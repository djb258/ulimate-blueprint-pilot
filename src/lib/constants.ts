// Application constants following Barton Doctrine principles

export const APP_CONFIG = {
  name: 'Ultimate Blueprint Pilot',
  version: '1.0.0',
  description: 'Cockpit for designing micro-engineered blueprints',
  author: 'djb258',
  repository: 'https://github.com/djb258/ulimate-blueprint-pilot.git',
  vercelUrl: 'ulimate-blueprint-pilot.vercel.app',
} as const;

export const API_ENDPOINTS = {
  blueprints: '/api/blueprints',
  prompts: '/api/prompts',
  reengineering: '/api/reengineering',
  analysis: '/api/analysis',
} as const;

export const PHASE_CONFIG = {
  PLAN: {
    id: 'plan',
    name: 'PLAN',
    description: 'Define project scope, requirements, and high-level architecture',
    estimatedDuration: 120, // 2 hours
    requirements: [
      'Project requirements document',
      'High-level architecture diagram',
      'Technology stack selection',
      'Timeline and milestones'
    ],
    deliverables: [
      'Requirements specification',
      'Architecture overview',
      'Technology decisions log',
      'Project timeline'
    ]
  },
  EQUATION: {
    id: 'equation',
    name: 'EQUATION',
    description: 'Define the component equation and tool assignments for the blueprint',
    estimatedDuration: 60, // 1 hour
    requirements: [
      'Component identification',
      'Tool selection from approved stack',
      'Component notes and constraints',
      'External tool approval requests'
    ],
    deliverables: [
      'Equation configuration file',
      'Tool assignment matrix',
      'Component documentation',
      'Approval tracking for external tools'
    ]
  },
  CONSTANTS_VARIABLES: {
    id: 'constants-variables',
    name: 'CONSTANTS + VARIABLES',
    description: 'Define system constants and dynamic variables for the blueprint architecture',
    estimatedDuration: 45, // 45 minutes
    requirements: [
      'System constant identification',
      'Variable type definitions',
      'Required vs optional variables',
      'Default value assignments'
    ],
    deliverables: [
      'Constants configuration file',
      'Variables schema definition',
      'Type validation rules',
      'Default value documentation'
    ]
  },
  DATA_SOURCE_MAPPING: {
    id: 'data-source-mapping',
    name: 'DATA SOURCE MAPPING',
    description: 'Define data sources and mapping rules for constants and variables',
    estimatedDuration: 60, // 1 hour
    requirements: [
      'Data source type identification',
      'Doctrine acronym assignment',
      'Validation method definition',
      'Failover rule configuration',
      'Nuclear doctrine compliance for writeable destinations'
    ],
    deliverables: [
      'Data source mapping configuration',
      'Doctrine compliance documentation',
      'Validation and failover rules',
      'Audit trail for all mappings'
    ]
  },
  SOLUTION_DESIGN: {
    id: 'solution-design',
    name: 'SOLUTION DESIGN',
    description: 'Commander-LLM collaboration to solve the equation with tool selection',
    estimatedDuration: 90, // 1.5 hours
    requirements: [
      'Equation component identification',
      'Tool selection for each component',
      'LLM recommendation integration',
      'Commander approval workflow',
      'External tool proposal handling'
    ],
    deliverables: [
      'Solution design configuration',
      'Tool selection documentation',
      'LLM collaboration audit trail',
      'Commander approval records'
    ]
  },
  SECURITY: {
    id: 'security',
    name: 'SECURITY',
    description: 'Define security requirements, error handling, and healing architecture',
    estimatedDuration: 75, // 1.25 hours
    requirements: [
      'Security requirements for each component',
      'Access controls and credential enforcement',
      'Centralized error handling architecture',
      'Healing agent assignment and escalation rules',
      'Nuclear doctrine compliance verification'
    ],
    deliverables: [
      'Security configuration',
      'Error handling architecture spec',
      'Healing agent configuration',
      'Commander sign-off documentation'
    ]
  },
  COMMANDER_INTENT: {
    id: 'commander-intent',
    name: 'COMMANDER INTENT',
    description: 'Define broad intent and target X for the blueprint',
    estimatedDuration: 30, // 30 minutes
    requirements: [
      'Commander intent definition',
      'Target X specification',
      'Notes and constraints',
      'Doctrine reference',
      'Commander sign-off'
    ],
    deliverables: [
      'Commander intent configuration',
      'Target X definition',
      'Success criteria',
      'Audit trail'
    ]
  },
  PING_PONG_INTEGRATION: {
    id: 'ping-pong-integration',
    name: 'PING-PONG INTEGRATION',
    description: 'Integrate and lock in output from the external ping-pong service',
    estimatedDuration: 20, // 20 minutes
    requirements: [
      'Link to ping-pong service',
      'Display refinement status',
      'Accept ping-pong output',
      'Commander sign-off',
      'Doctrine reference',
      'Audit tag'
    ],
    deliverables: [
      'Ping-pong output configuration',
      'Refinement notes and decisions',
      'Commander sign-off record',
      'Audit trail'
    ]
  },
  SCAFFOLD: {
    id: 'scaffold',
    name: 'SCAFFOLD',
    description: 'Set up project structure and initial configuration',
    estimatedDuration: 90, // 1.5 hours
    requirements: [
      'Development environment setup',
      'Project initialization',
      'Basic configuration files',
      'Dependency management'
    ],
    deliverables: [
      'Initialized project structure',
      'Configuration files',
      'Package.json with dependencies',
      'Development environment guide'
    ]
  },
  FILE_STRUCTURE: {
    id: 'file-structure',
    name: 'FILE STRUCTURE',
    description: 'Organize codebase with proper directory structure',
    estimatedDuration: 60, // 1 hour
    requirements: [
      'Directory organization plan',
      'Naming conventions',
      'Module separation strategy',
      'Asset organization'
    ],
    deliverables: [
      'Directory structure diagram',
      'Naming convention guide',
      'Module organization plan',
      'Asset management strategy'
    ]
  },
  TEST_PLAN: {
    id: 'test-plan',
    name: 'TEST PLAN',
    description: 'Define testing strategy and coverage requirements',
    estimatedDuration: 90, // 1.5 hours
    requirements: [
      'Testing framework selection',
      'Coverage requirements',
      'Test organization strategy',
      'CI/CD integration plan'
    ],
    deliverables: [
      'Testing strategy document',
      'Coverage configuration',
      'Test organization guide',
      'CI/CD pipeline setup'
    ]
  },
  SECURITY_PLAN: {
    id: 'security-plan',
    name: 'SECURITY PLAN',
    description: 'Implement security measures and best practices',
    estimatedDuration: 120, // 2 hours
    requirements: [
      'Security audit checklist',
      'Authentication strategy',
      'Authorization rules',
      'Data protection measures'
    ],
    deliverables: [
      'Security implementation guide',
      'Authentication setup',
      'Authorization configuration',
      'Security testing plan'
    ]
  },
  PHASE_GATES: {
    id: 'phase-gates',
    name: 'PHASE GATES / PROMOTION RULES',
    description: 'Establish deployment and promotion criteria',
    estimatedDuration: 60, // 1 hour
    requirements: [
      'Deployment strategy',
      'Environment configuration',
      'Promotion criteria',
      'Rollback procedures'
    ],
    deliverables: [
      'Deployment pipeline configuration',
      'Environment setup guide',
      'Promotion criteria document',
      'Rollback procedures'
    ]
  },
  FINALIZE: {
    id: 'finalize',
    name: 'FINALIZE BLUEPRINT',
    description: 'Complete documentation and final review',
    estimatedDuration: 90, // 1.5 hours
    requirements: [
      'Documentation completion',
      'Code review process',
      'Final testing',
      'Deployment preparation'
    ],
    deliverables: [
      'Complete documentation',
      'Code review checklist',
      'Final test results',
      'Deployment guide'
    ]
  }
} as const;

