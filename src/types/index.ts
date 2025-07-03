// Core application types following Barton Doctrine principles

export interface Phase {
  id: string;
  name: string;
  description: string;
  status: PhaseStatus;
  order: number;
  requirements: string[];
  deliverables: string[];
  estimatedDuration: number; // in minutes
  dependencies: string[]; // phase IDs that must be completed first
  completedAt?: Date;
  startedAt?: Date;
}

export type PhaseStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  createdAt: Date;
  updatedAt: Date;
  status: BlueprintStatus;
  metadata: BlueprintMetadata;
}

export type BlueprintStatus = 'draft' | 'in_progress' | 'review' | 'approved' | 'archived';

export interface BlueprintMetadata {
  author: string;
  version: string;
  tags: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTotalTime: number; // in minutes
  targetTechnologies: string[];
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  author: string;
}

export type PromptCategory = 
  | 'planning' 
  | 'scaffolding' 
  | 'architecture' 
  | 'testing' 
  | 'security' 
  | 'deployment' 
  | 'documentation'
  | 'general';

export interface ReengineeringProject {
  id: string;
  name: string;
  repositoryUrl: string;
  analysisStatus: AnalysisStatus;
  gapReport?: GapReport;
  createdAt: Date;
  updatedAt: Date;
  metadata: ReengineeringMetadata;
}

export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

export interface GapReport {
  id: string;
  projectId: string;
  summary: string;
  criticalIssues: Issue[];
  recommendations: Recommendation[];
  generatedAt: Date;
  score: number; // 0-100
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: IssueCategory;
  location?: string;
  suggestedFix?: string;
}

export type IssueCategory = 
  | 'security' 
  | 'performance' 
  | 'architecture' 
  | 'code_quality' 
  | 'documentation' 
  | 'testing' 
  | 'deployment';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  implementation: string;
}

export interface ReengineeringMetadata {
  repositorySize: number;
  languageBreakdown: Record<string, number>;
  lastCommitDate: Date;
  contributors: string[];
  stars: number;
  forks: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CreateBlueprintForm {
  name: string;
  description: string;
  complexity: BlueprintMetadata['complexity'];
  targetTechnologies: string[];
}

export interface CreatePromptForm {
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
}

export interface ReengineeringForm {
  repositoryUrl: string;
  name: string;
}

// UI State types
export interface AppState {
  currentBlueprint?: Blueprint;
  currentPhase?: Phase;
  isLoading: boolean;
  error?: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// Constants
export const PHASE_NAMES = [
  'PLAN',
  'SCAFFOLD', 
  'FILE STRUCTURE',
  'TEST PLAN',
  'SECURITY PLAN',
  'PHASE GATES / PROMOTION RULES',
  'FINALIZE BLUEPRINT'
] as const;

export const PHASE_DESCRIPTIONS = {
  PLAN: 'Define project scope, requirements, and high-level architecture',
  SCAFFOLD: 'Set up project structure and initial configuration',
  'FILE STRUCTURE': 'Organize codebase with proper directory structure',
  'TEST PLAN': 'Define testing strategy and coverage requirements',
  'SECURITY PLAN': 'Implement security measures and best practices',
  'PHASE GATES / PROMOTION RULES': 'Establish deployment and promotion criteria',
  'FINALIZE BLUEPRINT': 'Complete documentation and final review'
} as const;

// PLAN Phase Payload Structure
export interface PlanPhasePayload {
  plan_phase_id: string;
  plan_phase_duration: number; // in seconds
  objective: {
    data_domain: string;
    target_output: string;
  };
  constraints: {
    input_format: string;
    output_target: string;
  };
  assumptions: {
    items: string[];
    reviewed: boolean;
    confirmed: boolean;
    revisions?: string[];
  };
  input_references: Array<{
    type: 'spec' | 'repo' | 'compliance_doc' | 'other';
    label: string;
    url?: string;
    stub?: boolean;
  }>;
  validation_criteria: Array<{
    description: string;
    test: string;
    measurable: boolean;
  }>;
  inference_flags: Array<{
    field: string;
    inferred: boolean;
    confirmation_required: boolean;
    note?: string;
  }>;
  promotion_conditions: {
    all_fields_populated: boolean;
    exception_logged?: {
      reason: string;
      mitigation_plan: string;
    };
    owner_signoff: boolean;
    ui_output_binding_match: boolean;
    promote_to_phase2: boolean;
  };
  audit_log: PlanPhaseAuditLog[];
}

export interface PlanPhaseAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

// Equation Module Types
export type ApprovedTool = 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Abacus' 
  | 'APIFY' 
  | 'Make.com' 
  | 'Mindpal' 
  | 'Deerflow' 
  | 'Firebase' 
  | 'Neon' 
  | 'Render'
  | 'external_approval_required';

export interface EquationComponent {
  id: string;
  name: string;
  tool: ApprovedTool;
  notes: string;
  externalToolProposal?: string; // Only used when tool is 'external_approval_required'
}

export interface EquationPayload {
  blueprint_id: string;
  equation: {
    target: string;
    components: EquationComponent[];
  };
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
  };
  validation: {
    all_components_have_tools: boolean;
    external_tools_require_approval: boolean;
    target_defined: boolean;
    ready_for_save: boolean;
  };
  audit_log: EquationAuditLog[];
}

export interface EquationAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  component_id?: string;
}

