'use client';

import { useState } from 'react';
import { Phase, PhaseStatus } from '../types';
import { STATUS_CONFIG, PHASE_CONFIG } from '../lib/constants';
import { formatDuration, formatDate } from '../lib/utils';
import PlanPhaseModule from './PlanPhaseModule';
import EquationModule from '../modules/equation/EquationModule';
import ConstantsVariablesModule from '../modules/constants_variables/ConstantsVariablesModule';
import DataSourceMappingModule from '../modules/data_source_mapping/DataSourceMappingModule';
import SolutionDesignModule from '../modules/solution_design/SolutionDesignModule';
import SecurityModule from '../modules/security/SecurityModule';
import CommanderIntentModule from '../modules/commander_intent/CommanderIntentModule';
import PingPongIntegrationModule from '../modules/ping_pong_integration/PingPongIntegrationModule';

interface PhaseSectionProps {
  phase: Phase;
  onStatusChange?: (phaseId: string, status: PhaseStatus) => void;
  canStart?: boolean;
}

export default function PhaseSection({ phase, onStatusChange, canStart }: PhaseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig = STATUS_CONFIG[phase.status];
  const phaseConfig = Object.values(PHASE_CONFIG).find(config => config.id === phase.id);

  const handleStatusChange = async (newStatus: PhaseStatus) => {
    if (!onStatusChange || isUpdating) return;

    try {
      setIsUpdating(true);
      await onStatusChange(phase.id, newStatus);
    } catch (error) {
      console.error('Error updating phase status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusButton = () => {
    if (phase.status === 'completed') {
      return (
        <button
          onClick={() => handleStatusChange('in_progress')}
          disabled={isUpdating}
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Reopen'}
        </button>
      );
    }

    if (phase.status === 'in_progress') {
      return (
        <button
          onClick={() => handleStatusChange('completed')}
          disabled={isUpdating}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          {isUpdating ? 'Updating...' : 'Complete'}
        </button>
      );
    }

    if (phase.status === 'not_started' && canStart) {
      return (
        <button
          onClick={() => handleStatusChange('in_progress')}
          disabled={isUpdating}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          {isUpdating ? 'Starting...' : 'Start'}
        </button>
      );
    }

    return null;
  };

  if (phase.name === 'PLAN') {
    return (
      <PlanPhaseModule
        user="user@example.com"
        onPromoteToPhase2={(payload) => {
          // Placeholder: handle promotion to phase 2
          console.log('Promote to Phase 2 with PLAN payload:', payload);
        }}
      />
    );
  }

  if (phase.name === 'EQUATION') {
    return (
      <EquationModule
        blueprintId={phase.id}
        user="user@example.com"
      />
    );
  }

  if (phase.name === 'CONSTANTS + VARIABLES') {
    return (
      <ConstantsVariablesModule
        blueprintId={phase.id}
        user="user@example.com"
      />
    );
  }

  if (phase.name === 'DATA SOURCE MAPPING') {
    return (
      <DataSourceMappingModule
        blueprintId={phase.id}
        user="user@example.com"
      />
    );
  }

  if (phase.name === 'SOLUTION DESIGN') {
    return (
      <SolutionDesignModule
        blueprintId={phase.id}
        user="user@example.com"
      />
    );
  }

  if (phase.name === 'SECURITY') {
    return (
      <SecurityModule
        blueprintId={phase.id}
        user="user@example.com"
      />
    );
  }

  if (phase.name === 'COMMANDER INTENT') {
    return (
      <CommanderIntentModule
        blueprintId={phase.id}
        user="user@example.com"
        buildVersion="blueprint_v1.0.0"
      />
    );
  }

  if (phase.name === 'PING-PONG INTEGRATION') {
    return (
      <PingPongIntegrationModule
        blueprintId={phase.id}
        user="user@example.com"
        buildVersion="blueprint_v1.0.0"
      />
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Phase Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className={`w-10 h-10 flex items-center justify-center text-xl ${statusConfig.color} rounded-full`}>
              {statusConfig.icon}
            </div>
            
            {/* Phase Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg text-gray-900">{phase.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color} text-white`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
              
              {/* Phase Metadata */}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Duration: {formatDuration(phase.estimatedDuration)}</span>
                {phase.startedAt && (
                  <span>Started: {formatDate(phase.startedAt)}</span>
                )}
                {phase.completedAt && (
                  <span>Completed: {formatDate(phase.completedAt)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {getStatusButton()}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dependencies */}
        {phase.dependencies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Dependencies: {phase.dependencies.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && phaseConfig && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
              <ul className="space-y-2">
                {phaseConfig.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Deliverables</h4>
              <ul className="space-y-2">
                {phaseConfig.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-700">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase Description */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {phaseConfig.description}
            </p>
          </div>

          {/* Progress Tracking */}
          {phase.status === 'in_progress' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Progress Notes</h4>
              <textarea
                placeholder="Add notes about your progress..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 