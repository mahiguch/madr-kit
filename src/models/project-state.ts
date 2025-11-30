/**
 * Project State model - represents the state of an MADR project
 */

export interface ProjectState {
  initialized: boolean;
  decisionsPath: string;
  templatePath: string;
  highestNumber: number;
  madrVersion?: string;
  customTemplate: boolean;
  lastUpdated?: string;
}

/**
 * Create a default/empty project state
 * @returns A default ProjectState
 */
export function createDefaultProjectState(): ProjectState {
  return {
    initialized: false,
    decisionsPath: 'docs/decisions',
    templatePath: '.madrkit/templates',
    highestNumber: 0,
    customTemplate: false,
  };
}

/**
 * Validate a project state
 * @param state - The state to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateProjectState(state: ProjectState): string[] {
  const errors: string[] = [];

  if (typeof state.initialized !== 'boolean') {
    errors.push('initialized must be a boolean');
  }

  if (!state.decisionsPath || typeof state.decisionsPath !== 'string') {
    errors.push('decisionsPath must be a non-empty string');
  }

  if (!state.templatePath || typeof state.templatePath !== 'string') {
    errors.push('templatePath must be a non-empty string');
  }

  if (!Number.isInteger(state.highestNumber) || state.highestNumber < 0) {
    errors.push('highestNumber must be a non-negative integer');
  }

  if (typeof state.customTemplate !== 'boolean') {
    errors.push('customTemplate must be a boolean');
  }

  return errors;
}
