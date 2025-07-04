export interface DataTable {
  name: string;
  description: string;
  columns: DataColumn[];
  primaryKey: string;
  indexes: string[];
  constraints: TableConstraint[];
}

export interface DataColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  description: string;
  validationRules: string[];
}

export interface TableConstraint {
  name: string;
  type: 'foreign_key' | 'unique' | 'check';
  definition: string;
}

export interface JoinMapping {
  name: string;
  sourceTable: string;
  targetTable: string;
  joinType: 'inner' | 'left' | 'right' | 'full';
  conditions: JoinCondition[];
  description: string;
}

export interface JoinCondition {
  sourceColumn: string;
  targetColumn: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
}

export interface Constant {
  name: string;
  value: string | number | boolean;
  type: string;
  description: string;
  scope: 'global' | 'module' | 'function';
}

export interface Variable {
  name: string;
  type: string;
  description: string;
  scope: 'global' | 'module' | 'function';
  defaultValue?: string | number | boolean;
  validationRules: string[];
}

export interface AgentPattern {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  allowedOperations: string[];
  constraints: string[];
}

export interface CursorTemplate {
  name: string;
  description: string;
  template: string;
  variables: string[];
  usage: string;
}

export interface HealthHook {
  name: string;
  type: 'health_check' | 'status_monitor' | 'failure_handler';
  description: string;
  implementation: string;
  triggers: string[];
}

export interface AuditRequirement {
  name: string;
  type: 'data_access' | 'user_action' | 'system_event';
  description: string;
  requiredFields: string[];
  retentionPolicy: string;
}

export interface LogicManifest {
  version: string;
  buildAgent: string;
  doctrineReference: string;
  generatedAt: string;
  dataTableDesign: {
    tables: DataTable[];
    relationships: string[];
  };
  joinMappingLogic: {
    mappings: JoinMapping[];
    defaultJoins: string[];
  };
  constantsVariables: {
    constants: Constant[];
    variables: Variable[];
  };
  agentInteractionPatterns: {
    patterns: AgentPattern[];
    defaultPattern: string;
  };
  cursorTemplates: {
    templates: CursorTemplate[];
    defaultTemplate: string;
  };
  healthStatusHooks: {
    hooks: HealthHook[];
    defaultHooks: string[];
  };
  auditRequirements: {
    requirements: AuditRequirement[];
    mandatoryAudits: string[];
  };
}

export interface LogicManifestSpec {
  version: string;
  buildAgent: string;
  doctrineReference: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
} 