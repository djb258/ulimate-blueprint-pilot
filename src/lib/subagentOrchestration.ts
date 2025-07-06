/**
 * Subagent Orchestration Utilities
 * 
 * This module provides utilities for parsing Frame JSON manifests and
 * automatically decomposing application designs into logical modules
 * with subagent task specifications.
 */

import {
  FrameManifest,
  ModuleDefinition,
  SubagentTask,
  SubagentType,
  OrchestratedBlueprintOutput,
  MergePlan,
  RoutingPlan,
  BuildManifest,
  LogicManifestSpec,
  ValidationRule,
  SHQCompliance,
  MergeStrategy,
  ValidationStep,
  IntegrationStep,
  AuditStep
} from '../types/subagentOrchestration';

/**
 * Parse Frame JSON manifest and extract module definitions
 */
export function parseFrameManifest(frameJson: string): FrameManifest {
  try {
    const manifest = JSON.parse(frameJson) as FrameManifest;
    
    // Validate required fields
    const requiredFields = ['version', 'build_agent', 'doctrine_reference', 'generated_at'];
    for (const field of requiredFields) {
      if (!manifest[field as keyof FrameManifest]) {
        throw new Error(`Missing required field in Frame manifest: ${field}`);
      }
    }
    
    return manifest;
  } catch (error) {
    throw new Error(`Failed to parse Frame manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Automatically decompose application design into logical modules
 */
export function decomposeApplicationDesign(
  frameManifest: FrameManifest,
  applicationSpec: Record<string, unknown>
): ModuleDefinition[] {
  const modules: ModuleDefinition[] = [];
  
  // Extract module definitions from Frame manifest
  if (frameManifest.module_definitions && frameManifest.module_definitions.length > 0) {
    modules.push(...frameManifest.module_definitions);
  } else {
    // Auto-generate modules based on application specification
    modules.push(...generateDefaultModules(applicationSpec));
  }
  
  // Validate and enhance modules with subagent tasks
  return modules.map(moduleDef => enhanceModuleWithSubagents(moduleDef, frameManifest));
}

/**
 * Generate default modules based on application specification
 */
function generateDefaultModules(applicationSpec: Record<string, unknown>): ModuleDefinition[] {
  const modules: ModuleDefinition[] = [];
  
  // API Layer Module
  if (hasApiRequirements(applicationSpec)) {
    modules.push(createApiLayerModule());
  }
  
  // Data Models Module
  if (hasDataRequirements(applicationSpec)) {
    modules.push(createDataModelsModule());
  }
  
  // Tests Module
  modules.push(createTestsModule());
  
  // Logging Module
  modules.push(createLoggingModule());
  
  // Sustainment Hooks Module
  modules.push(createSustainmentHooksModule());
  
  // UI Module
  if (hasUIRequirements(applicationSpec)) {
    modules.push(createUIModule());
  }
  
  // Cursor Templates Module
  modules.push(createCursorTemplatesModule());
  
  // Security Module
  modules.push(createSecurityModule());
  
  // Integration Module
  if (hasIntegrationRequirements(applicationSpec)) {
    modules.push(createIntegrationModule());
  }
  
  // Validation Module
  modules.push(createValidationModule());
  
  return modules;
}

/**
 * Enhance module with subagent task specifications
 */
function enhanceModuleWithSubagents(
  module: ModuleDefinition,
  frameManifest: FrameManifest
): ModuleDefinition {
  const subagentTasks = generateSubagentTasksForModule(module, frameManifest);
  
  return {
    ...module,
    subagent_tasks: subagentTasks,
    merge_strategy: generateMergeStrategy(module, subagentTasks),
    validation_rules: generateValidationRules(module),
  };
}

/**
 * Generate subagent tasks for a module
 */
function generateSubagentTasksForModule(
  module: ModuleDefinition,
  frameManifest: FrameManifest
): SubagentTask[] {
  const tasks: SubagentTask[] = [];
  
  // Check if Frame manifest has specific subagent assignments
  if (frameManifest.subagent_assignments) {
    const moduleSubagents = Object.values(frameManifest.subagent_assignments)
      .filter(task => task.name.toLowerCase().includes(module.type.toLowerCase()));
    tasks.push(...moduleSubagents);
  }
  
  // Generate default subagent tasks based on module type
  const defaultTasks = generateDefaultSubagentTasks(module);
  tasks.push(...defaultTasks);
  
  return tasks;
}

/**
 * Generate default subagent tasks based on module type
 */
function generateDefaultSubagentTasks(module: ModuleDefinition): SubagentTask[] {
  const tasks: SubagentTask[] = [];
  
  switch (module.type) {
    case 'api_layer':
      tasks.push(createSubagentTask('api_design_agent', 'API Design Agent', 'Design API endpoints and contracts'));
      tasks.push(createSubagentTask('api_implementation_agent', 'API Implementation Agent', 'Implement API endpoints'));
      tasks.push(createSubagentTask('api_testing_agent', 'API Testing Agent', 'Create API tests'));
      break;
      
    case 'data_models':
      tasks.push(createSubagentTask('data_modeling_agent', 'Data Modeling Agent', 'Design data models and schemas'));
      tasks.push(createSubagentTask('database_agent', 'Database Agent', 'Set up database and migrations'));
      break;
      
    case 'tests':
      tasks.push(createSubagentTask('unit_test_agent', 'Unit Test Agent', 'Create unit tests'));
      tasks.push(createSubagentTask('integration_test_agent', 'Integration Test Agent', 'Create integration tests'));
      tasks.push(createSubagentTask('e2e_test_agent', 'E2E Test Agent', 'Create end-to-end tests'));
      break;
      
    case 'logging':
      tasks.push(createSubagentTask('logging_setup_agent', 'Logging Setup Agent', 'Configure logging infrastructure'));
      tasks.push(createSubagentTask('log_analysis_agent', 'Log Analysis Agent', 'Set up log analysis tools'));
      break;
      
    case 'sustainment_hooks':
      tasks.push(createSubagentTask('health_check_agent', 'Health Check Agent', 'Implement health checks'));
      tasks.push(createSubagentTask('monitoring_agent', 'Monitoring Agent', 'Set up monitoring and alerting'));
      break;
      
    case 'ui':
      tasks.push(createSubagentTask('ui_design_agent', 'UI Design Agent', 'Design user interface components'));
      tasks.push(createSubagentTask('ui_implementation_agent', 'UI Implementation Agent', 'Implement UI components'));
      break;
      
    case 'cursor_templates':
      tasks.push(createSubagentTask('template_generation_agent', 'Template Generation Agent', 'Generate Cursor templates'));
      tasks.push(createSubagentTask('template_validation_agent', 'Template Validation Agent', 'Validate generated templates'));
      break;
      
    case 'security':
      tasks.push(createSubagentTask('security_audit_agent', 'Security Audit Agent', 'Perform security audits'));
      tasks.push(createSubagentTask('security_implementation_agent', 'Security Implementation Agent', 'Implement security measures'));
      break;
      
    case 'integration':
      tasks.push(createSubagentTask('integration_design_agent', 'Integration Design Agent', 'Design integration patterns'));
      tasks.push(createSubagentTask('integration_implementation_agent', 'Integration Implementation Agent', 'Implement integrations'));
      break;
      
    case 'validation':
      tasks.push(createSubagentTask('validation_agent', 'Validation Agent', 'Perform comprehensive validation'));
      break;
      
    default:
      tasks.push(createSubagentTask('custom_agent', 'Custom Agent', 'Handle custom module requirements'));
  }
  
  return tasks;
}

/**
 * Create a subagent task with default configuration
 */
function createSubagentTask(
  id: string,
  name: string,
  description: string,
  agentType: SubagentType = 'custom_agent'
): SubagentTask {
  return {
    id,
    name,
    description,
    agent_type: agentType,
    role: `Primary agent for ${name.toLowerCase()}`,
    responsibilities: [
      `Execute ${name.toLowerCase()} tasks`,
      'Follow SHQ compliance requirements',
      'Generate audit trails',
      'Validate outputs'
    ],
    input_schema: {
      module_id: 'string',
      requirements: 'object',
      constraints: 'array'
    },
    output_schema: {
      result: 'object',
      validation_errors: 'array',
      audit_trail: 'object'
    },
    dependencies: [],
    priority: 'medium',
    estimated_duration: 30, // 30 minutes default
    validation_rules: [
      {
        field: 'result',
        rule_type: 'required',
        rule_value: true,
        error_message: 'Subagent must produce a result',
        severity: 'error'
      }
    ],
    audit_requirements: [
      {
        audit_type: 'output_validation',
        required_fields: ['result', 'timestamp', 'agent_id'],
        retention_period: '7 years',
        compliance_standard: 'SHQ'
      }
    ],
    shq_compliance: createDefaultSHQCompliance()
  };
}

/**
 * Create default SHQ compliance configuration
 */
function createDefaultSHQCompliance(): SHQCompliance {
  return {
    sub_hive_routing: {
      primary_route: {
        monte_major: 'Monte_Major_Agent',
        tim_sandbox: 'Tim_Sandbox_Agent',
        validator_major: 'Validator_Major_Agent',
        description: 'Standard SHQ routing path'
      },
      routing_rules: []
    },
    memory_requirements: [
      {
        type: 'short_term',
        capacity: '1GB',
        retention_policy: '24 hours',
        access_pattern: 'read_write'
      }
    ],
    audit_trail: {
      enabled: true,
      log_level: 'info',
      required_fields: ['timestamp', 'agent_id', 'action', 'result'],
      storage_location: 'audit_logs',
      encryption_required: true
    },
    validation_gates: [
      {
        gate_id: 'output_validation',
        name: 'Output Validation Gate',
        description: 'Validate subagent output before proceeding',
        validation_rules: [],
        required_approval: false,
        failure_action: 'fail'
      }
    ]
  };
}

/**
 * Generate merge strategy for a module
 */
function generateMergeStrategy(module: ModuleDefinition, subagentTasks: SubagentTask[]): MergeStrategy {
  return {
    strategy_type: 'sequential',
    merge_order: subagentTasks.map(task => task.id),
    conflict_resolution: {
      method: 'last_wins',
      resolution_rules: [],
      escalation_path: ['commander_approval']
    },
    validation_steps: [
      {
        step_id: 'module_validation',
        name: 'Module Output Validation',
        validation_type: 'schema',
        validation_rules: module.validation_rules,
        required: true
      }
    ]
  };
}

/**
 * Generate validation rules for a module
 */
function generateValidationRules(module: ModuleDefinition): ValidationRule[] {
  return [
    {
      field: 'output',
      rule_type: 'required',
      rule_value: true,
      error_message: `Module ${module.name} must produce output`,
      severity: 'error'
    },
    {
      field: 'format',
      rule_type: 'format',
      rule_value: module.output_format,
      error_message: `Module ${module.name} output must be in ${module.output_format} format`,
      severity: 'error'
    }
  ];
}

/**
 * Generate merge plan for orchestrating subagent outputs
 */
export function generateMergePlan(modules: ModuleDefinition[]): MergePlan {
  const integrationSteps: IntegrationStep[] = [];
  const validationSteps: ValidationStep[] = [];
  const auditSteps: AuditStep[] = [];
  
  let stepOrder = 1;
  
  // Create integration steps for each module
  for (const moduleDef of modules) {
    integrationSteps.push({
      step_id: `step_${stepOrder}`,
      name: `Integrate ${moduleDef.name}`,
      description: `Integrate outputs from ${moduleDef.name} module`,
      subagent_tasks: moduleDef.subagent_tasks.map((task) => task.id),
      order: stepOrder,
      dependencies: [],
      validation_required: true,
      approval_required: false
    });
    
    // Add validation step
    validationSteps.push({
      step_id: `validation_${stepOrder}`,
      name: `Validate ${moduleDef.name}`,
      validation_type: 'schema',
      validation_rules: moduleDef.validation_rules,
      required: true
    });
    
    // Add audit step
    auditSteps.push({
      step_id: `audit_${stepOrder}`,
      name: `Audit ${moduleDef.name}`,
      audit_type: 'output',
      required_fields: ['timestamp', 'module_id', 'output'],
      audit_agent: 'Audit_Agent',
      retention_period: '7 years'
    });
    
    stepOrder++;
  }
  
  return {
    integration_order: integrationSteps,
    validation_steps: validationSteps,
    audit_steps: auditSteps,
    rollback_strategy: {
      enabled: true,
      rollback_points: [],
      automatic_rollback: false,
      manual_approval_required: true
    },
    success_criteria: [
      {
        criterion_id: 'all_modules_integrated',
        name: 'All Modules Integrated',
        description: 'All modules must be successfully integrated',
        measurement_type: 'boolean',
        expected_value: true,
        required: true
      },
      {
        criterion_id: 'validation_passed',
        name: 'Validation Passed',
        description: 'All validation steps must pass',
        measurement_type: 'boolean',
        expected_value: true,
        required: true
      }
    ]
  };
}

/**
 * Generate routing plan for subagent results
 */
export function generateRoutingPlan(frameManifest: FrameManifest): RoutingPlan {
  // Use routing config from Frame manifest if available
  if (frameManifest.routing_config) {
    return frameManifest.routing_config;
  }
  
  // Generate default routing plan
  return {
    primary_route: {
      monte_major: 'Monte_Major_Agent',
      tim_sandbox: 'Tim_Sandbox_Agent',
      validator_major: 'Validator_Major_Agent',
      description: 'Standard SHQ routing path'
    },
    fallback_routes: [
      {
        monte_major: 'Monte_Major_Backup',
        tim_sandbox: 'Tim_Sandbox_Backup',
        validator_major: 'Validator_Major_Backup',
        description: 'Backup routing path'
      }
    ],
    routing_rules: [
      {
        condition: 'primary_route_failed',
        route: {
          monte_major: 'Monte_Major_Backup',
          tim_sandbox: 'Tim_Sandbox_Backup',
          validator_major: 'Validator_Major_Backup',
          description: 'Fallback routing on primary failure'
        },
        priority: 1
      }
    ],
    monitoring_points: [
      {
        point_id: 'monte_major_monitor',
        name: 'Monte Major Monitor',
        location: 'Monte_Major_Agent',
        metrics: [
          {
            name: 'processing_time',
            type: 'histogram',
            unit: 'seconds',
            description: 'Time taken to process requests'
          }
        ],
        alert_thresholds: [
          {
            metric_name: 'processing_time',
            threshold_value: 30,
            comparison: 'gt',
            severity: 'high',
            action: 'escalate_to_commander'
          }
        ]
      }
    ],
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
      fallback_actions: [
        {
          action_id: 'manual_intervention',
          name: 'Manual Intervention',
          description: 'Require manual intervention on repeated failures',
          trigger_condition: 'max_retries_exceeded',
          action_type: 'manual_intervention',
          escalation_path: ['commander_approval']
        }
      ]
    }
  };
}

/**
 * Create orchestrated blueprint output
 */
export function createOrchestratedBlueprintOutput(
  blueprintId: string,
  version: string,
  doctrineReference: string,
  commanderSignoff: string,
  modules: ModuleDefinition[],
  buildManifest: BuildManifest,
  logicManifestSpec: LogicManifestSpec,
  frameManifest: FrameManifest
): OrchestratedBlueprintOutput {
  const mergePlan = generateMergePlan(modules);
  const routingPlan = generateRoutingPlan(frameManifest);
  
  const totalSubagents = modules.reduce((total, module) => total + module.subagent_tasks.length, 0);
  const estimatedCompletionTime = modules.reduce((total, module) => {
    return total + module.subagent_tasks.reduce((moduleTotal, task) => moduleTotal + task.estimated_duration, 0);
  }, 0);
  
  return {
    blueprint_id: blueprintId,
    version,
    doctrine_reference: doctrineReference,
    commander_signoff: commanderSignoff,
    modules,
    merge_plan: mergePlan,
    routing_plan: routingPlan,
    build_manifest: buildManifest,
    logic_manifest_required: true,
    logic_manifest_spec: logicManifestSpec,
    metadata: {
      assembledAt: new Date().toISOString(),
      assembledBy: 'subagent_orchestration_system',
      orchestration_version: '1.0.0',
      total_subagents: totalSubagents,
      estimated_completion_time: estimatedCompletionTime
    }
  };
}

// Helper functions for module detection
function hasApiRequirements(spec: Record<string, unknown>): boolean {
  return spec.hasOwnProperty('api_endpoints') || 
         spec.hasOwnProperty('rest_api') || 
         spec.hasOwnProperty('graphql');
}

function hasDataRequirements(spec: Record<string, unknown>): boolean {
  return spec.hasOwnProperty('database') || 
         spec.hasOwnProperty('data_models') || 
         spec.hasOwnProperty('entities');
}

function hasUIRequirements(spec: Record<string, unknown>): boolean {
  return spec.hasOwnProperty('frontend') || 
         spec.hasOwnProperty('ui_components') || 
         spec.hasOwnProperty('user_interface');
}

function hasIntegrationRequirements(spec: Record<string, unknown>): boolean {
  return spec.hasOwnProperty('integrations') || 
         spec.hasOwnProperty('external_apis') || 
         spec.hasOwnProperty('third_party_services');
}

// Module creation functions
function createApiLayerModule(): ModuleDefinition {
  return {
    id: 'api_layer',
    name: 'API Layer',
    description: 'API endpoints and contracts',
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
  };
}

function createDataModelsModule(): ModuleDefinition {
  return {
    id: 'data_models',
    name: 'Data Models',
    description: 'Data models and database schemas',
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
  };
}

function createTestsModule(): ModuleDefinition {
  return {
    id: 'tests',
    name: 'Tests',
    description: 'Test suites and validation',
    type: 'tests',
    subagent_tasks: [],
    dependencies: [],
    merge_strategy: {
      strategy_type: 'parallel',
      merge_order: [],
      conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
      validation_steps: []
    },
    validation_rules: [],
    output_format: 'typescript'
  };
}

function createLoggingModule(): ModuleDefinition {
  return {
    id: 'logging',
    name: 'Logging',
    description: 'Logging infrastructure and analysis',
    type: 'logging',
    subagent_tasks: [],
    dependencies: [],
    merge_strategy: {
      strategy_type: 'sequential',
      merge_order: [],
      conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
      validation_steps: []
    },
    validation_rules: [],
    output_format: 'yaml'
  };
}

function createSustainmentHooksModule(): ModuleDefinition {
  return {
    id: 'sustainment_hooks',
    name: 'Sustainment Hooks',
    description: 'Health checks and monitoring',
    type: 'sustainment_hooks',
    subagent_tasks: [],
    dependencies: [],
    merge_strategy: {
      strategy_type: 'sequential',
      merge_order: [],
      conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
      validation_steps: []
    },
    validation_rules: [],
    output_format: 'yaml'
  };
}

function createUIModule(): ModuleDefinition {
  return {
    id: 'ui',
    name: 'User Interface',
    description: 'UI components and user experience',
    type: 'ui',
    subagent_tasks: [],
    dependencies: [],
    merge_strategy: {
      strategy_type: 'parallel',
      merge_order: [],
      conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
      validation_steps: []
    },
    validation_rules: [],
    output_format: 'typescript'
  };
}

function createCursorTemplatesModule(): ModuleDefinition {
  return {
    id: 'cursor_templates',
    name: 'Cursor Templates',
    description: 'Cursor IDE templates and configurations',
    type: 'cursor_templates',
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
  };
}

function createSecurityModule(): ModuleDefinition {
  return {
    id: 'security',
    name: 'Security',
    description: 'Security measures and compliance',
    type: 'security',
    subagent_tasks: [],
    dependencies: [],
    merge_strategy: {
      strategy_type: 'sequential',
      merge_order: [],
      conflict_resolution: { method: 'last_wins', resolution_rules: [], escalation_path: [] },
      validation_steps: []
    },
    validation_rules: [],
    output_format: 'yaml'
  };
}

function createIntegrationModule(): ModuleDefinition {
  return {
    id: 'integration',
    name: 'Integration',
    description: 'External integrations and APIs',
    type: 'integration',
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
  };
}

function createValidationModule(): ModuleDefinition {
  return {
    id: 'validation',
    name: 'Validation',
    description: 'Comprehensive validation and testing',
    type: 'validation',
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
  };
} 