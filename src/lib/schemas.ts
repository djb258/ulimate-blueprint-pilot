// Schema validation for all module outputs
// Enforces doctrine references, version pinning, and validation requirements

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Base schema for all module outputs
export const baseModuleSchema = {
  type: 'object',
  required: ['blueprint_id', 'doctrine_reference', 'version', 'metadata', 'audit'],
  properties: {
    blueprint_id: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+$',
      minLength: 1,
      maxLength: 100
    },
    doctrine_reference: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+_v[0-9]+\\.[0-9]+(\\.[0-9]+)?$',
      examples: ['nuclear_doctrine_v1.2', 'security_doctrine_v2.0', 'automation_doctrine_v1.0']
    },
    version: {
      type: 'string',
      pattern: '^v[0-9]+\\.[0-9]+(\\.[0-9]+)?$',
      examples: ['v1.0.0', 'v2.1.3', 'v1.0']
    },
    metadata: {
      type: 'object',
      required: ['created_at', 'updated_at', 'created_by', 'commander_approval'],
      properties: {
        created_at: {
          type: 'string',
          format: 'date-time'
        },
        updated_at: {
          type: 'string',
          format: 'date-time'
        },
        created_by: {
          type: 'string',
          minLength: 1
        },
        commander_approval: {
          type: 'object',
          required: ['commander', 'timestamp', 'signature'],
          properties: {
            commander: {
              type: 'string',
              minLength: 1
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            signature: {
              type: 'string',
              minLength: 1
            }
          }
        }
      }
    },
    audit: {
      type: 'string',
      minLength: 1,
      maxLength: 500
    }
  }
};

// Commander Intent Schema
export const commanderIntentSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'commander_intent', 'target_x'],
  properties: {
    ...baseModuleSchema.properties,
    commander_intent: {
      type: 'string',
      minLength: 10,
      maxLength: 1000
    },
    target_x: {
      type: 'string',
      minLength: 10,
      maxLength: 500
    },
    notes: {
      type: 'string',
      maxLength: 1000
    },
    constraints: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 200
      }
    },
    success_criteria: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 200
      }
    }
  }
};

// Data Source Mapping Schema
export const dataSourceMappingSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'data_sources'],
  properties: {
    ...baseModuleSchema.properties,
    data_sources: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'id',
          'constant_or_variable_name',
          'source_type',
          'source_id',
          'acronym',
          'validation',
          'failover',
          'commander_notes',
          'audit_tag'
        ],
        properties: {
          id: {
            type: 'string',
            pattern: '^[a-zA-Z0-9_-]+$'
          },
          constant_or_variable_name: {
            type: 'string',
            minLength: 1
          },
          source_type: {
            type: 'string',
            enum: [
              'API',
              'FTP',
              'Neon DB',
              'Firebase',
              'BigQuery',
              'Commander runtime input',
              'File system',
              'Environment variable',
              'Configuration file',
              'External service'
            ]
          },
          source_id: {
            type: 'string',
            minLength: 1
          },
          acronym: {
            type: 'string',
            enum: ['STAMPED', 'SPVPET', 'STACKED', 'N/A']
          },
          validation: {
            type: 'string',
            enum: [
              'type check',
              'range check',
              'schema validation',
              'format validation',
              'custom validation',
              'none'
            ]
          },
          failover: {
            type: 'string',
            enum: [
              'default value',
              'alternate source',
              'error out',
              'retry with backoff',
              'prompt user for input again',
              'skip operation'
            ]
          },
          commander_notes: {
            type: 'string',
            maxLength: 500
          },
          audit_tag: {
            type: 'string',
            minLength: 1
          },
          table: {
            type: 'string'
          },
          schema: {
            type: 'string'
          },
          credentials: {
            type: 'string'
          },
          requires_commander_approval: {
            type: 'boolean'
          },
          nuclear_doctrine_compliant: {
            type: 'boolean'
          }
        }
      }
    }
  }
};

