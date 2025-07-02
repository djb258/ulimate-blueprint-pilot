import PhaseTracker from '../components/PhaseTracker';
import ReengineeringSection from '../components/ReengineeringSection';

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
              {/* Re-engineering Tab - Coming Soon */}
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
                disabled
                title="Coming in Step 3"
              >
                Re-engineer Existing App
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhaseTracker />
        
        {/* Placeholder for Re-engineering Mode */}
        <div className="mt-12">
          <ReengineeringSection />
        </div>
      </div>
    </main>
  );
} 