export const STATUS_CONFIG = {
  not_started: {
    color: 'bg-red-400',
    label: 'Not Started',
    icon: '🔴',
    description: 'Phase has not been initiated'
  },
  in_progress: {
    color: 'bg-yellow-400',
    label: 'In Progress',
    icon: '🟡',
    description: 'Phase is currently being worked on'
  },
  completed: {
    color: 'bg-green-500',
    label: 'Completed',
    icon: '🟢',
    description: 'Phase has been successfully completed'
  },
  blocked: {
    color: 'bg-gray-400',
    label: 'Blocked',
    icon: '⚫',
    description: 'Phase is blocked by dependencies or issues'
  }
} as const;

export const PROMPT_CATEGORIES = {
  planning: {
    label: 'Planning',
    description: 'Project planning and requirements gathering',
    color: 'bg-blue-100 text-blue-800'
  },
  scaffolding: {
    label: 'Scaffolding',
    description: 'Project setup and initialization',
    color: 'bg-green-100 text-green-800'
  },
  architecture: {
    label: 'Architecture',
    description: 'System design and architecture decisions',
    color: 'bg-purple-100 text-purple-800'
  },
  testing: {
    label: 'Testing',
    description: 'Testing strategies and implementation',
    color: 'bg-orange-100 text-orange-800'
  },
  security: {
    label: 'Security',
    description: 'Security measures and best practices',
    color: 'bg-red-100 text-red-800'
  },
  deployment: {
    label: 'Deployment',
    description: 'Deployment and CI/CD configuration',
    color: 'bg-indigo-100 text-indigo-800'
  },
  documentation: {
    label: 'Documentation',
    description: 'Documentation and code comments',
    color: 'bg-gray-100 text-gray-800'
  },
  general: {
    label: 'General',
    description: 'General development prompts',
    color: 'bg-gray-100 text-gray-800'
  }
} as const;