// Solution Design Schema
export const solutionDesignSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'target_x', 'equation_components'],
  properties: {
    ...baseModuleSchema.properties,
    target_x: {
      type: 'string',
      minLength: 10,
      maxLength: 500
    },
    equation_components: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'id',
          'name',
          'tool',
          'external_tool_proposal',
          'llm_recommendation',
          'commander_notes',
          'requires_approval',
          'approval_status'
        ],
        properties: {
          id: {
            type: 'string',
            pattern: '^[a-zA-Z0-9_-]+$'
          },
          name: {
            type: 'string',
            minLength: 1
          },
          tool: {
            oneOf: [
              {
                type: 'string',
                enum: [
                  'Neon',
                  'Firebase',
                  'BigQuery',
                  'Make.com',
                  'Zapier',
                  'Cursor',
                  'Mindpal',
                  'Claude',
                  'GPT',
                  'Vercel',
                  'Next.js',
                  'React',
                  'TypeScript',
                  'Tailwind CSS',
                  'PostgreSQL',
                  'MongoDB',
                  'Redis',
                  'AWS Lambda',
                  'Google Cloud Functions',
                  'Azure Functions'
                ]
              },
              {
                type: 'null'
              }
            ]
          },
          external_tool_proposal: {
            type: 'string',
            maxLength: 500
          },
          llm_recommendation: {
            type: 'string',
            maxLength: 1000
          },
          commander_notes: {
            type: 'string',
            maxLength: 500
          },
          requires_approval: {
            type: 'boolean'
          },
          approval_status: {
            type: 'string',
            enum: ['pending', 'approved', 'rejected', 'not_required']
          },
          llm_suggestions: {
            type: 'array',
            items: {
              type: 'string',
              maxLength: 200
            }
          },
          constraints: {
            type: 'array',
            items: {
              type: 'string',
              maxLength: 200
            }
          }
        }
      }
    }
  }
};

