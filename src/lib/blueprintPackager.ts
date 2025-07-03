// Blueprint packaging system for final blueprint generation
// Handles version pinning, commander approval, and validation

import { validateFinalBlueprint, SchemaValidationResult } from './schemas';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface BlueprintPackageConfig {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  commander: string;
  approval_notes: string;
  output_dir?: string;
}

export interface FinalBlueprint {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  commander_approval: {
    commander: string;
    timestamp: string;
    signature: string;
    approval_notes: string;
  };
  timestamp: string;
  modules: {
    commander_intent: {
      file_path: string;
      validated: boolean;
      last_updated: string;
    };
    data_source_mapping: {
      file_path: string;
      validated: boolean;
      last_updated: string;
    };
    solution_design: {
      file_path: string;
      validated: boolean;
      last_updated: string;
    };
    security: {
      file_path: string;
      validated: boolean;
      last_updated: string;
    };
    ping_pong_integration: {
      file_path: string;
      validated: boolean;
      last_updated: string;
    };
  };
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    total_modules: number;
    validation_status: 'pending' | 'validated' | 'failed';
  };
}

export interface ModuleValidationResult {
  module: string;
  file_path: string;
  exists: boolean;
  validated: boolean;
  last_updated: string;
  errors: string[];
}

export class BlueprintPackager {
  private config: BlueprintPackageConfig;
  private outputDir: string;

