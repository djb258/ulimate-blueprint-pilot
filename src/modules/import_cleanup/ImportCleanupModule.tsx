import React, { useState } from 'react';
import { validateModuleData, schemaRegistry } from '../../lib/schemas';
import { parseImportedSpec, mapToBlueprintModules, generateCleanedBlueprint } from './importCleanupUtils';

export default function ImportCleanupModule() {
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<any>(null);
  const [moduleData, setModuleData] = useState<any>({});
  const [currentModule, setCurrentModule] = useState<string>('commander_intent');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [signOff, setSignOff] = useState<{ [module: string]: boolean }>({});
  const [outputPath, setOutputPath] = useState<string | null>(null);

  // Handle file import
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportedFile(file);
    const text = await file.text();
    const parsed = parseImportedSpec(text, file.name);
    setImportedData(parsed);
    const mapped = mapToBlueprintModules(parsed);
    setModuleData(mapped);
    setCurrentModule('commander_intent');
    setSignOff({});
    setOutputPath(null);
  };

  // Handle module data change
  const handleModuleChange = (module: string, data: any) => {
    setModuleData((prev: any) => ({ ...prev, [module]: data }));
  };

  // Handle sign-off
  const handleSignOff = (module: string) => {
    setSignOff((prev) => ({ ...prev, [module]: true }));
  };

  // Handle validation
  const handleValidate = (module: string) => {
    const data = moduleData[module];
    const schema = schemaRegistry[module as keyof typeof schemaRegistry];
    if (!schema) return;
    const result = validateModuleData(module as keyof typeof schemaRegistry, data);
    setValidationErrors(result.errors);
    return result.isValid;
  };

  // Handle next module
  const handleNext = () => {
    if (!handleValidate(currentModule)) return;
    handleSignOff(currentModule);
    // Move to next module
    const modules = [
      'commander_intent',
      'data_source_mapping',
      'solution_design',
      'security',
      'ping_pong_integration',
    ];
    const idx = modules.indexOf(currentModule);
    if (idx < modules.length - 1) {
      setCurrentModule(modules[idx + 1]);
      setValidationErrors([]);
    }
  };

  // Handle blueprint output
  const handleOutput = () => {
    // Validate all modules and sign-off
    const modules = [
      'commander_intent',
      'data_source_mapping',
      'solution_design',
      'security',
      'ping_pong_integration',
    ];
    for (const m of modules) {
      if (!signOff[m] || !handleValidate(m)) {
        setCurrentModule(m);
        return;
      }
    }
    // Generate cleaned blueprint
    const output = generateCleanedBlueprint(moduleData);
    setOutputPath(output.filePath);
  };

  // UI for module review (placeholder, integrate with existing module UIs)
  const renderModuleUI = (module: string) => (
    <div className="p-4 bg-gray-50 rounded-lg border mb-4">
      <h3 className="text-xl font-semibold mb-2 capitalize">{module.replace('_', ' ')}</h3>
      <pre className="text-xs bg-white p-2 rounded border overflow-x-auto mb-2">{JSON.stringify(moduleData[module], null, 2)}</pre>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
        onClick={() => handleValidate(module)}
      >Validate</button>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => handleSignOff(module)}
        disabled={!!signOff[module]}
      >Sign Off</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Import & Cleanup Existing App Spec</h2>
      <input type="file" accept=".yaml,.yml,.json" onChange={handleFileChange} className="mb-4" />
      {importedData && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Imported Data Mapping Summary</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded border overflow-x-auto">{JSON.stringify(moduleData, null, 2)}</pre>
        </div>
      )}
      {importedData && (
        <>
          {renderModuleUI(currentModule)}
          {validationErrors.length > 0 && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
              <ul>{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}
          <div className="flex space-x-2 mt-2">
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded"
              onClick={handleNext}
              disabled={!!signOff[currentModule]}
            >Next Module</button>
            <button
              className="px-4 py-2 bg-purple-700 text-white rounded"
              onClick={handleOutput}
              disabled={Object.keys(signOff).length < 5}
            >Generate Cleaned Blueprint</button>
          </div>
        </>
      )}
      {outputPath && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Cleaned blueprint saved to: <code>{outputPath}</code>
        </div>
      )}
    </div>
  );
} 