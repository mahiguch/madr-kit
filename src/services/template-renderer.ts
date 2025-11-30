/**
 * Template Renderer Service - handles Handlebars template rendering
 */

import Handlebars, { HelperOptions } from 'handlebars';
import { DecisionRecord } from '../models/decision-record.js';

// Register custom Handlebars helpers
Handlebars.registerHelper('padNumber', (number: number) => {
  return String(number).padStart(3, '0');
});

Handlebars.registerHelper('toISODate', (date: string) => {
  // Ensure ISO date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date().toISOString().split('T')[0];
  }
  return date;
});

Handlebars.registerHelper('isoNow', () => {
  return new Date().toISOString();
});

Handlebars.registerHelper('eq', (a: unknown, b: unknown) => {
  return a === b;
});

Handlebars.registerHelper('ifAny', (array: unknown[], options: HelperOptions) => {
  if (Array.isArray(array) && array.length > 0) {
    return options.fn(this);
  }
  return options.inverse(this);
});

export class TemplateRenderer {
  /**
   * Render a decision record from a template
   * @param template - The Handlebars template string
   * @param decision - The decision record data
   * @returns The rendered template
   */
  renderDecision(template: string, decision: DecisionRecord): string {
    const compiledTemplate = Handlebars.compile(template);

    return compiledTemplate({
      ...decision,
      number: String(decision.number).padStart(3, '0'),
      decidersArray: decision.deciders || [],
      relatedArray: decision.related || [],
      hasAlternatives: decision.alternatives && decision.alternatives.length > 0,
      hasRelated: decision.related && decision.related.length > 0,
      hasDeciders: decision.deciders && decision.deciders.length > 0,
    });
  }

  /**
   * Render a title index from a template
   * @param template - The Handlebars template string
   * @param data - The index data (entries, totalDecisions, lastUpdated)
   * @returns The rendered template
   */
  renderIndex(
    template: string,
    data: {
      entries: Array<{ number: number } & Record<string, unknown>>;
      totalDecisions: number;
      lastUpdated: string;
    }
  ): string {
    const compiledTemplate = Handlebars.compile(template);

    return compiledTemplate({
      ...data,
      entries: data.entries.map((entry) => ({
        ...entry,
        number: String(entry.number).padStart(3, '0'),
      })),
    });
  }

  /**
   * Compile a template string
   * @param template - The template string
   * @returns The compiled template function
   */
  compile(template: string): ReturnType<typeof Handlebars.compile> {
    return Handlebars.compile(template);
  }
}
