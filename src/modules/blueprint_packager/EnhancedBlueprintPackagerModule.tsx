/**
 * Enhanced Blueprint Packager Module
 * 
 * This component demonstrates the enhanced blueprint packager with
 * subagent orchestration capabilities.
 */

import React, { useState } from 'react';
import {
  createEnhancedBlueprint,
  validateOrchestratedBlueprint,
  exportOrchestratedBlueprint,
  generateSampleFrameManifest,
  EnhancedBlueprintPackagerOptions,
  EnhancedBlueprintPackagerResult,
  OrchestratedBlueprintOutput
} from './enhancedBlueprintPackager';

export default function EnhancedBlueprintPackagerModule() {
  const [options, setOptions] = useState<EnhancedBlueprintPackagerOptions>({
    blueprintId: 'enhanced_blueprint_demo',
    version: 'v1.0.0',
    doctrineReference: 'nuclear_doctrine_v1.2',
    commanderSignoff: 'commander@example.com',
    frameManifestJson: '',
    applicationSpec: {}
  });

  const [result, setResult] = useState<EnhancedBlueprintPackagerResult | null>(null);
  const [exportedBlueprint, setExportedBlueprint] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'export'>('input');

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const blueprintResult = createEnhancedBlueprint(options);
      setResult(blueprintResult);
      
      if (blueprintResult.success && blueprintResult.orchestratedBlueprint) {
        const exported = exportOrchestratedBlueprint(blueprintResult.orchestratedBlueprint, 'json');
        setExportedBlueprint(exported);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          totalModules: 0,
          totalSubagents: 0,
          estimatedCompletionTime: 0,
          generatedAt: new Date().toISOString()
        }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSampleFrame = () => {
    const sampleFrame = generateSampleFrameManifest();
    setOptions(prev => ({
      ...prev,
      frameManifestJson: sampleFrame
    }));
  };

  const handleValidateBlueprint = () => {
    if (result?.orchestratedBlueprint) {
      const validation = validateOrchestratedBlueprint(result.orchestratedBlueprint);
      alert(validation.valid ? 'Blueprint is valid!' : `Validation failed: ${validation.errors.join(', ')}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Blueprint Packager with Subagent Orchestration
        </h1>
        <p className="text-gray-600">
          Generate blueprints with modular subagent orchestration, automatic module decomposition,
          and SHQ-compliant routing through Monte_Major → Tim_Sandbox → Validator_Major.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'input'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Input Configuration
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'output'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generated Blueprint
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'export'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Export JSON
          </button>
        </nav>
      </div>

      {/* Input Configuration Tab */}
      {activeTab === 'input' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Blueprint Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blueprint ID
                </label>
                <input
                  type="text"
                  value={options.blueprintId}
                  onChange={(e) => setOptions(prev => ({ ...prev, blueprintId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={options.version}
                  onChange={(e) => setOptions(prev => ({ ...prev, version: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctrine Reference
                </label>
                <input
                  type="text"
                  value={options.doctrineReference}
                  onChange={(e) => setOptions(prev => ({ ...prev, doctrineReference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commander Sign-off
                </label>
                <input
                  type="text"
                  value={options.commanderSignoff}
                  onChange={(e) => setOptions(prev => ({ ...prev, commanderSignoff: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Frame Manifest */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Frame Manifest (Optional)</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame JSON Manifest
                </label>
                <textarea
                  value={options.frameManifestJson}
                  onChange={(e) => setOptions(prev => ({ ...prev, frameManifestJson: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Paste Frame JSON manifest here or use sample..."
                />
              </div>

              <button
                onClick={handleLoadSampleFrame}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Load Sample Frame
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleGenerateBlueprint}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Enhanced Blueprint'}
            </button>

            {result?.orchestratedBlueprint && (
              <button
                onClick={handleValidateBlueprint}
                className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Validate Blueprint
              </button>
            )}
          </div>
        </div>
      )}

      {/* Generated Blueprint Tab */}
      {activeTab === 'output' && result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Generated Blueprint</h2>
          
          {result.success ? (
            <div className="space-y-6">
              {/* Metadata */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Generation Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Modules:</span>
                    <span className="ml-2">{result.metadata.totalModules}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Subagents:</span>
                    <span className="ml-2">{result.metadata.totalSubagents}</span>
                  </div>
                  <div>
                    <span className="font-medium">Est. Completion:</span>
                    <span className="ml-2">{result.metadata.estimatedCompletionTime} min</span>
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span>
                    <span className="ml-2">{new Date(result.metadata.generatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Modules Overview */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Modules & Subagents</h3>
                <div className="space-y-3">
                  {result.orchestratedBlueprint?.modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                        <span className="text-sm text-gray-500">{module.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">Subagent Tasks:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {module.subagent_tasks.map((task) => (
                            <div key={task.id} className="bg-gray-50 p-2 rounded text-sm">
                              <div className="font-medium">{task.name}</div>
                              <div className="text-gray-600">{task.description}</div>
                              <div className="text-xs text-gray-500">
                                Duration: {task.estimated_duration} min | Priority: {task.priority}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Merge Plan */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Merge Plan</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Integration Steps:</span>
                      <span className="ml-2">{result.orchestratedBlueprint?.merge_plan.integration_order.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Validation Steps:</span>
                      <span className="ml-2">{result.orchestratedBlueprint?.merge_plan.validation_steps.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Audit Steps:</span>
                      <span className="ml-2">{result.orchestratedBlueprint?.merge_plan.audit_steps.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Routing Plan */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Routing Plan</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Primary Route:</span>
                      <span className="ml-2">
                        {result.orchestratedBlueprint?.routing_plan.primary_route.monte_major} → 
                        {result.orchestratedBlueprint?.routing_plan.primary_route.tim_sandbox} → 
                        {result.orchestratedBlueprint?.routing_plan.primary_route.validator_major}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Fallback Routes:</span>
                      <span className="ml-2">{result.orchestratedBlueprint?.routing_plan.fallback_routes.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Monitoring Points:</span>
                      <span className="ml-2">{result.orchestratedBlueprint?.routing_plan.monitoring_points.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Generation Failed</h3>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Export JSON Tab */}
      {activeTab === 'export' && exportedBlueprint && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Exported Blueprint JSON</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Machine-readable, model-neutral JSON output ready for Process phase consumption
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(exportedBlueprint)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm">{exportedBlueprint}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 