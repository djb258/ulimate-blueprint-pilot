import { LogicManifest } from '../modules/logic_manifest/logicManifestTypes';

export interface BlueprintOutput {
  content: string;
  format: 'yaml' | 'json' | 'typescript' | 'javascript' | 'python' | 'sql';
  metadata?: Record<string, unknown>;
}

export interface EmbeddedBlueprintOutput extends BlueprintOutput {
  embeddedManifest: LogicManifest;
  manifestEmbeddedAt: string;
}

/**
 * Embeds a logic manifest in blueprint output content
 */
export function embedLogicManifestInOutput(
  output: BlueprintOutput,
  manifest: LogicManifest
): EmbeddedBlueprintOutput {
  const manifestHeader = generateManifestHeader(manifest, output.format);
  const embeddedContent = manifestHeader + '\n\n' + output.content;

  return {
    ...output,
    content: embeddedContent,
    embeddedManifest: manifest,
    manifestEmbeddedAt: new Date().toISOString()
  };
}

/**
 * Generates appropriate manifest header based on output format
 */
function generateManifestHeader(manifest: LogicManifest, format: string): string {
  const baseInfo = `LOGIC MANIFEST EMBEDDED
Version: ${manifest.version}
Build Agent: ${manifest.buildAgent}
Doctrine Reference: ${manifest.doctrineReference}
Generated At: ${manifest.generatedAt}
Embedded At: ${new Date().toISOString()}

This output is generated according to the embedded logic manifest.
No modifications should be made beyond the manifest specifications.`;

  switch (format) {
    case 'yaml':
      return `# ${baseInfo.replace(/\n/g, '\n# ')}`;
    
    case 'json':
      return `/* ${baseInfo} */`;
    
    case 'typescript':
    case 'javascript':
      return `/**
 * ${baseInfo.replace(/\n/g, '\n * ')}
 */`;
    
    case 'python':
      return `"""
${baseInfo}
"""`;
    
    case 'sql':
      return `-- ${baseInfo.replace(/\n/g, '\n-- ')}`;
    
    default:
      return `/* ${baseInfo} */`;
  }
}

/**
 * Extracts logic manifest from embedded output
 */
export function extractLogicManifestFromOutput(
  output: string
): LogicManifest | null {
  // Look for manifest header patterns
  const patterns = [
    /LOGIC MANIFEST EMBEDDED[\s\S]*?Generated At: ([^\n]+)/,
    /# LOGIC MANIFEST EMBEDDED[\s\S]*?# Generated At: ([^\n]+)/,
    /\/\* LOGIC MANIFEST EMBEDDED[\s\S]*?Generated At: ([^\n]+)/,
    /\/\*\*[\s\S]*?\* LOGIC MANIFEST EMBEDDED[\s\S]*?\* Generated At: ([^\n]+)/,
    /"""[\s\S]*?LOGIC MANIFEST EMBEDDED[\s\S]*?Generated At: ([^\n]+)/,
    /-- LOGIC MANIFEST EMBEDDED[\s\S]*?-- Generated At: ([^\n]+)/
  ];

  for (const pattern of patterns) {
    const match = output.match(pattern);
    if (match) {
      return extractManifestInfo(output);
    }
  }

  return null;
}

/**
 * Extracts manifest information from output content
 */
function extractManifestInfo(output: string): LogicManifest | null {
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

/**
 * Validates that output contains required manifest information
 */
export function validateEmbeddedManifest(output: string): {
  valid: boolean;
  errors: string[];
  manifest: LogicManifest | null;
} {
  const manifest = extractLogicManifestFromOutput(output);
  const errors: string[] = [];

  if (!manifest) {
    errors.push('No logic manifest found in output');
    return { valid: false, errors, manifest: null };
  }

  if (!manifest.version) {
    errors.push('Manifest version is required');
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

  return {
    valid: errors.length === 0,
    errors,
    manifest
  };
}

/**
 * Creates a manifest-compliant output wrapper
 */
export function createManifestCompliantOutput(
  content: string,
  format: string,
  manifest: LogicManifest,
  metadata?: Record<string, unknown>
): EmbeddedBlueprintOutput {
  return embedLogicManifestInOutput(
    {
      content,
      format: format as 'yaml' | 'json' | 'typescript' | 'javascript' | 'python' | 'sql',
      metadata
    },
    manifest
  );
} 