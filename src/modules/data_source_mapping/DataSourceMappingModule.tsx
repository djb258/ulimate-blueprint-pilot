'use client';

import { useState, useEffect } from 'react';
import { DataSourceMappingPayload, DataSourceMapping, DataSourceType, DoctrineAcronym } from '../../types';
import { DATA_SOURCE_TYPES, DOCTRINE_ACRONYMS } from '../../lib/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveDataSourceMappingConfig, generateExampleDataSourceMapping } from './dataSourceMappingUtils';

interface DataSourceMappingModuleProps {
  blueprintId: string;
  user: string;
  onSave?: (payload: DataSourceMappingPayload) => void;
  initialData?: DataSourceMappingPayload;
}

export default function DataSourceMappingModule({ 
  blueprintId, 
  user, 
  onSave, 
  initialData 
}: DataSourceMappingModuleProps) {
  const [payload, setPayload] = useState<DataSourceMappingPayload>(
    initialData || {
      blueprint_id: blueprintId,
      data_sources: [],
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0'
      },
      validation: {
        all_mappings_have_sources: false,
        database_mappings_compliant: false,
        required_fields_populated: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  // Update validation whenever payload changes
  useEffect(() => {
    const validation = {
      all_mappings_have_sources: payload.data_sources.every(mapping => 
        mapping.source_type && mapping.source_id && mapping.constant_or_variable_name
      ),
      database_mappings_compliant: payload.data_sources.every(mapping => {
        const sourceType = DATA_SOURCE_TYPES[mapping.source_type];
        if (sourceType?.requires_approval) {
          return mapping.nuclear_doctrine_compliant && mapping.requires_commander_approval;
        }
        return true;
      }),
      required_fields_populated: payload.data_sources.every(mapping => 
        mapping.acronym && mapping.validation && mapping.failover && mapping.audit_tag
      ),
      ready_for_save: false
    };

    validation.ready_for_save = validation.all_mappings_have_sources && 
                               validation.database_mappings_compliant && 
                               validation.required_fields_populated;

    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.data_sources]);

  const addMapping = () => {
    const newMapping: DataSourceMapping = {
      id: uuidv4(),
      constant_or_variable_name: '',
      source_type: 'Commander runtime input',
      source_id: '',
      acronym: 'N/A',
      validation: '',
      failover: '',
      commander_notes: '',
      audit_tag: '',
      requires_commander_approval: false,
      nuclear_doctrine_compliant: false
    };

    setPayload(prev => ({
      ...prev,
      data_sources: [...prev.data_sources, newMapping],
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'mapping_added',
          user,
          details: 'Added new data source mapping',
          mapping_id: newMapping.id
        }
      ]
    }));
  };

  const updateMapping = (id: string, updates: Partial<DataSourceMapping>) => {
    setPayload(prev => ({
      ...prev,
      data_sources: prev.data_sources.map(mapping =>
        mapping.id === id ? { ...mapping, ...updates } : mapping
      ),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'mapping_updated',
          user,
          details: `Updated mapping: ${updates.constant_or_variable_name || 'mapping'}`,
          mapping_id: id
        }
      ]
    }));
  };

  const removeMapping = (id: string) => {
    const mapping = payload.data_sources.find(m => m.id === id);
    setPayload(prev => ({
      ...prev,
      data_sources: prev.data_sources.filter(m => m.id !== id),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'mapping_removed',
          user,
          details: `Removed mapping: ${mapping?.constant_or_variable_name || 'mapping'}`,
          mapping_id: id
        }
      ]
    }));
  };

  const handleSave = async () => {
    if (!payload.validation.ready_for_save) return;

    setIsSaving(true);
    try {
      // Save to file
      await saveDataSourceMappingConfig(payload, 'yaml');
      
      if (onSave) {
        await onSave(payload);
      }
      
      // Add save action to audit log
      setPayload(prev => ({
        ...prev,
        audit_log: [
          ...prev.audit_log,
          {
            timestamp: new Date().toISOString(),
            action: 'data_source_mapping_saved',
            user,
            details: 'Data source mapping configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving data source mapping:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleDataSourceMapping(blueprintId, user);
    setPayload(example);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Source Mapping Module</h2>
            <p className="text-gray-600 mt-1">
              Define data sources and mapping rules for constants and variables
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadExample}
              className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Load Example
            </button>
            <button
              onClick={handleSave}
              disabled={!payload.validation.ready_for_save || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        {/* Validation Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-md ${payload.validation.all_mappings_have_sources ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Sources Valid</div>
            <div className={`text-xs ${payload.validation.all_mappings_have_sources ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.all_mappings_have_sources ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.database_mappings_compliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">DB Compliance</div>
            <div className={`text-xs ${payload.validation.database_mappings_compliant ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.database_mappings_compliant ? '✓ Compliant' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.required_fields_populated ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Fields Complete</div>
            <div className={`text-xs ${payload.validation.required_fields_populated ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.required_fields_populated ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.ready_for_save ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="text-sm font-medium text-gray-700">Ready to Save</div>
            <div className={`text-xs ${payload.validation.ready_for_save ? 'text-green-600' : 'text-gray-600'}`}>
              {payload.validation.ready_for_save ? '✓ Ready' : '✗ Incomplete'}
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Mappings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Source Mappings</h3>
          <button
            onClick={addMapping}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            + Add Mapping
          </button>
        </div>

        {payload.data_sources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🗂️</div>
            <p>No data source mappings defined yet. Click &quot;Add Mapping&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payload.data_sources.map((mapping) => (
              <MappingCard
                key={mapping.id}
                mapping={mapping}
                onUpdate={(updates) => updateMapping(mapping.id, updates)}
                onRemove={() => removeMapping(mapping.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Audit Log */}
      {payload.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payload.audit_log.slice(-10).reverse().map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-gray-700">{log.action.replace('_', ' ')}</span>
                  {log.details && <span className="text-gray-600">- {log.details}</span>}
                </div>
                <span className="text-gray-400 text-xs">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MappingCardProps {
  mapping: DataSourceMapping;
  onUpdate: (updates: Partial<DataSourceMapping>) => void;
  onRemove: () => void;
}

function MappingCard({ mapping, onUpdate, onRemove }: MappingCardProps) {
  const sourceType = DATA_SOURCE_TYPES[mapping.source_type];
  const isWriteableDatabase = sourceType?.requires_approval;

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <input
          type="text"
          value={mapping.constant_or_variable_name}
          onChange={(e) => onUpdate({ constant_or_variable_name: e.target.value })}
          className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Constant or variable name"
        />
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove mapping"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Source Configuration</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Source Type</label>
            <select
              value={mapping.source_type}
              onChange={(e) => onUpdate({ source_type: e.target.value as DataSourceType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(DATA_SOURCE_TYPES).map(([key, sourceType]) => (
                <option key={key} value={key}>
                  {sourceType.label}
                </option>
              ))}
            </select>
            {sourceType && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${sourceType.color}`}>
                  {sourceType.category}
                </span>
                <p className="text-xs text-gray-600 mt-1">{sourceType.description}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source ID / Endpoint</label>
            <input
              type="text"
              value={mapping.source_id}
              onChange={(e) => onUpdate({ source_id: e.target.value })}
              placeholder="API endpoint, table name, file path, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctrine Acronym</label>
            <select
              value={mapping.acronym}
              onChange={(e) => onUpdate({ acronym: e.target.value as DoctrineAcronym })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(DOCTRINE_ACRONYMS).map(([key, acronym]) => (
                <option key={key} value={key}>
                  {acronym.label}
                </option>
              ))}
            </select>
            {DOCTRINE_ACRONYMS[mapping.acronym] && (
              <p className="text-xs text-gray-600 mt-1">{DOCTRINE_ACRONYMS[mapping.acronym].description}</p>
            )}
          </div>
        </div>

        {/* Validation & Failover */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Validation & Failover</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Validation Method</label>
            <input
              type="text"
              value={mapping.validation}
              onChange={(e) => onUpdate({ validation: e.target.value })}
              placeholder="e.g., string, non-empty, integer > 0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Failover Rule</label>
            <input
              type="text"
              value={mapping.failover}
              onChange={(e) => onUpdate({ failover: e.target.value })}
              placeholder="e.g., Use default value: 1, Prompt user for input again"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audit Tag</label>
            <input
              type="text"
              value={mapping.audit_tag}
              onChange={(e) => onUpdate({ audit_tag: e.target.value })}
              placeholder="e.g., Declared by commander, 2025-07-03, component: Market filter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Database-specific fields for writeable destinations */}
      {isWriteableDatabase && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-3">Nuclear Doctrine Compliance (Required for Writeable Databases)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-800 mb-2">Table Name</label>
              <input
                type="text"
                value={mapping.table || ''}
                onChange={(e) => onUpdate({ table: e.target.value })}
                placeholder="Database table name"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-800 mb-2">Schema</label>
              <input
                type="text"
                value={mapping.schema || ''}
                onChange={(e) => onUpdate({ schema: e.target.value })}
                placeholder="Database schema (e.g., public)"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-yellow-800 mb-2">Credentials</label>
              <input
                type="text"
                value={mapping.credentials || ''}
                onChange={(e) => onUpdate({ credentials: e.target.value })}
                placeholder="Credential rule (e.g., use_neon_service_account)"
                className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={mapping.nuclear_doctrine_compliant || false}
                onChange={(e) => onUpdate({ nuclear_doctrine_compliant: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-yellow-800">Nuclear Doctrine Compliant</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={mapping.requires_commander_approval || false}
                onChange={(e) => onUpdate({ requires_commander_approval: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-yellow-800">Requires Commander Approval</span>
            </label>
          </div>
        </div>
      )}

      {/* Commander Notes */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes & Constraints</label>
        <textarea
          value={mapping.commander_notes}
          onChange={(e) => onUpdate({ commander_notes: e.target.value })}
          placeholder="Add notes, constraints, or commander requirements..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>
    </div>
  );
} 