'use client';

import React, { useState } from 'react';
import { Phase } from '../../types';

interface StageViewProps {
  phase: Phase;
  onStatusChange?: (phaseId: string, status: string) => void;
  onSignOff?: (phaseId: string) => void;
  children?: React.ReactNode;
}

interface InputField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  required: boolean;
  completed: boolean;
  value?: string;
  options?: string[];
  validation?: {
    isValid: boolean;
    errors: string[];
  };
}

export default function StageView({ phase, onStatusChange, onSignOff, children }: StageViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commanderApproval, setCommanderApproval] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Mock input fields based on phase type
  const getInputFields = (): InputField[] => {
    switch (phase.id) {
      case 'commander_intent':
        return [
          {
            id: 'intent',
            label: 'Commander Intent',
            type: 'textarea',
            required: true,
            completed: true,
            validation: { isValid: true, errors: [] }
          },
          {
            id: 'target_x',
            label: 'Target X',
            type: 'textarea',
            required: true,
            completed: true,
            validation: { isValid: true, errors: [] }
          },
          {
            id: 'doctrine_reference',
            label: 'Doctrine Reference',
            type: 'text',
            required: true,
            completed: true,
            validation: { isValid: true, errors: [] }
          }
        ];
      case 'data_source_mapping':
        return [
          {
            id: 'source_mappings',
            label: 'Data Source Mappings',
            type: 'textarea',
            required: true,
            completed: false,
            validation: { isValid: false, errors: ['At least one mapping required'] }
          },
          {
            id: 'validation_rules',
            label: 'Validation Rules',
            type: 'textarea',
            required: true,
            completed: false,
            validation: { isValid: false, errors: ['Validation rules must be defined'] }
          }
        ];
      default:
        return [
          {
            id: 'content',
            label: 'Stage Content',
            type: 'textarea',
            required: true,
            completed: false,
            validation: { isValid: false, errors: ['Content is required'] }
          }
        ];
    }
  };

  const inputFields = getInputFields();
  const completedFields = inputFields.filter(field => field.completed);
  const requiredFields = inputFields.filter(field => field.required);
  const allRequiredCompleted = requiredFields.every(field => field.completed);
  const hasValidationErrors = inputFields.some(field => field.validation && !field.validation.isValid);

  const handleComplete = () => {
    if (!allRequiredCompleted) {
      setValidationErrors(['All required fields must be completed']);
      return;
    }
    if (hasValidationErrors) {
      setValidationErrors(['All validation errors must be resolved']);
      return;
    }
    if (!commanderApproval) {
      setValidationErrors(['Commander approval required']);
      return;
    }

    onStatusChange?.(phase.id, 'completed');
    onSignOff?.(phase.id);
  };

  const getStatusColor = () => {
    if (phase.status === 'completed') return 'bg-green-500';
    if (phase.status === 'in_progress') return 'bg-blue-500';
    if (phase.status === 'blocked') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (phase.status === 'completed') return 'Complete';
    if (phase.status === 'in_progress') return 'In Progress';
    if (phase.status === 'blocked') return 'Blocked';
    return 'Not Started';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Mobile Header */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            phase.status === 'completed' ? 'bg-green-100 text-green-800' :
            phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Stage Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${getStatusColor()}`}>
              {phase.id === 'commander_intent' ? '🎯' :
               phase.id === 'data_source_mapping' ? '🗂️' :
               phase.id === 'solution_design' ? '🏗️' :
               phase.id === 'security' ? '🔒' : '📋'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{phase.name}</h1>
              <p className="text-gray-600 mt-1">{phase.description}</p>
            </div>
          </div>
          
          {/* Desktop Status */}
          <div className="hidden md:block">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              phase.status === 'completed' ? 'bg-green-100 text-green-800' :
              phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedFields.length}/{inputFields.length} fields complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedFields.length / inputFields.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Inputs</h2>
        
        <div className="space-y-4">
          {inputFields.map((field) => (
            <div key={field.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex items-center gap-2">
                  {field.completed && (
                    <span className="text-green-600 text-sm">✓ Complete</span>
                  )}
                  {field.validation && !field.validation.isValid && (
                    <span className="text-red-600 text-sm">⚠️ Errors</span>
                  )}
                </div>
              </div>

              {/* Field Content */}
              <div className="bg-gray-50 rounded p-3 min-h-[60px]">
                {field.completed ? (
                  <div className="text-sm text-gray-700">
                    {field.value || 'Content completed'}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    {field.type === 'textarea' ? 'Enter content...' :
                     field.type === 'text' ? 'Enter text...' :
                     field.type === 'select' ? 'Select option...' :
                     'Input required'}
                  </div>
                )}
              </div>

              {/* Validation Errors */}
              {field.validation && !field.validation.isValid && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <ul className="text-xs text-red-700">
                    {field.validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Commander Approval */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Commander Approval</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="commander-approval"
              checked={commanderApproval}
              onChange={(e) => setCommanderApproval(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="commander-approval" className="text-sm text-gray-700">
              I approve this stage completion and confirm all inputs are accurate and complete.
              This stage will be marked as complete and cannot be modified without reopening.
            </label>
          </div>

          {commanderApproval && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-700">
                ✓ Commander approval granted. Stage can be completed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stage Content */}
      {children && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stage Interface</h2>
          {children}
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">Cannot Complete Stage</h3>
          <ul className="text-sm text-red-700">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleComplete}
          disabled={!allRequiredCompleted || hasValidationErrors || !commanderApproval}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
            allRequiredCompleted && !hasValidationErrors && commanderApproval
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {phase.status === 'completed' ? 'Stage Complete' : 'Complete Stage'}
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Stage Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Duration: {Math.round(phase.estimatedDuration / 60)} minutes</p>
            {phase.startedAt && (
              <p>Started: {new Date(phase.startedAt).toLocaleString()}</p>
            )}
            {phase.completedAt && (
              <p>Completed: {new Date(phase.completedAt).toLocaleString()}</p>
            )}
            <p>Requirements: {requiredFields.length} required, {completedFields.length} complete</p>
          </div>
        </div>
      )}
    </div>
  );
} 