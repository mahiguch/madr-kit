/**
 * Questionnaire Schema - defines the questions for creating a decision record
 */

export interface QuestionAnswers {
  title: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'deprecated' | 'superseded';
  context: string;
  decision: string;
  consequences: string;
  deciders?: string;
  related?: string;
}

/**
 * Get the questionnaire schema for creating a decision record
 * @returns An array of question configurations for Inquirer.js
 */
export function getQuestionnaireSchema() {
  return [
    {
      type: 'input',
      name: 'title',
      message: 'Decision title:',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Title is required';
        }
        if (input.length > 200) {
          return 'Title cannot exceed 200 characters';
        }
        // Check for unsafe characters
        if (/[<>:"/\\|?*]/g.test(input)) {
          return 'Title contains unsafe characters: < > : " / \\ | ? *';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'status',
      message: 'Decision status:',
      choices: ['proposed', 'accepted', 'rejected', 'deprecated', 'superseded'],
      default: 'proposed',
    },
    {
      type: 'editor',
      name: 'context',
      message: 'Context and Problem Statement (press Enter to open editor):',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Context is required';
        }
        return true;
      },
    },
    {
      type: 'editor',
      name: 'decision',
      message: 'Decision (press Enter to open editor):',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Decision statement is required';
        }
        return true;
      },
    },
    {
      type: 'editor',
      name: 'consequences',
      message: 'Consequences (press Enter to open editor):',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return 'Consequences are required';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'deciders',
      message: 'Deciders (comma-separated, optional):',
      default: '',
    },
    {
      type: 'input',
      name: 'related',
      message: 'Related decision numbers (comma-separated, optional):',
      default: '',
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return true;
        }
        // Validate comma-separated numbers
        const numbers = input.split(',').map((s) => s.trim());
        for (const num of numbers) {
          const parsed = parseInt(num, 10);
          if (isNaN(parsed) || parsed < 1 || parsed > 999) {
            return `Invalid decision number: ${num} (must be 1-999)`;
          }
        }
        return true;
      },
    },
  ];
}
