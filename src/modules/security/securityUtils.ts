import { SecurityPayload } from '../../types';

// Convert security payload to YAML format
export function securityToYaml(payload: SecurityPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
security:
  components:
${payload.security.components.map(component => `    - name: "${component.name.replace(/"/g, '\\"')}"
      access: "${component.access}"
      credentials: "${component.credentials}"
      permission_rules: [${component.permission_rules.map(rule => `"${rule.replace(/"/g, '\\"')}"`).join(', ')}]
      data_flow_security: [${component.data_flow_security.map(flow => `"${flow.replace(/"/g, '\\"')}"`).join(', ')}]
      nuclear_doctrine_compliant: ${component.nuclear_doctrine_compliant}
      commander_notes: "${component.commander_notes.replace(/"/g, '\\"')}"`).join('\n')}
  nuclear_doctrine_version: ${payload.security.nuclear_doctrine_version}
  overall_security_level: ${payload.security.overall_security_level}
error_handling:
  target_table: ${payload.error_handling.target_table}
  schema:
${payload.error_handling.schema.map(field => `    - field: "${field.field.replace(/"/g, '\\"')}"
      type: "${field.type}"
      required: ${field.required}
      description: "${field.description.replace(/"/g, '\\"')}"`).join('\n')}
  location: ${payload.error_handling.location}
  nuclear_doctrine_version: ${payload.error_handling.nuclear_doctrine_version}
  error_categories: [${payload.error_handling.error_categories.map(cat => `"${cat.replace(/"/g, '\\"')}"`).join(', ')}]
  retention_policy: ${payload.error_handling.retention_policy}
  commander_notes: "${payload.error_handling.commander_notes.replace(/"/g, '\\"')}"
healing:
  agent: ${payload.healing.agent}
  doctrine_reference: ${payload.healing.doctrine_reference}
  escalation_rules: [${payload.healing.escalation_rules.map(rule => `"${rule}"`).join(', ')}]
  healing_strategies: [${payload.healing.healing_strategies.map(strategy => `"${strategy.replace(/"/g, '\\"')}"`).join(', ')}]
  timeout_settings: ${payload.healing.timeout_settings}
  nuclear_doctrine_compliant: ${payload.healing.nuclear_doctrine_compliant}
  commander_notes: "${payload.healing.commander_notes.replace(/"/g, '\\"')}"
metadata:
  created_at: ${payload.metadata.created_at}
  updated_at: ${payload.metadata.updated_at}
  created_by: ${payload.metadata.created_by}
  version: ${payload.metadata.version}
validation:
  all_components_secured: ${payload.validation.all_components_secured}
  error_handling_defined: ${payload.validation.error_handling_defined}
  healing_architecture_defined: ${payload.validation.healing_architecture_defined}
  nuclear_doctrine_referenced: ${payload.validation.nuclear_doctrine_referenced}
  commander_signed_off: ${payload.validation.commander_signed_off}
  ready_for_save: ${payload.validation.ready_for_save}
audit_log:
${payload.audit_log.map(log => `  - timestamp: ${log.timestamp}
    action: ${log.action}
    user: ${log.user}${log.details ? `
    details: "${log.details.replace(/"/g, '\\"')}"` : ''}${log.component_id ? `
    component_id: ${log.component_id}` : ''}${log.section ? `
    section: ${log.section}` : ''}`).join('\n')}
`;

  return yaml;
}

// Convert security payload to JSON format
export function securityToJson(payload: SecurityPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save security configuration to file
export async function saveSecurityConfig(payload: SecurityPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? securityToYaml(payload) : securityToJson(payload);
    const filename = format === 'yaml' ? 'security.yaml' : 'security.json';
    
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
    
    console.log(`Security configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving security configuration:', error);
    throw error;
  }
}

