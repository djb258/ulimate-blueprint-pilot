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