// Security Schema
export const securitySchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'security', 'error_handling', 'healing'],
  properties: {
    ...baseModuleSchema.properties,
    security: {
      type: 'object',
      required: ['components', 'nuclear_doctrine_version', 'overall_security_level'],
      properties: {
        components: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: [
              'id',
              'name',
              'access',
              'credentials',
              'permission_rules',
              'data_flow_security',
              'nuclear_doctrine_compliant',
              'commander_notes'
            ],
            properties: {
              id: {
                type: 'string',
                pattern: '^[a-zA-Z0-9_-]+$'
              },
              name: {
                type: 'string',
                minLength: 1
              },
              access: {
                type: 'string',
                enum: [
                  'commander_only',
                  'authenticated_users',
                  'public_read',
                  'service_account',
                  'admin_only',
                  'restricted_access'
                ]
              },
              credentials: {
                type: 'string',
                enum: [
                  'neon_service_account',
                  'firebase_auth',
                  'oauth2_token',
                  'api_key',
                  'jwt_token',
                  'custom_credentials'
                ]
              },
              permission_rules: {
                type: 'array',
                items: {
                  type: 'string',
                  maxLength: 200
                }
              },
              data_flow_security: {
                type: 'array',
                items: {
                  type: 'string',
                  maxLength: 200
                }
              },
              nuclear_doctrine_compliant: {
                type: 'boolean'
              },
              commander_notes: {
                type: 'string',
                maxLength: 500
              }
            }
          }
        },
        nuclear_doctrine_version: {
          type: 'string',
          pattern: '^v[0-9]+\\.[0-9]+(\\.[0-9]+)?$'
        },
        overall_security_level: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical']
        }
      }
    },
    error_handling: {
      type: 'object',
      required: [
        'target_table',
        'schema',
        'location',
        'nuclear_doctrine_version',
        'error_categories',
        'retention_policy',
        'commander_notes'
      ],
      properties: {
        target_table: {
          type: 'string',
          minLength: 1
        },
        schema: {
          type: 'array',
          items: {
            type: 'object',
            required: ['field', 'type', 'required', 'description'],
            properties: {
              field: {
                type: 'string',
                minLength: 1
              },
              type: {
                type: 'string',
                enum: ['string', 'number', 'datetime', 'boolean', 'json', 'array']
              },
              required: {
                type: 'boolean'
              },
              description: {
                type: 'string',
                maxLength: 200
              },
              validation_rules: {
                type: 'array',
                items: {
                  type: 'string',
                  maxLength: 100
                }
              }
            }
          }
        },
        location: {
          type: 'string',
          minLength: 1
        },
        nuclear_doctrine_version: {
          type: 'string',
          pattern: '^v[0-9]+\\.[0-9]+(\\.[0-9]+)?$'
        },
        error_categories: {
          type: 'array',
          items: {
            type: 'string',
            maxLength: 100
          }
        },
        retention_policy: {
          type: 'string',
          maxLength: 200
        },
        commander_notes: {
          type: 'string',
          maxLength: 500
        }
      }
    },
    healing: {
      type: 'object',
      required: [
        'agent',
        'doctrine_reference',
        'escalation_rules',
        'healing_strategies',
        'timeout_settings',
        'nuclear_doctrine_compliant',
        'commander_notes'
      ],
      properties: {
        agent: {
          type: 'string',
          enum: [
            'self_healing_agent_v1',
            'automated_recovery_agent',
            'circuit_breaker_agent',
            'health_check_agent',
            'custom_healing_agent'
          ]
        },
        doctrine_reference: {
          type: 'string',
          pattern: '^[a-zA-Z0-9_-]+_v[0-9]+\\.[0-9]+(\\.[0-9]+)?$'
        },
        escalation_rules: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'retry_operation',
              'alert_commander_if_unresolved',
              'fallback_to_backup',
              'shutdown_component',
              'manual_intervention_required'
            ]
          }
        },
        healing_strategies: {
          type: 'array',
          items: {
            type: 'string',
            maxLength: 200
          }
        },
        timeout_settings: {
          type: 'string',
          maxLength: 100
        },
        nuclear_doctrine_compliant: {
          type: 'boolean'
        },
        commander_notes: {
          type: 'string',
          maxLength: 500
        }
      }
    }
  }
};

// Ping Pong Integration Schema
export const pingPongSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'ping_pong_refinement'],
  properties: {
    ...baseModuleSchema.properties,
    ping_pong_refinement: {
      type: 'object',
      required: [
        'notes',
        'decisions',
        'status',
        'doctrine_reference',
        'audit',
        'commander_signed_off'
      ],
      properties: {
        notes: {
          type: 'string',
          maxLength: 1000
        },
        decisions: {
          type: 'string',
          maxLength: 1000
        },
        status: {
          type: 'string',
          enum: ['not_started', 'in_progress', 'complete']
        },
        doctrine_reference: {
          type: 'string',
          pattern: '^[a-zA-Z0-9_-]+_v[0-9]+\\.[0-9]+(\\.[0-9]+)?$'
        },
        audit: {
          type: 'string',
          minLength: 1,
          maxLength: 500
        },
        commander_signed_off: {
          type: 'boolean'
        }
      }
    }
  }
};

