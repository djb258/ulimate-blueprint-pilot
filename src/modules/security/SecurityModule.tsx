'use client';

import { useState, useEffect } from 'react';
import { 
  SecurityPayload, 
  SecurityComponent, 
  ErrorField, 
  AccessLevel, 
  CredentialType, 
  ErrorFieldType, 
  HealingAgent, 
  EscalationLevel 
} from '../../types';
import { 
  SECURITY_ACCESS_LEVELS, 
  SECURITY_CREDENTIAL_TYPES, 
  HEALING_AGENTS, 
  ESCALATION_LEVELS 
} from '../../lib/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveSecurityConfig, generateExampleSecurityConfig } from './securityUtils';

interface SecurityModuleProps {
  blueprintId: string;
  user: string;
  onSave?: (payload: SecurityPayload) => void;
  initialData?: SecurityPayload;
}

export default function SecurityModule({ 
  blueprintId, 
  user, 
  onSave, 
  initialData 
}: SecurityModuleProps) {
  const [payload, setPayload] = useState<SecurityPayload>(
    initialData || {
      blueprint_id: blueprintId,
      security: {
        components: [],
        nuclear_doctrine_version: 'nuclear_doctrine_v1.2',
        overall_security_level: 'High'
      },
      error_handling: {
        target_table: 'central_error_table',
        schema: [
          {
            field: 'timestamp',
            type: 'datetime',
            required: true,
            description: 'Timestamp when error occurred'
          },
          {
            field: 'component',
            type: 'string',
            required: true,
            description: 'Component where error occurred'
          },
          {
            field: 'error_code',
            type: 'string',
            required: true,
            description: 'Error code identifier'
          },
          {
            field: 'details',
            type: 'string',
            required: false,
            description: 'Detailed error information'
          }
        ],
        location: '/data/errors/central_error_table',
        nuclear_doctrine_version: 'nuclear_doctrine_v1.2',
        error_categories: ['authentication', 'authorization', 'data_validation', 'system_error'],
        retention_policy: '30 days',
        commander_notes: ''
      },
      healing: {
        agent: 'self_healing_agent_v1',
        doctrine_reference: 'nuclear_doctrine_v1.2',
        escalation_rules: ['retry_operation', 'alert_commander_if_unresolved'],
        healing_strategies: ['automatic_retry', 'circuit_breaker', 'graceful_degradation'],
        timeout_settings: '5 minutes',
        nuclear_doctrine_compliant: true,
        commander_notes: ''
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0'
      },
      validation: {
        all_components_secured: false,
        error_handling_defined: true,
        healing_architecture_defined: true,
        nuclear_doctrine_referenced: true,
        commander_signed_off: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [commanderSignedOff, setCommanderSignedOff] = useState(false);

  // Update validation whenever payload changes
  useEffect(() => {
    const validation = {
      all_components_secured: payload.security.components.length > 0 && 
                              payload.security.components.every(component => 
                                component.access && component.credentials
                              ),
      error_handling_defined: payload.error_handling.target_table.trim() !== '' && 
                             payload.error_handling.schema.length > 0,
      healing_architecture_defined: payload.healing.agent && 
                                   payload.healing.escalation_rules.length > 0,
      nuclear_doctrine_referenced: payload.security.nuclear_doctrine_version.trim() !== '' &&
                                  payload.error_handling.nuclear_doctrine_version.trim() !== '',
      commander_signed_off: commanderSignedOff,
      ready_for_save: false
    };

    validation.ready_for_save = validation.all_components_secured && 
                               validation.error_handling_defined && 
                               validation.healing_architecture_defined && 
                               validation.nuclear_doctrine_referenced && 
                               validation.commander_signed_off;

    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.security.components, payload.error_handling, payload.healing, payload.security.nuclear_doctrine_version, payload.error_handling.nuclear_doctrine_version, commanderSignedOff]);

  const addSecurityComponent = () => {
    const newComponent: SecurityComponent = {
      id: uuidv4(),
      name: '',
      access: 'authenticated_users',
      credentials: 'api_key',
      permission_rules: [],
      data_flow_security: [],
      nuclear_doctrine_compliant: true,
      commander_notes: ''
    };

    setPayload(prev => ({
      ...prev,
      security: {
        ...prev.security,
        components: [...prev.security.components, newComponent]
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'security_component_added',
          user,
          details: 'Added new security component',
          component_id: newComponent.id,
          section: 'security'
        }
      ]
    }));
  };

  const updateSecurityComponent = (id: string, updates: Partial<SecurityComponent>) => {
    setPayload(prev => ({
      ...prev,
      security: {
        ...prev.security,
        components: prev.security.components.map(component =>
          component.id === id ? { ...component, ...updates } : component
        )
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'security_component_updated',
          user,
          details: `Updated security component: ${updates.name || 'component'}`,
          component_id: id,
          section: 'security'
        }
      ]
    }));
  };

  const removeSecurityComponent = (id: string) => {
    const component = payload.security.components.find(c => c.id === id);
    setPayload(prev => ({
      ...prev,
      security: {
        ...prev.security,
        components: prev.security.components.filter(c => c.id !== id)
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'security_component_removed',
          user,
          details: `Removed security component: ${component?.name || 'component'}`,
          component_id: id,
          section: 'security'
        }
      ]
    }));
  };

  const addErrorField = () => {
    const newField: ErrorField = {
      field: '',
      type: 'string',
      required: true,
      description: ''
    };

    setPayload(prev => ({
      ...prev,
      error_handling: {
        ...prev.error_handling,
        schema: [...prev.error_handling.schema, newField]
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'error_field_added',
          user,
          details: 'Added new error field to schema',
          section: 'error_handling'
        }
      ]
    }));
  };

  const updateErrorField = (index: number, updates: Partial<ErrorField>) => {
    setPayload(prev => ({
      ...prev,
      error_handling: {
        ...prev.error_handling,
        schema: prev.error_handling.schema.map((field, i) =>
          i === index ? { ...field, ...updates } : field
        )
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'error_field_updated',
          user,
          details: `Updated error field: ${updates.field || 'field'}`,
          section: 'error_handling'
        }
      ]
    }));
  };

  const removeErrorField = (index: number) => {
    const field = payload.error_handling.schema[index];
    setPayload(prev => ({
      ...prev,
      error_handling: {
        ...prev.error_handling,
        schema: prev.error_handling.schema.filter((_, i) => i !== index)
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'error_field_removed',
          user,
          details: `Removed error field: ${field?.field || 'field'}`,
          section: 'error_handling'
        }
      ]
    }));
  };

  const handleSave = async () => {
    if (!payload.validation.ready_for_save) return;

    setIsSaving(true);
    try {
      // Save to file
      await saveSecurityConfig(payload, 'yaml');
      
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
            action: 'security_config_saved',
            user,
            details: 'Security configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving security configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleSecurityConfig(blueprintId, user);
    setPayload(example);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Security Module</h2>
            <p className="text-gray-600 mt-1">
              Define security requirements, error handling, and healing architecture
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-md ${payload.validation.all_components_secured ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Components Secured</div>
            <div className={`text-xs ${payload.validation.all_components_secured ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.all_components_secured ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.error_handling_defined ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Error Handling</div>
            <div className={`text-xs ${payload.validation.error_handling_defined ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.error_handling_defined ? '✓ Defined' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.healing_architecture_defined ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Healing Architecture</div>
            <div className={`text-xs ${payload.validation.healing_architecture_defined ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.healing_architecture_defined ? '✓ Defined' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.nuclear_doctrine_referenced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Nuclear Doctrine</div>
            <div className={`text-xs ${payload.validation.nuclear_doctrine_referenced ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.nuclear_doctrine_referenced ? '✓ Referenced' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.commander_signed_off ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Commander Sign-off</div>
            <div className={`text-xs ${payload.validation.commander_signed_off ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.commander_signed_off ? '✓ Signed' : '✗ Required'}
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

      {/* Security Components */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Security Components</h3>
          <button
            onClick={addSecurityComponent}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            + Add Component
          </button>
        </div>

        {payload.security.components.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔒</div>
            <p>No security components defined yet. Click &quot;Add Component&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payload.security.components.map((component) => (
              <SecurityComponentCard
                key={component.id}
                component={component}
                onUpdate={(updates) => updateSecurityComponent(component.id, updates)}
                onRemove={() => removeSecurityComponent(component.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error Handling Architecture */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Handling Architecture</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Error Table</label>
            <input
              type="text"
              value={payload.error_handling.target_table}
              onChange={(e) => setPayload(prev => ({
                ...prev,
                error_handling: { ...prev.error_handling, target_table: e.target.value }
              }))}
              placeholder="central_error_table"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Table Location</label>
            <input
              type="text"
              value={payload.error_handling.location}
              onChange={(e) => setPayload(prev => ({
                ...prev,
                error_handling: { ...prev.error_handling, location: e.target.value }
              }))}
              placeholder="/data/errors/central_error_table"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Error Schema</label>
            <button
              onClick={addErrorField}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
            >
              + Add Field
            </button>
          </div>
          
          <div className="space-y-3">
            {payload.error_handling.schema.map((field, index) => (
              <ErrorFieldCard
                key={index}
                field={field}
                onUpdate={(updates) => updateErrorField(index, updates)}
                onRemove={() => removeErrorField(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nuclear Doctrine Version</label>
          <input
            type="text"
            value={payload.error_handling.nuclear_doctrine_version}
            onChange={(e) => setPayload(prev => ({
              ...prev,
              error_handling: { ...prev.error_handling, nuclear_doctrine_version: e.target.value }
            }))}
            placeholder="nuclear_doctrine_v1.2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes</label>
          <textarea
            value={payload.error_handling.commander_notes}
            onChange={(e) => setPayload(prev => ({
              ...prev,
              error_handling: { ...prev.error_handling, commander_notes: e.target.value }
            }))}
            placeholder="Commander notes for error handling architecture..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Healing Architecture */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Healing Architecture</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Healing Agent</label>
            <select
              value={payload.healing.agent}
              onChange={(e) => setPayload(prev => ({
                ...prev,
                healing: { ...prev.healing, agent: e.target.value as HealingAgent }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(HEALING_AGENTS).map(([key, agent]) => (
                <option key={key} value={key}>
                  {agent.label}
                </option>
              ))}
            </select>
            {payload.healing.agent && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${HEALING_AGENTS[payload.healing.agent].color}`}>
                  {HEALING_AGENTS[payload.healing.agent].label}
                </span>
                <p className="text-xs text-gray-600 mt-1">{HEALING_AGENTS[payload.healing.agent].description}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctrine Reference</label>
            <input
              type="text"
              value={payload.healing.doctrine_reference}
              onChange={(e) => setPayload(prev => ({
                ...prev,
                healing: { ...prev.healing, doctrine_reference: e.target.value }
              }))}
              placeholder="nuclear_doctrine_v1.2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Escalation Rules</label>
          <div className="space-y-2">
            {Object.entries(ESCALATION_LEVELS).map(([key, level]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={payload.healing.escalation_rules.includes(key as EscalationLevel)}
                  onChange={(e) => {
                    const newRules = e.target.checked
                      ? [...payload.healing.escalation_rules, key as EscalationLevel]
                      : payload.healing.escalation_rules.filter(rule => rule !== key);
                    setPayload(prev => ({
                      ...prev,
                      healing: { ...prev.healing, escalation_rules: newRules }
                    }));
                  }}
                  className="mr-2"
                />
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${level.color}`}>
                  {level.label}
                </span>
                <span className="text-xs text-gray-600 ml-2">{level.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes</label>
          <textarea
            value={payload.healing.commander_notes}
            onChange={(e) => setPayload(prev => ({
              ...prev,
              healing: { ...prev.healing, commander_notes: e.target.value }
            }))}
            placeholder="Commander notes for healing architecture..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Commander Sign-off */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commander Sign-off</h3>
        
        <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Nuclear Doctrine Compliance Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              All security, error handling, and healing configurations must be reviewed and approved by the commander.
            </p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={commanderSignedOff}
              onChange={(e) => setCommanderSignedOff(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-yellow-800">
              I approve this security configuration
            </span>
          </label>
        </div>
      </div>

      {/* Audit Log */}
      {payload.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Audit Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payload.audit_log.slice(-10).reverse().map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-gray-700">{log.action.replace('_', ' ')}</span>
                  {log.details && <span className="text-gray-600">- {log.details}</span>}
                  {log.section && <span className="text-blue-600">[{log.section}]</span>}
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

interface SecurityComponentCardProps {
  component: SecurityComponent;
  onUpdate: (updates: Partial<SecurityComponent>) => void;
  onRemove: () => void;
}

function SecurityComponentCard({ component, onUpdate, onRemove }: SecurityComponentCardProps) {
  const selectedAccess = SECURITY_ACCESS_LEVELS[component.access];
  const selectedCredentials = SECURITY_CREDENTIAL_TYPES[component.credentials];

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <input
          type="text"
          value={component.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Component name"
        />
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove component"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
            <select
              value={component.access}
              onChange={(e) => onUpdate({ access: e.target.value as AccessLevel })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(SECURITY_ACCESS_LEVELS).map(([key, level]) => (
                <option key={key} value={key}>
                  {level.label}
                </option>
              ))}
            </select>
            {selectedAccess && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${selectedAccess.color}`}>
                  {selectedAccess.security_level}
                </span>
                <p className="text-xs text-gray-600 mt-1">{selectedAccess.description}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credentials</label>
            <select
              value={component.credentials}
              onChange={(e) => onUpdate({ credentials: e.target.value as CredentialType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(SECURITY_CREDENTIAL_TYPES).map(([key, cred]) => (
                <option key={key} value={key}>
                  {cred.label}
                </option>
              ))}
            </select>
            {selectedCredentials && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${selectedCredentials.color}`}>
                  {selectedCredentials.label}
                </span>
                <p className="text-xs text-gray-600 mt-1">{selectedCredentials.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permission Rules</label>
            <div className="space-y-2">
              {component.permission_rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => {
                      const rules = [...component.permission_rules];
                      rules[index] = e.target.value;
                      onUpdate({ permission_rules: rules });
                    }}
                    placeholder="Permission rule"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      const rules = component.permission_rules.filter((_, i) => i !== index);
                      onUpdate({ permission_rules: rules });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onUpdate({ permission_rules: [...component.permission_rules, ''] })}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Rule
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Flow Security</label>
            <div className="space-y-2">
              {component.data_flow_security.map((flow, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={flow}
                    onChange={(e) => {
                      const flows = [...component.data_flow_security];
                      flows[index] = e.target.value;
                      onUpdate({ data_flow_security: flows });
                    }}
                    placeholder="Data flow security rule"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => {
                      const flows = component.data_flow_security.filter((_, i) => i !== index);
                      onUpdate({ data_flow_security: flows });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onUpdate({ data_flow_security: [...component.data_flow_security, ''] })}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Flow Rule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={component.nuclear_doctrine_compliant}
            onChange={(e) => onUpdate({ nuclear_doctrine_compliant: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Nuclear Doctrine Compliant</span>
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes</label>
        <textarea
          value={component.commander_notes}
          onChange={(e) => onUpdate({ commander_notes: e.target.value })}
          placeholder="Commander notes for this component..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}

interface ErrorFieldCardProps {
  field: ErrorField;
  onUpdate: (updates: Partial<ErrorField>) => void;
  onRemove: () => void;
}

function ErrorFieldCard({ field, onUpdate, onRemove }: ErrorFieldCardProps) {
  return (
    <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-md bg-white">
      <div className="flex-1">
        <input
          type="text"
          value={field.field}
          onChange={(e) => onUpdate({ field: e.target.value })}
          placeholder="Field name"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="w-32">
        <select
          value={field.type}
          onChange={(e) => onUpdate({ type: e.target.value as ErrorFieldType })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="datetime">DateTime</option>
          <option value="boolean">Boolean</option>
          <option value="json">JSON</option>
          <option value="array">Array</option>
        </select>
      </div>
      <div className="w-20">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="mr-1"
          />
          <span className="text-xs">Required</span>
        </label>
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={field.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Field description"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  );
} 