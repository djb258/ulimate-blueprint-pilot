import { DataSourceMappingPayload } from '../../types';

// Convert data source mapping payload to YAML format
export function dataSourceMappingToYaml(payload: DataSourceMappingPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
data_sources:
${payload.data_sources.map(mapping => `  ${mapping.constant_or_variable_name}:
    source_type: "${mapping.source_type}"
    source_id: "${mapping.source_id}"
    acronym: "${mapping.acronym}"
    validation: "${mapping.validation.replace(/"/g, '\\"')}"
    failover: "${mapping.failover.replace(/"/g, '\\"')}"
    audit: "${mapping.audit_tag.replace(/"/g, '\\"')}"${mapping.table ? `
    table: "${mapping.table}"` : ''}${mapping.schema ? `
    schema: "${mapping.schema}"` : ''}${mapping.credentials ? `
    credentials: "${mapping.credentials}"` : ''}${mapping.commander_notes ? `
    commander_notes: "${mapping.commander_notes.replace(/"/g, '\\"')}"` : ''}${mapping.requires_commander_approval !== undefined ? `
    requires_commander_approval: ${mapping.requires_commander_approval}` : ''}${mapping.nuclear_doctrine_compliant !== undefined ? `
    nuclear_doctrine_compliant: ${mapping.nuclear_doctrine_compliant}` : ''}`).join('\n')}
metadata:
  created_at: ${payload.metadata.created_at}
  updated_at: ${payload.metadata.updated_at}
  created_by: ${payload.metadata.created_by}
  version: ${payload.metadata.version}
validation:
  all_mappings_have_sources: ${payload.validation.all_mappings_have_sources}
  database_mappings_compliant: ${payload.validation.database_mappings_compliant}
  required_fields_populated: ${payload.validation.required_fields_populated}
  ready_for_save: ${payload.validation.ready_for_save}
audit_log:
${payload.audit_log.map(log => `  - timestamp: ${log.timestamp}
    action: ${log.action}
    user: ${log.user}${log.details ? `
    details: "${log.details.replace(/"/g, '\\"')}"` : ''}${log.mapping_id ? `
    mapping_id: ${log.mapping_id}` : ''}`).join('\n')}
`;

  return yaml;
}

// Convert data source mapping payload to JSON format
export function dataSourceMappingToJson(payload: DataSourceMappingPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save data source mapping configuration to file
export async function saveDataSourceMappingConfig(payload: DataSourceMappingPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? dataSourceMappingToYaml(payload) : dataSourceMappingToJson(payload);
    const filename = format === 'yaml' ? 'data_source_mapping.yaml' : 'data_source_mapping.json';
    
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
    
    console.log(`Data source mapping configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving data source mapping configuration:', error);
    throw error;
  }
}

// Generate example data source mapping configuration
export function generateExampleDataSourceMapping(blueprintId: string, user: string): DataSourceMappingPayload {
  return {
    blueprint_id: blueprintId,
    data_sources: [
      {
        id: "mapping-1",
        constant_or_variable_name: "user_input_start_description",
        source_type: "Commander runtime input",
        source_id: "form_input",
        acronym: "SPVPET",
        validation: "string, non-empty",
        failover: "Prompt user for input again",
        audit_tag: "Declared by commander, 2025-07-03, component: Market filter",
        commander_notes: "User provides broad description at start of equation"
      },
      {
        id: "mapping-2",
        constant_or_variable_name: "user_input_target_x",
        source_type: "Commander runtime input",
        source_id: "form_input",
        acronym: "SPVPET",
        validation: "string, non-empty",
        failover: "Prompt user for input again",
        audit_tag: "Declared by commander, 2025-07-03, component: Zip scoring",
        commander_notes: "User provides specific end goal for equation"
      },
      {
        id: "mapping-3",
        constant_or_variable_name: "some_neon_input",
        source_type: "Neon DB",
        source_id: "neon_table_xyz",
        acronym: "STAMPED",
        table: "neon_table_xyz",
        schema: "public",
        credentials: "use_neon_service_account",
        validation: "integer, > 0",
        failover: "Use default value: 1",
        audit_tag: "Declared by commander, 2025-07-03, component: Data bridge",
        commander_notes: "Read from Neon database table for data processing",
        requires_commander_approval: true,
        nuclear_doctrine_compliant: true
      },
      {
        id: "mapping-4",
        constant_or_variable_name: "api_configuration",
        source_type: "API",
        source_id: "https://api.example.com/config",
        acronym: "SPVPET",
        validation: "JSON schema validation",
        failover: "Use cached configuration",
        audit_tag: "Declared by commander, 2025-07-03, component: Market filter",
        commander_notes: "External API for configuration data"
      },
      {
        id: "mapping-5",
        constant_or_variable_name: "firebase_user_data",
        source_type: "Firebase",
        source_id: "users_collection",
        acronym: "STACKED",
        table: "users",
        schema: "firebase",
        credentials: "use_firebase_service_account",
        validation: "user object schema validation",
        failover: "Error out",
        audit_tag: "Declared by commander, 2025-07-03, component: Data bridge",
        commander_notes: "User data from Firebase database",
        requires_commander_approval: true,
        nuclear_doctrine_compliant: true
      },
      {
        id: "mapping-6",
        constant_or_variable_name: "environment_config",
        source_type: "Environment variable",
        source_id: "APP_ENVIRONMENT",
        acronym: "N/A",
        validation: "string, one of: development, staging, production",
        failover: "Use default: development",
        audit_tag: "Declared by commander, 2025-07-03, component: System",
        commander_notes: "Environment configuration from system variables"
      }
    ],
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: "1.0.0"
    },
    validation: {
      all_mappings_have_sources: true,
      database_mappings_compliant: true,
      required_fields_populated: true,
      ready_for_save: true
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: "example_generated",
        user,
        details: "Generated example data source mapping configuration"
      }
    ]
  };
} 