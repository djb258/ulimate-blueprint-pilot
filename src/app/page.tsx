'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ultimate Blueprint Pilot
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Welcome to the blueprint design cockpit
        </p>
        
        {/* Primary Action */}
        <div className="mb-8">
          <Link 
            href="/prompts"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-colors duration-200 inline-block text-lg"
          >
            🚀 Start New Blueprint
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/doctrine"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 inline-block"
          >
            📋 Doctrine
          </Link>
          
          <Link 
            href="/drive"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 inline-block"
          >
            ☁️ Drive Integration
          </Link>
          
          <Link 
            href="/logic-manifest"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 inline-block"
          >
            ⚙️ Logic Manifest
          </Link>
          
          <Link 
            href="/reengineer"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 inline-block"
          >
            🔧 Re-engineering
          </Link>
          
          <Link 
            href="/test"
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 inline-block"
          >
            🧪 Test Page
          </Link>
        </div>
      </div>
    </div>
  );
} 