// Constants + Variables Module Types
export type VariableType = 'string' | 'number' | 'boolean' | 'array';

export interface ConstantDeclaration {
  id: string;
  name: string;
  value: string | number | boolean | string[];
  notes: string;
  category?: string;
}

export interface VariableDeclaration {
  id: string;
  name: string;
  type: VariableType;
  required: boolean;
  default: string | number | boolean | string[] | null;
  notes: string;
  category?: string;
}

export interface ConstantsVariablesPayload {
  blueprint_id: string;
  constants: ConstantDeclaration[];
  variables: VariableDeclaration[];
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
  };
  validation: {
    all_constants_have_values: boolean;
    all_variables_have_types: boolean;
    required_variables_defined: boolean;
    ready_for_save: boolean;
  };
  audit_log: ConstantsVariablesAuditLog[];
}

export interface ConstantsVariablesAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  item_id?: string;
  item_type?: 'constant' | 'variable';
}

// Data Source Mapping Module Types
export type DataSourceType = 
  | 'API' 
  | 'FTP' 
  | 'Neon DB' 
  | 'Firebase' 
  | 'BigQuery' 
  | 'Commander runtime input'
  | 'File system'
  | 'Environment variable'
  | 'Configuration file'
  | 'External service';

export type DoctrineAcronym = 
  | 'STAMPED' 
  | 'SPVPET' 
  | 'STACKED' 
  | 'N/A';

export type ValidationMethod = 
  | 'type check' 
  | 'range check' 
  | 'schema validation' 
  | 'format validation' 
  | 'custom validation'
  | 'none';

export type FailoverRule = 
  | 'default value' 
  | 'alternate source' 
  | 'error out' 
  | 'retry with backoff' 
  | 'prompt user for input again'
  | 'skip operation';

export interface DataSourceMapping {
  id: string;
  constant_or_variable_name: string;
  source_type: DataSourceType;
  source_id: string;
  acronym: DoctrineAcronym;
  validation: string;
  failover: string;
  commander_notes: string;
  audit_tag: string;
  // Database-specific fields (for writeable destinations)
  table?: string;
  schema?: string;
  credentials?: string;
  requires_commander_approval?: boolean;
  nuclear_doctrine_compliant?: boolean;
}

export interface DataSourceMappingPayload {
  blueprint_id: string;
  data_sources: DataSourceMapping[];
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
  };
  validation: {
    all_mappings_have_sources: boolean;
    database_mappings_compliant: boolean;
    required_fields_populated: boolean;
    ready_for_save: boolean;
  };
  audit_log: DataSourceMappingAuditLog[];
}

export interface DataSourceMappingAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  mapping_id?: string;
}

// Solution Design Module Types
export type SolutionDesignTool = 
  | 'Neon' 
  | 'Firebase' 
  | 'BigQuery' 
  | 'Make.com' 
  | 'Zapier' 
  | 'Cursor' 
  | 'Mindpal' 
  | 'Claude' 
  | 'GPT' 
  | 'Vercel' 
  | 'Next.js' 
  | 'React' 
  | 'TypeScript' 
  | 'Tailwind CSS'
  | 'PostgreSQL'
  | 'MongoDB'
  | 'Redis'
  | 'AWS Lambda'
  | 'Google Cloud Functions'
  | 'Azure Functions';

export type ExternalTool = 
  | 'Custom API'
  | 'Third-party service'
  | 'Legacy system'
  | 'Proprietary tool'
  | 'Open source alternative'
  | 'Cloud service'
  | 'Database service'
  | 'Integration platform';

export interface SolutionComponent {
  id: string;
  name: string;
  tool: SolutionDesignTool | null;
  external_tool_proposal: string;
  llm_recommendation: string;
  commander_notes: string;
  requires_approval: boolean;
  approval_status: 'pending' | 'approved' | 'rejected' | 'not_required';
  llm_suggestions: string[];
  constraints: string[];
}

