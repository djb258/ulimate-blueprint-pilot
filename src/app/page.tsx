'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhaseTracker from '../components/PhaseTracker';
import { Blueprint } from '../types';
import { useNotificationHelpers } from '../components/NotificationSystem';
import { APP_CONFIG } from '../lib/constants';

export default function Home() {
  const [currentBlueprint, setCurrentBlueprint] = useState<Blueprint | null>(null);
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

  return (
    <main className="min-h-screen bg-gray-50">
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
            <div className="flex space-x-4">
              {/* Main Tracker Tab - Active */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow-sm">
                Design Blueprint
              </button>
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
                Follow the 7-phase methodology to ensure nothing is missed in your development process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-blue-600 mb-2">📋 Plan</div>
                  <p className="text-gray-600">Define scope, requirements, and architecture</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-green-600 mb-2">🏗️ Scaffold</div>
                  <p className="text-gray-600">Set up project structure and configuration</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-semibold text-purple-600 mb-2">📁 Organize</div>
                  <p className="text-gray-600">Structure files and organize codebase</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase Tracker */}
        <PhaseTracker 
          blueprint={currentBlueprint || undefined}
          onBlueprintChange={handleBlueprintChange}
          onPhaseComplete={handlePhaseComplete}
        />
        
        {/* Re-engineering Mode Link */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Re-engineer?
            </h2>
            <p className="text-gray-600 mb-6">
              Analyze existing GitHub repositories and generate comprehensive gap reports to improve your applications.
            </p>
            <Link 
              href="/reengineer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Launch Re-engineering Mode
            </Link>
          </div>
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
  );
} 