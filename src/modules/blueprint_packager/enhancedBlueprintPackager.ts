/**
 * Enhanced Blueprint Packager with Subagent Orchestration
 * 
 * This module extends the existing blueprint packager to support
 * modular subagent orchestration as part of the standard output.
 */

import {
  parseFrameManifest,
  decomposeApplicationDesign,
  createOrchestratedBlueprintOutput,
  generateMergePlan,
  generateRoutingPlan
} from '../../lib/subagentOrchestration';
import {
  OrchestratedBlueprintOutput,
  FrameManifest,
  ModuleDefinition,
  BuildManifest,
  LogicManifestSpec
} from '../../types/subagentOrchestration';
import { assembleFinalBlueprint, generateBuildManifest, validateBuildManifest } from './blueprintPackagerUtils';

export interface EnhancedBlueprintPackagerOptions {
  blueprintId: string;
  version: string;
  doctrineReference: string;
  commanderSignoff: string;
  frameManifestJson?: string;
  applicationSpec?: Record<string, unknown>;
  buildManifest?: BuildManifest;
  logicManifestSpec?: LogicManifestSpec;
}

export interface EnhancedBlueprintPackagerResult {
  success: boolean;
  orchestratedBlueprint?: OrchestratedBlueprintOutput;
  error?: string;
  metadata: {
    totalModules: number;
    totalSubagents: number;
    estimatedCompletionTime: number;
    generatedAt: string;
  };
}

/**
 * Enhanced blueprint packager that supports subagent orchestration
 */
export function createEnhancedBlueprint(
  options: EnhancedBlueprintPackagerOptions
): EnhancedBlueprintPackagerResult {
  try {
    // Parse Frame manifest if provided
    let frameManifest: FrameManifest | null = null;
    if (options.frameManifestJson) {
      frameManifest = parseFrameManifest(options.frameManifestJson);
    } else {
      // Create default Frame manifest
      frameManifest = createDefaultFrameManifest(options);
    }

    // Decompose application design into modules
    const applicationSpec = options.applicationSpec || {};
    const modules = decomposeApplicationDesign(frameManifest, applicationSpec);

    // Generate or use provided build manifest
    const buildManifest = options.buildManifest || generateDefaultBuildManifest(options);

    // Validate build manifest
    const buildValidation = validateBuildManifest(buildManifest);
    if (!buildValidation.valid) {
      return {
        success: false,
        error: `Build manifest validation failed: ${buildValidation.errors.join(', ')}`,
        metadata: {
          totalModules: modules.length,
          totalSubagents: 0,
          estimatedCompletionTime: 0,
          generatedAt: new Date().toISOString()
        }
      };
    }

    // Generate or use provided logic manifest spec
    const logicManifestSpec = options.logicManifestSpec || generateDefaultLogicManifestSpec();

    // Create orchestrated blueprint output
    const orchestratedBlueprint = createOrchestratedBlueprintOutput(
      options.blueprintId,
      options.version,
      options.doctrineReference,
      options.commanderSignoff,
      modules,
      buildManifest,
      logicManifestSpec,
      frameManifest
    );

    // Calculate metadata
    const totalSubagents = modules.reduce((total, module) => total + module.subagent_tasks.length, 0);
    const estimatedCompletionTime = modules.reduce((total, module) => {
      return total + module.subagent_tasks.reduce((moduleTotal, task) => moduleTotal + task.estimated_duration, 0);
    }, 0);

    return {
      success: true,
      orchestratedBlueprint,
      metadata: {
        totalModules: modules.length,
        totalSubagents,
        estimatedCompletionTime,
        generatedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        totalModules: 0,
        totalSubagents: 0,
        estimatedCompletionTime: 0,
        generatedAt: new Date().toISOString()
      }
    };
  }
}

/**
 * Create default Frame manifest when none is provided
 */
function createDefaultFrameManifest(options: EnhancedBlueprintPackagerOptions): FrameManifest {
  return {
    version: '1.0.0',
    build_agent: 'Enhanced Blueprint Packager',
    doctrine_reference: options.doctrineReference,
    generated_at: new Date().toISOString(),
    module_definitions: [],
    subagent_assignments: {},
    routing_config: {
      primary_route: {
        monte_major: 'Monte_Major_Agent',
        tim_sandbox: 'Tim_Sandbox_Agent',
        validator_major: 'Validator_Major_Agent',
        description: 'Standard SHQ routing path'
      },
      fallback_routes: [],
      routing_rules: [],
      monitoring_points: [],
      failure_handling: {
        retry_policy: {
          max_retries: 3,
          backoff_strategy: 'exponential',
          retry_delay: 5,
          max_delay: 60
        },
        circuit_breaker: {
          enabled: true,
          failure_threshold: 5,
          recovery_timeout: 300,
          half_open_state: true
        },
        fallback_actions: []
      }
    },
    merge_config: {
      integration_order: [],
      validation_steps: [],
      audit_steps: [],
      rollback_strategy: {
        enabled: true,
        rollback_points: [],
        automatic_rollback: false,
        manual_approval_required: true
      },
      success_criteria: []
    },
    compliance: {
      shq_required: true,
      audit_required: true,
      validation_required: true,
      security_required: true
    }
  };
}

/**
 * Generate default build manifest
 */
