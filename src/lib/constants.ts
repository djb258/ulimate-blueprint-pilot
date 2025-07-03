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