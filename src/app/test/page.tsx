import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          ✅ Test Page Working!
        </h1>
        <p className="text-green-600 mb-6">
          If you can see this, routing is working correctly.
        </p>
        <Link 
          href="/"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200 inline-block"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 