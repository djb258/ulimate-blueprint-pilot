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

interface LogicManifestSpec {
  required_fields: string[];
  master_file_strategy: {
    primary_files: string[];
    secondary_files: string[];
    merge_strategy: string;
  };
  table_merge_plan: {
    source_tables: string[];
    target_tables: string[];
    merge_rules: Record<string, string>;
  };
  constants_variables_map: {
    global_constants: string[];
    module_variables: string[];
    validation_rules: Record<string, string[]>;
  };
  agent_interaction: {
    allowed_patterns: string[];
    forbidden_operations: string[];
    interaction_scope: string;
  };
  cursor_scope: {
    template_usage: string[];
    code_generation_rules: string[];
    modification_limits: string[];
  };
  sustainment_plan: {
    health_checks: string[];
    monitoring_hooks: string[];
    failure_handlers: string[];
  };
  audit_map: {
    required_audits: string[];
    audit_fields: Record<string, string[]>;
    retention_policies: Record<string, string>;
  };
  build_agent: string;
  manifest_version: string;
}

interface FinalBlueprint {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  commander_signoff: string;
  modules: Record<string, ModuleOutput>;
  build_manifest: BuildManifest;
  logic_manifest_required: boolean;
  logic_manifest_spec: LogicManifestSpec;
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

// Generate Logic Manifest Specification
function generateLogicManifestSpec(): LogicManifestSpec {
  return {
    required_fields: [
      'master_file_strategy',
      'table_merge_plan',
      'constants_variables_map',
      'agent_interaction',
      'cursor_scope',
      'sustainment_plan',
      'audit_map',
      'build_agent',
      'manifest_version'
    ],
    master_file_strategy: {
      primary_files: ['src/app/page.tsx', 'src/app/layout.tsx', 'package.json'],
      secondary_files: ['src/components/', 'src/lib/', 'config/'],
      merge_strategy: 'manifest_guided_merge'
    },
    table_merge_plan: {
      source_tables: ['users', 'blueprints', 'logic_manifests'],
      target_tables: ['users', 'blueprints', 'logic_manifests'],
      merge_rules: {
        'users': 'merge_by_email',
        'blueprints': 'merge_by_id',
        'logic_manifests': 'merge_by_version'
      }
    },
    constants_variables_map: {
      global_constants: ['MAX_BLUEPRINT_SIZE', 'DEFAULT_TIMEOUT', 'MANIFEST_VERSION'],
      module_variables: ['currentUser', 'blueprintData'],
      validation_rules: {
        'email': ['not_null', 'email_format'],
        'blueprint': ['not_null', 'valid_json'],
        'manifest': ['not_null', 'valid_manifest']
      }
    },
    agent_interaction: {
      allowed_patterns: ['blueprint_generation', 'code_generation', 'manifest_validation'],
      forbidden_operations: ['freelancing', 'manifest_modification', 'scope_violation'],
      interaction_scope: 'manifest_defined_only'
    },
    cursor_scope: {
      template_usage: ['react_component', 'api_endpoint', 'database_schema'],
      code_generation_rules: ['follow_manifest', 'use_templates', 'validate_output'],
      modification_limits: ['no_manifest_changes', 'no_scope_expansion', 'no_freelancing']
    },
    sustainment_plan: {
      health_checks: ['manifest_validation_hook', 'blueprint_health_check'],
      monitoring_hooks: ['generation_monitor', 'error_tracker'],
      failure_handlers: ['error_handler', 'rollback_handler']
    },
    audit_map: {
      required_audits: ['blueprint_generation_audit', 'manifest_access_audit'],
      audit_fields: {
        'generation': ['user_id', 'blueprint_id', 'generation_time', 'manifest_version'],
        'access': ['user_id', 'manifest_id', 'access_time', 'operation']
      },
      retention_policies: {
        'generation_audits': '7 years',
        'access_audits': '3 years',
        'system_audits': '1 year'
      }
    },
    build_agent: 'Cursor AI Assistant',
    manifest_version: '1.0.0'
  };
}

// Assemble final blueprint object with build manifest and logic manifest requirements
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
  
  // Generate logic manifest specification
  const logicManifestSpec = generateLogicManifestSpec();
  
  return {
    blueprint_id: commanderIntent?.blueprint_id || 'example_blueprint',
    version,
    doctrine_reference: commanderIntent?.doctrine_reference || 'nuclear_doctrine_v1.2',
    commander_signoff: commanderSignoff,
    build_manifest: buildManifest,
    logic_manifest_required: true,
    logic_manifest_spec: logicManifestSpec,
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

// Validate Logic Manifest Specification
export function validateLogicManifestSpec(spec: LogicManifestSpec): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate required fields
  const requiredFields = [
    'master_file_strategy',
    'table_merge_plan',
    'constants_variables_map',
    'agent_interaction',
    'cursor_scope',
    'sustainment_plan',
    'audit_map',
    'build_agent',
    'manifest_version'
  ];
  
  for (const field of requiredFields) {
    if (!spec.required_fields.includes(field)) {
      errors.push(`Missing required field in logic manifest spec: ${field}`);
    }
  }
  
  // Validate build agent
  if (!spec.build_agent) {
    errors.push('Build agent is required in logic manifest spec');
  }
  
  // Validate manifest version
  if (!spec.manifest_version) {
    errors.push('Manifest version is required in logic manifest spec');
  }
  
  // Validate agent interaction scope
  if (spec.agent_interaction.interaction_scope !== 'manifest_defined_only') {
    errors.push('Agent interaction scope must be "manifest_defined_only"');
  }
  
  // Validate forbidden operations
  if (!spec.agent_interaction.forbidden_operations.includes('freelancing')) {
    errors.push('Freelancing must be in forbidden operations');
  }
  
  return {
    valid: errors.length === 0,
    errors
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
  
  // Validate logic manifest requirements
  if (blueprint.logic_manifest_required) {
    const logicManifestValidation = validateLogicManifestSpec(blueprint.logic_manifest_spec);
    if (!logicManifestValidation.valid) {
      return {
        success: false,
        error: `Logic manifest validation failed: ${logicManifestValidation.errors.join(', ')}`
      };
    }
  }
  
  // Would write YAML to filePath and manifestPath here
  return { success: true, filePath, manifestPath };
} 