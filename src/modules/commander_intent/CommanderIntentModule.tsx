'use client';

import { useState, useEffect } from 'react';
import { CommanderIntentPayload, CommanderIntent } from '../../types';
import { DOCTRINE_VERSIONS } from '../../lib/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveCommanderIntentConfig, generateExampleCommanderIntent } from './commanderIntentUtils';

interface CommanderIntentModuleProps {
  blueprintId: string;
  user: string;
  buildVersion: string;
  onSave?: (payload: CommanderIntentPayload) => void;
  initialData?: CommanderIntentPayload;
}

export default function CommanderIntentModule({
  blueprintId,
  user,
  buildVersion,
  onSave,
  initialData
}: CommanderIntentModuleProps) {
  const [payload, setPayload] = useState<CommanderIntentPayload>(
    initialData || {
      blueprint_id: blueprintId,
      doctrine_reference: 'nuclear_doctrine_v1.2',
      commander_intent: {
        id: uuidv4(),
        intent: '',
        target_x: '',
        notes: '',
        constraints: [],
        success_criteria: [],
        commander_notes: ''
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0',
        build_version: buildVersion
      },
      validation: {
        intent_defined: false,
        target_x_defined: false,
        doctrine_referenced: true,
        commander_signed_off: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [commanderSignedOff, setCommanderSignedOff] = useState(false);

  useEffect(() => {
    const validation = {
      intent_defined: payload.commander_intent.intent.trim().length > 0,
      target_x_defined: payload.commander_intent.target_x.trim().length > 0,
      doctrine_referenced: payload.doctrine_reference.trim().length > 0,
      commander_signed_off: commanderSignedOff,
      ready_for_save: false
    };
    validation.ready_for_save = validation.intent_defined && validation.target_x_defined && validation.doctrine_referenced && validation.commander_signed_off;
    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.commander_intent.intent, payload.commander_intent.target_x, payload.doctrine_reference, commanderSignedOff]);

  const handleFieldChange = (field: keyof CommanderIntent, value: string | string[]) => {
    setPayload(prev => ({
      ...prev,
      commander_intent: {
        ...prev.commander_intent,
        [field]: value
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'field_updated',
          user,
          details: `Updated ${field}`,
          field_updated: field
        }
      ]
    }));
  };

  const handleSave = async () => {
    if (!payload.validation.ready_for_save) return;
    setIsSaving(true);
    try {
      await saveCommanderIntentConfig(payload, 'yaml');
      if (onSave) await onSave(payload);
      setPayload(prev => ({
        ...prev,
        audit_log: [
          ...prev.audit_log,
          {
            timestamp: new Date().toISOString(),
            action: 'commander_intent_saved',
            user,
            details: 'Commander intent configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving commander intent:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleCommanderIntent(blueprintId, user, buildVersion);
    setPayload(example);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Commander Intent + Goal Module</h2>
            <p className="text-gray-600 mt-1">
              Define the broad intent and target X for this blueprint
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commander Intent <span className="text-red-500">*</span></label>
            <textarea
              value={payload.commander_intent.intent}
              onChange={e => handleFieldChange('intent', e.target.value)}
              placeholder="Describe what you are building and why..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target X <span className="text-red-500">*</span></label>
            <textarea
              value={payload.commander_intent.target_x}
              onChange={e => handleFieldChange('target_x', e.target.value)}
              placeholder="What does success look like?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Constraints</label>
          <textarea
            value={payload.commander_intent.notes}
            onChange={e => handleFieldChange('notes', e.target.value)}
            placeholder="Optional notes, constraints, or special requirements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctrine Reference <span className="text-red-500">*</span></label>
          <select
            value={payload.doctrine_reference}
            onChange={e => setPayload(prev => ({ ...prev, doctrine_reference: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {Object.entries(DOCTRINE_VERSIONS).map(([key, doctrine]) => (
              <option key={key} value={key}>{doctrine.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-1">{DOCTRINE_VERSIONS[payload.doctrine_reference]?.description}</p>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes</label>
          <textarea
            value={payload.commander_intent.commander_notes}
            onChange={e => handleFieldChange('commander_notes', e.target.value)}
            placeholder="Commander notes for this intent..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Audit Tag</label>
          <input
            type="text"
            value={`Declared by ${user} on ${new Date(payload.metadata.created_at).toLocaleDateString()} for ${payload.metadata.build_version}`}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
        </div>
        <div className="mt-6 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Commander Sign-off Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Both commander intent and target X must be defined and approved before blueprint progression.
            </p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={commanderSignedOff}
              onChange={e => setCommanderSignedOff(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-yellow-800">
              I approve this commander intent
            </span>
          </label>
        </div>
      </div>
      {/* Audit Log */}
      {payload.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commander Intent Audit Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payload.audit_log.slice(-10).reverse().map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-gray-700">{log.action.replace('_', ' ')}</span>
                  {log.details && <span className="text-gray-600">- {log.details}</span>}
                  {log.field_updated && <span className="text-blue-600">[{log.field_updated}]</span>}
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