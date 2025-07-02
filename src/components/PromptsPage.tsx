'use client';

import { useState, useEffect } from 'react';
import { Prompt, Phase, promptsStore, PHASES } from '../utils/promptsStore';
import PromptButton from './PromptButton';
import PromptForm from './PromptForm';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<Phase>>(new Set(PHASES));

  // Load prompts on component mount
  useEffect(() => {
    setPrompts(promptsStore.getAllPrompts());
  }, []);

  // Refresh prompts after changes
  const refreshPrompts = () => {
    setPrompts(promptsStore.getAllPrompts());
  };

  // Handle form submission (add or edit)
  const handleSubmit = (text: string, phase: Phase) => {
    if (editingPrompt) {
      // Update existing prompt
      promptsStore.updatePrompt(editingPrompt.id, { text, phase });
    } else {
      // Add new prompt
      promptsStore.addPrompt(text, phase);
    }
    
    refreshPrompts();
    setIsFormOpen(false);
    setEditingPrompt(null);
  };

  // Handle prompt deletion
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      promptsStore.deletePrompt(id);
      refreshPrompts();
    }
  };

  // Handle prompt editing
  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  // Handle prompt triggering (placeholder for now)
  const handleTrigger = (prompt: Prompt) => {
    // TODO: Implement prompt injection into active phase
    console.log('Triggering prompt:', prompt);
    alert(`Prompt triggered: "${prompt.text}"\n\nThis will be integrated with the active phase in future updates.`);
  };

  // Toggle phase expansion
  const togglePhase = (phase: Phase) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phase)) {
      newExpanded.delete(phase);
    } else {
      newExpanded.add(phase);
    }
    setExpandedPhases(newExpanded);
  };

  // Get prompts for a specific phase
  const getPromptsForPhase = (phase: Phase) => {
    return prompts.filter(p => p.phase === phase);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prompts Library</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your blueprint prompts by phase
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Prompt
        </button>
      </div>

      {/* Prompts by Phase */}
      <div className="space-y-6">
        {PHASES.map((phase) => {
          const phasePrompts = getPromptsForPhase(phase);
          const isExpanded = expandedPhases.has(phase);

          return (
            <div key={phase} className="bg-white rounded-lg border border-gray-200">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900">{phase}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {phasePrompts.length} prompt{phasePrompts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Phase Content */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  {phasePrompts.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No prompts for this phase yet.
                      <br />
                      <button
                        onClick={() => {
                          setIsFormOpen(true);
                          // Pre-select the phase
                          setEditingPrompt({ id: '', text: '', phase, createdAt: new Date(), updatedAt: new Date() });
                        }}
                        className="text-blue-600 hover:text-blue-700 mt-2"
                      >
                        Add your first prompt
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {phasePrompts.map((prompt) => (
                        <PromptButton
                          key={prompt.id}
                          prompt={prompt}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onTrigger={handleTrigger}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prompt Form Modal */}
      <PromptForm
        prompt={editingPrompt}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingPrompt(null);
        }}
        isOpen={isFormOpen}
      />
    </div>
  );
} 