'use client';

import React from 'react';
import { Phase } from '../../types';

interface StageTrackerProps {
  phases: Phase[];
  currentPhaseId?: string;
  onPhaseClick?: (phaseId: string) => void;
  onSignOff?: (phaseId: string) => void;
}

interface StageConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
}

const STAGE_CONFIGS: Record<string, StageConfig> = {
  'commander_intent': {
    id: 'commander_intent',
    name: 'Commander Intent',
    shortName: 'Intent',
    description: 'Define commander goals and target outcomes',
    icon: '🎯',
    color: 'bg-blue-500',
    requirements: ['Commander intent', 'Target X', 'Doctrine reference', 'Commander sign-off']
  },
  'ping_pong_integration': {
    id: 'ping_pong_integration',
    name: 'Ping-Pong Integration',
    shortName: 'Ping-Pong',
    description: 'External refinement and validation',
    icon: '🏓',
    color: 'bg-purple-500',
    requirements: ['Integration status', 'Refinement notes', 'Commander sign-off']
  },
  'equation': {
    id: 'equation',
    name: 'Architecture Equation',
    shortName: 'Equation',
    description: 'Define system components and tools',
    icon: '⚖️',
    color: 'bg-green-500',
    requirements: ['Target definition', 'Component tools', 'Commander sign-off']
  },
  'constants_variables': {
    id: 'constants_variables',
    name: 'Constants & Variables',
    shortName: 'Constants',
    description: 'Define system constants and variables',
    icon: '🔧',
    color: 'bg-yellow-500',
    requirements: ['Constants defined', 'Variables typed', 'Commander sign-off']
  },
  'data_source_mapping': {
    id: 'data_source_mapping',
    name: 'Data Source Mapping',
    shortName: 'Data Sources',
    description: 'Map data sources and validation',
    icon: '🗂️',
    color: 'bg-indigo-500',
    requirements: ['Source mappings', 'Validation rules', 'Commander sign-off']
  },
  'solution_design': {
    id: 'solution_design',
    name: 'Solution Design',
    shortName: 'Solution',
    description: 'Design system architecture and components',
    icon: '🏗️',
    color: 'bg-orange-500',
    requirements: ['Component design', 'Tool selection', 'Commander sign-off']
  },
  'security': {
    id: 'security',
    name: 'Security & Error Handling',
    shortName: 'Security',
    description: 'Define security and error handling',
    icon: '🔒',
    color: 'bg-red-500',
    requirements: ['Security components', 'Error handling', 'Commander sign-off']
  },
  'final_packaging': {
    id: 'final_packaging',
    name: 'Final Packaging',
    shortName: 'Package',
    description: 'Assemble and version final blueprint',
    icon: '📦',
    color: 'bg-gray-500',
    requirements: ['All modules complete', 'Version pinned', 'Commander sign-off']
  }
};

export default function StageTracker({ phases, currentPhaseId, onPhaseClick, onSignOff }: StageTrackerProps) {
  const getStageStatus = (phase: Phase) => {
    if (phase.status === 'completed') return 'completed';
    if (phase.status === 'in_progress') return 'current';
    if (phase.status === 'blocked') return 'blocked';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-500';
      case 'current': return 'bg-blue-500 border-blue-500';
      case 'blocked': return 'bg-red-500 border-red-500';
      default: return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complete';
      case 'current': return 'In Progress';
      case 'blocked': return 'Blocked';
      default: return 'Pending';
    }
  };

  const isPhaseClickable = (phase: Phase) => {
    return phase.status === 'in_progress' || 
           phase.status === 'completed' || 
           (phase.status === 'not_started' && canStartPhase(phase));
  };

  const canStartPhase = (phase: Phase) => {
    // Check if previous phases are completed
    const phaseIndex = phases.findIndex(p => p.id === phase.id);
    if (phaseIndex === 0) return true;
    
    for (let i = 0; i < phaseIndex; i++) {
      if (phases[i].status !== 'completed') return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Mobile Header */}
      <div className="md:hidden mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Blueprint Progress</h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Current: {phases.find(p => p.id === currentPhaseId)?.name || 'None'}</span>
          <span>{phases.filter(p => p.status === 'completed').length}/{phases.length} Complete</span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Blueprint Design Tracker</h2>
        <p className="text-gray-600">Track your blueprint design progress through all stages</p>
      </div>

      {/* Stage Tracker */}
      <div className="space-y-4">
        {phases.map((phase, index) => {
          const config = STAGE_CONFIGS[phase.id];
          const status = getStageStatus(phase);
          const isClickable = isPhaseClickable(phase);
          const isCurrent = phase.id === currentPhaseId;
          const isCompleted = phase.status === 'completed';

          return (
            <div
              key={phase.id}
              className={`relative ${
                isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={() => isClickable && onPhaseClick?.(phase.id)}
            >
              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}

              {/* Stage Card */}
              <div className={`
                relative bg-white rounded-lg border-2 p-4 transition-all duration-200
                ${isClickable ? 'hover:shadow-lg hover:scale-[1.02]' : ''}
                ${isCurrent ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${status === 'completed' ? 'border-green-500' : 
                  status === 'current' ? 'border-blue-500' :
                  status === 'blocked' ? 'border-red-500' : 'border-gray-300'}
              `}>
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold
                    ${getStatusColor(status)}
                    ${!isClickable ? 'opacity-50' : ''}
                  `}>
                    {config?.icon || '📋'}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {config?.name || phase.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {config?.description || phase.description}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${status === 'completed' ? 'bg-green-100 text-green-800' :
                            status === 'current' ? 'bg-blue-100 text-blue-800' :
                            status === 'blocked' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {getStatusText(status)}
                        </span>
                        
                        {/* Commander Sign-off */}
                        {isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSignOff?.(phase.id);
                            }}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Sign-off
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Requirements Progress */}
                    {config?.requirements && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Requirements</span>
                          <span className="font-medium">
                            {isCompleted ? config.requirements.length : 0}/{config.requirements.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {config.requirements.map((req, reqIndex) => (
                            <div key={reqIndex} className="flex items-center gap-2">
                              <div className={`
                                w-2 h-2 rounded-full
                                ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                              `} />
                              <span className={`
                                text-xs
                                ${isCompleted ? 'text-green-700' : 'text-gray-500'}
                              `}>
                                {req}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Phase Metadata */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>Duration: {Math.round(phase.estimatedDuration / 60)}min</span>
                      {phase.startedAt && (
                        <span>Started: {new Date(phase.startedAt).toLocaleDateString()}</span>
                      )}
                      {phase.completedAt && (
                        <span>Completed: {new Date(phase.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blocked Indicator */}
                {status === 'blocked' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-700">
                      ⚠️ This stage is blocked. Complete previous stages first.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm text-gray-600">
            {phases.filter(p => p.status === 'completed').length} of {phases.length} stages complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(phases.filter(p => p.status === 'completed').length / phases.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
} 