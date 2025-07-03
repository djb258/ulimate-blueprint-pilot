'use client';

import { useState, useEffect } from 'react';
import PhaseSection from './PhaseSection';
import { Blueprint, PhaseStatus } from '../types';
import { createDefaultBlueprint, calculateBlueprintProgress, getNextAvailablePhase } from '../lib/utils';
import { COMPLEXITY_LEVELS } from '../lib/constants';

interface PhaseTrackerProps {
  blueprint?: Blueprint;
  onBlueprintChange?: (blueprint: Blueprint) => void;
  onPhaseComplete?: (phaseId: string) => void;
}

export default function PhaseTracker({ 
  blueprint, 
  onBlueprintChange, 
  onPhaseComplete 
}: PhaseTrackerProps) {
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(blueprint || null);
  const [isCreatingBlueprint, setIsCreatingBlueprint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    complexity: 'moderate' as 'simple' | 'moderate' | 'complex'
  });

  useEffect(() => {
    if (blueprint) {
      setCurrentBlueprint(blueprint);
    }
  }, [blueprint]);

  const handleCreateBlueprint = async () => {
    try {
      setError(null);
      setIsCreatingBlueprint(true);

      if (!formData.name.trim() || !formData.description.trim()) {
        setError('Please fill in all required fields');
        return;
      }

      const newBlueprint = createDefaultBlueprint(
        formData.name.trim(),
        formData.description.trim(),
        formData.complexity
      );

      setCurrentBlueprint(newBlueprint);
      onBlueprintChange?.(newBlueprint);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', complexity: 'moderate' });
    } catch (err) {
      setError('Failed to create blueprint. Please try again.');
      console.error('Error creating blueprint:', err);
    } finally {
      setIsCreatingBlueprint(false);
    }
  };

  const handlePhaseStatusChange = (phaseId: string, newStatus: PhaseStatus) => {
    if (!currentBlueprint) return;

    const updatedBlueprint = {
      ...currentBlueprint,
      phases: currentBlueprint.phases.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              status: newStatus,
              startedAt: newStatus === 'in_progress' && !phase.startedAt ? new Date() : phase.startedAt,
              completedAt: newStatus === 'completed' ? new Date() : phase.completedAt
            }
          : phase
      ),
      updatedAt: new Date()
    };

    setCurrentBlueprint(updatedBlueprint);
    onBlueprintChange?.(updatedBlueprint);
    onPhaseComplete?.(phaseId);
  };

  const handleStartNextPhase = () => {
    if (!currentBlueprint) return;

    const nextPhase = getNextAvailablePhase(currentBlueprint);
    if (nextPhase) {
      handlePhaseStatusChange(nextPhase.id, 'in_progress');
    }
  };

  const progress = currentBlueprint ? calculateBlueprintProgress(currentBlueprint) : 0;
  const nextPhase = currentBlueprint ? getNextAvailablePhase(currentBlueprint) : null;

  if (!currentBlueprint) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Design Phases</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!showCreateForm ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              No Blueprint Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Create a new blueprint to start designing your project phases.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Blueprint
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Blueprint</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Blueprint Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blueprint name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your blueprint"
              />
            </div>

            <div>
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
                Complexity Level
              </label>
              <select
                id="complexity"
                value={formData.complexity}
                onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value as 'simple' | 'moderate' | 'complex' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(COMPLEXITY_LEVELS).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} - {config.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleCreateBlueprint}
                disabled={isCreatingBlueprint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCreatingBlueprint ? 'Creating...' : 'Create Blueprint'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Design Phases</h2>
          <p className="text-sm text-gray-600 mt-1">
            {currentBlueprint.name} - {currentBlueprint.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Progress</div>
          <div className="text-2xl font-bold text-blue-600">{progress}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {currentBlueprint.phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            onStatusChange={handlePhaseStatusChange}
            canStart={phase.status === 'not_started' && 
              phase.dependencies.every(depId => 
                currentBlueprint.phases.find(p => p.id === depId)?.status === 'completed'
              )}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {nextPhase ? (
            <span>Next: {nextPhase.name}</span>
          ) : progress === 100 ? (
            <span className="text-green-600">All phases completed!</span>
          ) : (
            <span>Complete current phase to continue</span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentBlueprint(null)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
          >
            New Blueprint
          </button>
          
          {nextPhase && (
            <button
              onClick={handleStartNextPhase}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Start Next Phase
            </button>
          )}
        </div>
      </div>
    </section>
  );
} 