function generateDefaultBuildManifest(options: EnhancedBlueprintPackagerOptions): BuildManifest {
  return {
    build_version: options.version,
    build_date: new Date().toISOString().split('T')[0],
    stack: {
      framework: 'Next.js 15.3.4',
      hosting: 'Vercel',
      persistence: 'File System'
    },
    modules: {},
    external_dependencies: ['react', 'typescript', 'tailwindcss'],
    doctrine_reference: options.doctrineReference,
    design_notes: 'Enhanced Blueprint with Subagent Orchestration',
    build_agent: 'Enhanced Blueprint Packager'
  };
}

/**
 * Generate default logic manifest specification
 */
function generateDefaultLogicManifestSpec(): LogicManifestSpec {
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
        generation: ['user_id', 'blueprint_id', 'generation_time', 'manifest_version'],
        access: ['user_id', 'manifest_id', 'access_time', 'operation']
      },
      retention_policies: {
        generation_audits: '7 years',
        access_audits: '3 years',
        system_audits: '1 year'
      }
    },
    build_agent: 'Enhanced Blueprint Packager',
    manifest_version: '1.0.0'
  };
}

/**
 * Validate orchestrated blueprint output
 */
export function validateOrchestratedBlueprint(
  blueprint: OrchestratedBlueprintOutput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate required fields
  if (!blueprint.blueprint_id) {
    errors.push('Missing blueprint_id');
  }
  if (!blueprint.version) {
    errors.push('Missing version');
  }
  if (!blueprint.doctrine_reference) {
    errors.push('Missing doctrine_reference');
  }
  if (!blueprint.commander_signoff) {
    errors.push('Missing commander_signoff');
  }

  // Validate modules
  if (!blueprint.modules || blueprint.modules.length === 0) {
    errors.push('No modules defined');
  } else {
    blueprint.modules.forEach((module, index) => {
      if (!module.id) {
        errors.push(`Module ${index}: Missing id`);
      }
      if (!module.name) {
        errors.push(`Module ${index}: Missing name`);
      }
      if (!module.subagent_tasks || module.subagent_tasks.length === 0) {
        errors.push(`Module ${index}: No subagent tasks defined`);
      }
    });
  }

  // Validate merge plan
  if (!blueprint.merge_plan) {
    errors.push('Missing merge_plan');
  } else {
    if (!blueprint.merge_plan.integration_order || blueprint.merge_plan.integration_order.length === 0) {
      errors.push('Merge plan: No integration steps defined');
    }
  }

  // Validate routing plan
  if (!blueprint.routing_plan) {
    errors.push('Missing routing_plan');
  } else {
    if (!blueprint.routing_plan.primary_route) {
      errors.push('Routing plan: Missing primary_route');
    }
  }

  // Validate build manifest
  if (!blueprint.build_manifest) {
    errors.push('Missing build_manifest');
  } else {
    const buildValidation = validateBuildManifest(blueprint.build_manifest);
    if (!buildValidation.valid) {
      errors.push(`Build manifest validation failed: ${buildValidation.errors.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Export orchestrated blueprint to JSON
 */
export function exportOrchestratedBlueprint(
  blueprint: OrchestratedBlueprintOutput,
  format: 'json' | 'yaml' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(blueprint, null, 2);
  } else {
    // For YAML, we would need a YAML library
    // For now, return JSON as fallback
    return JSON.stringify(blueprint, null, 2);
  }
}

/**
 * Generate sample Frame manifest for testing
 */
export function generateSampleFrameManifest(): string {
  const sampleManifest: FrameManifest = {
    version: '1.0.0',
    build_agent: 'Sample Frame Generator',
    doctrine_reference: 'nuclear_doctrine_v1.2',
    generated_at: new Date().toISOString(),
    module_definitions: [
      {
        id: 'api_layer',
        name: 'API Layer',
        description: 'REST API endpoints and contracts',
        type: 'api_layer',
        subagent_tasks: [],
        dependencies: [],
        merge_strategy: {
          strategy_type: 'sequential',
          merge_order: [],
          conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
          validation_steps: []
        },
        validation_rules: [],
        output_format: 'json'
      },
      {
        id: 'data_models',
        name: 'Data Models',
        description: 'Database schemas and data models',
        type: 'data_models',
        subagent_tasks: [],
        dependencies: [],
        merge_strategy: {
          strategy_type: 'sequential',
          merge_order: [],
          conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
          validation_steps: []
        },
        validation_rules: [],
        output_format: 'sql'
      }
    ],
    subagent_assignments: {},
    routing_config: {
      primary_route: {
        monte_major: 'Monte_Major_Agent',
        tim_sandbox: 'Tim_Sandbox_Agent',
        validator_major: 'Validator_Major_Agent',
        description: 'Standard SHQ routing path'
      },
      fallback_routes: [],
      routing_rules: [],
      monitoring_points: [],
      failure_handling: {
        retry_policy: {
          max_retries: 3,
          backoff_strategy: 'exponential',
          retry_delay: 5,
          max_delay: 60
        },
        circuit_breaker: {
          enabled: true,
          failure_threshold: 5,
          recovery_timeout: 300,
          half_open_state: true
        },
        fallback_actions: []
      }
    },
    merge_config: {
      integration_order: [],
      validation_steps: [],
      audit_steps: [],
      rollback_strategy: {
        enabled: true,
        rollback_points: [],
        automatic_rollback: false,
        manual_approval_required: true
      },
      success_criteria: []
    },
    compliance: {
      shq_required: true,
      audit_required: true,
      validation_required: true,
      security_required: true
    }
  };

  return JSON.stringify(sampleManifest, null, 2);
} 