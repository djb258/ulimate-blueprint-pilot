'use client';

import Link from 'next/link';
import PhaseTracker from '../components/PhaseTracker';
import { Blueprint } from '../types';

export default function Home() {
  const handleBlueprintChange = (blueprint: Blueprint) => {
    console.log('Blueprint updated:', blueprint);
    // Here you would typically save to a database or state management
  };

  const handlePhaseComplete = (phaseId: string) => {
    console.log('Phase completed:', phaseId);
    // Handle phase completion logic
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ultimate Blueprint Pilot
              </h1>
              <p className="text-gray-600">
                Cockpit for designing micro-engineered blueprints
              </p>
            </div>
            <div className="flex space-x-4">
              {/* Main Tracker Tab - Active */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium">
                Design Blueprint
              </button>
              {/* Doctrine Compliance Tab */}
              <Link 
                href="/doctrine"
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Doctrine Compliance
              </Link>
              {/* Prompts Tab */}
              <Link 
                href="/prompts"
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Prompts Library
              </Link>
              {/* Re-engineering Tab */}
              <Link 
                href="/reengineer"
                className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                Re-engineer Existing App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhaseTracker
          onBlueprintChange={handleBlueprintChange}
          onPhaseComplete={handlePhaseComplete}
        />
      </div>
    </main>
  );
} 