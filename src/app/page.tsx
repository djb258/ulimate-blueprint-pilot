import Link from 'next/link';
import PhaseTracker from '../components/PhaseTracker';

export default function Home() {
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
              <p className="text-gray-600 mt-1">
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
        <PhaseTracker />
        
        {/* Re-engineering Mode Link */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Re-engineer?
            </h2>
            <p className="text-gray-600 mb-6">
              Analyze existing GitHub repositories and generate comprehensive gap reports to improve your applications.
            </p>
            <Link 
              href="/reengineer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Launch Re-engineering Mode
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 