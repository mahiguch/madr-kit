/**
 * Questionnaire - Interactive CLI questions for decision record creation
 */

import inquirer, { QuestionCollection } from 'inquirer';
import { DecisionRecord } from '../models/decision-record.js';
import { getQuestionnaireSchema } from '../models/questionnaire-schema.js';
import { FileManager } from '../services/file-manager.js';
import { UserCancelledError } from '../models/app-error.js';

export interface QuestionAnswers {
  title: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'deprecated' | 'superseded';
  context: string;
  decision: string;
  consequences: string;
  deciders?: string;
  related?: string;
}

export class Questionnaire {
  private fileManager: FileManager;
  private decisionsDir: string;

  constructor(decisionsDir: string = 'docs/decisions') {
    this.fileManager = new FileManager();
    this.decisionsDir = decisionsDir;
  }

  /**
   * Validate decision title
   */
  validateTitle(title: string): boolean | string {
    if (!title || title.trim().length === 0) {
      return 'Title cannot be empty';
    }

    if (title.length > 200) {
      return 'Title must be 200 characters or less';
    }

    // Check for unsafe filename characters
    // eslint-disable-next-line no-control-regex
    const unsafeChars = /[<>:"\\/|?*\x00-\x1f]/g;
    if (unsafeChars.test(title)) {
      return 'Title contains unsafe characters for filenames';
    }

    return true;
  }

  /**
   * Validate related decision numbers
   */
  async validateRelatedDecisions(input: string): Promise<boolean | string> {
    if (!input || input.trim().length === 0) {
      return true; // Optional field
    }

    const numbers = input
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    for (const num of numbers) {
      if (!/^\d{1,3}$/.test(num)) {
        return `Invalid decision number: ${num}. Use numeric format (e.g., 001, 002)`;
      }

      // Check if the file exists
      const paddedNum = String(num).padStart(3, '0');
      const searchPattern = new RegExp(`^${paddedNum}-.*\\.md$`);
      const absoluteDir = this.fileManager.getAbsolutePath(this.decisionsDir);

      try {
        const files = await this.fileManager.listDecisionFiles(absoluteDir);
        const found = files.some((file) => searchPattern.test(file));

        if (!found) {
          return `Decision ${paddedNum} not found`;
        }
      } catch {
        return `Failed to validate related decisions`;
      }
    }

    return true;
  }

  /**
   * Parse deciders from comma-separated input
   */
  parseDeciders(input: string): string[] {
    if (!input || input.trim().length === 0) {
      return [];
    }

    return input
      .split(',')
      .map((decider) => decider.trim())
      .filter((decider) => decider.length > 0);
  }

  /**
   * Parse related decision numbers from comma-separated input
   */
  parseRelated(input: string): number[] {
    if (!input || input.trim().length === 0) {
      return [];
    }

    return input
      .split(',')
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));
  }

  /**
   * Prompt user with questionnaire and return answers
   */
  async prompt(): Promise<QuestionAnswers> {
    try {
      // Get question schema
      const schema = getQuestionnaireSchema();

      // Add custom validation for related decisions
      const questions: QuestionCollection = schema.map((question) => {
        if (question.name === 'title') {
          return {
            ...question,
            validate: (value: string) => {
              const result = this.validateTitle(value);
              return result;
            },
          };
        }
        if (question.name === 'related') {
          return {
            ...question,
            validate: this.validateRelatedDecisions.bind(this),
          };
        }
        return question;
      });

      // Prompt user
      const answers = await inquirer.prompt(questions);

      return answers as QuestionAnswers;
    } catch (error) {
      // Handle Ctrl+C cancellation
      if (error instanceof Error && error.message === 'User force closed the prompt') {
        throw new UserCancelledError();
      }
      throw error;
    }
  }

  /**
   * Convert questionnaire answers to DecisionRecord
   */
  async convertToDecisionRecord(answers: QuestionAnswers): Promise<DecisionRecord> {
    const today = new Date().toISOString().split('T')[0];

    return {
      number: 0, // Will be assigned by DecisionCreator
      title: answers.title,
      status: answers.status,
      date: today,
      context: answers.context,
      decision: answers.decision,
      consequences: answers.consequences,
      deciders: answers.deciders ? this.parseDeciders(answers.deciders) : undefined,
      related: answers.related ? this.parseRelated(answers.related) : undefined,
    };
  }
}
