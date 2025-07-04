'use client';

import React from 'react';
import LogicManifestModule from '../../modules/logic_manifest/LogicManifestModule';
import { LogicManifest } from '../../modules/logic_manifest/logicManifestTypes';

export default function LogicManifestPage() {
  const handleManifestGenerated = (manifest: LogicManifest) => {
    console.log('Logic manifest generated:', manifest);
  };

  const handleManifestValidated = (isValid: boolean, errors: string[]) => {
    console.log('Manifest validation:', { isValid, errors });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Logic Manifest System</h1>
          <p className="mt-2 text-gray-600">
            Generate authoritative design specifications for consistent code generation across all IDEs and agents.
          </p>
        </div>

        <LogicManifestModule 
          onManifestGenerated={handleManifestGenerated}
          onManifestValidated={handleManifestValidated}
        />

        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Logic Manifest Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Purpose</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Defines canonical data table design</li>
                <li>• Specifies join/mapping logic</li>
                <li>• Declares constants and variable types</li>
                <li>• Establishes agent interaction patterns</li>
                <li>• Defines Cursor template usage</li>
                <li>• Sets health/status/failure hooks</li>
                <li>• Enforces audit requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Consistent code generation across IDEs</li>
                <li>• No freelancing beyond specifications</li>
                <li>• Modular and portable outputs</li>
                <li>• LLM-neutral design approach</li>
                <li>• Version and build agent tracking</li>
                <li>• Embedded in all blueprint outputs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 