  constructor(config: BlueprintPackageConfig) {
    this.config = config;
    this.outputDir = config.output_dir || 'blueprints';
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Validate all module files exist and are properly formatted
   */
  validateModules(): ModuleValidationResult[] {
    const moduleFiles = [
      { name: 'commander_intent', path: 'config/commander_intent.yaml' },
      { name: 'data_source_mapping', path: 'config/data_source_mapping.yaml' },
      { name: 'solution_design', path: 'config/solution_design.yaml' },
      { name: 'security', path: 'config/security.yaml' },
      { name: 'ping_pong_integration', path: 'config/ping_pong.yaml' }
    ];

    const results: ModuleValidationResult[] = [];

    for (const moduleFile of moduleFiles) {
      const filePath = moduleFile.path;
      const exists = fs.existsSync(filePath);
      let validated = false;
      let lastUpdated = '';
      const errors: string[] = [];

      if (exists) {
        try {
          const stats = fs.statSync(filePath);
          lastUpdated = stats.mtime.toISOString();

          // Read and parse YAML
          const content = fs.readFileSync(filePath, 'utf8');
          const data = yaml.load(content) as Record<string, unknown>;

          // Basic validation - check for required fields
          if (data && typeof data === 'object') {
            const requiredFields = ['blueprint_id', 'doctrine_reference', 'version'];
            const missingFields = requiredFields.filter(field => !data[field]);
            
            if (missingFields.length === 0) {
              validated = true;
            } else {
              errors.push(`Missing required fields: ${missingFields.join(', ')}`);
            }
          } else {
            errors.push('Invalid YAML format');
          }
        } catch (error) {
          errors.push(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        errors.push('File does not exist');
      }

      results.push({
        module: moduleFile.name,
        file_path: filePath,
        exists,
        validated,
        last_updated: lastUpdated,
        errors
      });
    }

    return results;
  }

  /**
   * Generate commander signature for approval
   */
  generateCommanderSignature(): string {
    const timestamp = new Date().toISOString();
    const signatureData = `${this.config.commander}:${this.config.blueprint_id}:${this.config.version}:${timestamp}`;
    
    // Simple hash-like signature (in production, use proper cryptographic signing)
    let hash = 0;
    for (let i = 0; i < signatureData.length; i++) {
      const char = signatureData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `sig_${Math.abs(hash).toString(16)}_${timestamp.split('T')[0]}`;
  }

  /**
   * Create the final blueprint package
   */
  createFinalBlueprint(): { blueprint: FinalBlueprint; validation: SchemaValidationResult } {
    const moduleValidation = this.validateModules();
    const timestamp = new Date().toISOString();
    const signature = this.generateCommanderSignature();
    
    // Check if all modules are validated
    const allValidated = moduleValidation.every(result => result.validated);
    const validationStatus = allValidated ? 'validated' : 'failed';

    const blueprint: FinalBlueprint = {
      blueprint_id: this.config.blueprint_id,
      version: this.config.version,
      doctrine_reference: this.config.doctrine_reference,
      commander_approval: {
        commander: this.config.commander,
        timestamp,
        signature,
        approval_notes: this.config.approval_notes
      },
      timestamp,
      modules: {
        commander_intent: {
          file_path: 'config/commander_intent.yaml',
          validated: moduleValidation.find(r => r.module === 'commander_intent')?.validated || false,
          last_updated: moduleValidation.find(r => r.module === 'commander_intent')?.last_updated || ''
        },
        data_source_mapping: {
          file_path: 'config/data_source_mapping.yaml',
          validated: moduleValidation.find(r => r.module === 'data_source_mapping')?.validated || false,
          last_updated: moduleValidation.find(r => r.module === 'data_source_mapping')?.last_updated || ''
        },
        solution_design: {
          file_path: 'config/solution_design.yaml',
          validated: moduleValidation.find(r => r.module === 'solution_design')?.validated || false,
          last_updated: moduleValidation.find(r => r.module === 'solution_design')?.last_updated || ''
        },
        security: {
          file_path: 'config/security.yaml',
          validated: moduleValidation.find(r => r.module === 'security')?.validated || false,
          last_updated: moduleValidation.find(r => r.module === 'security')?.last_updated || ''
        },
        ping_pong_integration: {
          file_path: 'config/ping_pong.yaml',
          validated: moduleValidation.find(r => r.module === 'ping_pong_integration')?.validated || false,
          last_updated: moduleValidation.find(r => r.module === 'ping_pong_integration')?.last_updated || ''
        }
      },
      metadata: {
        created_at: timestamp,
        updated_at: timestamp,
        created_by: this.config.commander,
        total_modules: moduleValidation.length,
        validation_status: validationStatus
      }
    };

    // Validate the final blueprint
    const validation = validateFinalBlueprint(blueprint);

    return { blueprint, validation };
  }

  /**
   * Save the final blueprint to file
   */
  saveFinalBlueprint(blueprint: FinalBlueprint): { success: boolean; filePath: string; error?: string } {
    try {
      const fileName = `final_blueprint_${blueprint.version}.yaml`;
      const filePath = path.join(this.outputDir, fileName);

      // Convert to YAML
      const yamlContent = yaml.dump(blueprint, {
        indent: 2,
        lineWidth: 120,
        noRefs: true
      });

      // Write to file
      fs.writeFileSync(filePath, yamlContent, 'utf8');

      return { success: true, filePath };
    } catch (error) {
      return {
        success: false,
        filePath: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Package the complete blueprint with all modules
   */
  packageBlueprint(): {
    success: boolean;
    blueprint?: FinalBlueprint;
    validation?: SchemaValidationResult;
    filePath?: string;
    moduleValidation?: ModuleValidationResult[];
    error?: string;
  } {
    try {
      // Validate all modules first
      const moduleValidation = this.validateModules();
      
      // Check if all modules exist and are valid
      const invalidModules = moduleValidation.filter(result => !result.validated);
      if (invalidModules.length > 0) {
        return {
          success: false,
          moduleValidation,
          error: `Invalid modules found: ${invalidModules.map(m => m.module).join(', ')}`
        };
      }

      // Create final blueprint
      const { blueprint, validation } = this.createFinalBlueprint();

      // Check if final blueprint validation passed
      if (!validation.isValid) {
        return {
          success: false,
          blueprint,
          validation,
          moduleValidation,
          error: `Final blueprint validation failed: ${validation.errors.join(', ')}`
        };
      }

      // Save the blueprint
      const saveResult = this.saveFinalBlueprint(blueprint);
      if (!saveResult.success) {
        return {
          success: false,
          blueprint,
          validation,
          moduleValidation,
          error: saveResult.error
        };
      }

      return {
        success: true,
        blueprint,
        validation,
        filePath: saveResult.filePath,
        moduleValidation
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get package status and validation results
   */
  getPackageStatus(): {
    ready: boolean;
    moduleValidation: ModuleValidationResult[];
    missingModules: string[];
    invalidModules: string[];
    error?: string;
  } {
    const moduleValidation = this.validateModules();
    const missingModules = moduleValidation
      .filter(result => !result.exists)
      .map(result => result.module);
    
    const invalidModules = moduleValidation
      .filter(result => result.exists && !result.validated)
      .map(result => result.module);

    const ready = missingModules.length === 0 && invalidModules.length === 0;

    return {
      ready,
      moduleValidation,
      missingModules,
      invalidModules
    };
  }
}

// Utility functions for common operations
export function createBlueprintPackage(config: BlueprintPackageConfig) {
  return new BlueprintPackager(config);
}

export function validateBlueprintVersion(version: string): boolean {
  const versionPattern = /^v[0-9]+\.[0-9]+(\.[0-9]+)?$/;
  return versionPattern.test(version);
}

export function validateDoctrineReference(doctrineRef: string): boolean {
  const doctrinePattern = /^[a-zA-Z0-9_-]+_v[0-9]+\.[0-9]+(\.[0-9]+)?$/;
  return doctrinePattern.test(doctrineRef);
}

export function generateBlueprintId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
} 