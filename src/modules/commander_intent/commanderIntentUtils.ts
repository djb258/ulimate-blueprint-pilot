import { CommanderIntentPayload } from '../../types';

// Convert commander intent payload to YAML format
export function commanderIntentToYaml(payload: CommanderIntentPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
doctrine_reference: ${payload.doctrine_reference}
commander_intent: "${payload.commander_intent.intent.replace(/"/g, '\\"')}"
target_x: "${payload.commander_intent.target_x.replace(/"/g, '\\"')}"
notes: "${payload.commander_intent.notes.replace(/"/g, '\\"')}"
audit: "Declared by ${payload.metadata.created_by} on ${new Date(payload.metadata.created_at).toLocaleDateString()} for ${payload.metadata.build_version}"
`;
  return yaml;
}

// Convert commander intent payload to JSON format
export function commanderIntentToJson(payload: CommanderIntentPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save commander intent configuration to file
export async function saveCommanderIntentConfig(payload: CommanderIntentPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? commanderIntentToYaml(payload) : commanderIntentToJson(payload);
    const filename = format === 'yaml' ? 'commander_intent.yaml' : 'commander_intent.json';
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
    console.log(`Commander intent configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving commander intent configuration:', error);
    throw error;
  }
}

// Generate example commander intent configuration
export function generateExampleCommanderIntent(blueprintId: string, user: string, buildVersion: string): CommanderIntentPayload {
  return {
    blueprint_id: blueprintId,
    doctrine_reference: 'nuclear_doctrine_v1.2',
    commander_intent: {
      id: 'intent-1',
      intent: 'We are building a modular automation system for insurance claims processing.',
      target_x: 'Fully automated, audit-compliant claims processing pipeline.',
      notes: 'Must integrate with existing Neon DB; no external tools without approval.',
      constraints: ['Integrate with Neon DB', 'No external tools without approval'],
      success_criteria: ['Claims processed automatically', 'Audit compliance met'],
      commander_notes: 'This is a high-priority blueprint for Q3.'
    },
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: '1.0.0',
      build_version: buildVersion
    },
    validation: {
      intent_defined: true,
      target_x_defined: true,
      doctrine_referenced: true,
      commander_signed_off: false,
      ready_for_save: false
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: 'example_generated',
        user,
        details: 'Generated example commander intent configuration'
      }
    ]
  };
} 