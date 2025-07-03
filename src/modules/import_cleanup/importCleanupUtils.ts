import yaml from 'js-yaml';

interface ImportedSpec {
  [key: string]: unknown;
}

type ModuleData = Record<string, unknown>;

// Parse imported YAML/JSON spec
export function parseImportedSpec(text: string, fileName: string): ImportedSpec {
  if (fileName.endsWith('.json')) {
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }
  try {
    return yaml.load(text) as ImportedSpec;
  } catch {
    return {};
  }
}

// Map imported data to blueprint module fields (stub)
export function mapToBlueprintModules(imported: ImportedSpec): Record<string, ModuleData> {
  // TODO: Implement mapping logic for each module
  return {
    commander_intent: imported.commander_intent as ModuleData || {},
    data_source_mapping: imported.data_source_mapping as ModuleData || {},
    solution_design: imported.solution_design as ModuleData || {},
    security: imported.security as ModuleData || {},
    ping_pong_integration: imported.ping_pong_integration as ModuleData || {},
  };
}

// Generate cleaned, versioned blueprint output (stub)
export function generateCleanedBlueprint(moduleData: Record<string, ModuleData>): { filePath: string } {
  // TODO: Implement output logic
  const version = (moduleData.commander_intent as { version?: string })?.version || 'v1.0.0';
  const filePath = `/blueprints/final_blueprint_${version}.yaml`;
  // Would write YAML to filePath here
  return { filePath };
} 