'use client';

import { useState, useEffect } from 'react';
import { ConstantsVariablesPayload, ConstantDeclaration, VariableDeclaration, VariableType } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { saveConstantsVariablesConfig, generateExampleConstantsVariables } from './constantsVariablesUtils';

interface ConstantsVariablesModuleProps {
  blueprintId: string;
  user: string;
  onSave?: (payload: ConstantsVariablesPayload) => void;
  initialData?: ConstantsVariablesPayload;
}

export default function ConstantsVariablesModule({ 
  blueprintId, 
  user, 
  onSave, 
  initialData 
}: ConstantsVariablesModuleProps) {
  const [payload, setPayload] = useState<ConstantsVariablesPayload>(
    initialData || {
      blueprint_id: blueprintId,
      constants: [],
      variables: [],
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0'
      },
      validation: {
        all_constants_have_values: false,
        all_variables_have_types: false,
        required_variables_defined: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  // Update validation whenever payload changes
  useEffect(() => {
    const validation = {
      all_constants_have_values: payload.constants.every(constant => 
        constant.value !== undefined && constant.value !== null && constant.value !== ''
      ),
      all_variables_have_types: payload.variables.every(variable => 
        variable.type && variable.name.trim().length > 0
      ),
      required_variables_defined: payload.variables.every(variable => 
        !variable.required || (variable.default !== null && variable.default !== '')
      ),
      ready_for_save: false
    };

    validation.ready_for_save = validation.all_constants_have_values && 
                               validation.all_variables_have_types && 
                               validation.required_variables_defined;

    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.constants, payload.variables]);

  const addConstant = () => {
    const newConstant: ConstantDeclaration = {
      id: uuidv4(),
      name: '',
      value: '',
      notes: '',
      category: 'system'
    };

    setPayload(prev => ({
      ...prev,
      constants: [...prev.constants, newConstant],
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'constant_added',
          user,
          details: 'Added new constant declaration',
          item_id: newConstant.id,
          item_type: 'constant'
        }
      ]
    }));
  };

  const updateConstant = (id: string, updates: Partial<ConstantDeclaration>) => {
    setPayload(prev => ({
      ...prev,
      constants: prev.constants.map(constant =>
        constant.id === id ? { ...constant, ...updates } : constant
      ),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'constant_updated',
          user,
          details: `Updated constant: ${updates.name || 'constant'}`,
          item_id: id,
          item_type: 'constant'
        }
      ]
    }));
  };

  const removeConstant = (id: string) => {
    const constant = payload.constants.find(c => c.id === id);
    setPayload(prev => ({
      ...prev,
      constants: prev.constants.filter(c => c.id !== id),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'constant_removed',
          user,
          details: `Removed constant: ${constant?.name || 'constant'}`,
          item_id: id,
          item_type: 'constant'
        }
      ]
    }));
  };

  const addVariable = () => {
    const newVariable: VariableDeclaration = {
      id: uuidv4(),
      name: '',
      type: 'string',
      required: false,
      default: null,
      notes: '',
      category: 'user_input'
    };

    setPayload(prev => ({
      ...prev,
      variables: [...prev.variables, newVariable],
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'variable_added',
          user,
          details: 'Added new variable declaration',
          item_id: newVariable.id,
          item_type: 'variable'
        }
      ]
    }));
  };

  const updateVariable = (id: string, updates: Partial<VariableDeclaration>) => {
    setPayload(prev => ({
      ...prev,
      variables: prev.variables.map(variable =>
        variable.id === id ? { ...variable, ...updates } : variable
      ),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'variable_updated',
          user,
          details: `Updated variable: ${updates.name || 'variable'}`,
          item_id: id,
          item_type: 'variable'
        }
      ]
    }));
  };

  const removeVariable = (id: string) => {
    const variable = payload.variables.find(v => v.id === id);
    setPayload(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.id !== id),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'variable_removed',
          user,
          details: `Removed variable: ${variable?.name || 'variable'}`,
          item_id: id,
          item_type: 'variable'
        }
      ]
    }));
  };

  const handleSave = async () => {
    if (!payload.validation.ready_for_save) return;

    setIsSaving(true);
    try {
      // Save to file
      await saveConstantsVariablesConfig(payload, 'yaml');
      
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
            action: 'constants_variables_saved',
            user,
            details: 'Constants and variables configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving constants and variables:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleConstantsVariables(blueprintId, user);
    setPayload(example);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Constants + Variables Module</h2>
            <p className="text-gray-600 mt-1">
              Define system constants and dynamic variables for the blueprint architecture
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
          <div className={`p-3 rounded-md ${payload.validation.all_constants_have_values ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Constants Valid</div>
            <div className={`text-xs ${payload.validation.all_constants_have_values ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.all_constants_have_values ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.all_variables_have_types ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Variables Valid</div>
            <div className={`text-xs ${payload.validation.all_variables_have_types ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.all_variables_have_types ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.required_variables_defined ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="text-sm font-medium text-gray-700">Required Variables</div>
            <div className={`text-xs ${payload.validation.required_variables_defined ? 'text-green-600' : 'text-yellow-600'}`}>
              {payload.validation.required_variables_defined ? '✓ Defined' : '⚠ Check Defaults'}
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

      {/* Constants Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">System Constants</h3>
          <button
            onClick={addConstant}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            + Add Constant
          </button>
        </div>

        {payload.constants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔧</div>
            <p>No constants defined yet. Click &quot;Add Constant&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payload.constants.map((constant) => (
              <ConstantCard
                key={constant.id}
                constant={constant}
                onUpdate={(updates) => updateConstant(constant.id, updates)}
                onRemove={() => removeConstant(constant.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Variables Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Dynamic Variables</h3>
          <button
            onClick={addVariable}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            + Add Variable
          </button>
        </div>

        {payload.variables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No variables defined yet. Click &quot;Add Variable&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payload.variables.map((variable) => (
              <VariableCard
                key={variable.id}
                variable={variable}
                onUpdate={(updates) => updateVariable(variable.id, updates)}
                onRemove={() => removeVariable(variable.id)}
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

interface ConstantCardProps {
  constant: ConstantDeclaration;
  onUpdate: (updates: Partial<ConstantDeclaration>) => void;
  onRemove: () => void;
}

function ConstantCard({ constant, onUpdate, onRemove }: ConstantCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
      <div className="flex items-start justify-between mb-4">
        <input
          type="text"
          value={constant.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
          placeholder="Constant name"
        />
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove constant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
          <input
            type="text"
            value={constant.value as string}
            onChange={e => onUpdate({ value: e.target.value })}
            placeholder="Enter constant value"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={constant.category || 'system'}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="system">System</option>
            <option value="configuration">Configuration</option>
            <option value="doctrine">Doctrine</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Constraints</label>
        <textarea
          value={constant.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Add notes, constraints, or commander requirements..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}

interface VariableCardProps {
  variable: VariableDeclaration;
  onUpdate: (updates: Partial<VariableDeclaration>) => void;
  onRemove: () => void;
}

function VariableCard({ variable, onUpdate, onRemove }: VariableCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
      <div className="flex items-start justify-between mb-4">
        <input
          type="text"
          value={variable.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Variable name"
        />
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          title="Remove variable"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={variable.type}
            onChange={(e) => onUpdate({ type: e.target.value as VariableType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Required</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={variable.required}
                onChange={() => onUpdate({ required: true })}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!variable.required}
                onChange={() => onUpdate({ required: false })}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={variable.category || 'user_input'}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user_input">User Input</option>
            <option value="runtime">Runtime</option>
            <option value="commander_override">Commander Override</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
        <input
          type="text"
          value={variable.default as string || ''}
          onChange={(e) => onUpdate({ default: e.target.value })}
          placeholder="Default value (leave empty if none)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Constraints</label>
        <textarea
          value={variable.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Add notes, constraints, or commander requirements..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
        />
      </div>
    </div>
  );
} 