// Ultimate Blueprint Pilot - Doctrine Store
// Implements: Barton Doctrine (1960) + NEON Doctrine + STAMPED Framework
// Database Structure: DB.HQ.SUB.NESTED.INDEX format

export interface BartonNumber {
  database: 1 | 2; // 1: Command Ops, 2: Marketing DB
  hq: number;      // Sub-hive identifier
  sub: number;     // Sub-sub-hive
  nested: number;  // Section (0-49)
  index: number;   // Doctrinal ID
}

export interface DoctrineSchema {
  bartonId: string; // Format: DB.HQ.SUB.NESTED.INDEX
  title: string;
  description: string;
  type: 'tone' | 'structure' | 'process' | 'compliance' | 'messaging';
  phase: 'FRAME' | 'BLUEPRINT' | 'PROCESS';
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED';
  createdAt: string;
  updatedAt: string;
  owner: string;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VALIDATE';
  agent: string;
  changes: Record<string, any>;
  compliance: boolean;
}

export interface STAMPEDProcess {
  processId: string;
  structured: boolean;    // S - Consistent organization
  traceable: boolean;     // T - Complete audit trail
  auditReady: boolean;    // A - Compliance-ready structures
  mapped: boolean;        // M - Clear relationships
  promotable: boolean;    // P - Version-controlled changes
  enforced: boolean;      // E - Automated validation
  documented: boolean;    // D - Comprehensive documentation
}

export interface NEONCompliance {
  nuclearEnforcement: boolean;     // N - Strict validation
  explicitOwnership: boolean;      // E - Clear data ownership
  operationalNormalization: boolean; // O - Standardized operations
  noOrphanData: boolean;          // N - Complete data lineage
}

class DoctrineStore {
  private doctrines: Map<string, DoctrineSchema> = new Map();
  private processes: Map<string, STAMPEDProcess> = new Map();

  // Barton Numbering System
  private validateBartonNumber(bartonId: string): boolean {
    const pattern = /^[12]\.\d+\.\d+\.\d+\.\d+$/;
    return pattern.test(bartonId);
  }

  private parseBartonNumber(bartonId: string): BartonNumber | null {
    if (!this.validateBartonNumber(bartonId)) return null;
    
    const parts = bartonId.split('.').map(Number);
    return {
      database: parts[0] as 1 | 2,
      hq: parts[1],
      sub: parts[2],
      nested: parts[3],
      index: parts[4]
    };
  }

  // Section Categories (0-49)
  private getSectionType(nested: number): DoctrineSchema['type'] {
    if (nested >= 0 && nested <= 9) return 'tone';
    if (nested >= 10 && nested <= 19) return 'structure';
    if (nested >= 20 && nested <= 29) return 'process';
    if (nested >= 30 && nested <= 39) return 'compliance';
    if (nested >= 40 && nested <= 49) return 'messaging';
    throw new Error(`Invalid section number: ${nested}`);
  }

  // NEON Doctrine Compliance
  private validateNEONCompliance(doctrine: DoctrineSchema): NEONCompliance {
    return {
      nuclearEnforcement: this.validateBartonNumber(doctrine.bartonId),
      explicitOwnership: doctrine.owner !== '',
      operationalNormalization: doctrine.type !== undefined,
      noOrphanData: doctrine.auditTrail.length > 0
    };
  }

  // STAMPED Framework Validation
  private validateSTAMPEDProcess(processId: string): STAMPEDProcess {
    const process = this.processes.get(processId);
    if (!process) {
      return {
        processId,
        structured: false,
        traceable: false,
        auditReady: false,
        mapped: false,
        promotable: false,
        enforced: false,
        documented: false
      };
    }
    return process;
  }

