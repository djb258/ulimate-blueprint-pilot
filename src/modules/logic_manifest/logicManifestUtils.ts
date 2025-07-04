import { 
  LogicManifest, 
  LogicManifestSpec, 
  ValidationResult
} from './logicManifestTypes';

export async function generateLogicManifest(spec: LogicManifestSpec): Promise<LogicManifest> {
  // Generate sample data table design
  const dataTableDesign = {
    tables: [
      {
        name: 'users',
        description: 'User account information',
        columns: [
          {
            name: 'id',
            type: 'UUID',
            nullable: false,
            description: 'Primary key',
            validationRules: ['not_null', 'unique']
          },
          {
            name: 'email',
            type: 'VARCHAR(255)',
            nullable: false,
            description: 'User email address',
            validationRules: ['not_null', 'unique', 'email_format']
          },
          {
            name: 'created_at',
            type: 'TIMESTAMP',
            nullable: false,
            defaultValue: 'CURRENT_TIMESTAMP',
            description: 'Account creation timestamp',
            validationRules: ['not_null']
          }
        ],
        primaryKey: 'id',
        indexes: ['idx_users_email'],
        constraints: [
          {
            name: 'fk_users_roles',
            type: 'foreign_key' as const,
            definition: 'FOREIGN KEY (role_id) REFERENCES roles(id)'
          }
        ]
      },
      {
        name: 'blueprints',
        description: 'Blueprint specifications',
        columns: [
          {
            name: 'id',
            type: 'UUID',
            nullable: false,
            description: 'Primary key',
            validationRules: ['not_null', 'unique']
          },
          {
            name: 'name',
            type: 'VARCHAR(255)',
            nullable: false,
            description: 'Blueprint name',
            validationRules: ['not_null']
          },
          {
            name: 'manifest',
            type: 'JSONB',
            nullable: false,
            description: 'Embedded logic manifest',
            validationRules: ['not_null', 'valid_json']
          }
        ],
        primaryKey: 'id',
        indexes: ['idx_blueprints_name'],
        constraints: []
      }
    ],
    relationships: [
      'users -> blueprints (one-to-many)',
      'blueprints -> logic_manifest (one-to-one)'
    ]
  };

  // Generate join/mapping logic
  const joinMappingLogic = {
    mappings: [
      {
        name: 'user_blueprints',
        sourceTable: 'users',
        targetTable: 'blueprints',
        joinType: 'left' as const,
        conditions: [
          {
            sourceColumn: 'users.id',
            targetColumn: 'blueprints.user_id',
            operator: '=' as const
          }
        ],
        description: 'Join users with their created blueprints'
      }
    ],
    defaultJoins: ['user_blueprints']
  };

  // Generate constants and variables
  const constantsVariables = {
    constants: [
      {
        name: 'MAX_BLUEPRINT_SIZE',
        value: 1048576,
        type: 'number',
        description: 'Maximum blueprint file size in bytes',
        scope: 'global' as const
      },
      {
        name: 'DEFAULT_TIMEOUT',
        value: 30000,
        type: 'number',
        description: 'Default API timeout in milliseconds',
        scope: 'global' as const
      },
      {
        name: 'MANIFEST_VERSION',
        value: '1.0.0',
        type: 'string',
        description: 'Current logic manifest version',
        scope: 'global' as const
      }
    ],
    variables: [
      {
        name: 'currentUser',
        type: 'User',
        description: 'Currently authenticated user',
        scope: 'module' as const,
        validationRules: ['not_null', 'authenticated']
      },
      {
        name: 'blueprintData',
        type: 'BlueprintData',
        description: 'Current blueprint data being processed',
        scope: 'function' as const,
        validationRules: ['valid_blueprint_format']
      }
    ]
  };

  // Generate agent interaction patterns
  const agentInteractionPatterns = {
    patterns: [
      {
        name: 'blueprint_generation',
        description: 'Standard blueprint generation pattern',
        inputSchema: {
          requirements: 'string',
          constraints: 'string[]',
          target_language: 'string'
        },
        outputSchema: {
          blueprint: 'BlueprintData',
          manifest: 'LogicManifest',
          validation_errors: 'string[]'
        },
        allowedOperations: ['generate', 'validate', 'export'],
        constraints: ['must_include_manifest', 'version_tagged']
      },
      {
        name: 'code_generation',
        description: 'Code generation from blueprint pattern',
        inputSchema: {
          blueprint: 'BlueprintData',
          manifest: 'LogicManifest',
          target_framework: 'string'
        },
        outputSchema: {
          generated_code: 'string',
          dependencies: 'string[]',
          build_instructions: 'string'
        },
        allowedOperations: ['generate', 'validate', 'build'],
        constraints: ['follow_manifest', 'no_freelancing']
      }
    ],
    defaultPattern: 'blueprint_generation'
  };

  // Generate Cursor templates
  const cursorTemplates = {
    templates: [
      {
        name: 'react_component',
        description: 'React component template',
        template: `import React from 'react';

interface {{componentName}}Props {
  {{props}}
}

export default function {{componentName}}({ {{props}} }: {{componentName}}Props) {
  return (
    <div>
      {{content}}
    </div>
  );
}`,
        variables: ['componentName', 'props', 'content'],
        usage: 'Generate React components with TypeScript'
      },
      {
        name: 'api_endpoint',
        description: 'API endpoint template',
        template: `export async function {{methodName}}(req: Request, res: Response) {
  try {
    {{logic}}
    return res.status(200).json({ success: true, data: {{response}} });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}`,
        variables: ['methodName', 'logic', 'response'],
        usage: 'Generate API endpoint handlers'
      }
    ],
    defaultTemplate: 'react_component'
  };

  // Generate health/status hooks
  const healthStatusHooks = {
    hooks: [
      {
        name: 'manifest_validation_hook',
        type: 'health_check' as const,
        description: 'Validates logic manifest integrity',
        implementation: 'validateManifestIntegrity(manifest)',
        triggers: ['before_generation', 'before_deployment']
      },
      {
        name: 'blueprint_health_check',
        type: 'status_monitor' as const,
        description: 'Monitors blueprint generation health',
        implementation: 'checkBlueprintHealth(blueprint)',
        triggers: ['generation_complete', 'hourly']
      },
      {
        name: 'error_handler',
        type: 'failure_handler' as const,
        description: 'Handles generation failures',
        implementation: 'handleGenerationError(error, context)',
        triggers: ['generation_failed', 'validation_failed']
      }
    ],
    defaultHooks: ['manifest_validation_hook', 'error_handler']
  };

  // Generate audit requirements
  const auditRequirements = {
    requirements: [
      {
        name: 'blueprint_generation_audit',
        type: 'user_action' as const,
        description: 'Audit all blueprint generation activities',
        requiredFields: ['user_id', 'blueprint_id', 'generation_time', 'manifest_version'],
        retentionPolicy: '7 years'
      },
      {
        name: 'manifest_access_audit',
        type: 'data_access' as const,
        description: 'Audit access to logic manifests',
        requiredFields: ['user_id', 'manifest_id', 'access_time', 'operation'],
        retentionPolicy: '3 years'
      },
      {
        name: 'system_health_audit',
        type: 'system_event' as const,
        description: 'Audit system health events',
        requiredFields: ['event_type', 'timestamp', 'severity', 'details'],
        retentionPolicy: '1 year'
      }
    ],
    mandatoryAudits: ['blueprint_generation_audit', 'manifest_access_audit']
  };

  return {
    version: spec.version,
    buildAgent: spec.buildAgent,
    doctrineReference: spec.doctrineReference,
    generatedAt: new Date().toISOString(),
    dataTableDesign,
    joinMappingLogic,
    constantsVariables,
    agentInteractionPatterns,
    cursorTemplates,
    healthStatusHooks,
    auditRequirements
  };
}

