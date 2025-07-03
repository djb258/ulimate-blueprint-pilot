'use client';

import React, { useState, useEffect } from 'react';
import { BlueprintPackager, BlueprintPackageConfig, ModuleValidationResult } from '../lib/blueprintPackager';
import { validateBlueprintVersion, validateDoctrineReference } from '../lib/blueprintPackager';

interface FinalBlueprintPackagerProps {
  onComplete: (filePath: string) => void;
  onValidationError: (errors: string[]) => void;
}

export default function FinalBlueprintPackager({ onComplete, onValidationError }: FinalBlueprintPackagerProps) {
  const [config, setConfig] = useState<BlueprintPackageConfig>({
    blueprint_id: '',
    version: '',
    doctrine_reference: '',
    commander: '',
    approval_notes: ''
  });

  const [moduleValidation, setModuleValidation] = useState<ModuleValidationResult[]>([]);
  const [packageStatus, setPackageStatus] = useState<{
    ready: boolean;
    missingModules: string[];
    invalidModules: string[];
  }>({
    ready: false,
    missingModules: [],
    invalidModules: []
  });

  const [isPackaging, setIsPackaging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Initialize packager and check status
  useEffect(() => {
    const packager = new BlueprintPackager(config);
    const status = packager.getPackageStatus();
    setPackageStatus(status);
    setModuleValidation(status.moduleValidation);
  }, [config]);

  const handleConfigChange = (field: keyof BlueprintPackageConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const validateConfig = (): boolean => {
    const errors: string[] = [];

    if (!config.blueprint_id.trim()) {
      errors.push('Blueprint ID is required');
    }

    if (!config.version.trim()) {
      errors.push('Version is required');
    } else if (!validateBlueprintVersion(config.version)) {
      errors.push('Version must be in format v1.0.0, v2.1.3, etc.');
    }

    if (!config.doctrine_reference.trim()) {
      errors.push('Doctrine reference is required');
    } else if (!validateDoctrineReference(config.doctrine_reference)) {
      errors.push('Doctrine reference must be in format doctrine_name_v1.2');
    }

    if (!config.commander.trim()) {
      errors.push('Commander name is required');
    }

    if (!config.approval_notes.trim()) {
      errors.push('Approval notes are required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePackageBlueprint = async () => {
    if (!validateConfig()) {
      onValidationError(validationErrors);
      return;
    }

    if (!packageStatus.ready) {
      const errorMsg = `Cannot package blueprint: ${[
        ...packageStatus.missingModules.map(m => `Missing ${m}`),
        ...packageStatus.invalidModules.map(m => `Invalid ${m}`)
      ].join(', ')}`;
      onValidationError([errorMsg]);
      return;
    }

    setIsPackaging(true);
    setValidationErrors([]);
    setValidationWarnings([]);

    try {
      const packager = new BlueprintPackager(config);
      const result = packager.packageBlueprint();

      if (result.success && result.filePath) {
        onComplete(result.filePath);
      } else {
        const errors = result.error ? [result.error] : ['Unknown packaging error'];
        setValidationErrors(errors);
        onValidationError(errors);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setValidationErrors([errorMsg]);
      onValidationError([errorMsg]);
    } finally {
      setIsPackaging(false);
    }
  };

  const getModuleStatusIcon = (module: ModuleValidationResult) => {
    if (!module.exists) {
      return '❌';
    }
    if (!module.validated) {
      return '⚠️';
    }
    return '✅';
  };

  const getModuleStatusText = (module: ModuleValidationResult) => {
    if (!module.exists) {
      return 'Missing';
    }
    if (!module.validated) {
      return 'Invalid';
    }
    return 'Valid';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Final Blueprint Packaging</h2>
        <p className="text-gray-600 mb-6">
          Package your blueprint with version pinning, commander approval, and validation.
          All modules must be completed and validated before packaging.
        </p>
      </div>

      {/* Module Validation Status */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Module Validation Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {moduleValidation.map((module) => (
            <div
              key={module.module}
              className={`p-4 rounded-lg border ${
                module.validated
                  ? 'border-green-200 bg-green-50'
                  : module.exists
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 capitalize">
                    {module.module.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600">{module.file_path}</p>
                  {module.last_updated && (
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(module.last_updated).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl">{getModuleStatusIcon(module)}</div>
                  <div className="text-sm font-medium">{getModuleStatusText(module)}</div>
                </div>
              </div>
              {module.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-red-600 font-medium">Errors:</p>
                  <ul className="text-xs text-red-600 list-disc list-inside">
                    {module.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Package Configuration */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blueprint ID *
            </label>
            <input
              type="text"
              value={config.blueprint_id}
              onChange={(e) => handleConfigChange('blueprint_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., claims_automation_system"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Version *
            </label>
            <input
              type="text"
              value={config.version}
              onChange={(e) => handleConfigChange('version', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., v1.0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctrine Reference *
            </label>
            <input
              type="text"
              value={config.doctrine_reference}
              onChange={(e) => handleConfigChange('doctrine_reference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., nuclear_doctrine_v1.2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commander Name *
            </label>
            <input
              type="text"
              value={config.commander}
              onChange={(e) => handleConfigChange('commander', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Commander Smith"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Notes *
            </label>
            <textarea
              value={config.approval_notes}
              onChange={(e) => handleConfigChange('approval_notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe why this blueprint is approved and ready for execution..."
            />
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="text-sm text-red-700 list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Validation Warnings:</h4>
          <ul className="text-sm text-yellow-700 list-disc list-inside">
            {validationWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Package Status */}
      <div className="mb-8">
        <div className={`p-4 rounded-lg border ${
          packageStatus.ready
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center">
            <div className="text-2xl mr-3">
              {packageStatus.ready ? '✅' : '❌'}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {packageStatus.ready ? 'Ready to Package' : 'Cannot Package'}
              </h4>
              <p className="text-sm text-gray-600">
                {packageStatus.ready
                  ? 'All modules are validated and ready for packaging'
                  : `Issues found: ${[
                      ...packageStatus.missingModules.map(m => `Missing ${m}`),
                      ...packageStatus.invalidModules.map(m => `Invalid ${m}`)
                    ].join(', ')}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handlePackageBlueprint}
          disabled={!packageStatus.ready || isPackaging}
          className={`px-6 py-3 rounded-lg font-medium ${
            packageStatus.ready && !isPackaging
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isPackaging ? 'Packaging...' : 'Package Blueprint'}
        </button>
      </div>

      {/* Package Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Package Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Final blueprint will be saved as: <code>blueprints/final_blueprint_{config.version || 'vX.X.X'}.yaml</code></p>
          <p>• All modules must be completed and validated before packaging</p>
          <p>• Commander approval signature will be generated automatically</p>
          <p>• Package includes validation status for all modules</p>
        </div>
      </div>
    </div>
  );
} 