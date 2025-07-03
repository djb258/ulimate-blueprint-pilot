import { EquationPayload } from '../../types';

// Convert equation payload to YAML format
export function equationToYaml(payload: EquationPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
equation:
  target: "${payload.equation.target}"
  components:
${payload.equation.components.map(component => `    - name: "${component.name}"
      tool: "${component.tool}"
      notes: "${component.notes.replace(/"/g, '\\"')}"${component.externalToolProposal ? `
      external_tool_proposal: "${component.externalToolProposal.replace(/"/g, '\\"')}"` : ''}`).join('\n')}
metadata:
  created_at: ${payload.metadata.created_at}
  updated_at: ${payload.metadata.updated_at}
  created_by: ${payload.metadata.created_by}
  version: ${payload.metadata.version}
validation:
  all_components_have_tools: ${payload.validation.all_components_have_tools}
  external_tools_require_approval: ${payload.validation.external_tools_require_approval}
  target_defined: ${payload.validation.target_defined}
  ready_for_save: ${payload.validation.ready_for_save}
audit_log:
${payload.audit_log.map(log => `  - timestamp: ${log.timestamp}
    action: ${log.action}
    user: ${log.user}${log.details ? `
    details: "${log.details.replace(/"/g, '\\"')}"` : ''}${log.component_id ? `
    component_id: ${log.component_id}` : ''}`).join('\n')}
`;

  return yaml;
}

// Convert equation payload to JSON format
export function equationToJson(payload: EquationPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save equation configuration to file
export async function saveEquationConfig(payload: EquationPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? equationToYaml(payload) : equationToJson(payload);
    const filename = format === 'yaml' ? 'equation.yaml' : 'equation.json';
    
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
    
    console.log(`Equation configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving equation configuration:', error);
    throw error;
  }
}

// Generate example equation configuration
export function generateExampleEquation(blueprintId: string, user: string): EquationPayload {
  return {
    blueprint_id: blueprintId,
    equation: {
      target: "Deploy storage container viability system",
      components: [
        {
          id: "comp-1",
          name: "Market filter",
          tool: "Claude",
          notes: "Uses Claude to apply Phase 0 filters"
        },
        {
          id: "comp-2", 
          name: "Zip scoring",
          tool: "ChatGPT",
          notes: "ChatGPT applies phase logic"
        },
        {
          id: "comp-3",
          name: "Data bridge",
          tool: "Make.com",
          notes: "Bridge between Mindpal + Cursor"
        }
      ]
    },
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: "1.0.0"
    },
    validation: {
      all_components_have_tools: true,
      external_tools_require_approval: false,
      target_defined: true,
      ready_for_save: true
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: "example_generated",
        user,
        details: "Generated example equation configuration"
      }
    ]
  };
} 