'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhaseTracker from '../components/PhaseTracker';
import StageTracker from '../components/ui/StageTracker';
import MobileNavigation from '../components/ui/MobileNavigation';
import { Blueprint, Phase } from '../types';
import { useNotificationHelpers } from '../components/NotificationSystem';
import { APP_CONFIG } from '../lib/constants';

// Force Vercel rebuild - module files audit complete

export default function Home() {
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(null);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | undefined>();
  const { showSuccess } = useNotificationHelpers();

  const handleBlueprintChange = (blueprint: Blueprint) => {
    setCurrentBlueprint(blueprint);
    showSuccess('Blueprint Updated', 'Your blueprint has been saved successfully.');
  };

  const handlePhaseComplete = (phaseId: string) => {
    const phase = currentBlueprint?.phases.find(p => p.id === phaseId);
    if (phase) {
      showSuccess('Phase Completed', `${phase.name} has been marked as completed.`);
    }
  };

  const handlePhaseClick = (phaseId: string) => {
    setCurrentPhaseId(phaseId);
    // Navigate to specific phase or show phase details
    console.log('Navigating to phase:', phaseId);
  };

  const handlePhaseSignOff = () => {
    showSuccess('Commander Sign-off', 'Phase has been signed off by commander.');
    // Handle commander sign-off logic
  };

  // Mock phases for demonstration
  const mockPhases: Phase[] = [
    {
      id: 'commander_intent',
      name: 'Commander Intent',
      description: 'Define commander goals and target outcomes',
      status: 'completed',
      order: 1,
      requirements: ['Commander intent', 'Target X', 'Doctrine reference'],
      deliverables: ['Intent document', 'Target specification'],
      estimatedDuration: 30 * 60 * 1000, // 30 minutes
      dependencies: [],
      startedAt: new Date('2024-01-15T10:00:00'),
      completedAt: new Date('2024-01-15T10:25:00')
    },
    {
      id: 'ping_pong_integration',
      name: 'Ping-Pong Integration',
      description: 'External refinement and validation',
      status: 'completed',
      order: 2,
      requirements: ['Integration status', 'Refinement notes'],
      deliverables: ['Integration report', 'Refinement document'],
      estimatedDuration: 45 * 60 * 1000, // 45 minutes
      dependencies: ['commander_intent'],
      startedAt: new Date('2024-01-15T10:30:00'),
      completedAt: new Date('2024-01-15T11:10:00')
    },
    {
      id: 'equation',
      name: 'Architecture Equation',
      description: 'Define system components and tools',
      status: 'in_progress',
      order: 3,
      requirements: ['Target definition', 'Component tools'],
      deliverables: ['Architecture document', 'Component specification'],
      estimatedDuration: 60 * 60 * 1000, // 60 minutes
      dependencies: ['ping_pong_integration'],
      startedAt: new Date('2024-01-15T11:15:00'),
      completedAt: undefined
    },
    {
      id: 'constants_variables',
      name: 'Constants & Variables',
      description: 'Define system constants and variables',
      status: 'not_started',
      order: 4,
      requirements: ['Constants defined', 'Variables typed'],
      deliverables: ['Constants specification', 'Variables document'],
      estimatedDuration: 30 * 60 * 1000, // 30 minutes
      dependencies: ['equation'],
      startedAt: undefined,
      completedAt: undefined
    },
    {
      id: 'data_source_mapping',
      name: 'Data Source Mapping',
      description: 'Map data sources and validation',
      status: 'not_started',
      order: 5,
      requirements: ['Source mappings', 'Validation rules'],
      deliverables: ['Data mapping document', 'Validation specification'],
      estimatedDuration: 45 * 60 * 1000, // 45 minutes
      dependencies: ['constants_variables'],
      startedAt: undefined,
      completedAt: undefined
    },
    {
      id: 'solution_design',
      name: 'Solution Design',
      description: 'Design system architecture and components',
      status: 'not_started',
      order: 6,
      requirements: ['Component design', 'Tool selection'],
      deliverables: ['Solution architecture', 'Component specification'],
      estimatedDuration: 90 * 60 * 1000, // 90 minutes
      dependencies: ['data_source_mapping'],
      startedAt: undefined,
      completedAt: undefined
    },
    {
      id: 'security',
      name: 'Security & Error Handling',
      description: 'Define security and error handling',
      status: 'not_started',
      order: 7,
      requirements: ['Security components', 'Error handling'],
      deliverables: ['Security specification', 'Error handling document'],
      estimatedDuration: 60 * 60 * 1000, // 60 minutes
      dependencies: ['solution_design'],
      startedAt: undefined,
      completedAt: undefined
    },
    {
      id: 'final_packaging',
      name: 'Final Packaging',
      description: 'Assemble and version final blueprint',
      status: 'not_started',
      order: 8,
      requirements: ['All modules complete', 'Version pinned'],
      deliverables: ['Final blueprint package', 'Version documentation'],
      estimatedDuration: 30 * 60 * 1000, // 30 minutes
      dependencies: ['security'],
      startedAt: undefined,
      completedAt: undefined
    }
  ];

  const completedPhases = mockPhases.filter(p => p.status === 'completed').length;
  const currentPhase = mockPhases.find(p => p.status === 'in_progress')?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavigation 
        currentPhase={currentPhase}
        totalPhases={mockPhases.length}
        completedPhases={completedPhases}
      />
      
      <main className="pt-16 md:pt-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {APP_CONFIG.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {APP_CONFIG.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Version {APP_CONFIG.version} • Built with Next.js 15.3.4
                </p>
              </div>
              <div className="hidden md:flex space-x-4">
                {/* Main Tracker Tab - Active */}
                <Link 
                  href="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow-sm"
                >
                  Design Blueprint
                </Link>
                {/* Doctrine Compliance Tab */}
                <Link 
                  href="/doctrine"
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                  Doctrine Compliance
                </Link>
                {/* Prompts Tab */}
                <Link 
                  href="/prompts"
                  className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  Prompts Library
                </Link>
                {/* Re-engineering Tab */}
                <Link 
                  href="/reengineer"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Re-engineer Existing App
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          {!currentBlueprint && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Ultimate Blueprint Pilot
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Create comprehensive blueprints for your software projects with our structured approach. 
                  Follow the 8-phase methodology to ensure nothing is missed in your development process.
                </p>
                <button 
                  onClick={() => {
                    // Initialize a new blueprint with the first phase
                    const newBlueprint: Blueprint = {
                      id: `blueprint-${Date.now()}`,
                      name: 'New Blueprint',
                      description: 'A new blueprint project',
                      phases: mockPhases,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      status: 'in_progress',
                      metadata: {
                        author: 'Commander',
                        version: '1.0.0',
                        tags: ['new', 'blueprint'],
                        complexity: 'moderate',
                        estimatedTotalTime: mockPhases.reduce((total, phase) => total + phase.estimatedDuration, 0),
                        targetTechnologies: ['Next.js', 'React', 'TypeScript']
                      }
                    };
                    setCurrentBlueprint(newBlueprint);
                    setCurrentPhaseId('commander_intent');
                    showSuccess('Blueprint Started', 'Your new blueprint has been created. Starting with Commander Intent phase.');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 transform hover:scale-105"
                >
                  🚀 Start New Blueprint
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-semibold text-blue-600 mb-2">🎯 Intent</div>
                    <p className="text-gray-600">Define commander goals and outcomes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-semibold text-green-600 mb-2">⚖️ Equation</div>
                    <p className="text-gray-600">Define system components and tools</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-semibold text-purple-600 mb-2">🏗️ Design</div>
                    <p className="text-gray-600">Design architecture and components</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-semibold text-orange-600 mb-2">📦 Package</div>
                    <p className="text-gray-600">Assemble final blueprint</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stage Tracker */}
          <div className="mb-8">
            <StageTracker
              phases={mockPhases}
              currentPhaseId={currentPhaseId}
              onPhaseClick={handlePhaseClick}
              onSignOff={handlePhaseSignOff}
            />
          </div>

          {/* Legacy Phase Tracker (for comparison) */}
          <div className="mb-8">
            <PhaseTracker 
              blueprint={currentBlueprint || undefined}
              onBlueprintChange={handleBlueprintChange}
              onPhaseComplete={handlePhaseComplete}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link 
              href="/drive"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">☁️</span>
                </div>
                <h3 className="font-semibold text-gray-900">Google Drive</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Access and manage your blueprint specifications from Google Drive
              </p>
            </Link>

            <Link 
              href="/prompts"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">💬</span>
                </div>
                <h3 className="font-semibold text-gray-900">Prompts Library</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Browse and use pre-built prompts for blueprint generation
              </p>
            </Link>

            <Link 
              href="/reengineer"
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🔧</span>
                </div>
                <h3 className="font-semibold text-gray-900">Re-engineering</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Analyze existing apps and generate improvement blueprints
              </p>
            </Link>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>
                Built with ❤️ by{' '}
                <a 
                  href="https://github.com/djb258" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  djb258
                </a>
              </p>
              <p className="mt-1">
                <a 
                  href={APP_CONFIG.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  View on GitHub
                </a>
                {' • '}
                <a 
                  href={`https://${APP_CONFIG.vercelUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  Live Demo
                </a>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
} 