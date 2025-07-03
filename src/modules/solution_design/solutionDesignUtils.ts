import { SolutionDesignPayload } from '../../types';

// Convert solution design payload to YAML format
export function solutionDesignToYaml(payload: SolutionDesignPayload): string {
  const yaml = `---
blueprint_id: ${payload.blueprint_id}
solution_design:
  target_x: "${payload.target_x.replace(/"/g, '\\"')}"
  components:
${payload.equation_components.map(component => `    - name: "${component.name.replace(/"/g, '\\"')}"
      tool: "${component.tool || 'Not selected'}"
      notes: "${component.commander_notes.replace(/"/g, '\\"')}"
      llm_recommendation: "${component.llm_recommendation.replace(/"/g, '\\"')}"
      external_tool_proposal: "${component.external_tool_proposal.replace(/"/g, '\\"')}"
      approval_status: "${component.approval_status}"
      llm_suggestions: [${component.llm_suggestions.map(s => `"${s.replace(/"/g, '\\"')}"`).join(', ')}]
      constraints: [${component.constraints.map(c => `"${c.replace(/"/g, '\\"')}"`).join(', ')}]`).join('\n')}
metadata:
  created_at: ${payload.metadata.created_at}
  updated_at: ${payload.metadata.updated_at}
  created_by: ${payload.metadata.created_by}
  version: ${payload.metadata.version}${payload.metadata.llm_used ? `
  llm_used: ${payload.metadata.llm_used}` : ''}
validation:
  all_components_have_tools: ${payload.validation.all_components_have_tools}
  external_tools_approved: ${payload.validation.external_tools_approved}
  equation_balanced: ${payload.validation.equation_balanced}
  ready_for_save: ${payload.validation.ready_for_save}
audit_log:
${payload.audit_log.map(log => `  - timestamp: ${log.timestamp}
    action: ${log.action}
    user: ${log.user}${log.details ? `
    details: "${log.details.replace(/"/g, '\\"')}"` : ''}${log.component_id ? `
    component_id: ${log.component_id}` : ''}${log.tool_selected ? `
    tool_selected: ${log.tool_selected}` : ''}`).join('\n')}
`;

  return yaml;
}

// Convert solution design payload to JSON format
export function solutionDesignToJson(payload: SolutionDesignPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Save solution design configuration to file
export async function saveSolutionDesignConfig(payload: SolutionDesignPayload, format: 'yaml' | 'json' = 'yaml'): Promise<void> {
  try {
    const content = format === 'yaml' ? solutionDesignToYaml(payload) : solutionDesignToJson(payload);
    const filename = format === 'yaml' ? 'solution_design.yaml' : 'solution_design.json';
    
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
    
    console.log(`Solution design configuration saved as ${filename}`);
  } catch (error) {
    console.error('Error saving solution design configuration:', error);
    throw error;
  }
}

// Generate example solution design configuration
export function generateExampleSolutionDesign(blueprintId: string, user: string): SolutionDesignPayload {
  return {
    blueprint_id: blueprintId,
    target_x: 'Automated market analysis and recommendation system',
    equation_components: [
      {
        id: "component-1",
        name: "Market filter",
        tool: "Neon",
        external_tool_proposal: "",
        llm_recommendation: "LLM suggested Neon for its serverless Postgres capabilities and ease of integration with the existing stack. Neon provides excellent performance for market data storage and querying.",
        commander_notes: "LLM suggested Neon; commander approved. Neon is perfect for our market data needs.",
        requires_approval: false,
        approval_status: "not_required",
        llm_suggestions: [
          "Consider Neon for its serverless architecture",
          "Neon integrates well with Vercel deployment",
          "Postgres provides robust SQL capabilities for market data"
        ],
        constraints: [
          "Must be serverless",
          "Must support real-time data updates",
          "Must integrate with existing authentication"
        ]
      },
      {
        id: "component-2",
        name: "Data bridge",
        tool: "Make.com",
        external_tool_proposal: "",
        llm_recommendation: "LLM recommended Make.com for its powerful automation capabilities and ability to connect multiple data sources. Make.com can handle the complex data transformation and routing needed for market analysis.",
        commander_notes: "LLM suggested Make.com bridge for Mindpal-Cursor integration. Perfect for our automation needs.",
        requires_approval: false,
        approval_status: "not_required",
        llm_suggestions: [
          "Make.com excels at data transformation",
          "Excellent integration with Mindpal and Cursor",
          "Can handle complex workflow automation"
        ],
        constraints: [
          "Must support webhook triggers",
          "Must handle JSON data transformation",
          "Must provide error handling and retry logic"
        ]
      },
      {
        id: "component-3",
        name: "AI analysis engine",
        tool: "Mindpal",
        external_tool_proposal: "",
        llm_recommendation: "LLM recommended Mindpal for its advanced AI capabilities and ability to process market data intelligently. Mindpal can provide insights and recommendations based on the processed data.",
        commander_notes: "Mindpal selected for AI analysis. Provides excellent market insights and recommendations.",
        requires_approval: false,
        approval_status: "not_required",
        llm_suggestions: [
          "Mindpal has excellent market analysis capabilities",
          "Can provide real-time insights and recommendations",
          "Integrates well with our data pipeline"
        ],
        constraints: [
          "Must process data in real-time",
          "Must provide actionable insights",
          "Must support multiple market data sources"
        ]
      },
      {
        id: "component-4",
        name: "User interface",
        tool: "Next.js",
        external_tool_proposal: "",
        llm_recommendation: "LLM recommended Next.js for its excellent React framework capabilities, server-side rendering, and seamless integration with our existing tech stack. Next.js provides the perfect foundation for our market analysis dashboard.",
        commander_notes: "Next.js selected for the frontend. Provides excellent performance and developer experience.",
        requires_approval: false,
        approval_status: "not_required",
        llm_suggestions: [
          "Next.js provides excellent performance",
          "Great developer experience and tooling",
          "Seamless integration with Vercel deployment"
        ],
        constraints: [
          "Must be responsive and mobile-friendly",
          "Must support real-time data updates",
          "Must provide excellent user experience"
        ]
      },
      {
        id: "component-5",
        name: "Custom analytics API",
        tool: null,
        external_tool_proposal: "Custom Python FastAPI service for advanced analytics",
        llm_recommendation: "LLM suggested a custom analytics API for advanced market analysis algorithms that aren't available in off-the-shelf solutions. This would provide unique competitive advantages.",
        commander_notes: "Custom API proposed for advanced analytics. Requires commander approval for development resources.",
        requires_approval: true,
        approval_status: "pending",
        llm_suggestions: [
          "Custom API can provide unique analytics capabilities",
          "Python FastAPI offers excellent performance",
          "Can implement proprietary algorithms"
        ],
        constraints: [
          "Must be developed in-house",
          "Requires additional development time",
          "Must integrate with existing authentication"
        ]
      }
    ],
    metadata: {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: user,
      version: "1.0.0",
      llm_used: "Claude-3.5-Sonnet"
    },
    validation: {
      all_components_have_tools: true,
      external_tools_approved: false,
      equation_balanced: true,
      ready_for_save: false
    },
    audit_log: [
      {
        timestamp: new Date().toISOString(),
        action: "example_generated",
        user,
        details: "Generated example solution design configuration"
      }
    ]
  };
} 