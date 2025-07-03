'use client';

import { useState, useEffect } from 'react';
import { EquationPayload, EquationComponent, ApprovedTool } from '../../types';
import { APPROVED_TOOLS } from '../../lib/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveEquationConfig, generateExampleEquation } from './equationUtils';

interface EquationModuleProps {
  blueprintId: string;
  user: string;
  onSave?: (payload: EquationPayload) => void;
  initialData?: EquationPayload;
}

export default function EquationModule({ 
  blueprintId, 
  user, 
  onSave, 
  initialData 
}: EquationModuleProps) {
  const [equation, setEquation] = useState<EquationPayload>(
    initialData || {
      blueprint_id: blueprintId,
      equation: {
        target: '',
        components: []
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0'
      },
      validation: {
        all_components_have_tools: false,
        external_tools_require_approval: false,
        target_defined: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  // Update validation whenever equation changes
  useEffect(() => {
    const validation = {
      all_components_have_tools: equation.equation.components.every(comp => comp.tool),
      external_tools_require_approval: equation.equation.components.some(comp => comp.tool === 'external_approval_required'),
      target_defined: equation.equation.target.trim().length > 0,
      ready_for_save: false
    };

    validation.ready_for_save = validation.all_components_have_tools && validation.target_defined;

    setEquation(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [equation.equation]);

  const addComponent = () => {
    const newComponent: EquationComponent = {
      id: uuidv4(),
      name: `Component ${equation.equation.components.length + 1}`,
      tool: 'ChatGPT' as ApprovedTool,
      notes: ''
    };

    setEquation(prev => ({
      ...prev,
      equation: {
        ...prev.equation,
        components: [...prev.equation.components, newComponent]
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'component_added',
          user,
          details: `Added component: ${newComponent.name}`,
          component_id: newComponent.id
        }
      ]
    }));
  };

  const updateComponent = (id: string, updates: Partial<EquationComponent>) => {
    setEquation(prev => ({
      ...prev,
      equation: {
        ...prev.equation,
        components: prev.equation.components.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        )
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'component_updated',
          user,
          details: `Updated component: ${updates.name || 'component'}`,
          component_id: id
        }
      ]
    }));
  };

  const removeComponent = (id: string) => {
    const component = equation.equation.components.find(comp => comp.id === id);
    setEquation(prev => ({
      ...prev,
      equation: {
        ...prev.equation,
        components: prev.equation.components.filter(comp => comp.id !== id)
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'component_removed',
          user,
          details: `Removed component: ${component?.name || 'component'}`,
          component_id: id
        }
      ]
    }));
  };

  const updateTarget = (target: string) => {
    setEquation(prev => ({
      ...prev,
      equation: {
        ...prev.equation,
        target
      },
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'target_updated',
          user,
          details: `Updated target: ${target}`
        }
      ]
    }));
  };

  const handleSave = async () => {
    if (!equation.validation.ready_for_save) return;

    setIsSaving(true);
    try {
      // Save to file
      await saveEquationConfig(equation, 'yaml');
      
      if (onSave) {
        await onSave(equation);
      }
      
      // Add save action to audit log
      setEquation(prev => ({
        ...prev,
        audit_log: [
          ...prev.audit_log,
          {
            timestamp: new Date().toISOString(),
            action: 'equation_saved',
            user,
            details: 'Equation configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving equation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleEquation(blueprintId, user);
    setEquation(example);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Equation Module</h2>
            <p className="text-gray-600 mt-1">
              Define the component equation and assign tools to each component
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
              disabled={!equation.validation.ready_for_save || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Equation'}
            </button>
          </div>
        </div>

        {/* Validation Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-md ${equation.validation.target_defined ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Target Defined</div>
            <div className={`text-xs ${equation.validation.target_defined ? 'text-green-600' : 'text-red-600'}`}>
              {equation.validation.target_defined ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${equation.validation.all_components_have_tools ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Tools Assigned</div>
            <div className={`text-xs ${equation.validation.all_components_have_tools ? 'text-green-600' : 'text-red-600'}`}>
              {equation.validation.all_components_have_tools ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${equation.validation.external_tools_require_approval ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
            <div className="text-sm font-medium text-gray-700">External Tools</div>
            <div className={`text-xs ${equation.validation.external_tools_require_approval ? 'text-yellow-600' : 'text-green-600'}`}>
              {equation.validation.external_tools_require_approval ? '⚠ Approval Needed' : '✓ All Approved'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${equation.validation.ready_for_save ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="text-sm font-medium text-gray-700">Ready to Save</div>
            <div className={`text-xs ${equation.validation.ready_for_save ? 'text-green-600' : 'text-gray-600'}`}>
              {equation.validation.ready_for_save ? '✓ Ready' : '✗ Incomplete'}
            </div>
          </div>
        </div>
      </div>

      {/* Target Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Output</h3>
        <input
          type="text"
          value={equation.equation.target}
          onChange={(e) => updateTarget(e.target.value)}
          placeholder="Enter the target output (e.g., Deploy storage container viability system)"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Equation Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Component Equation</h3>
          <button
            onClick={addComponent}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            + Add Component
          </button>
        </div>

        {equation.equation.components.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🧩</div>
            <p>No components defined yet. Click &quot;Add Component&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Visual Equation Bar */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {equation.equation.components.map((component, index) => (
                <div key={component.id} className="flex items-center">
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg px-4 py-2 min-w-[120px] text-center">
                    <div className="text-sm font-medium text-blue-800">{component.name}</div>
                    <div className="text-xs text-blue-600">{APPROVED_TOOLS[component.tool]?.label}</div>
                  </div>
                  {index < equation.equation.components.length - 1 && (
                    <div className="mx-2 text-2xl text-gray-400">+</div>
                  )}
                </div>
              ))}
              <div className="mx-2 text-2xl text-gray-400">=</div>
              <div className="bg-green-100 border-2 border-green-300 rounded-lg px-4 py-2 min-w-[200px] text-center">
                <div className="text-sm font-medium text-green-800">Target</div>
                <div className="text-xs text-green-600 truncate">{equation.equation.target || 'Not defined'}</div>
              </div>
            </div>

            {/* Component Details */}
            <div className="space-y-4">
              {equation.equation.components.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onUpdate={(updates) => updateComponent(component.id, updates)}
                  onRemove={() => removeComponent(component.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audit Log */}
      {equation.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {equation.audit_log.slice(-10).reverse().map((log, index) => (
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

interface ComponentCardProps {
  component: EquationComponent;
  onUpdate: (updates: Partial<EquationComponent>) => void;
  onRemove: () => void;
}

function ComponentCard({ component, onUpdate, onRemove }: ComponentCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tool Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tool Assignment</label>
          <select
            value={component.tool}
            onChange={(e) => onUpdate({ tool: e.target.value as ApprovedTool })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(APPROVED_TOOLS).map(([key, tool]) => (
              <option key={key} value={key}>
                {tool.label}
              </option>
            ))}
          </select>
          {component.tool && (
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${APPROVED_TOOLS[component.tool]?.color}`}>
                {APPROVED_TOOLS[component.tool]?.category}
              </span>
              <p className="text-xs text-gray-600 mt-1">{APPROVED_TOOLS[component.tool]?.description}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Constraints</label>
          <textarea
            value={component.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Add notes, constraints, or commander requirements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* External Tool Proposal */}
      {component.tool === 'external_approval_required' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <label className="block text-sm font-medium text-yellow-800 mb-2">
            External Tool Proposal (Commander Approval Required)
          </label>
          <input
            type="text"
            value={component.externalToolProposal || ''}
            onChange={(e) => onUpdate({ externalToolProposal: e.target.value })}
            placeholder="Describe the external tool and why it's needed..."
            className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <p className="text-xs text-yellow-700 mt-1">
            This tool requires commander approval before it can be used in the blueprint.
          </p>
        </div>
      )}
    </div>
  );
} 