// Final Blueprint Schema (for packaging)
export const finalBlueprintSchema = {
  type: 'object',
  required: [
    'blueprint_id',
    'version',
    'doctrine_reference',
    'commander_approval',
    'timestamp',
    'modules',
    'metadata'
  ],
  properties: {
    blueprint_id: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+$',
      minLength: 1,
      maxLength: 100
    },
    version: {
      type: 'string',
      pattern: '^v[0-9]+\\.[0-9]+(\\.[0-9]+)?$',
      examples: ['v1.0.0', 'v2.1.3', 'v1.0']
    },
    doctrine_reference: {
      type: 'string',
      pattern: '^[a-zA-Z0-9_-]+_v[0-9]+\\.[0-9]+(\\.[0-9]+)?$'
    },
    commander_approval: {
      type: 'object',
      required: ['commander', 'timestamp', 'signature', 'approval_notes'],
      properties: {
        commander: {
          type: 'string',
          minLength: 1
        },
        timestamp: {
          type: 'string',
          format: 'date-time'
        },
        signature: {
          type: 'string',
          minLength: 1
        },
        approval_notes: {
          type: 'string',
          maxLength: 1000
        }
      }
    },
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    modules: {
      type: 'object',
      required: [
        'commander_intent',
        'data_source_mapping',
        'solution_design',
        'security',
        'ping_pong_integration'
      ],
      properties: {
        commander_intent: {
          type: 'object',
          required: ['file_path', 'validated', 'last_updated'],
          properties: {
            file_path: {
              type: 'string',
              pattern: '^config/commander_intent\\.ya?ml$'
            },
            validated: {
              type: 'boolean'
            },
            last_updated: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        data_source_mapping: {
          type: 'object',
          required: ['file_path', 'validated', 'last_updated'],
          properties: {
            file_path: {
              type: 'string',
              pattern: '^config/data_source_mapping\\.ya?ml$'
            },
            validated: {
              type: 'boolean'
            },
            last_updated: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        solution_design: {
          type: 'object',
          required: ['file_path', 'validated', 'last_updated'],
          properties: {
            file_path: {
              type: 'string',
              pattern: '^config/solution_design\\.ya?ml$'
            },
            validated: {
              type: 'boolean'
            },
            last_updated: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        security: {
          type: 'object',
          required: ['file_path', 'validated', 'last_updated'],
          properties: {
            file_path: {
              type: 'string',
              pattern: '^config/security\\.ya?ml$'
            },
            validated: {
              type: 'boolean'
            },
            last_updated: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ping_pong_integration: {
          type: 'object',
          required: ['file_path', 'validated', 'last_updated'],
          properties: {
            file_path: {
              type: 'string',
              pattern: '^config/ping_pong\\.ya?ml$'
            },
            validated: {
              type: 'boolean'
            },
            last_updated: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    metadata: {
      type: 'object',
      required: ['created_at', 'updated_at', 'created_by', 'total_modules', 'validation_status'],
      properties: {
        created_at: {
          type: 'string',
          format: 'date-time'
        },
        updated_at: {
          type: 'string',
          format: 'date-time'
        },
        created_by: {
          type: 'string',
          minLength: 1
        },
        total_modules: {
          type: 'number',
          minimum: 5
        },
        validation_status: {
          type: 'string',
          enum: ['pending', 'validated', 'failed']
        }
      }
    }
  }
};

// Equation Schema
export const equationSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'equation', 'variables', 'constants'],
  properties: {
    ...baseModuleSchema.properties,
    equation: {
      type: 'string',
      minLength: 1,
      maxLength: 1000
    },
    variables: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['name', 'type', 'description'],
        properties: {
          name: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['number', 'string', 'boolean', 'array', 'object'] },
          description: { type: 'string', minLength: 1 },
          default_value: { type: 'string' },
          validation: { type: 'string' }
        }
      }
    },
    constants: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'value', 'description'],
        properties: {
          name: { type: 'string', minLength: 1 },
          value: { type: 'string', minLength: 1 },
          description: { type: 'string', minLength: 1 },
          unit: { type: 'string' }
        }
      }
    }
  }
};

// Constants and Variables Schema
export const constantsVariablesSchema = {
  ...baseModuleSchema,
  required: [...baseModuleSchema.required, 'constants', 'variables'],
  properties: {
    ...baseModuleSchema.properties,
    constants: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'value', 'type', 'description'],
        properties: {
          name: { type: 'string', minLength: 1 },
          value: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['string', 'number', 'boolean', 'array', 'object'] },
          description: { type: 'string', minLength: 1 },
          scope: { type: 'string', enum: ['global', 'module', 'function'] },
          is_immutable: { type: 'boolean' }
        }
      }
    },
    variables: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'type', 'description'],
        properties: {
          name: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['string', 'number', 'boolean', 'array', 'object'] },
          description: { type: 'string', minLength: 1 },
          default_value: { type: 'string' },
          scope: { type: 'string', enum: ['global', 'module', 'function'] },
          is_required: { type: 'boolean' }
        }
      }
    }
  }
};

