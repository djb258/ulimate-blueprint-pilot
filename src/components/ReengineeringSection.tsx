'use client';

import { useState, useEffect } from 'react';
import { RepoInfo, reengineeringStore, PHASES } from '../utils/reengineeringStore';
import RepoInputForm from './RepoInputForm';
import ReengineeringPhase from './ReengineeringPhase';
import GapReport from './GapReport';

export default function ReengineeringSection() {
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<RepoInfo | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [showGapReport, setShowGapReport] = useState(false);
  const [gapReportSummary, setGapReportSummary] = useState('');

  // Load repos on component mount
  useEffect(() => {
    setRepos(reengineeringStore.getAllRepos());
  }, []);

  const handleRepoAdded = (repo: RepoInfo) => {
    setRepos(prev => [...prev, repo]);
    setSelectedRepo(repo);
    setCurrentPhaseIndex(0);
    setShowGapReport(false);
  };

  const handleRepoSelect = (repo: RepoInfo) => {
    setSelectedRepo(repo);
    setCurrentPhaseIndex(0);
    setShowGapReport(false);
  };

  const handlePhaseComplete = () => {
    // Move to next phase or show gap report
    if (currentPhaseIndex < PHASES.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      // All phases complete, ready for gap report
      setShowGapReport(true);
    }
  };

  const handleGenerateGapReport = () => {
    if (!selectedRepo || !gapReportSummary.trim()) return;
    
    reengineeringStore.generateGapReport(selectedRepo.id, gapReportSummary);
    setShowGapReport(true);
  };

  const getCompletedPhases = (repoId: string): number => {
    const analyses = reengineeringStore.getPhaseAnalysesByRepo(repoId);
    return analyses.length;
  };

  const getGapReport = (repoId: string) => {
    return reengineeringStore.getGapReportByRepo(repoId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Re-engineer Existing App
        </h2>
        <p className="text-gray-600">
          Analyze existing GitHub repositories and generate comprehensive gap reports to improve your applications.
        </p>
      </div>

      {/* Repository Selection */}
      {repos.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Repository to Analyze
          </h3>
          <div className="grid gap-3">
            {repos.map(repo => {
              const completedPhases = getCompletedPhases(repo.id);
              const isSelected = selectedRepo?.id === repo.id;
              const hasGapReport = getGapReport(repo.id);
              
              return (
                <div
                  key={repo.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRepoSelect(repo)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{repo.name}</h4>
                      <p className="text-sm text-gray-600">{repo.url}</p>
                      {repo.description && (
                        <p className="text-sm text-gray-500 mt-1">{repo.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {completedPhases}/{PHASES.length} phases
                      </div>
                      <div className="text-xs text-gray-500">
                        {hasGapReport ? '✅ Report ready' : '📝 In progress'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Repository */}
      <RepoInputForm onRepoAdded={handleRepoAdded} />

      {/* Phase Analysis */}
      {selectedRepo && !showGapReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Phase Analysis: {selectedRepo.name}
              </h3>
              <p className="text-sm text-gray-600">
                Phase {currentPhaseIndex + 1} of {PHASES.length}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {getCompletedPhases(selectedRepo.id)}/{PHASES.length} completed
            </div>
          </div>

          <div className="space-y-4">
            {PHASES.map((phase, index) => (
              <ReengineeringPhase
                key={phase}
                repoId={selectedRepo.id}
                phase={phase}
                isActive={index === currentPhaseIndex}
                onPhaseComplete={handlePhaseComplete}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900">
                {Math.round((getCompletedPhases(selectedRepo.id) / PHASES.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getCompletedPhases(selectedRepo.id) / PHASES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Gap Report Generation */}
      {selectedRepo && showGapReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Gap Report: {selectedRepo.name}
          </h3>
          
          {!getGapReport(selectedRepo.id) ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Executive Summary
                </label>
                <textarea
                  value={gapReportSummary}
                  onChange={(e) => setGapReportSummary(e.target.value)}
                  placeholder="Provide a high-level summary of your analysis findings..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleGenerateGapReport}
                disabled={!gapReportSummary.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Gap Report
              </button>
            </div>
          ) : (
            <GapReport 
              report={getGapReport(selectedRepo.id)!} 
              repoName={selectedRepo.name} 
            />
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedRepo && repos.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Getting Started with Re-engineering Mode
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>1. <strong>Add a Repository:</strong> Enter a GitHub repository URL to begin analysis</p>
            <p>2. <strong>Phase Analysis:</strong> Walk through each blueprint phase and document findings</p>
            <p>3. <strong>Identify Gaps:</strong> Note missing components, issues, and areas for improvement</p>
            <p>4. <strong>Generate Report:</strong> Create a comprehensive gap analysis report</p>
            <p>5. <strong>Export Results:</strong> Download your findings in Markdown or JSON format</p>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This is a manual analysis tool. Future versions will include automated GitHub API integration and AI-powered analysis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 