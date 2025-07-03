'use client';

import { useState, useEffect } from 'react';
import { SolutionDesignPayload, SolutionComponent, SolutionDesignTool } from '../../types';
import { SOLUTION_DESIGN_TOOLS } from '../../lib/constants';
import { v4 as uuidv4 } from 'uuid';
import { saveSolutionDesignConfig, generateExampleSolutionDesign } from './solutionDesignUtils';

interface SolutionDesignModuleProps {
  blueprintId: string;
  user: string;
  onSave?: (payload: SolutionDesignPayload) => void;
  initialData?: SolutionDesignPayload;
}

export default function SolutionDesignModule({ 
  blueprintId, 
  user, 
  onSave, 
  initialData 
}: SolutionDesignModuleProps) {
  const [payload, setPayload] = useState<SolutionDesignPayload>(
    initialData || {
      blueprint_id: blueprintId,
      target_x: '',
      equation_components: [],
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user,
        version: '1.0.0'
      },
      validation: {
        all_components_have_tools: false,
        external_tools_approved: false,
        equation_balanced: false,
        ready_for_save: false
      },
      audit_log: []
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  // Update validation whenever payload changes
  useEffect(() => {
    const validation = {
      all_components_have_tools: payload.equation_components.every(component => 
        component.tool !== null || component.external_tool_proposal.trim() !== ''
      ),
      external_tools_approved: payload.equation_components.every(component => 
        !component.requires_approval || component.approval_status === 'approved'
      ),
      equation_balanced: payload.equation_components.length > 0 && payload.target_x.trim() !== '',
      ready_for_save: false
    };

    validation.ready_for_save = validation.all_components_have_tools && 
                               validation.external_tools_approved && 
                               validation.equation_balanced;

    setPayload(prev => ({
      ...prev,
      validation,
      metadata: {
        ...prev.metadata,
        updated_at: new Date().toISOString()
      }
    }));
  }, [payload.equation_components, payload.target_x]);

  const addComponent = () => {
    const newComponent: SolutionComponent = {
      id: uuidv4(),
      name: '',
      tool: null,
      external_tool_proposal: '',
      llm_recommendation: '',
      commander_notes: '',
      requires_approval: false,
      approval_status: 'not_required',
      llm_suggestions: [],
      constraints: []
    };

    setPayload(prev => ({
      ...prev,
      equation_components: [...prev.equation_components, newComponent],
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'component_added',
          user,
          details: 'Added new equation component',
          component_id: newComponent.id
        }
      ]
    }));
  };

  const updateComponent = (id: string, updates: Partial<SolutionComponent>) => {
    setPayload(prev => ({
      ...prev,
      equation_components: prev.equation_components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      ),
      audit_log: [
        ...prev.audit_log,
        {
          timestamp: new Date().toISOString(),
          action: 'component_updated',
          user,
          details: `Updated component: ${updates.name || 'component'}`,
          component_id: id,
          tool_selected: updates.tool || undefined
        }
      ]
    }));
  };

  const removeComponent = (id: string) => {
    const component = payload.equation_components.find(c => c.id === id);
    setPayload(prev => ({
      ...prev,
      equation_components: prev.equation_components.filter(c => c.id !== id),
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

  const handleSave = async () => {
    if (!payload.validation.ready_for_save) return;

    setIsSaving(true);
    try {
      // Save to file
      await saveSolutionDesignConfig(payload, 'yaml');
      
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
            action: 'solution_design_saved',
            user,
            details: 'Solution design configuration saved successfully'
          }
        ]
      }));
    } catch (error) {
      console.error('Error saving solution design:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadExample = () => {
    const example = generateExampleSolutionDesign(blueprintId, user);
    setPayload(example);
  };

  const renderEquation = () => {
    if (payload.equation_components.length === 0) {
      return <span className="text-gray-400">[No components defined]</span>;
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {payload.equation_components.map((component, index) => (
          <div key={component.id} className="flex items-center gap-1">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
              [{component.name || 'Component'}] {component.tool && `(${component.tool})`}
            </span>
            {index < payload.equation_components.length - 1 && (
              <span className="text-gray-500">+</span>
            )}
          </div>
        ))}
        <span className="text-gray-500 mx-2">=</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
          [{payload.target_x || 'Target X'}]
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Solution Design Conversational Module</h2>
            <p className="text-gray-600 mt-1">
              Commander-LLM collaboration to solve the equation with tool selection
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
          <div className={`p-3 rounded-md ${payload.validation.all_components_have_tools ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Tools Selected</div>
            <div className={`text-xs ${payload.validation.all_components_have_tools ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.all_components_have_tools ? '✓ Complete' : '✗ Required'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.external_tools_approved ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">External Tools</div>
            <div className={`text-xs ${payload.validation.external_tools_approved ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.external_tools_approved ? '✓ Approved' : '✗ Pending'}
            </div>
          </div>
          <div className={`p-3 rounded-md ${payload.validation.equation_balanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-sm font-medium text-gray-700">Equation Balanced</div>
            <div className={`text-xs ${payload.validation.equation_balanced ? 'text-green-600' : 'text-red-600'}`}>
              {payload.validation.equation_balanced ? '✓ Balanced' : '✗ Required'}
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

      {/* Visual Equation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Equation</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            {renderEquation()}
          </div>
        </div>
        
        {/* Target X Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target X</label>
          <input
            type="text"
            value={payload.target_x}
            onChange={(e) => setPayload(prev => ({ ...prev, target_x: e.target.value }))}
            placeholder="Enter the target output or goal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Equation Components */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Equation Components</h3>
          <button
            onClick={addComponent}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            + Add Component
          </button>
        </div>

        {payload.equation_components.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🧩</div>
            <p>No equation components defined yet. Click &quot;Add Component&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {payload.equation_components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                onUpdate={(updates) => updateComponent(component.id, updates)}
                onRemove={() => removeComponent(component.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Audit Log */}
      {payload.audit_log.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {payload.audit_log.slice(-10).reverse().map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className="text-gray-700">{log.action.replace('_', ' ')}</span>
                  {log.details && <span className="text-gray-600">- {log.details}</span>}
                  {log.tool_selected && <span className="text-blue-600">Tool: {log.tool_selected}</span>}
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
  component: SolutionComponent;
  onUpdate: (updates: Partial<SolutionComponent>) => void;
  onRemove: () => void;
}

function ComponentCard({ component, onUpdate, onRemove }: ComponentCardProps) {
  const selectedTool = component.tool ? SOLUTION_DESIGN_TOOLS[component.tool] : null;

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
        {/* Tool Selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Tool Selection</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approved Tool</label>
            <select
              value={component.tool || ''}
              onChange={(e) => onUpdate({ tool: e.target.value as SolutionDesignTool || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a tool...</option>
              {Object.entries(SOLUTION_DESIGN_TOOLS).map(([key, tool]) => (
                <option key={key} value={key}>
                  {tool.label}
                </option>
              ))}
            </select>
            {selectedTool && (
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${selectedTool.color}`}>
                  {selectedTool.category}
                </span>
                <p className="text-xs text-gray-600 mt-1">{selectedTool.description}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">External Tool Proposal</label>
            <input
              type="text"
              value={component.external_tool_proposal}
              onChange={(e) => onUpdate({ external_tool_proposal: e.target.value })}
              placeholder="Propose external tool (requires approval)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {component.external_tool_proposal && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">External Tool Proposal</span>
                <select
                  value={component.approval_status}
                  onChange={(e) => onUpdate({ 
                    approval_status: e.target.value as 'pending' | 'approved' | 'rejected' | 'not_required',
                    requires_approval: e.target.value === 'pending'
                  })}
                  className="text-xs px-2 py-1 border border-yellow-300 rounded"
                >
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <p className="text-xs text-yellow-700 mt-1">{component.external_tool_proposal}</p>
            </div>
          )}
        </div>

        {/* LLM Collaboration */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">LLM Collaboration</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LLM Recommendation</label>
            <textarea
              value={component.llm_recommendation}
              onChange={(e) => onUpdate({ llm_recommendation: e.target.value })}
              placeholder="LLM provides conversational guidance and suggestions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commander Notes & Constraints</label>
            <textarea
              value={component.commander_notes}
              onChange={(e) => onUpdate({ commander_notes: e.target.value })}
              placeholder="Commander notes, constraints, and final decisions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* LLM Suggestions */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">LLM Suggestions</label>
        <div className="space-y-2">
          {component.llm_suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={suggestion}
                onChange={(e) => {
                  const suggestions = [...component.llm_suggestions];
                  suggestions[index] = e.target.value;
                  onUpdate({ llm_suggestions: suggestions });
                }}
                placeholder="LLM suggestion"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => {
                  const suggestions = component.llm_suggestions.filter((_, i) => i !== index);
                  onUpdate({ llm_suggestions: suggestions });
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ llm_suggestions: [...component.llm_suggestions, ''] })}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Suggestion
          </button>
        </div>
      </div>

      {/* Constraints */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Constraints</label>
        <div className="space-y-2">
          {component.constraints.map((constraint, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={constraint}
                onChange={(e) => {
                  const constraints = [...component.constraints];
                  constraints[index] = e.target.value;
                  onUpdate({ constraints });
                }}
                placeholder="Constraint"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => {
                  const constraints = component.constraints.filter((_, i) => i !== index);
                  onUpdate({ constraints });
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate({ constraints: [...component.constraints, ''] })}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add Constraint
          </button>
        </div>
      </div>
    </div>
  );
} 