// Generate example security configuration
export function generateExampleSecurityConfig(blueprintId: string, user: string): SecurityPayload {
  return {
    blueprint_id: blueprintId,
    security: {
      components: [
        {
          id: "component-1",
          name: "Market filter",
          access: "commander_only",
          credentials: "neon_service_account",
          permission_rules: [
            "Only commander can access market data",
            "Service account must be authenticated",
            "All access must be logged"
          ],
          data_flow_security: [
            "Data must be encrypted in transit",
            "Sensitive data must be masked in logs",
            "Access attempts must be rate limited"
          ],
          nuclear_doctrine_compliant: true,
          commander_notes: "Market filter requires maximum security due to sensitive financial data."
        },
        {
          id: "component-2",
          name: "Data bridge",
          access: "service_account",
          credentials: "api_key",
          permission_rules: [
            "Service account authentication required",
            "API key must be rotated monthly",
            "Access limited to specific IP ranges"
          ],
          data_flow_security: [
            "All data transfers must be encrypted",
            "Data validation required before processing",
            "Audit trail for all data movements"
          ],
          nuclear_doctrine_compliant: true,
          commander_notes: "Data bridge handles sensitive data transformation and requires strict access controls."
        },
        {
          id: "component-3",
          name: "AI analysis engine",
          access: "authenticated_users",
          credentials: "jwt_token",
          permission_rules: [
            "JWT token validation required",
            "User must have analysis permissions",
            "Rate limiting applied per user"
          ],
          data_flow_security: [
            "Input data must be sanitized",
            "AI model outputs must be validated",
            "User session tracking required"
          ],
          nuclear_doctrine_compliant: true,
          commander_notes: "AI engine requires user authentication and input validation for security."
        },
        {
          id: "component-4",
          name: "User interface",
          access: "public_read",
          credentials: "oauth2_token",
          permission_rules: [
            "Public read access for dashboard",
            "OAuth2 required for user actions",
            "Session timeout after 30 minutes"
          ],
          data_flow_security: [
            "HTTPS required for all connections",
            "CSRF protection enabled",
            "XSS prevention measures active"
          ],
          nuclear_doctrine_compliant: true,
          commander_notes: "UI provides public access with OAuth2 authentication for user actions."
        }
      ],
      nuclear_doctrine_version: 'nuclear_doctrine_v1.2',
      overall_security_level: 'High'
    },
    error_handling: {
      target_table: 'central_error_table',
      schema: [
        {
          field: 'timestamp',
          type: 'datetime',
          required: true,
          description: 'Timestamp when error occurred'
        },
        {
          field: 'component',
          type: 'string',
          required: true,
          description: 'Component where error occurred'
        },
        {
          field: 'error_code',
          type: 'string',
          required: true,
          description: 'Error code identifier'
        },
        {
          field: 'details',
          type: 'string',
          required: false,
          description: 'Detailed error information'
        },
        {
          field: 'user_id',
          type: 'string',
          required: false,
          description: 'User ID if error occurred in user context'
        },
        {
          field: 'severity',
          type: 'string',
          required: true,
          description: 'Error severity level (low, medium, high, critical)'
        },
        {
          field: 'stack_trace',
          type: 'string',
          required: false,
          description: 'Stack trace for debugging'
        }
      ],
      location: '/data/errors/central_error_table',
      nuclear_doctrine_version: 'nuclear_doctrine_v1.2',
      error_categories: ['authentication', 'authorization', 'data_validation', 'system_error', 'network_error'],
      retention_policy: '30 days',
      commander_notes: 'Centralized error handling ensures all errors are captured and analyzed for security threats.'
    },
    healing: {
      agent: 'self_healing_agent_v1',
      doctrine_reference: 'nuclear_doctrine_v1.2',
      escalation_rules: ['retry_operation', 'alert_commander_if_unresolved', 'fallback_to_backup'],
      healing_strategies: [
        'automatic_retry_with_exponential_backoff',
        'circuit_breaker_pattern',
        'graceful_degradation',
        'health_check_monitoring',
        'automatic_restart_on_failure'
      ],
      timeout_settings: '5 minutes',
      nuclear_doctrine_compliant: true,
      commander_notes: 'Self-healing agent provides automated recovery with escalation to commander for unresolved issues.'
    },
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: '1.0.0'
    },
    validation: {
      all_components_secured: true,
      error_handling_defined: true,
      healing_architecture_defined: true,
      nuclear_doctrine_referenced: true,
      commander_signed_off: false,
      ready_for_save: false
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: 'example_generated',
        user,
        details: 'Generated example security configuration'
      }
    ]
  };
} 