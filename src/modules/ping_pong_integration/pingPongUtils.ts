import { PingPongIntegrationPayload } from '../../types';

export function pingPongToYaml(payload: PingPongIntegrationPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
doctrine_reference: ${payload.doctrine_reference}
ping_pong_refinement:
  notes: "${payload.ping_pong_refinement.notes.replace(/"/g, '\\"')}"
  decisions: "${payload.ping_pong_refinement.decisions.replace(/"/g, '\\"')}"
  status: ${payload.ping_pong_refinement.status}
  audit: "Completed by ${payload.metadata.created_by} on ${new Date(payload.metadata.created_at).toLocaleDateString()} for ${payload.metadata.build_version}"
`;
  return yaml;
}

export function pingPongToJson(payload: PingPongIntegrationPayload): string {
  return JSON.stringify(payload, null, 2);
}

export async function savePingPongConfig(payload: PingPongIntegrationPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? pingPongToYaml(payload) : pingPongToJson(payload);
    const filename = format === 'yaml' ? 'ping_pong.yaml' : 'ping_pong.json';
    const blob = new Blob([content], { type: format === 'yaml' ? 'text/yaml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Ping-pong config saved as ${filename}`);
  } catch (error) {
    console.error('Error saving ping-pong config:', error);
    throw error;
  }
}

export function generateExamplePingPongConfig(blueprintId: string, user: string, buildVersion: string): PingPongIntegrationPayload {
  return {
    blueprint_id: blueprintId,
    doctrine_reference: 'nuclear_doctrine_v1.2',
    ping_pong_refinement: {
      notes: 'Refined plan to include Make.com bridge between Mindpal and Cursor.',
      decisions: 'Approved Neon DB for market filter; rejected Firebase external dependency.',
      status: 'complete',
      doctrine_reference: 'nuclear_doctrine_v1.2',
      audit: `Completed by ${user} on ${new Date().toLocaleDateString()} for ${buildVersion}`,
      commander_signed_off: true
    },
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: '1.0.0',
      build_version: buildVersion
    },
    validation: {
      output_present: true,
      commander_signed_off: true,
      ready_for_save: false
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: 'example_generated',
        user,
        details: 'Generated example ping-pong integration config'
      }
    ]
  };
} 