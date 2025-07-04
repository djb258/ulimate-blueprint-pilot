// Types for module outputs
interface ModuleOutput {
  [key: string]: unknown;
}

interface CommanderIntentOutput {
  blueprint_id?: string;
  doctrine_reference?: string;
}

interface BuildManifest {
  build_version: string;
  build_date: string;
  stack: {
    framework: string;
    hosting: string;
    persistence?: string;
    [key: string]: unknown;
  };
  modules: Record<string, string>;
  external_dependencies: string[];
  doctrine_reference: string;
  design_notes: string;
  build_agent: string;
  [key: string]: unknown;
}

interface FinalBlueprint {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  commander_signoff: string;
  modules: Record<string, ModuleOutput>;
  build_manifest: BuildManifest;
  metadata: {
    assembledAt: string;
    assembledBy: string;
  };
}

interface PackageResult {
  success: boolean;
  filePath?: string;
  manifestPath?: string;
  error?: string;
}

// Build Manifest Validation
export function validateBuildManifest(manifest: BuildManifest): { valid: boolean; errors: string[] } {
  const requiredFields = [
    'build_version',
    'build_date', 
    'stack',
    'modules',
    'external_dependencies',
    'doctrine_reference',
    'design_notes',
    'build_agent'
  ];
  
  const errors: string[] = [];
  
  for (const field of requiredFields) {
    if (!manifest[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate stack has required sub-fields
  if (manifest.stack && typeof manifest.stack === 'object') {
    if (!manifest.stack.framework) {
      errors.push('Stack must include framework');
    }
    if (!manifest.stack.hosting) {
      errors.push('Stack must include hosting');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate Build Manifest
export function generateBuildManifest({
  version,
  modules,
  stack,
  dependencies,
  doctrineReference,
  designNotes,
  buildAgent
}: {
  version: string;
  modules: Record<string, string>;
  stack: {
    framework: string;
    hosting: string;
    persistence?: string;
    [key: string]: unknown;
  };
  dependencies: string[];
  doctrineReference: string;
  designNotes: string;
  buildAgent: string;
}): BuildManifest {
  return {
    build_version: version,
    build_date: new Date().toISOString().split('T')[0],
    stack,
    modules,
    external_dependencies: dependencies,
    doctrine_reference: doctrineReference,
    design_notes: designNotes,
    build_agent: buildAgent
  };
}

// Load outputs from all modules (stub)
export function loadModuleOutputs(): Record<string, ModuleOutput> {
  // TODO: Implement loading from config files or state
  return {
    commander_intent: {},
    ping_pong_refinement: {},
    equation: {},
    constants_variables: {},
    data_sources: {},
    solution_design: {},
    security: {},
  };
}

// Assemble final blueprint object with build manifest
export function assembleFinalBlueprint({ 
  moduleOutputs, 
  version, 
  commanderSignoff,
  buildManifest 
}: {
  moduleOutputs: Record<string, ModuleOutput>;
  version: string;
  commanderSignoff: string;
  buildManifest: BuildManifest;
}): FinalBlueprint {
  const commanderIntent = moduleOutputs.commander_intent as CommanderIntentOutput;
  
  // Validate build manifest before assembly
  const manifestValidation = validateBuildManifest(buildManifest);
  if (!manifestValidation.valid) {
    throw new Error(`Build manifest validation failed: ${manifestValidation.errors.join(', ')}`);
  }
  
  return {
    blueprint_id: commanderIntent?.blueprint_id || 'example_blueprint',
    version,
    doctrine_reference: commanderIntent?.doctrine_reference || 'nuclear_doctrine_v1.2',
    commander_signoff: commanderSignoff,
    build_manifest: buildManifest,
    modules: {
      commander_intent: moduleOutputs.commander_intent,
      ping_pong_refinement: moduleOutputs.ping_pong_refinement,
      equation: moduleOutputs.equation,
      constants_variables: moduleOutputs.constants_variables,
      data_sources: moduleOutputs.data_sources,
      solution_design: moduleOutputs.solution_design,
      security: moduleOutputs.security,
    },
    metadata: {
      assembledAt: new Date().toISOString(),
      assembledBy: 'system',
    },
  };
}

// Save final blueprint and build manifest
export function saveFinalBlueprint(blueprint: FinalBlueprint): PackageResult {
  // TODO: Implement file save logic
  const version = blueprint.version || 'v1.0.0';
  const filePath = `/blueprints/final_blueprint_${version}.yaml`;
  const manifestPath = `/build_manifest.yaml`;
  
  // Validate build manifest before saving
  const manifestValidation = validateBuildManifest(blueprint.build_manifest);
  if (!manifestValidation.valid) {
    return { 
      success: false, 
      error: `Build manifest validation failed: ${manifestValidation.errors.join(', ')}` 
    };
  }
  
  // Would write YAML to filePath and manifestPath here
  return { success: true, filePath, manifestPath };
} 