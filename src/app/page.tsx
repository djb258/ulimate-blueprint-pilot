'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ultimate Blueprint Pilot
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to the blueprint design cockpit
        </p>
        <button 
          onClick={() => alert('Start New Blueprint clicked!')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200"
        >
          🚀 Start New Blueprint
        </button>
      </div>
    </div>
  );
} 