export const ISSUE_SEVERITY = {
  low: {
    label: 'Low',
    color: 'bg-green-100 text-green-800',
    priority: 1
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    priority: 2
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    priority: 3
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    priority: 4
  }
} as const;

export const EFFORT_LEVELS = {
  low: {
    label: 'Low',
    description: 'Quick fixes and minor changes',
    color: 'bg-green-100 text-green-800'
  },
  medium: {
    label: 'Medium',
    description: 'Moderate refactoring and improvements',
    color: 'bg-yellow-100 text-yellow-800'
  },
  high: {
    label: 'High',
    description: 'Major architectural changes',
    color: 'bg-red-100 text-red-800'
  }
} as const;

export const IMPACT_LEVELS = {
  low: {
    label: 'Low',
    description: 'Minor improvements',
    color: 'bg-gray-100 text-gray-800'
  },
  medium: {
    label: 'Medium',
    description: 'Noticeable improvements',
    color: 'bg-blue-100 text-blue-800'
  },
  high: {
    label: 'High',
    description: 'Significant improvements',
    color: 'bg-purple-100 text-purple-800'
  }
} as const;

export const COMPLEXITY_LEVELS = {
  simple: {
    label: 'Simple',
    description: 'Basic project with minimal complexity',
    estimatedTime: '1-2 days',
    color: 'bg-green-100 text-green-800'
  },
  moderate: {
    label: 'Moderate',
    description: 'Standard project with typical complexity',
    estimatedTime: '3-5 days',
    color: 'bg-yellow-100 text-yellow-800'
  },
  complex: {
    label: 'Complex',
    description: 'Advanced project with high complexity',
    estimatedTime: '1-2 weeks',
    color: 'bg-red-100 text-red-800'
  }
} as const;

export const TECHNOLOGIES = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Firebase',
  'Supabase',
  'Tailwind CSS',
  'Material-UI',
  'Ant Design',
  'Jest',
  'Cypress',
  'Playwright',
  'GitHub Actions',
  'CircleCI',
  'Jenkins',
  'Vercel',
  'Netlify',
  'Heroku'
] as const;

