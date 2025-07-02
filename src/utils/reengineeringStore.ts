// Types for re-engineering analysis
export interface RepoInfo {
  id: string;
  url: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface PhaseAnalysis {
  id: string;
  repoId: string;
  phase: string;
  notes: string;
  gaps: string[];
  issues: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GapReport {
  id: string;
  repoId: string;
  summary: string;
  criticalGaps: string[];
  mediumGaps: string[];
  lowGaps: string[];
  recommendations: string[];
  createdAt: Date;
}

export type Phase = 'PLAN' | 'SCAFFOLD' | 'FILE STRUCTURE' | 'TEST PLAN' | 'SECURITY PLAN' | 'PHASE GATES / PROMOTION RULES' | 'FINALIZE BLUEPRINT';

// In-memory store for re-engineering data
class ReengineeringStore {
  private repos: RepoInfo[] = [];
  private phaseAnalyses: PhaseAnalysis[] = [];
  private gapReports: GapReport[] = [];
  private readonly STORAGE_KEY = 'ultimate-blueprint-reengineering';

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.repos = (parsed.repos as unknown[])?.map((r: unknown) => ({
          ...(r as RepoInfo),
          createdAt: new Date((r as RepoInfo).createdAt)
        })) || [];
        this.phaseAnalyses = (parsed.phaseAnalyses as unknown[])?.map((p: unknown) => ({
          ...(p as PhaseAnalysis),
          createdAt: new Date((p as PhaseAnalysis).createdAt),
          updatedAt: new Date((p as PhaseAnalysis).updatedAt)
        })) || [];
        this.gapReports = (parsed.gapReports as unknown[])?.map((g: unknown) => ({
          ...(g as GapReport),
          createdAt: new Date((g as GapReport).createdAt)
        })) || [];
      }
    } catch (error) {
      console.warn('Failed to load re-engineering data from storage:', error);
      this.repos = [];
      this.phaseAnalyses = [];
      this.gapReports = [];
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const data = {
        repos: this.repos,
        phaseAnalyses: this.phaseAnalyses,
        gapReports: this.gapReports
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save re-engineering data to storage:', error);
    }
  }

  // Repo management
  addRepo(url: string, name: string, description?: string): RepoInfo {
    const newRepo: RepoInfo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: url.trim(),
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date()
    };

    this.repos.push(newRepo);
    this.saveToStorage();
    return newRepo;
  }

  getRepoById(id: string): RepoInfo | null {
    return this.repos.find(r => r.id === id) || null;
  }

  getAllRepos(): RepoInfo[] {
    return [...this.repos];
  }

  // Phase analysis management
  addPhaseAnalysis(repoId: string, phase: Phase, notes: string, gaps: string[], issues: string[], recommendations: string[]): PhaseAnalysis {
    const newAnalysis: PhaseAnalysis = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      repoId,
      phase,
      notes: notes.trim(),
      gaps: gaps.filter(g => g.trim()),
      issues: issues.filter(i => i.trim()),
      recommendations: recommendations.filter(r => r.trim()),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.phaseAnalyses.push(newAnalysis);
    this.saveToStorage();
    return newAnalysis;
  }

  updatePhaseAnalysis(id: string, updates: Partial<Pick<PhaseAnalysis, 'notes' | 'gaps' | 'issues' | 'recommendations'>>): PhaseAnalysis | null {
    const analysisIndex = this.phaseAnalyses.findIndex(a => a.id === id);
    if (analysisIndex === -1) return null;

    this.phaseAnalyses[analysisIndex] = {
      ...this.phaseAnalyses[analysisIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return this.phaseAnalyses[analysisIndex];
  }

  getPhaseAnalysesByRepo(repoId: string): PhaseAnalysis[] {
    return this.phaseAnalyses.filter(a => a.repoId === repoId);
  }

  getPhaseAnalysis(repoId: string, phase: Phase): PhaseAnalysis | null {
    return this.phaseAnalyses.find(a => a.repoId === repoId && a.phase === phase) || null;
  }

  // Gap report management
  generateGapReport(repoId: string, summary: string): GapReport {
    const repoAnalyses = this.getPhaseAnalysesByRepo(repoId);
    
    // Collect all gaps and categorize them
    const allGaps: string[] = [];
    const allIssues: string[] = [];
    const allRecommendations: string[] = [];

    repoAnalyses.forEach(analysis => {
      allGaps.push(...analysis.gaps);
      allIssues.push(...analysis.issues);
      allRecommendations.push(...analysis.recommendations);
    });

    // Simple categorization (in future, this could be more sophisticated)
    const criticalGaps = allGaps.filter(gap => 
      gap.toLowerCase().includes('security') || 
      gap.toLowerCase().includes('critical') ||
      gap.toLowerCase().includes('error')
    );
    
    const mediumGaps = allGaps.filter(gap => 
      gap.toLowerCase().includes('test') || 
      gap.toLowerCase().includes('performance') ||
      gap.toLowerCase().includes('structure')
    );
    
    const lowGaps = allGaps.filter(gap => 
      !criticalGaps.includes(gap) && !mediumGaps.includes(gap)
    );

    const newReport: GapReport = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      repoId,
      summary: summary.trim(),
      criticalGaps,
      mediumGaps,
      lowGaps,
      recommendations: [...new Set(allRecommendations)], // Remove duplicates
      createdAt: new Date()
    };

    this.gapReports.push(newReport);
    this.saveToStorage();
    return newReport;
  }

  getGapReportByRepo(repoId: string): GapReport | null {
    return this.gapReports.find(r => r.repoId === repoId) || null;
  }

  // Clear all data (for testing/reset)
  clearAll(): void {
    this.repos = [];
    this.phaseAnalyses = [];
    this.gapReports = [];
    this.saveToStorage();
  }
}

// Export singleton instance
export const reengineeringStore = new ReengineeringStore();

// Export phases for consistency
export const PHASES: Phase[] = [
  'PLAN',
  'SCAFFOLD', 
  'FILE STRUCTURE',
  'TEST PLAN',
  'SECURITY PLAN',
  'PHASE GATES / PROMOTION RULES',
  'FINALIZE BLUEPRINT'
]; 