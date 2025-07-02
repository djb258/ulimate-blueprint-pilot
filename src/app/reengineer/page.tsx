import Link from 'next/link';
import ReengineeringSection from '../../components/ReengineeringSection';

export default function ReengineerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ultimate Blueprint Pilot
              </h1>
              <p className="text-gray-600 mt-1">
                Re-engineering Mode
              </p>
            </div>
            <div className="flex space-x-4">
              {/* Main Tracker Tab */}
              <Link 
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Design Blueprint
              </Link>
              {/* Prompts Tab */}
              <Link 
                href="/prompts"
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Prompts Library
              </Link>
              {/* Re-engineering Tab - Active */}
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium">
                Re-engineer Existing App
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReengineeringSection />
      </div>
    </div>
  );
} 