export const APPROVED_TOOLS = {
  ChatGPT: {
    label: 'ChatGPT',
    description: 'OpenAI\'s conversational AI for text generation and analysis',
    category: 'AI/ML',
    color: 'bg-green-100 text-green-800'
  },
  Claude: {
    label: 'Claude',
    description: 'Anthropic\'s AI assistant for reasoning and analysis',
    category: 'AI/ML',
    color: 'bg-blue-100 text-blue-800'
  },
  Abacus: {
    label: 'Abacus',
    description: 'Mathematical computation and calculation tool',
    category: 'Computation',
    color: 'bg-purple-100 text-purple-800'
  },
  APIFY: {
    label: 'APIFY',
    description: 'Web scraping and automation platform',
    category: 'Automation',
    color: 'bg-orange-100 text-orange-800'
  },
  'Make.com': {
    label: 'Make.com',
    description: 'Visual workflow automation platform',
    category: 'Automation',
    color: 'bg-indigo-100 text-indigo-800'
  },
  Mindpal: {
    label: 'Mindpal',
    description: 'AI-powered workflow and task management',
    category: 'Productivity',
    color: 'bg-pink-100 text-pink-800'
  },
  Deerflow: {
    label: 'Deerflow',
    description: 'Data flow and pipeline management',
    category: 'Data',
    color: 'bg-teal-100 text-teal-800'
  },
  Firebase: {
    label: 'Firebase',
    description: 'Google\'s app development platform',
    category: 'Backend',
    color: 'bg-yellow-100 text-yellow-800'
  },
  Neon: {
    label: 'Neon',
    description: 'Serverless Postgres database',
    category: 'Database',
    color: 'bg-cyan-100 text-cyan-800'
  },
  Render: {
    label: 'Render',
    description: 'Cloud application hosting platform',
    category: 'Hosting',
    color: 'bg-gray-100 text-gray-800'
  },
  external_approval_required: {
    label: 'External Tool (Approval Required)',
    description: 'Propose external tool for commander approval',
    category: 'External',
    color: 'bg-red-100 text-red-800'
  }
} as const;

