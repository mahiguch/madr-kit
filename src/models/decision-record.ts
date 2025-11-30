/**
 * Decision Record model - represents a documented architectural decision
 */

export interface Alternative {
  title: string;
  description: string;
  pros?: string[];
  cons?: string[];
}

export type DecisionStatus = 'proposed' | 'accepted' | 'rejected' | 'deprecated' | 'superseded';

export interface DecisionRecord {
  number: number;
  title: string;
  status: DecisionStatus;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  context: string; // Markdown
  decision: string; // Markdown
  consequences: string; // Markdown
  deciders?: string[]; // Comma-separated list of names
  alternatives?: Alternative[];
  related?: number[]; // Related decision numbers
  metadata?: Record<string, unknown>;
  filePath?: string; // Relative path to the decision file
}

export interface DecisionRecordInput {
  title: string;
  status: DecisionStatus;
  context: string;
  decision: string;
  consequences: string;
  deciders?: string;
  alternatives?: Alternative[];
  related?: string; // Comma-separated numbers
}

/**
 * Validate a decision record
 * @param record - The record to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateDecisionRecord(record: DecisionRecord): string[] {
  const errors: string[] = [];

  // Validate number
  if (!Number.isInteger(record.number) || record.number < 1 || record.number > 999) {
    errors.push('Decision number must be an integer between 1 and 999');
  }

  // Validate title
  if (!record.title || record.title.trim().length === 0) {
    errors.push('Decision title is required');
  }
  if (record.title.length > 200) {
    errors.push('Decision title cannot exceed 200 characters');
  }

  // Validate status
  const validStatuses: DecisionStatus[] = [
    'proposed',
    'accepted',
    'rejected',
    'deprecated',
    'superseded',
  ];
  if (!validStatuses.includes(record.status)) {
    errors.push(`Decision status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate date
  if (!record.date || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
    errors.push('Decision date must be in ISO 8601 format (YYYY-MM-DD)');
  }

  // Validate required content
  if (!record.context || record.context.trim().length === 0) {
    errors.push('Decision context is required');
  }
  if (!record.decision || record.decision.trim().length === 0) {
    errors.push('Decision statement is required');
  }
  if (!record.consequences || record.consequences.trim().length === 0) {
    errors.push('Decision consequences are required');
  }

  // Validate related decisions
  if (record.related) {
    for (const num of record.related) {
      if (!Number.isInteger(num) || num < 1 || num > 999) {
        errors.push(`Related decision number must be between 1 and 999: ${num}`);
      }
    }
  }

  return errors;
}

/**
 * Get today's date in ISO 8601 format
 * @returns Today's date as YYYY-MM-DD
 */
export function getToday(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}
