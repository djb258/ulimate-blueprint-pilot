// Types for prompt management
export interface Prompt {
  id: string;
  text: string;
  phase: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Phase = 'PLAN' | 'SCAFFOLD' | 'FILE STRUCTURE' | 'TEST PLAN' | 'SECURITY PLAN' | 'PHASE GATES / PROMOTION RULES' | 'FINALIZE BLUEPRINT';

// In-memory store for prompts
class PromptsStore {
  private prompts: Prompt[] = [];
  private readonly STORAGE_KEY = 'ultimate-blueprint-prompts';

  constructor() {
    this.loadFromStorage();
  }

  // Load prompts from localStorage
  private loadFromStorage(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      this.prompts = [];
      return;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.prompts = parsed.map((p: Omit<Prompt, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string }) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
      }
    } catch (error) {
      console.warn('Failed to load prompts from storage:', error);
      this.prompts = [];
    }
  }

  // Save prompts to localStorage
  private saveToStorage(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.prompts));
    } catch (error) {
      console.warn('Failed to save prompts to storage:', error);
    }
  }

  // Get all prompts
  getAllPrompts(): Prompt[] {
    return [...this.prompts];
  }

  // Get prompts by phase
  getPromptsByPhase(phase: Phase): Prompt[] {
    return this.prompts.filter(prompt => prompt.phase === phase);
  }

  // Add new prompt
  addPrompt(text: string, phase: Phase): Prompt {
    const newPrompt: Prompt = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      phase,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.prompts.push(newPrompt);
    this.saveToStorage();
    return newPrompt;
  }

  // Update existing prompt
  updatePrompt(id: string, updates: Partial<Pick<Prompt, 'text' | 'phase'>>): Prompt | null {
    const promptIndex = this.prompts.findIndex(p => p.id === id);
    if (promptIndex === -1) return null;

    this.prompts[promptIndex] = {
      ...this.prompts[promptIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToStorage();
    return this.prompts[promptIndex];
  }

  // Delete prompt
  deletePrompt(id: string): boolean {
    const initialLength = this.prompts.length;
    this.prompts = this.prompts.filter(p => p.id !== id);
    
    if (this.prompts.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Get prompt by ID
  getPromptById(id: string): Prompt | null {
    return this.prompts.find(p => p.id === id) || null;
  }

  // Clear all prompts (for testing/reset)
  clearAll(): void {
    this.prompts = [];
    this.saveToStorage();
  }
}

// Export singleton instance
export const promptsStore = new PromptsStore();

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