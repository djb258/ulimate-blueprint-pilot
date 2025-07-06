/**
 * Subagent Orchestration Types
 * 
 * This module defines the types and interfaces for modular subagent orchestration
 * as part of the Blueprint App's standard output.
 */

// Subagent Task Specification
export interface SubagentTask {
  id: string;
  name: string;
  description: string;
  agent_type: SubagentType;
  role: string;
  responsibilities: string[];
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  dependencies: string[]; // IDs of other subagent tasks
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_duration: number; // in minutes
  validation_rules: ValidationRule[];
  audit_requirements: AuditRequirement[];
  shq_compliance: SHQCompliance;
}

// Subagent Types based on Frame manifest definitions
export type SubagentType = 
  | 'api_layer_agent'
  | 'data_model_agent'
  | 'test_agent'
  | 'logging_agent'
  | 'sustainment_agent'
  | 'ui_agent'
  | 'cursor_template_agent'
  | 'security_agent'
  | 'integration_agent'
  | 'validation_agent'
  | 'custom_agent';

// Validation Rules for subagent outputs
export interface ValidationRule {
  field: string;
  rule_type: 'required' | 'format' | 'range' | 'custom';
  rule_value: string | number | boolean;
  error_message: string;
  severity: 'warning' | 'error' | 'critical';
}

// Audit Requirements for subagent tasks
export interface AuditRequirement {
  audit_type: 'input_validation' | 'output_validation' | 'process_audit' | 'security_audit';
  required_fields: string[];
  retention_period: string; // e.g., "7 years", "1 year"
  compliance_standard: string; // e.g., "SHQ", "Nuclear Doctrine"
}

// SHQ Compliance requirements
export interface SHQCompliance {
  sub_hive_routing: SubHiveRouting;
  memory_requirements: MemoryRequirement[];
  audit_trail: AuditTrail;
  validation_gates: ValidationGate[];
}

// Sub-hive routing configuration
export interface SubHiveRouting {
  primary_route: SubHiveRoute;
  fallback_route?: SubHiveRoute;
  routing_rules: RoutingRule[];
}

export interface SubHiveRoute {
  monte_major: string;
  tim_sandbox: string;
  validator_major: string;
  description: string;
}

export interface RoutingRule {
  condition: string;
  route: SubHiveRoute;
  priority: number;
}

// Memory requirements for subagents
export interface MemoryRequirement {
  type: 'short_term' | 'long_term' | 'persistent';
  capacity: string; // e.g., "1GB", "unlimited"
  retention_policy: string;
  access_pattern: 'read_only' | 'read_write' | 'append_only';
}

// Audit trail configuration
export interface AuditTrail {
  enabled: boolean;
  log_level: 'debug' | 'info' | 'warn' | 'error';
  required_fields: string[];
  storage_location: string;
  encryption_required: boolean;
}

// Validation gates for subagent outputs
export interface ValidationGate {
  gate_id: string;
  name: string;
  description: string;
  validation_rules: ValidationRule[];
  required_approval: boolean;
  approval_agent?: string;
  failure_action: 'retry' | 'escalate' | 'fail' | 'continue';
}

// Module Definition
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  type: ModuleType;
  subagent_tasks: SubagentTask[];
  dependencies: string[]; // Module IDs
  merge_strategy: MergeStrategy;
  validation_rules: ValidationRule[];
  output_format: 'json' | 'yaml' | 'typescript' | 'javascript' | 'python' | 'sql';
}

export type ModuleType = 
  | 'api_layer'
  | 'data_models'
  | 'tests'
  | 'logging'
  | 'sustainment_hooks'
  | 'ui'
  | 'cursor_templates'
  | 'security'
  | 'integration'
  | 'validation'
  | 'custom';

// Merge Strategy for combining subagent outputs
export interface MergeStrategy {
  strategy_type: 'sequential' | 'parallel' | 'hierarchical' | 'custom';
  merge_order: string[]; // Subagent task IDs in merge order
  conflict_resolution: ConflictResolution;
  validation_steps: ValidationStep[];
}

export interface ConflictResolution {
  method: 'last_wins' | 'first_wins' | 'manual' | 'consensus' | 'custom';
  resolution_rules: ResolutionRule[];
  escalation_path: string[];
}

export interface ResolutionRule {
  condition: string;
  action: string;
  priority: number;
}

export interface ValidationStep {
  step_id: string;
  name: string;
  validation_type: 'schema' | 'business_logic' | 'security' | 'performance';
  validation_rules: ValidationRule[];
  required: boolean;
}