export interface SolutionDesignPayload {
  blueprint_id: string;
  target_x: string;
  equation_components: SolutionComponent[];
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
    llm_used?: string;
  };
  validation: {
    all_components_have_tools: boolean;
    external_tools_approved: boolean;
    equation_balanced: boolean;
    ready_for_save: boolean;
  };
  audit_log: SolutionDesignAuditLog[];
}

export interface SolutionDesignAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  component_id?: string;
  tool_selected?: string;
}

// Security Module Types
export type AccessLevel = 
  | 'commander_only' 
  | 'authenticated_users' 
  | 'public_read' 
  | 'service_account' 
  | 'admin_only' 
  | 'restricted_access';

export type CredentialType = 
  | 'neon_service_account' 
  | 'firebase_auth' 
  | 'oauth2_token' 
  | 'api_key' 
  | 'jwt_token' 
  | 'custom_credentials';

export type ErrorFieldType = 
  | 'string' 
  | 'number' 
  | 'datetime' 
  | 'boolean' 
  | 'json' 
  | 'array';

export type HealingAgent = 
  | 'self_healing_agent_v1' 
  | 'automated_recovery_agent' 
  | 'circuit_breaker_agent' 
  | 'health_check_agent' 
  | 'custom_healing_agent';

export type EscalationLevel = 
  | 'retry_operation' 
  | 'alert_commander_if_unresolved' 
  | 'fallback_to_backup' 
  | 'shutdown_component' 
  | 'manual_intervention_required';

export interface SecurityComponent {
  id: string;
  name: string;
  access: AccessLevel;
  credentials: CredentialType;
  permission_rules: string[];
  data_flow_security: string[];
  nuclear_doctrine_compliant: boolean;
  commander_notes: string;
}

export interface ErrorField {
  field: string;
  type: ErrorFieldType;
  required: boolean;
  description: string;
  validation_rules?: string[];
}

export interface ErrorHandlingArchitecture {
  target_table: string;
  schema: ErrorField[];
  location: string;
  nuclear_doctrine_version: string;
  error_categories: string[];
  retention_policy: string;
  commander_notes: string;
}

export interface HealingArchitecture {
  agent: HealingAgent;
  doctrine_reference: string;
  escalation_rules: EscalationLevel[];
  healing_strategies: string[];
  timeout_settings: string;
  nuclear_doctrine_compliant: boolean;
  commander_notes: string;
}

export interface SecurityPayload {
  blueprint_id: string;
  security: {
    components: SecurityComponent[];
    nuclear_doctrine_version: string;
    overall_security_level: string;
  };
  error_handling: ErrorHandlingArchitecture;
  healing: HealingArchitecture;
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
  };
  validation: {
    all_components_secured: boolean;
    error_handling_defined: boolean;
    healing_architecture_defined: boolean;
    nuclear_doctrine_referenced: boolean;
    commander_signed_off: boolean;
    ready_for_save: boolean;
  };
  audit_log: SecurityAuditLog[];
}

export interface SecurityAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  component_id?: string;
  section?: 'security' | 'error_handling' | 'healing';
}

// Commander Intent Module Types
export interface FileAttachment {
  id: string;
  filename: string;
  location: string;
  description?: string;
  file_type?: string;
  size?: string;
  last_modified?: string;
}

export interface CommanderIntent {
  id: string;
  intent: string;
  target_x: string;
  notes: string;
  constraints: string[];
  success_criteria: string[];
  commander_notes: string;
  attachments: FileAttachment[];
}

export interface CommanderIntentPayload {
  blueprint_id: string;
  doctrine_reference: string;
  commander_intent: CommanderIntent;
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
    build_version: string;
  };
  validation: {
    intent_defined: boolean;
    target_x_defined: boolean;
    doctrine_referenced: boolean;
    commander_signed_off: boolean;
    ready_for_save: boolean;
  };
  audit_log: CommanderIntentAuditLog[];
}

export interface CommanderIntentAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  field_updated?: string;
}

// Ping-Pong Integration Module Types
export type PingPongStatus = 'not_started' | 'in_progress' | 'complete';

export interface PingPongRefinement {
  notes: string;
  decisions: string;
  status: PingPongStatus;
  doctrine_reference: string;
  audit: string;
  commander_signed_off: boolean;
}

export interface PingPongIntegrationPayload {
  blueprint_id: string;
  doctrine_reference: string;
  ping_pong_refinement: PingPongRefinement;
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
    build_version: string;
  };
  validation: {
    output_present: boolean;
    commander_signed_off: boolean;
    ready_for_save: boolean;
  };
  audit_log: PingPongAuditLog[];
}

export interface PingPongAuditLog {
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  field_updated?: string;
}