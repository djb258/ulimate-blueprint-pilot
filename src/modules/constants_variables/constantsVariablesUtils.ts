import { ConstantsVariablesPayload } from '../../types';

// Convert constants and variables payload to YAML format
export function constantsVariablesToYaml(payload: ConstantsVariablesPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
constants:
${payload.constants.map(constant => `  ${constant.name}:
    value: ${formatValue(constant.value)}
    notes: "${constant.notes.replace(/"/g, '\\"')}"${constant.category ? `
    category: ${constant.category}` : ''}`).join('\n')}
variables:
${payload.variables.map(variable => `  ${variable.name}:
    type: ${variable.type}
    required: ${variable.required}
    default: ${formatValue(variable.default)}${variable.default !== null ? `
    notes: "${variable.notes.replace(/"/g, '\\"')}"` : `
    notes: "${variable.notes.replace(/"/g, '\\"')}"`}${variable.category ? `
    category: ${variable.category}` : ''}`).join('\n')}
metadata:
  created_at: ${payload.metadata.created_at}
  updated_at: ${payload.metadata.updated_at}
  created_by: ${payload.metadata.created_by}
  version: ${payload.metadata.version}
validation:
  all_constants_have_values: ${payload.validation.all_constants_have_values}
  all_variables_have_types: ${payload.validation.all_variables_have_types}
  required_variables_defined: ${payload.validation.required_variables_defined}
  ready_for_save: ${payload.validation.ready_for_save}
audit_log:
${payload.audit_log.map(log => `  - timestamp: ${log.timestamp}
    action: ${log.action}
    user: ${log.user}${log.details ? `
    details: "${log.details.replace(/"/g, '\\"')}"` : ''}${log.item_id ? `
    item_id: ${log.item_id}` : ''}${log.item_type ? `
    item_type: ${log.item_type}` : ''}`).join('\n')}
`;

  return yaml;
}

// Helper function to format values for YAML
function formatValue(value: string | number | boolean | string[] | null): string {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (typeof value === 'string') {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  if (typeof value === 'boolean') {
    return value.toString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return `[${value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
  }
  return `"${value}"`;
}

// Convert constants and variables payload to JSON format
export function constantsVariablesToJson(payload: ConstantsVariablesPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save constants and variables configuration to file
export async function saveConstantsVariablesConfig(payload: ConstantsVariablesPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? constantsVariablesToYaml(payload) : constantsVariablesToJson(payload);
    const filename = format === 'yaml' ? 'constants_variables.yaml' : 'constants_variables.json';
    
    // In a browser environment, we'll create a download link
    const blob = new Blob([content], { type: format === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Constants and variables configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving constants and variables configuration:', error);
    throw error;
  }
}

// Generate example constants and variables configuration
export function generateExampleConstantsVariables(blueprintId: string, user: string): ConstantsVariablesPayload {
  return {
    blueprint_id: blueprintId,
    constants: [
      {
        id: "const-1",
        name: "approved_tool_stack",
        value: ["ChatGPT", "Claude", "Abacus", "APIFY", "Make.com", "Mindpal", "Deerflow", "Firebase", "Neon", "Render"],
        notes: "Approved tools list; external tools require commander approval",
        category: "system"
      },
      {
        id: "const-2",
        name: "output_path",
        value: "/config/",
        notes: "Standard config output directory",
        category: "configuration"
      },
      {
        id: "const-3",
        name: "max_retry_attempts",
        value: 3,
        notes: "Maximum number of retry attempts for failed operations",
        category: "system"
      },
      {
        id: "const-4",
        name: "enable_debug_mode",
        value: false,
        notes: "Enable debug mode for development and troubleshooting",
        category: "configuration"
      }
    ],
    variables: [
      {
        id: "var-1",
        name: "user_input_start_description",
        type: "string",
        required: true,
        default: null,
        notes: "User-provided broad description; start of equation",
        category: "user_input"
      },
      {
        id: "var-2",
        name: "user_input_target_x",
        type: "string",
        required: true,
        default: null,
        notes: "Specific end goal; target X of equation",
        category: "user_input"
      },
      {
        id: "var-3",
        name: "commander_override_timeout",
        type: "number",
        required: false,
        default: 300,
        notes: "Timeout value in seconds; can be overridden by commander",
        category: "commander_override"
      },
      {
        id: "var-4",
        name: "enable_advanced_features",
        type: "boolean",
        required: false,
        default: false,
        notes: "Enable advanced features; requires commander approval",
        category: "commander_override"
      },
      {
        id: "var-5",
        name: "allowed_file_types",
        type: "array",
        required: false,
        default: ["yaml", "json", "md"],
        notes: "Allowed file types for configuration output",
        category: "system"
      }
    ],
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: "1.0.0"
    },
    validation: {
      all_constants_have_values: true,
      all_variables_have_types: true,
      required_variables_defined: true,
      ready_for_save: true
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: "example_generated",
        user,
        details: "Generated example constants and variables configuration"
      }
    ]
  };
} 