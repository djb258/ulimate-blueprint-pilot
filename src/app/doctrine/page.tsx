import Link from 'next/link';
import DoctrineCompliance from '../../components/DoctrineCompliance';

export default function DoctrinePage() {
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
                Doctrine Compliance & Validation System
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
              {/* Doctrine Compliance Tab - Active */}
              <button className="px-4 py-2 bg-red-600 text-white rounded-md font-medium">
                Doctrine Compliance
              </button>
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
        <DoctrineCompliance />
        
        {/* Doctrine Information */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About the Doctrine System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Barton Doctrine (1960)</h3>
              <p>
                R.S. Barton's foundational principles emphasizing full automation, 
                high-level programming languages, machine-controlled operations, 
                and stack-based architectures for efficient computation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">NEON Doctrine</h3>
              <p>
                <strong>N</strong>uclear Enforcement, <strong>E</strong>xplicit Ownership, 
                <strong>O</strong>perational Normalization, <strong>N</strong>o Orphan Data. 
                Ensures strict validation and complete data lineage.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">STAMPED Framework</h3>
              <p>
                <strong>S</strong>tructured, <strong>T</strong>raceable, <strong>A</strong>udit-ready, 
                <strong>M</strong>apped, <strong>P</strong>romotable, <strong>E</strong>nforced, 
                <strong>D</strong>ocumented. Complete process management and compliance.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Barton Numbering System</h3>
            <p className="text-blue-800 text-sm">
              All doctrines use the format: <code className="bg-blue-100 px-1 rounded">DB.HQ.SUB.NESTED.INDEX</code>
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• <strong>DB</strong>: Database (1=Command Ops, 2=Marketing)</li>
              <li>• <strong>HQ</strong>: Sub-hive identifier</li>
              <li>• <strong>SUB</strong>: Sub-sub-hive</li>
              <li>• <strong>NESTED</strong>: Section (0-9=tone, 10-19=structure, 20-29=process, 30-39=compliance, 40-49=messaging)</li>
              <li>• <strong>INDEX</strong>: Sequential doctrinal ID</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 