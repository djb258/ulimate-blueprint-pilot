import React, { useState } from 'react';
import { validateModuleData, schemaRegistry } from '../../lib/schemas';
import { assembleFinalBlueprint, saveFinalBlueprint, loadModuleOutputs } from './blueprintPackagerUtils';

const REQUIRED_MODULES = [
  'commander_intent',
  'ping_pong_refinement',
  'equation',
  'constants_variables',
  'data_sources',
  'solution_design',
  'security',
];

export default function FinalBlueprintPackagerModule() {
  const [moduleOutputs, setModuleOutputs] = useState<any>({});
  const [validationStatus, setValidationStatus] = useState<{ [key: string]: { present: boolean; valid: boolean; errors: string[] } }>({});
  const [version, setVersion] = useState('');
  const [commanderSignoff, setCommanderSignoff] = useState('');
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [packagingError, setPackagingError] = useState<string | null>(null);

  // Load all module outputs and validate
  const handleLoadModules = () => {
    const outputs = loadModuleOutputs();
    setModuleOutputs(outputs);
    const status: { [key: string]: { present: boolean; valid: boolean; errors: string[] } } = {};
    for (const mod of REQUIRED_MODULES) {
      const data = outputs[mod];
      let present = !!data;
      let valid = false;
      let errors: string[] = [];
      if (present) {
        const schema = schemaRegistry[mod as keyof typeof schemaRegistry];
        if (schema) {
          const result = validateModuleData(mod as keyof typeof schemaRegistry, data);
          valid = result.isValid;
          errors = result.errors;
        } else {
          valid = true;
        }
      }
      status[mod] = { present, valid, errors };
    }
    setValidationStatus(status);
  };

  // Validate all sections before packaging
  const canPackage = () => {
    for (const mod of REQUIRED_MODULES) {
      const status = validationStatus[mod];
      if (!status || !status.present || !status.valid) return false;
    }
    if (!version.match(/^v\d+\.\d+\.\d+$/)) return false;
    if (!commanderSignoff.trim()) return false;
    return true;
  };

  // Assemble and save final blueprint
  const handlePackage = () => {
    setPackagingError(null);
    if (!canPackage()) {
      setPackagingError('All sections must be present, valid, and have version/sign-off.');
      return;
    }
    const blueprint = assembleFinalBlueprint({
      moduleOutputs,
      version,
      commanderSignoff,
    });
    const result = saveFinalBlueprint(blueprint);
    if (result.success) {
      setOutputPath(result.filePath);
    } else {
      setPackagingError(result.error || 'Unknown error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Final Blueprint Packaging</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded mb-4" onClick={handleLoadModules}>
        Load & Validate Module Outputs
      </button>
      <div className="mb-4">
        <label className="block font-medium mb-1">Blueprint Version *</label>
        <input
          type="text"
          value={version}
          onChange={e => setVersion(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., v1.0.0"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Commander Sign-off *</label>
        <input
          type="text"
          value={commanderSignoff}
          onChange={e => setCommanderSignoff(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., Approved by commander on 2025-07-03"
        />
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Section Status</h3>
        <ul className="text-sm">
          {REQUIRED_MODULES.map(mod => (
            <li key={mod} className="mb-1">
              <span className="font-mono">{mod}</span>: {validationStatus[mod]?.present ? (validationStatus[mod]?.valid ? '✅ Valid' : '❌ Invalid') : '❌ Missing'}
              {validationStatus[mod]?.errors?.length > 0 && (
                <ul className="ml-4 text-red-600 list-disc">
                  {validationStatus[mod].errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        className={`px-6 py-3 rounded-lg font-medium ${canPackage() ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        onClick={handlePackage}
        disabled={!canPackage()}
      >
        Assemble & Save Final Blueprint
      </button>
      {packagingError && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">{packagingError}</div>
      )}
      {outputPath && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Final blueprint saved to: <code>{outputPath}</code>
        </div>
      )}
    </div>
  );
} 