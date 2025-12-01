/**
 * Custom error class for application-specific errors
 * Provides exit codes and structured error messages
 */

export type ErrorCode =
  | 'E001'
  | 'E002'
  | 'E003'
  | 'E004'
  | 'E005'
  | 'E006'
  | 'E007';

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  details?: string;
  suggestion?: string;
  exitCode: number;
}

export class AppError extends Error {
  code: ErrorCode;
  details?: string;
  suggestion?: string;
  exitCode: number;

  constructor(errorDetails: ErrorDetails) {
    super(errorDetails.message);
    this.code = errorDetails.code;
    this.details = errorDetails.details;
    this.suggestion = errorDetails.suggestion;
    this.exitCode = errorDetails.exitCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * E001: npm not found
 */
export class NpmNotFoundError extends AppError {
  constructor() {
    super({
      code: 'E001',
      message: 'npm not found',
      details: 'MADR installation requires npm (Node Package Manager).',
      suggestion:
        'Please install Node.js from https://nodejs.org/ and try again.',
      exitCode: 1,
    });
    Object.setPrototypeOf(this, NpmNotFoundError.prototype);
  }
}

/**
 * E002: Permission denied
 */
export class PermissionDeniedError extends AppError {
  constructor(directory: string) {
    super({
      code: 'E002',
      message: 'Permission denied',
      details: `Cannot write to directory: ${directory}`,
      suggestion: `Run with elevated permissions or change output directory:\n  madrkit --output ./my-decisions`,
      exitCode: 2,
    });
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

/**
 * E003: MADR package installation failed
 */
export class InstallationFailedError extends AppError {
  constructor(details?: string) {
    super({
      code: 'E003',
      message: 'MADR package installation failed',
      details: details || 'npm install command exited with non-zero code',
      suggestion:
        'Check your network connection and npm configuration.\nSee npm error log for details.',
      exitCode: 3,
    });
    Object.setPrototypeOf(this, InstallationFailedError.prototype);
  }
}

/**
 * E004: Invalid decision title
 */
export class InvalidTitleError extends AppError {
  constructor(title: string) {
    super({
      code: 'E004',
      message: 'Invalid decision title',
      details: `Title contains characters not safe for filenames: "${title}"`,
      suggestion:
        'Please use only letters, numbers, spaces, and hyphens.',
      exitCode: 4,
    });
    Object.setPrototypeOf(this, InvalidTitleError.prototype);
  }
}

/**
 * E005: Template file not found
 */
export class TemplateNotFoundError extends AppError {
  constructor(path: string) {
    super({
      code: 'E005',
      message: 'Template file not found',
      details: `Cannot read template: ${path}`,
      suggestion: 'Verify the path or omit --template flag to use default template.',
      exitCode: 5,
    });
    Object.setPrototypeOf(this, TemplateNotFoundError.prototype);
  }
}

/**
 * E006: User cancelled questionnaire
 */
export class UserCancelledError extends AppError {
  constructor() {
    super({
      code: 'E006',
      message: 'Operation cancelled by user',
      details: 'No decision record was created.',
      exitCode: 130,
    });
    Object.setPrototypeOf(this, UserCancelledError.prototype);
  }
}

/**
 * E007: Decision number overflow
 */
export class DecisionOverflowError extends AppError {
  constructor() {
    super({
      code: 'E007',
      message: 'Maximum decisions reached',
      details: 'Project has reached the limit of 999 decision records.',
      suggestion:
        'Consider archiving old decisions or starting a new MADR project.',
      exitCode: 7,
    });
    Object.setPrototypeOf(this, DecisionOverflowError.prototype);
  }
}