export const DATA_SOURCE_TYPES = {
  'API': {
    label: 'API',
    description: 'REST or GraphQL API endpoint',
    category: 'External',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'FTP': {
    label: 'FTP',
    description: 'File Transfer Protocol server',
    category: 'File Transfer',
    color: 'bg-green-100 text-green-800',
    requires_approval: false
  },
  'Neon DB': {
    label: 'Neon DB',
    description: 'Serverless Postgres database',
    category: 'Database',
    color: 'bg-cyan-100 text-cyan-800',
    requires_approval: true
  },
  'Firebase': {
    label: 'Firebase',
    description: 'Google Firebase database',
    category: 'Database',
    color: 'bg-yellow-100 text-yellow-800',
    requires_approval: true
  },
  'BigQuery': {
    label: 'BigQuery',
    description: 'Google BigQuery data warehouse',
    category: 'Database',
    color: 'bg-purple-100 text-purple-800',
    requires_approval: true
  },
  'Commander runtime input': {
    label: 'Commander Runtime Input',
    description: 'User input provided at runtime',
    category: 'User Input',
    color: 'bg-orange-100 text-orange-800',
    requires_approval: false
  },
  'File system': {
    label: 'File System',
    description: 'Local or network file system',
    category: 'Storage',
    color: 'bg-gray-100 text-gray-800',
    requires_approval: false
  },
  'Environment variable': {
    label: 'Environment Variable',
    description: 'System environment variable',
    category: 'System',
    color: 'bg-indigo-100 text-indigo-800',
    requires_approval: false
  },
  'Configuration file': {
    label: 'Configuration File',
    description: 'Configuration file (JSON, YAML, etc.)',
    category: 'Configuration',
    color: 'bg-pink-100 text-pink-800',
    requires_approval: false
  },
  'External service': {
    label: 'External Service',
    description: 'Third-party service integration',
    category: 'External',
    color: 'bg-red-100 text-red-800',
    requires_approval: true
  }
} as const;

export const DOCTRINE_ACRONYMS = {
  'STAMPED': {
    label: 'STAMPED',
    description: 'Structured, Typed, Audited, Managed, Protected, Encrypted, Documented',
    category: 'Database',
    color: 'bg-blue-100 text-blue-800'
  },
  'SPVPET': {
    label: 'SPVPET',
    description: 'Secure, Validated, Protected, Verified, Encrypted, Trusted',
    category: 'Security',
    color: 'bg-green-100 text-green-800'
  },
  'STACKED': {
    label: 'STACKED',
    description: 'Secure, Typed, Audited, Controlled, Keyed, Encrypted, Documented',
    category: 'Database',
    color: 'bg-purple-100 text-purple-800'
  },
  'N/A': {
    label: 'N/A',
    description: 'Not applicable for this data source type',
    category: 'None',
    color: 'bg-gray-100 text-gray-600'
  }
} as const;

export const VALIDATION_METHODS = {
  'type check': {
    label: 'Type Check',
    description: 'Validate data type matches expected type',
    color: 'bg-blue-100 text-blue-800'
  },
  'range check': {
    label: 'Range Check',
    description: 'Validate value is within acceptable range',
    color: 'bg-green-100 text-green-800'
  },
  'schema validation': {
    label: 'Schema Validation',
    description: 'Validate against predefined schema',
    color: 'bg-purple-100 text-purple-800'
  },
  'format validation': {
    label: 'Format Validation',
    description: 'Validate data format (email, URL, etc.)',
    color: 'bg-orange-100 text-orange-800'
  },
  'custom validation': {
    label: 'Custom Validation',
    description: 'Custom validation logic',
    color: 'bg-red-100 text-red-800'
  },
  'none': {
    label: 'None',
    description: 'No validation required',
    color: 'bg-gray-100 text-gray-600'
  }
} as const;

export const FAILOVER_RULES = {
  'default value': {
    label: 'Default Value',
    description: 'Use predefined default value',
    color: 'bg-blue-100 text-blue-800'
  },
  'alternate source': {
    label: 'Alternate Source',
    description: 'Try alternative data source',
    color: 'bg-green-100 text-green-800'
  },
  'error out': {
    label: 'Error Out',
    description: 'Throw error and stop execution',
    color: 'bg-red-100 text-red-800'
  },
  'retry with backoff': {
    label: 'Retry with Backoff',
    description: 'Retry with exponential backoff',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'prompt user for input again': {
    label: 'Prompt User Again',
    description: 'Ask user to provide input again',
    color: 'bg-orange-100 text-orange-800'
  },
  'skip operation': {
    label: 'Skip Operation',
    description: 'Skip this operation and continue',
    color: 'bg-gray-100 text-gray-800'
  }
} as const;

export const SOLUTION_DESIGN_TOOLS = {
  'Neon': {
    label: 'Neon',
    description: 'Serverless Postgres database',
    category: 'Database',
    color: 'bg-cyan-100 text-cyan-800',
    requires_approval: false
  },
  'Firebase': {
    label: 'Firebase',
    description: 'Google Firebase platform',
    category: 'Backend',
    color: 'bg-yellow-100 text-yellow-800',
    requires_approval: false
  },
  'BigQuery': {
    label: 'BigQuery',
    description: 'Google BigQuery data warehouse',
    category: 'Analytics',
    color: 'bg-purple-100 text-purple-800',
    requires_approval: false
  },
  'Make.com': {
    label: 'Make.com',
    description: 'Automation and integration platform',
    category: 'Integration',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'Zapier': {
    label: 'Zapier',
    description: 'Workflow automation platform',
    category: 'Integration',
    color: 'bg-orange-100 text-orange-800',
    requires_approval: false
  },
  'Cursor': {
    label: 'Cursor',
    description: 'AI-powered code editor',
    category: 'Development',
    color: 'bg-green-100 text-green-800',
    requires_approval: false
  },
  'Mindpal': {
    label: 'Mindpal',
    description: 'AI assistant and automation',
    category: 'AI',
    color: 'bg-indigo-100 text-indigo-800',
    requires_approval: false
  },
  'Claude': {
    label: 'Claude',
    description: 'Anthropic AI assistant',
    category: 'AI',
    color: 'bg-pink-100 text-pink-800',
    requires_approval: false
  },
  'GPT': {
    label: 'GPT',
    description: 'OpenAI GPT models',
    category: 'AI',
    color: 'bg-emerald-100 text-emerald-800',
    requires_approval: false
  },
  'Vercel': {
    label: 'Vercel',
    description: 'Deployment and hosting platform',
    category: 'Deployment',
    color: 'bg-black text-white',
    requires_approval: false
  },
  'Next.js': {
    label: 'Next.js',
    description: 'React framework',
    category: 'Frontend',
    color: 'bg-gray-100 text-gray-800',
    requires_approval: false
  },
  'React': {
    label: 'React',
    description: 'JavaScript library for UI',
    category: 'Frontend',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'TypeScript': {
    label: 'TypeScript',
    description: 'Typed JavaScript',
    category: 'Language',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'Tailwind CSS': {
    label: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
    category: 'Styling',
    color: 'bg-cyan-100 text-cyan-800',
    requires_approval: false
  },
  'PostgreSQL': {
    label: 'PostgreSQL',
    description: 'Relational database',
    category: 'Database',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'MongoDB': {
    label: 'MongoDB',
    description: 'NoSQL database',
    category: 'Database',
    color: 'bg-green-100 text-green-800',
    requires_approval: false
  },
  'Redis': {
    label: 'Redis',
    description: 'In-memory data store',
    category: 'Cache',
    color: 'bg-red-100 text-red-800',
    requires_approval: false
  },
  'AWS Lambda': {
    label: 'AWS Lambda',
    description: 'Serverless compute',
    category: 'Cloud',
    color: 'bg-orange-100 text-orange-800',
    requires_approval: false
  },
  'Google Cloud Functions': {
    label: 'Google Cloud Functions',
    description: 'Serverless compute',
    category: 'Cloud',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  },
  'Azure Functions': {
    label: 'Azure Functions',
    description: 'Serverless compute',
    category: 'Cloud',
    color: 'bg-blue-100 text-blue-800',
    requires_approval: false
  }
} as const;

export const VALIDATION_RULES = {
  blueprint: {
    name: {
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_]+$/
    },
    description: {
      minLength: 10,
      maxLength: 500
    }
  },
  prompt: {
    title: {
      minLength: 5,
      maxLength: 100
    },
    content: {
      minLength: 20,
      maxLength: 5000
    }
  },
  repository: {
    url: {
      pattern: /^https:\/\/github\.com\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+$/
    }
  }
} as const;

export const STORAGE_KEYS = {
  currentBlueprint: 'ubp_current_blueprint',
  userPreferences: 'ubp_user_preferences',
  recentPrompts: 'ubp_recent_prompts',
  savedProjects: 'ubp_saved_projects'
} as const;

export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection and try again.',
  validation: 'Please check your input and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'An unexpected error occurred. Please try again later.',
  timeout: 'Request timed out. Please try again.',
  invalidRepository: 'Please enter a valid GitHub repository URL.',
  analysisFailed: 'Repository analysis failed. Please check the URL and try again.'
} as const;

export const SUCCESS_MESSAGES = {
  blueprintCreated: 'Blueprint created successfully!',
  blueprintUpdated: 'Blueprint updated successfully!',
  promptSaved: 'Prompt saved successfully!',
  analysisStarted: 'Repository analysis started successfully!',
  analysisCompleted: 'Repository analysis completed!',
  phaseCompleted: 'Phase completed successfully!'
} as const;

export const SECURITY_ACCESS_LEVELS = {
  'commander_only': {
    label: 'Commander Only',
    description: 'Access restricted to commander only',
    color: 'bg-red-100 text-red-800',
    security_level: 'Maximum'
  },
  'authenticated_users': {
    label: 'Authenticated Users',
    description: 'Access for authenticated users only',
    color: 'bg-orange-100 text-orange-800',
    security_level: 'High'
  },
  'public_read': {
    label: 'Public Read',
    description: 'Public read access, write restricted',
    color: 'bg-yellow-100 text-yellow-800',
    security_level: 'Medium'
  },
  'service_account': {
    label: 'Service Account',
    description: 'Access via service account credentials',
    color: 'bg-blue-100 text-blue-800',
    security_level: 'High'
  },
  'admin_only': {
    label: 'Admin Only',
    description: 'Access restricted to administrators',
    color: 'bg-purple-100 text-purple-800',
    security_level: 'Maximum'
  },
  'restricted_access': {
    label: 'Restricted Access',
    description: 'Custom restricted access rules',
    color: 'bg-gray-100 text-gray-800',
    security_level: 'Variable'
  }
} as const;

export const SECURITY_CREDENTIAL_TYPES = {
  'neon_service_account': {
    label: 'Neon Service Account',
    description: 'Neon database service account credentials',
    color: 'bg-cyan-100 text-cyan-800'
  },
  'firebase_auth': {
    label: 'Firebase Auth',
    description: 'Firebase authentication tokens',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'oauth2_token': {
    label: 'OAuth2 Token',
    description: 'OAuth2 authentication tokens',
    color: 'bg-green-100 text-green-800'
  },
  'api_key': {
    label: 'API Key',
    description: 'API key authentication',
    color: 'bg-blue-100 text-blue-800'
  },
  'jwt_token': {
    label: 'JWT Token',
    description: 'JSON Web Token authentication',
    color: 'bg-purple-100 text-purple-800'
  },
  'custom_credentials': {
    label: 'Custom Credentials',
    description: 'Custom authentication method',
    color: 'bg-gray-100 text-gray-800'
  }
} as const;

export const HEALING_AGENTS = {
  'self_healing_agent_v1': {
    label: 'Self Healing Agent v1',
    description: 'Primary self-healing agent with automated recovery',
    color: 'bg-green-100 text-green-800',
    capabilities: ['Automatic retry', 'Circuit breaker', 'Health monitoring']
  },
  'automated_recovery_agent': {
    label: 'Automated Recovery Agent',
    description: 'Specialized agent for system recovery',
    color: 'bg-blue-100 text-blue-800',
    capabilities: ['System restart', 'Configuration recovery', 'Data restoration']
  },
  'circuit_breaker_agent': {
    label: 'Circuit Breaker Agent',
    description: 'Agent for handling cascading failures',
    color: 'bg-orange-100 text-orange-800',
    capabilities: ['Failure isolation', 'Graceful degradation', 'Service protection']
  },
  'health_check_agent': {
    label: 'Health Check Agent',
    description: 'Agent for monitoring system health',
    color: 'bg-purple-100 text-purple-800',
    capabilities: ['Health monitoring', 'Performance tracking', 'Alert generation']
  },
  'custom_healing_agent': {
    label: 'Custom Healing Agent',
    description: 'Custom healing agent implementation',
    color: 'bg-gray-100 text-gray-800',
    capabilities: ['Custom strategies', 'Flexible configuration', 'Specialized handling']
  }
} as const;

export const ESCALATION_LEVELS = {
  'retry_operation': {
    label: 'Retry Operation',
    description: 'Retry the failed operation',
    color: 'bg-blue-100 text-blue-800',
    priority: 'Low'
  },
  'alert_commander_if_unresolved': {
    label: 'Alert Commander',
    description: 'Alert commander if issue remains unresolved',
    color: 'bg-yellow-100 text-yellow-800',
    priority: 'Medium'
  },
  'fallback_to_backup': {
    label: 'Fallback to Backup',
    description: 'Switch to backup system or configuration',
    color: 'bg-orange-100 text-orange-800',
    priority: 'High'
  },
  'shutdown_component': {
    label: 'Shutdown Component',
    description: 'Gracefully shutdown the problematic component',
    color: 'bg-red-100 text-red-800',
    priority: 'Critical'
  },
  'manual_intervention_required': {
    label: 'Manual Intervention',
    description: 'Require manual intervention by commander',
    color: 'bg-purple-100 text-purple-800',
    priority: 'Emergency'
  }
} as const;

export const DOCTRINE_VERSIONS = {
  'nuclear_doctrine_v1.0': {
    label: 'Nuclear Doctrine v1.0',
    description: 'Initial nuclear doctrine version',
    color: 'bg-blue-100 text-blue-800',
    release_date: '2024-01-01'
  },
  'nuclear_doctrine_v1.1': {
    label: 'Nuclear Doctrine v1.1',
    description: 'Updated nuclear doctrine with enhanced protocols',
    color: 'bg-green-100 text-green-800',
    release_date: '2024-06-01'
  },
  'nuclear_doctrine_v1.2': {
    label: 'Nuclear Doctrine v1.2',
    description: 'Latest nuclear doctrine with comprehensive guidelines',
    color: 'bg-purple-100 text-purple-800',
    release_date: '2025-01-01'
  },
  'nuclear_doctrine_v2.0': {
    label: 'Nuclear Doctrine v2.0',
    description: 'Next generation nuclear doctrine (preview)',
    color: 'bg-orange-100 text-orange-800',
    release_date: '2025-07-01'
  }
} as const; 