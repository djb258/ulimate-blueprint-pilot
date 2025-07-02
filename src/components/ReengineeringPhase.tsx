'use client';

import { useState, useEffect } from 'react';
import { Phase, reengineeringStore } from '../utils/reengineeringStore';

interface ReengineeringPhaseProps {
  repoId: string;
  phase: Phase;
  isActive: boolean;
  onPhaseComplete: () => void;
}

export default function ReengineeringPhase({ 
  repoId, 
  phase, 
  isActive, 
  onPhaseComplete 
}: ReengineeringPhaseProps) {
  const [notes, setNotes] = useState('');
  const [gaps, setGaps] = useState<string[]>(['']);
  const [issues, setIssues] = useState<string[]>(['']);
  const [recommendations, setRecommendations] = useState<string[]>(['']);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing analysis if available
  useEffect(() => {
    const existingAnalysis = reengineeringStore.getPhaseAnalysis(repoId, phase);
    if (existingAnalysis) {
      setNotes(existingAnalysis.notes);
      setGaps(existingAnalysis.gaps.length > 0 ? existingAnalysis.gaps : ['']);
      setIssues(existingAnalysis.issues.length > 0 ? existingAnalysis.issues : ['']);
      setRecommendations(existingAnalysis.recommendations.length > 0 ? existingAnalysis.recommendations : ['']);
    }
  }, [repoId, phase]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Filter out empty strings
      const filteredGaps = gaps.filter(g => g.trim());
      const filteredIssues = issues.filter(i => i.trim());
      const filteredRecommendations = recommendations.filter(r => r.trim());

      // Add or update analysis
      const existingAnalysis = reengineeringStore.getPhaseAnalysis(repoId, phase);
      if (existingAnalysis) {
        reengineeringStore.updatePhaseAnalysis(existingAnalysis.id, {
          notes,
          gaps: filteredGaps,
          issues: filteredIssues,
          recommendations: filteredRecommendations
        });
      } else {
        reengineeringStore.addPhaseAnalysis(
          repoId,
          phase,
          notes,
          filteredGaps,
          filteredIssues,
          filteredRecommendations
        );
      }

      onPhaseComplete();
    } catch (error) {
      console.error('Failed to save phase analysis:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (type: 'gaps' | 'issues' | 'recommendations') => {
    const setter = type === 'gaps' ? setGaps : type === 'issues' ? setIssues : setRecommendations;
    setter(prev => [...prev, '']);
  };

  const updateItem = (type: 'gaps' | 'issues' | 'recommendations', index: number, value: string) => {
    const setter = type === 'gaps' ? setGaps : type === 'issues' ? setIssues : setRecommendations;
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeItem = (type: 'gaps' | 'issues' | 'recommendations', index: number) => {
    const setter = type === 'gaps' ? setGaps : type === 'issues' ? setIssues : setRecommendations;
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const getPhaseDescription = (phase: Phase): string => {
    const descriptions = {
      'PLAN': 'Analyze the overall project structure, goals, and architecture decisions',
      'SCAFFOLD': 'Review the initial setup, dependencies, and project scaffolding',
      'FILE STRUCTURE': 'Evaluate the organization and structure of files and directories',
      'TEST PLAN': 'Assess testing strategy, coverage, and test implementation',
      'SECURITY PLAN': 'Review security measures, vulnerabilities, and best practices',
      'PHASE GATES / PROMOTION RULES': 'Evaluate deployment pipeline, CI/CD, and promotion criteria',
      'FINALIZE BLUEPRINT': 'Synthesize findings and create final recommendations'
    };
    return descriptions[phase] || '';
  };

  return (
    <div className={`border rounded-lg mb-4 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {isActive ? '→' : '○'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{phase}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-9">
          {getPhaseDescription(phase)}
        </p>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-4 mt-4">
            {/* Notes Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document your findings and observations for this phase..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Gaps Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identified Gaps
              </label>
              <div className="space-y-2">
                {gaps.map((gap, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={gap}
                      onChange={(e) => updateItem('gaps', index, e.target.value)}
                      placeholder="Describe a gap or missing component..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {gaps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('gaps', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('gaps')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Gap
                </button>
              </div>
            </div>

            {/* Issues Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issues Found
              </label>
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={issue}
                      onChange={(e) => updateItem('issues', index, e.target.value)}
                      placeholder="Describe an issue or problem..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {issues.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('issues', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('issues')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Issue
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommendations
              </label>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rec}
                      onChange={(e) => updateItem('recommendations', index, e.target.value)}
                      placeholder="Suggest an improvement or solution..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {recommendations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('recommendations', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('recommendations')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Recommendation
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Analysis'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 