export function validateLogicManifest(manifest: LogicManifest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!manifest.version) {
    errors.push('Version is required');
  }

  if (!manifest.buildAgent) {
    errors.push('Build agent is required');
  }

  if (!manifest.doctrineReference) {
    errors.push('Doctrine reference is required');
  }

  if (!manifest.generatedAt) {
    errors.push('Generated timestamp is required');
  }

  // Validate data table design
  if (!manifest.dataTableDesign.tables || manifest.dataTableDesign.tables.length === 0) {
    warnings.push('No data tables defined');
  }

  // Validate join mappings
  if (!manifest.joinMappingLogic.mappings || manifest.joinMappingLogic.mappings.length === 0) {
    warnings.push('No join mappings defined');
  }

  // Validate constants and variables
  if (!manifest.constantsVariables.constants || manifest.constantsVariables.constants.length === 0) {
    warnings.push('No constants defined');
  }

  // Validate agent patterns
  if (!manifest.agentInteractionPatterns.patterns || manifest.agentInteractionPatterns.patterns.length === 0) {
    errors.push('At least one agent interaction pattern is required');
  }

  // Validate Cursor templates
  if (!manifest.cursorTemplates.templates || manifest.cursorTemplates.templates.length === 0) {
    warnings.push('No Cursor templates defined');
  }

  // Validate health hooks
  if (!manifest.healthStatusHooks.hooks || manifest.healthStatusHooks.hooks.length === 0) {
    warnings.push('No health hooks defined');
  }

  // Validate audit requirements
  if (!manifest.auditRequirements.requirements || manifest.auditRequirements.requirements.length === 0) {
    warnings.push('No audit requirements defined');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function embedManifestInOutput(output: string, manifest: LogicManifest): string {
  const manifestComment = `/*
LOGIC MANIFEST EMBEDDED
Version: ${manifest.version}
Build Agent: ${manifest.buildAgent}
Doctrine Reference: ${manifest.doctrineReference}
Generated At: ${manifest.generatedAt}

This output is generated according to the embedded logic manifest.
No modifications should be made beyond the manifest specifications.
*/

`;

  return manifestComment + output;
}

export function extractManifestFromOutput(output: string): LogicManifest | null {
  const manifestMatch = output.match(/LOGIC MANIFEST EMBEDDED[\s\S]*?Generated At: ([^\n]+)/);
  
  if (!manifestMatch) {
    return null;
  }

  // Extract manifest information from the comment block
  const versionMatch = output.match(/Version: ([^\n]+)/);
  const buildAgentMatch = output.match(/Build Agent: ([^\n]+)/);
  const doctrineMatch = output.match(/Doctrine Reference: ([^\n]+)/);
  const generatedAtMatch = output.match(/Generated At: ([^\n]+)/);

  if (!versionMatch || !buildAgentMatch || !doctrineMatch || !generatedAtMatch) {
    return null;
  }

  return {
    version: versionMatch[1].trim(),
    buildAgent: buildAgentMatch[1].trim(),
    doctrineReference: doctrineMatch[1].trim(),
    generatedAt: generatedAtMatch[1].trim(),
    dataTableDesign: { tables: [], relationships: [] },
    joinMappingLogic: { mappings: [], defaultJoins: [] },
    constantsVariables: { constants: [], variables: [] },
    agentInteractionPatterns: { patterns: [], defaultPattern: '' },
    cursorTemplates: { templates: [], defaultTemplate: '' },
    healthStatusHooks: { hooks: [], defaultHooks: [] },
    auditRequirements: { requirements: [], mandatoryAudits: [] }
  };
} 