// Schema registry for easy access
export const schemaRegistry = {
  commander_intent: commanderIntentSchema,
  data_source_mapping: dataSourceMappingSchema,
  solution_design: solutionDesignSchema,
  security: securitySchema,
  ping_pong_integration: pingPongSchema,
  equation: equationSchema,
  constants_variables: constantsVariablesSchema,
  final_blueprint: finalBlueprintSchema
};

// Validation function using JSON Schema
interface SchemaDefinition {
  type?: string;
  required?: string[];
  properties?: Record<string, SchemaDefinition>;
  pattern?: string;
  enum?: unknown[];
  minItems?: number;
  maxItems?: number;
  items?: SchemaDefinition;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  oneOf?: SchemaDefinition[];
}

export function validateSchema(data: unknown, schema: SchemaDefinition): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Basic type checking
    if (typeof data !== 'object' || data === null) {
      errors.push('Data must be an object');
      return { isValid: false, errors, warnings };
    }

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check properties
    if (schema.properties) {
      for (const [field, value] of Object.entries(data)) {
        const fieldSchema = schema.properties[field];
        if (fieldSchema) {
          const fieldValidation = validateField(value, fieldSchema, field);
          errors.push(...fieldValidation.errors);
          warnings.push(...fieldValidation.warnings);
        } else {
          warnings.push(`Unknown field: ${field}`);
        }
      }
    }

    // Check pattern validation
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (typeof data === 'string' && !regex.test(data)) {
        errors.push(`Value does not match pattern: ${schema.pattern}`);
      }
    }

    // Check enum validation
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`Value must be one of: ${schema.enum.join(', ')}`);
    }

    // Check array validation
    if (schema.type === 'array') {
      if (!Array.isArray(data)) {
        errors.push('Value must be an array');
      } else {
        const arrayData = data as unknown[];
        if (schema.minItems && arrayData.length < schema.minItems) {
          errors.push(`Array must have at least ${schema.minItems} items`);
        }
        if (schema.maxItems && arrayData.length > schema.maxItems) {
          errors.push(`Array must have at most ${schema.maxItems} items`);
        }
        if (schema.items) {
          for (let i = 0; i < arrayData.length; i++) {
            const itemValidation = validateField(arrayData[i], schema.items, `[${i}]`);
            errors.push(...itemValidation.errors);
            warnings.push(...itemValidation.warnings);
          }
        }
      }
    }

    // Check string validation
    if (schema.type === 'string') {
      if (typeof data !== 'string') {
        errors.push('Value must be a string');
      } else {
        const stringData = data as string;
        if (schema.minLength && stringData.length < schema.minLength) {
          errors.push(`String must be at least ${schema.minLength} characters`);
        }
        if (schema.maxLength && stringData.length > schema.maxLength) {
          errors.push(`String must be at most ${schema.maxLength} characters`);
        }
      }
    }

    // Check boolean validation
    if (schema.type === 'boolean' && typeof data !== 'boolean') {
      errors.push('Value must be a boolean');
    }

    // Check number validation
    if (schema.type === 'number') {
      if (typeof data !== 'number') {
        errors.push('Value must be a number');
      } else {
        if (schema.minimum !== undefined && data < schema.minimum) {
          errors.push(`Number must be at least ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && data > schema.maximum) {
          errors.push(`Number must be at most ${schema.maximum}`);
        }
      }
    }

  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function validateField(value: unknown, schema: SchemaDefinition, fieldPath: string): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Handle oneOf (union types)
    if (schema.oneOf) {
      let valid = false;
      for (const option of schema.oneOf) {
        const optionValidation = validateField(value, option, fieldPath);
        if (optionValidation.errors.length === 0) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        errors.push(`${fieldPath}: Value does not match any valid option`);
      }
    }

    // Handle object validation
    if (schema.type === 'object' || (schema.properties && !schema.type)) {
      if (typeof value !== 'object' || value === null) {
        errors.push(`${fieldPath}: Must be an object`);
      } else {
        // Check required fields
        if (schema.required) {
          for (const requiredField of schema.required) {
            if (!(requiredField in value)) {
              errors.push(`${fieldPath}.${requiredField}: Required field missing`);
            }
          }
        }

        // Check properties
        if (schema.properties) {
          for (const [prop, propValue] of Object.entries(value)) {
            const propSchema = schema.properties[prop];
            if (propSchema) {
              const propValidation = validateField(propValue, propSchema, `${fieldPath}.${prop}`);
              errors.push(...propValidation.errors);
              warnings.push(...propValidation.warnings);
            } else {
              warnings.push(`${fieldPath}.${prop}: Unknown property`);
            }
          }
        }
      }
    }

    // Handle array validation
    if (schema.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`${fieldPath}: Must be an array`);
      } else {
        if (schema.minItems && value.length < schema.minItems) {
          errors.push(`${fieldPath}: Must have at least ${schema.minItems} items`);
        }
        if (schema.maxItems && value.length > schema.maxItems) {
          errors.push(`${fieldPath}: Must have at most ${schema.maxItems} items`);
        }
        if (schema.items) {
          for (let i = 0; i < value.length; i++) {
            const itemValidation = validateField(value[i], schema.items, `${fieldPath}[${i}]`);
            errors.push(...itemValidation.errors);
            warnings.push(...itemValidation.warnings);
          }
        }
      }
    }

    // Handle string validation
    if (schema.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${fieldPath}: Must be a string`);
      } else {
        if (schema.minLength && value.length < schema.minLength) {
          errors.push(`${fieldPath}: Must be at least ${schema.minLength} characters`);
        }
        if (schema.maxLength && value.length > schema.maxLength) {
          errors.push(`${fieldPath}: Must be at most ${schema.maxLength} characters`);
        }
        if (schema.pattern) {
          const regex = new RegExp(schema.pattern);
          if (!regex.test(value)) {
            errors.push(`${fieldPath}: Does not match pattern ${schema.pattern}`);
          }
        }
        if (schema.enum && !schema.enum.includes(value)) {
          errors.push(`${fieldPath}: Must be one of: ${schema.enum.join(', ')}`);
        }
      }
    }

    // Handle boolean validation
    if (schema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${fieldPath}: Must be a boolean`);
    }

    // Handle number validation
    if (schema.type === 'number') {
      if (typeof value !== 'number') {
        errors.push(`${fieldPath}: Must be a number`);
      } else {
        if (schema.minimum !== undefined && value < schema.minimum) {
          errors.push(`${fieldPath}: Must be at least ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          errors.push(`${fieldPath}: Must be at most ${schema.maximum}`);
        }
      }
    }

  } catch (error) {
    errors.push(`${fieldPath}: Validation error - ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { isValid: errors.length === 0, errors, warnings };
}

// Convenience function to validate module data
export function validateModuleData(moduleType: keyof typeof schemaRegistry, data: unknown): SchemaValidationResult {
  const schema = schemaRegistry[moduleType];
  if (!schema) {
    return {
      isValid: false,
      errors: [`Unknown module type: ${moduleType}`],
      warnings: []
    };
  }
  return validateSchema(data, schema);
}

// Function to validate final blueprint
export function validateFinalBlueprint(data: unknown): SchemaValidationResult {
  return validateSchema(data, finalBlueprintSchema);
} 