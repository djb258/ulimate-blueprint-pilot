'use client';

import React, { useState } from 'react';
import { LogicManifest } from './logicManifestTypes';
import { generateLogicManifest, validateLogicManifest } from './logicManifestUtils';

interface LogicManifestModuleProps {
  onManifestGenerated?: (manifest: LogicManifest) => void;
  onManifestValidated?: (isValid: boolean, errors: string[]) => void;
}

export default function LogicManifestModule({ 
  onManifestGenerated, 
  onManifestValidated 
}: LogicManifestModuleProps) {
  const [manifest, setManifest] = useState<LogicManifest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleGenerateManifest = async () => {
    setIsGenerating(true);
    try {
      const newManifest = await generateLogicManifest({
        version: '1.0.0',
        buildAgent: 'Cursor AI Assistant',
        doctrineReference: 'nuclear_doctrine_v1.2'
      });
      
      setManifest(newManifest);
      onManifestGenerated?.(newManifest);
      
      // Validate the generated manifest
      const validation = validateLogicManifest(newManifest);
      setValidationErrors(validation.errors);
      onManifestValidated?.(validation.valid, validation.errors);
      
    } catch (error) {
      console.error('Error generating logic manifest:', error);
      setValidationErrors(['Failed to generate logic manifest']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportManifest = () => {
    if (!manifest) return;
    
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(manifestBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logic_manifest_${manifest.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Logic Manifest Generator</h2>
          <p className="text-gray-600 mt-1">
            Generate authoritative design specifications for code generation
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateManifest}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Manifest'}
          </button>
          {manifest && (
            <button
              onClick={handleExportManifest}
              className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            >
              Export JSON
            </button>
          )}
        </div>
      </div>

      {/* Manifest Display */}
      {manifest && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Generated Logic Manifest</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Version:</span> {manifest.version}
              </div>
              <div>
                <span className="font-medium">Build Agent:</span> {manifest.buildAgent}
              </div>
              <div>
                <span className="font-medium">Doctrine Reference:</span> {manifest.doctrineReference}
              </div>
              <div>
                <span className="font-medium">Generated At:</span> {manifest.generatedAt}
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {validationErrors.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✓ Manifest Valid</h4>
              <p className="text-green-700 text-sm">
                Logic manifest is valid and ready for embedding in blueprint outputs.
              </p>
            </div>
          )}

          {/* Manifest Sections */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Data Table Design</h4>
              <div className="text-sm text-gray-600">
                {manifest.dataTableDesign.tables.length} tables defined
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Join/Mapping Logic</h4>
              <div className="text-sm text-gray-600">
                {manifest.joinMappingLogic.mappings.length} mappings defined
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Constants & Variables</h4>
              <div className="text-sm text-gray-600">
                {manifest.constantsVariables.constants.length} constants, {manifest.constantsVariables.variables.length} variables
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Agent Interaction Patterns</h4>
              <div className="text-sm text-gray-600">
                {manifest.agentInteractionPatterns.patterns.length} patterns defined
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Logic Manifest Instructions</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Manifest defines authoritative design specifications</li>
          <li>• All code generators must consume this manifest</li>
          <li>• No freelancing beyond manifest specifications</li>
          <li>• Manifest is embedded in all blueprint outputs</li>
          <li>• Version and build agent tags required in all outputs</li>
        </ul>
      </div>
    </div>
  );
} 