// Merge Plan for orchestrating subagent outputs
export interface MergePlan {
  integration_order: IntegrationStep[];
  validation_steps: ValidationStep[];
  audit_steps: AuditStep[];
  rollback_strategy: RollbackStrategy;
  success_criteria: SuccessCriteria[];
}

export interface IntegrationStep {
  step_id: string;
  name: string;
  description: string;
  subagent_tasks: string[]; // Subagent task IDs
  order: number;
  dependencies: string[]; // Step IDs
  validation_required: boolean;
  approval_required: boolean;
}

export interface AuditStep {
  step_id: string;
  name: string;
  audit_type: 'input' | 'process' | 'output' | 'security';
  required_fields: string[];
  audit_agent: string;
  retention_period: string;
}

export interface RollbackStrategy {
  enabled: boolean;
  rollback_points: RollbackPoint[];
  automatic_rollback: boolean;
  manual_approval_required: boolean;
}

export interface RollbackPoint {
  point_id: string;
  name: string;
  description: string;
  checkpoint_data: Record<string, unknown>;
  created_at: string;
}

export interface SuccessCriteria {
  criterion_id: string;
  name: string;
  description: string;
  measurement_type: 'boolean' | 'numeric' | 'string' | 'custom';
  expected_value: unknown;
  tolerance?: number;
  required: boolean;
}

// Routing Plan for subagent results
export interface RoutingPlan {
  primary_route: SubHiveRoute;
  fallback_routes: SubHiveRoute[];
  routing_rules: RoutingRule[];
  monitoring_points: MonitoringPoint[];
  failure_handling: FailureHandling;
}

export interface MonitoringPoint {
  point_id: string;
  name: string;
  location: string; // Subagent or route location
  metrics: Metric[];
  alert_thresholds: AlertThreshold[];
}

export interface Metric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  unit: string;
  description: string;
}

export interface AlertThreshold {
  metric_name: string;
  threshold_value: number;
  comparison: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
}

export interface FailureHandling {
  retry_policy: RetryPolicy;
  circuit_breaker: CircuitBreaker;
  fallback_actions: FallbackAction[];
}

export interface RetryPolicy {
  max_retries: number;
  backoff_strategy: 'linear' | 'exponential' | 'custom';
  retry_delay: number; // in seconds
  max_delay: number; // in seconds
}

export interface CircuitBreaker {
  enabled: boolean;
  failure_threshold: number;
  recovery_timeout: number; // in seconds
  half_open_state: boolean;
}

export interface FallbackAction {
  action_id: string;
  name: string;
  description: string;
  trigger_condition: string;
  action_type: 'retry' | 'escalate' | 'manual_intervention' | 'continue';
  escalation_path: string[];
}

// Enhanced Blueprint Output with Subagent Orchestration
export interface OrchestratedBlueprintOutput {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  commander_signoff: string;
  
  // Subagent Orchestration
  modules: ModuleDefinition[];
  merge_plan: MergePlan;
  routing_plan: RoutingPlan;
  
  // Standard Blueprint fields
  build_manifest: BuildManifest;
  logic_manifest_required: boolean;
  logic_manifest_spec: LogicManifestSpec;
  
  // Metadata
  metadata: {
    assembledAt: string;
    assembledBy: string;
    orchestration_version: string;
    total_subagents: number;
    estimated_completion_time: number; // in minutes
  };
}

// Frame JSON Manifest Interface
export interface FrameManifest {
  version: string;
  build_agent: string;
  doctrine_reference: string;
  generated_at: string;
  
  // Module definitions from Frame
  module_definitions: ModuleDefinition[];
  
  // Subagent assignments
  subagent_assignments: Record<string, SubagentTask>;
  
  // Routing configuration
  routing_config: RoutingPlan;
  
  // Merge configuration
  merge_config: MergePlan;
  
  // Compliance requirements
  compliance: {
    shq_required: boolean;
    audit_required: boolean;
    validation_required: boolean;
    security_required: boolean;
  };
}

// Import existing types
export interface BuildManifest {
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

export interface LogicManifestSpec {
  required_fields: string[];
  master_file_strategy: Record<string, unknown>;
  table_merge_plan: Record<string, unknown>;
  constants_variables_map: Record<string, unknown>;
  agent_interaction: Record<string, unknown>;
  cursor_scope: Record<string, unknown>;
  sustainment_plan: Record<string, unknown>;
  audit_map: Record<string, unknown>;
  build_agent: string;
  manifest_version: string;
} 