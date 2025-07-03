'use client';

import { useState, useEffect } from 'react';
import { PingPongIntegrationPayload } from '../../types';
import { DOCTRINE_VERSIONS } from '../../lib/constants';
import { savePingPongConfig, generateExamplePingPongConfig } from './pingPongUtils';

interface PingPongIntegrationModuleProps {
  blueprintId: string;
  user: string;
  buildVersion: string;
  onSave?: (payload: PingPongIntegrationPayload) => void;
  initialData?: PingPongIntegrationPayload;
}

const PING_PONG_URL = 'https://ping-pong.example.com'; // Placeholder external service URL

export default function PingPongIntegrationModule({
  blueprintId,
  user,
  buildVersion,
  onSave,
  initialData
}: PingPongIntegrationModuleProps) {
  const [payload, setPayload] = useState<PingPongIntegrationPayload>(
    initialData || {
      blueprint_id: blueprintId,
      doctrine_reference: 'nuclear_doctrine_v1.2',
      ping_pong_refinement: {
        notes: '',
        decisions: '',
        status: 'not_started',
        doctrine_reference: 'nuclear_doctrine_v1.2',
        audit: '',
        commander_signed_off: false
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0',
        build_version: buildVersion
      },
      validation: {
        output_present: false,
        commander_signed_off: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [commanderSignedOff, setCommanderSignedOff] = useState(false);

  useEffect(() => {
    const outputPresent = payload.ping_pong_refinement.notes.trim().length > 0 && payload.ping_pong_refinement.decisions.trim().length > 0 && payload.ping_pong_refinement.status === 'complete';
    const validation = {
      output_present: outputPresent,
      commander_signed_off: commanderSignedOff,
      ready_for_save: outputPresent && commanderSignedOff
    };
    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.ping_pong_refinement.notes, payload.ping_pong_refinement.decisions, payload.ping_pong_refinement.status, commanderSignedOff]);

  const handleFieldChange = (field: 'notes' | 'decisions' | 'status' | 'doctrine_reference', value: string) => {
    setPayload(prev => ({
      ...prev,
      ping_pong_refinement: {
        ...prev.ping_pong_refinement,
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
      await savePingPongConfig(payload, 'yaml');
      if (onSave) await onSave(payload);
      setPayload(prev => ({
        ...prev,
        audit_log: [
          ...prev.audit_log,
          {
            timestamp: new Date().toISOString(),
            action: 'ping_pong_saved',
            user,
            details: 'Ping-pong integration configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving ping-pong config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExamplePingPongConfig(blueprintId, user, buildVersion);
    setPayload(example);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ping-Pong Integration Module</h2>
            <p className="text-gray-600 mt-1">
              Integrate and lock in output from the external ping-pong service
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
        <div className="mb-6">
          <a
            href={PING_PONG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Launch Ping-Pong Service ↗
          </a>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Refinement Status</label>
          <select
            value={payload.ping_pong_refinement.status}
            onChange={e => handleFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Refinement Notes</label>
          <textarea
            value={payload.ping_pong_refinement.notes}
            onChange={e => handleFieldChange('notes', e.target.value)}
            placeholder="Notes from ping-pong refinement..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Refinement Decisions</label>
          <textarea
            value={payload.ping_pong_refinement.decisions}
            onChange={e => handleFieldChange('decisions', e.target.value)}
            placeholder="Decisions made during ping-pong refinement..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Doctrine Reference</label>
          <select
            value={payload.ping_pong_refinement.doctrine_reference}
            onChange={e => handleFieldChange('doctrine_reference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DOCTRINE_VERSIONS).map(([key, doctrine]) => (
              <option key={key} value={key}>{doctrine.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-600 mt-1">{DOCTRINE_VERSIONS[payload.ping_pong_refinement.doctrine_reference]?.description}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Audit Tag</label>
          <input
            type="text"
            value={`Completed by ${user} on ${new Date(payload.metadata.created_at).toLocaleDateString()} for ${payload.metadata.build_version}`}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
        </div>
        <div className="mb-6 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Commander Sign-off Required
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Blueprint progression is blocked until ping-pong output is present and signed off.
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
              I approve this ping-pong record
            </span>
          </label>
        </div>
      </div>
      {/* Audit Log */}
      {payload.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ping-Pong Audit Log</h3>
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