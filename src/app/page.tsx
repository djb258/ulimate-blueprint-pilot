'use client';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ultimate Blueprint Pilot
          </h1>
          <p className="text-xl text-gray-600">
            Cockpit for designing micro-engineered blueprints
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phase Tracker - Main Content */}
          <div className="lg:col-span-2">
            <PhaseTracker
              onBlueprintChange={handleBlueprintChange}
              onPhaseComplete={handlePhaseComplete}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/doctrine"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  📋 View Doctrine
                </a>
                <a
                  href="/drive"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  ☁️ Drive Integration
                </a>
                <a
                  href="/logic-manifest"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  ⚙️ Logic Manifest
                </a>
                <a
                  href="/reengineer"
                  className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  🔧 Re-engineering
                </a>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blueprint Engine</span>
                  <span className="text-sm font-medium text-green-600">● Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Logic Manifest</span>
                  <span className="text-sm font-medium text-green-600">● Loaded</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phase Tracker</span>
                  <span className="text-sm font-medium text-green-600">● Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 