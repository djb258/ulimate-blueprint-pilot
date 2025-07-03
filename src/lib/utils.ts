// Utility functions following Barton Doctrine principles

import { Phase, PhaseStatus, Blueprint } from '../types';
import { PHASE_CONFIG, VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Generates a unique ID using timestamp and random string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formats duration in minutes to a human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}

/**
 * Validates a blueprint name according to validation rules
 */
export function validateBlueprintName(name: string): { isValid: boolean; error?: string } {
  const { minLength, maxLength, pattern } = VALIDATION_RULES.blueprint.name;
  
  if (name.length < minLength) {
    return { isValid: false, error: `Name must be at least ${minLength} characters long` };
  }
  
  if (name.length > maxLength) {
    return { isValid: false, error: `Name must be no more than ${maxLength} characters long` };
  }
  
  if (!pattern.test(name)) {
    return { isValid: false, error: 'Name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }
  
  return { isValid: true };
}

/**
 * Validates a blueprint description according to validation rules
 */
export function validateBlueprintDescription(description: string): { isValid: boolean; error?: string } {
  const { minLength, maxLength } = VALIDATION_RULES.blueprint.description;
  
  if (description.length < minLength) {
    return { isValid: false, error: `Description must be at least ${minLength} characters long` };
  }
  
  if (description.length > maxLength) {
    return { isValid: false, error: `Description must be no more than ${maxLength} characters long` };
  }
  
  return { isValid: true };
}

/**
 * Validates a GitHub repository URL
 */
export function validateRepositoryUrl(url: string): { isValid: boolean; error?: string } {
  const { pattern } = VALIDATION_RULES.repository.url;
  
  if (!pattern.test(url)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidRepository };
  }
  
  return { isValid: true };
}

/**
 * Validates a prompt title according to validation rules
 */
export function validatePromptTitle(title: string): { isValid: boolean; error?: string } {
  const { minLength, maxLength } = VALIDATION_RULES.prompt.title;
  
  if (title.length < minLength) {
    return { isValid: false, error: `Title must be at least ${minLength} characters long` };
  }
  
  if (title.length > maxLength) {
    return { isValid: false, error: `Title must be no more than ${maxLength} characters long` };
  }
  
  return { isValid: true };
}

/**
 * Validates a prompt content according to validation rules
 */
export function validatePromptContent(content: string): { isValid: boolean; error?: string } {
  const { minLength, maxLength } = VALIDATION_RULES.prompt.content;
  
  if (content.length < minLength) {
    return { isValid: false, error: `Content must be at least ${minLength} characters long` };
  }
  
  if (content.length > maxLength) {
    return { isValid: false, error: `Content must be no more than ${maxLength} characters long` };
  }
  
  return { isValid: true };
}

/**
 * Creates a new blueprint with default phases
 */
export function createDefaultBlueprint(name: string, description: string, complexity: 'simple' | 'moderate' | 'complex'): Blueprint {
  const phases: Phase[] = Object.values(PHASE_CONFIG).map((config, index) => ({
    id: config.id,
    name: config.name,
    description: config.description,
    status: 'not_started' as PhaseStatus,
    order: index,
    requirements: [...config.requirements],
    deliverables: [...config.deliverables],
    estimatedDuration: config.estimatedDuration,
    dependencies: index > 0 ? [Object.values(PHASE_CONFIG)[index - 1].id] : []
  }));

  const totalTime = phases.reduce((sum, phase) => sum + phase.estimatedDuration, 0);

  return {
    id: generateId(),
    name,
    description,
    phases,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    metadata: {
      author: 'Current User', // TODO: Get from auth context
      version: '1.0.0',
      tags: [],
      complexity,
      estimatedTotalTime: totalTime,
      targetTechnologies: []
    }
  };
}

/**
 * Checks if a phase can be started (all dependencies completed)
 */
export function canStartPhase(phase: Phase, blueprint: Blueprint): boolean {
  if (phase.dependencies.length === 0) {
    return true;
  }
  
  return phase.dependencies.every(depId => {
    const depPhase = blueprint.phases.find(p => p.id === depId);
    return depPhase?.status === 'completed';
  });
}

/**
 * Gets the next available phase in a blueprint
 */
export function getNextAvailablePhase(blueprint: Blueprint): Phase | null {
  return blueprint.phases.find(phase => 
    phase.status === 'not_started' && canStartPhase(phase, blueprint)
  ) || null;
}

/**
 * Calculates the progress percentage of a blueprint
 */
export function calculateBlueprintProgress(blueprint: Blueprint): number {
  const completedPhases = blueprint.phases.filter(phase => phase.status === 'completed');
  return Math.round((completedPhases.length / blueprint.phases.length) * 100);
}

/**
 * Calculates the estimated time remaining for a blueprint
 */
export function calculateTimeRemaining(blueprint: Blueprint): number {
  const remainingPhases = blueprint.phases.filter(phase => 
    phase.status === 'not_started' || phase.status === 'in_progress'
  );
  return remainingPhases.reduce((sum, phase) => sum + phase.estimatedDuration, 0);
}

/**
 * Sorts phases by their order
 */
export function sortPhasesByOrder(phases: Phase[]): Phase[] {
  return [...phases].sort((a, b) => a.order - b.order);
}

/**
 * Filters phases by status
 */
export function filterPhasesByStatus(phases: Phase[], status: PhaseStatus): Phase[] {
  return phases.filter(phase => phase.status === status);
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely stringifies JSON with error handling
 */
export function safeJsonStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
}

/**
 * Generates a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Capitalizes the first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats a file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Merges two objects deeply
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = deepClone(target);
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
        if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
          result[key] = deepMerge(targetValue, sourceValue as object);
        } else {
          result[key] = deepClone(sourceValue) as T[Extract<keyof T, string>];
        }
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

/**
 * Generates a random color hex code
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Calculates the contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Simplified contrast calculation - in a real app, you'd want a more sophisticated algorithm
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substr(0, 2), 16);
  const g1 = parseInt(hex1.substr(2, 2), 16);
  const b1 = parseInt(hex1.substr(4, 2), 16);
  
  const r2 = parseInt(hex2.substr(0, 2), 16);
  const g2 = parseInt(hex2.substr(2, 2), 16);
  const b2 = parseInt(hex2.substr(4, 2), 16);
  
  const luminance1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
  const luminance2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color meets WCAG contrast requirements
 */
export function meetsContrastRequirements(color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = calculateContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
} 