  // Blueprint Phase Management
  public createDoctrine(doctrine: Omit<DoctrineSchema, 'createdAt' | 'updatedAt' | 'auditTrail'>): string {
    if (!this.validateBartonNumber(doctrine.bartonId)) {
      throw new Error(`Invalid Barton ID format: ${doctrine.bartonId}`);
    }

    const bartonNumber = this.parseBartonNumber(doctrine.bartonId)!;
    const expectedType = this.getSectionType(bartonNumber.nested);
    
    if (doctrine.type !== expectedType) {
      throw new Error(`Type mismatch: expected ${expectedType} for section ${bartonNumber.nested}`);
    }

    const timestamp = new Date().toISOString();
    const fullDoctrine: DoctrineSchema = {
      ...doctrine,
      createdAt: timestamp,
      updatedAt: timestamp,
      auditTrail: [{
        timestamp,
        action: 'CREATE',
        agent: 'UltimateBlueprint_Agent',
        changes: { created: true },
        compliance: true
      }]
    };

    this.doctrines.set(doctrine.bartonId, fullDoctrine);
    return doctrine.bartonId;
  }

  public getDoctrine(bartonId: string): DoctrineSchema | null {
    return this.doctrines.get(bartonId) || null;
  }

  public getDoctrinesByPhase(phase: DoctrineSchema['phase']): DoctrineSchema[] {
    return Array.from(this.doctrines.values()).filter(d => d.phase === phase);
  }

  public getDoctrinesByType(type: DoctrineSchema['type']): DoctrineSchema[] {
    return Array.from(this.doctrines.values()).filter(d => d.type === type);
  }

  // Compliance Reporting
  public generateComplianceReport(): {
    totalDoctrines: number;
    neonCompliant: number;
    stampedCompliant: number;
    bartonCompliant: number;
    issues: string[];
  } {
    const doctrines = Array.from(this.doctrines.values());
    const issues: string[] = [];
    
    let neonCompliant = 0;
    let stampedCompliant = 0;
    let bartonCompliant = 0;

    doctrines.forEach(doctrine => {
      // NEON Compliance
      const neonStatus = this.validateNEONCompliance(doctrine);
      if (Object.values(neonStatus).every(Boolean)) {
        neonCompliant++;
      } else {
        issues.push(`NEON compliance issue in ${doctrine.bartonId}`);
      }

      // Barton Numbering
      if (this.validateBartonNumber(doctrine.bartonId)) {
        bartonCompliant++;
      } else {
        issues.push(`Invalid Barton numbering in ${doctrine.bartonId}`);
      }
    });

    return {
      totalDoctrines: doctrines.length,
      neonCompliant,
      stampedCompliant: this.processes.size,
      bartonCompliant,
      issues
    };
  }

  // Initialize with Blueprint Pilot specific doctrines
  public initializeBlueprintDoctrines(): void {
    // Phase Structure Doctrine
    this.createDoctrine({
      bartonId: '1.1.1.20.1', // Command Ops -> Blueprint -> Process
      title: 'Blueprint Phase Structure',
      description: 'Defines the three-phase structure: FRAME -> BLUEPRINT -> PROCESS',
      type: 'process',
      phase: 'FRAME',
      status: 'ACTIVE',
      owner: 'UltimateBlueprint_System'
    });

    // Component Architecture Doctrine
    this.createDoctrine({
      bartonId: '1.1.1.10.1', // Command Ops -> Blueprint -> Structure
      title: 'Component Architecture Standards',
      description: 'React/Next.js component architecture following Barton Doctrine principles',
      type: 'structure',
      phase: 'BLUEPRINT',
      status: 'ACTIVE',
      owner: 'UltimateBlueprint_System'
    });

    // Automation Compliance Doctrine
    this.createDoctrine({
      bartonId: '1.1.1.30.1', // Command Ops -> Blueprint -> Compliance
      title: 'Full Automation Compliance',
      description: 'Ensures all operations follow Barton Doctrine full automation principles',
      type: 'compliance',
      phase: 'PROCESS',
      status: 'ACTIVE',
      owner: 'UltimateBlueprint_System'
    });
  }
}

// Global doctrine store instance
export const doctrineStore = new DoctrineStore();

// Initialize on module load
doctrineStore.initializeBlueprintDoctrines(); 