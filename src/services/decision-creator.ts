/**
 * Decision Creator Service - handles decision record creation and management
 */

import { FileManager } from './file-manager.js';
import { TemplateRenderer } from './template-renderer.js';
import { IndexManager } from './index-manager.js';
import { DecisionRecord } from '../models/decision-record.js';
import { extractNumberFromFilename, getNextNumber, padNumber } from '../lib/number-utils.js';
import { titleToFilename } from '../lib/string-utils.js';

interface CreateDecisionOptions {
  templatePath?: string;
  outputDir?: string;
  template?: string;
}

interface CreatedDecisionInfo {
  number: number;
  title: string;
  filePath: string;
  createdAt: string;
}

export class DecisionCreator {
  private fileManager: FileManager;
  private templateRenderer: TemplateRenderer;
  private decisionsDir: string;
  private templatePath: string;

  constructor(
    decisionsDir: string = 'docs/decisions',
    templatePath: string = '.madrkit/templates/decision-template.md'
  ) {
    this.fileManager = new FileManager();
    this.templateRenderer = new TemplateRenderer();
    this.decisionsDir = decisionsDir;
    this.templatePath = templatePath;
  }

  /**
   * Get the next available decision number
   */
  async getNextNumber(): Promise<number> {
    try {
      const absolutePath = this.fileManager.getAbsolutePath(this.decisionsDir);
      const files = await this.fileManager.listDecisionFiles(absolutePath);

      if (files.length === 0) {
        return 1;
      }

      // Extract numbers from filenames
      const numbers: number[] = [];
      for (const file of files) {
        const num = extractNumberFromFilename(file);
        if (num > 0) {
          numbers.push(num);
        }
      }

      if (numbers.length === 0) {
        return 1;
      }

      return getNextNumber(numbers);
    } catch (error) {
      throw new Error(
        `Failed to get next number: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate filename from title and number
   */
  generateFilename(number: number, title: string): string {
    const paddedNumber = padNumber(number);
    const titleFilename = titleToFilename(paddedNumber, title);
    return titleFilename;
  }

  /**
   * Render decision template with user data
   */
  async renderTemplate(decision: DecisionRecord, customTemplate?: string): Promise<string> {
    try {
      // Use custom template if provided, otherwise use default
      let template = customTemplate;
      if (!template) {
        const templatePath = this.fileManager.getAbsolutePath(this.templatePath);
        template = await this.fileManager.readFileContent(templatePath);
      }

      return this.templateRenderer.renderDecision(template, decision);
    } catch (error) {
      throw new Error(
        `Failed to render template: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Write decision file to disk
   */
  async writeDecisionFile(
    number: number,
    title: string,
    content: string
  ): Promise<CreatedDecisionInfo> {
    try {
      const filename = this.generateFilename(number, title);
      const absoluteDir = this.fileManager.getAbsolutePath(this.decisionsDir);
      const filePath = this.fileManager.joinPaths(absoluteDir, filename);

      // Write file atomically
      await this.fileManager.writeFile(filePath, content);

      return {
        number,
        title,
        filePath: this.fileManager.getRelativePath(process.cwd(), filePath),
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Failed to write decision file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a complete decision record
   */
  async createDecision(
    decision: DecisionRecord,
    options: CreateDecisionOptions = {}
  ): Promise<CreatedDecisionInfo> {
    try {
      // Get next number if not provided
      if (!decision.number || decision.number === 0) {
        decision.number = await this.getNextNumber();
      }

      // Render template
      const content = await this.renderTemplate(decision, options.template);

      // Write file
      const decisionInfo = await this.writeDecisionFile(decision.number, decision.title, content);

      // Update index automatically
      try {
        const indexManager = new IndexManager(this.decisionsDir);
        await indexManager.updateIndex();
      } catch (indexError) {
        // Log but don't fail if index update fails
        console.warn(
          `Warning: Failed to update index: ${indexError instanceof Error ? indexError.message : String(indexError)}`
        );
      }

      return decisionInfo;
    } catch (error) {
      throw new Error(
        `Failed to create decision: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
