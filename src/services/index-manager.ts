/**
 * Index Manager Service - handles title index management and updates
 */

import { FileManager } from './file-manager.js';
import { TemplateRenderer } from './template-renderer.js';
import { extractNumberFromFilename } from '../lib/number-utils.js';
import { filenameToTitle } from '../lib/string-utils.js';

interface IndexEntry {
  number: number;
  title: string;
  status: string;
  date: string;
  filePath: string;
  filename: string;
}

export class IndexManager {
  private fileManager: FileManager;
  private templateRenderer: TemplateRenderer;
  private decisionsDir: string;
  private indexTemplatePath: string;
  private indexFilename: string = '000-titles.md';

  constructor(
    decisionsDir: string = 'docs/decisions',
    indexTemplatePath: string = '.madrkit/templates/index-template.md'
  ) {
    this.fileManager = new FileManager();
    this.templateRenderer = new TemplateRenderer();
    this.decisionsDir = decisionsDir;
    this.indexTemplatePath = indexTemplatePath;
  }

  /**
   * Parse decision files and extract metadata
   */
  async parseDecisionFiles(): Promise<IndexEntry[]> {
    try {
      const absoluteDir = this.fileManager.getAbsolutePath(this.decisionsDir);
      const files = await this.fileManager.listDecisionFiles(absoluteDir);

      const entries: IndexEntry[] = [];

      for (const file of files) {
        try {
          const number = extractNumberFromFilename(file);
          if (number <= 0) continue;

          const filePath = this.fileManager.joinPaths(absoluteDir, file);
          const content = await this.fileManager.readFileContent(filePath);

          const entry = this.createIndexEntry(number, file, content);
          entries.push(entry);
        } catch {
          // Skip files that cannot be parsed
          continue;
        }
      }

      return entries;
    } catch (error) {
      throw new Error(
        `Failed to parse decision files: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create an index entry from file metadata
   */
  private createIndexEntry(number: number, filename: string, content: string): IndexEntry {
    // Extract title from filename
    const title = filenameToTitle(filename);

    // Extract status and date from content
    const statusMatch = content.match(/\*\*Status\*\*:\s*(\w+)/);
    const dateMatch = content.match(/\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})/);

    const status = statusMatch ? statusMatch[1] : 'unknown';
    const date = dateMatch ? dateMatch[1] : 'unknown';
    const relativeFilename = filename.replace(/\.md$/, '');

    return {
      number,
      title,
      status,
      date,
      filePath: `./${filename}`,
      filename: relativeFilename,
    };
  }

  /**
   * Sort entries by number ascending
   */
  sortEntries(entries: IndexEntry[]): IndexEntry[] {
    return [...entries].sort((a, b) => a.number - b.number);
  }

  /**
   * Render index using Handlebars template
   */
  async renderIndex(entries: IndexEntry[], customTemplate?: string): Promise<string> {
    try {
      const sortedEntries = this.sortEntries(entries);

      // Get template
      let template = customTemplate;
      if (!template) {
        const templatePath = this.fileManager.getAbsolutePath(this.indexTemplatePath);
        template = await this.fileManager.readFileContent(templatePath);
      }

      // Render using TemplateRenderer
      return this.templateRenderer.renderIndex(template, {
        entries: sortedEntries as unknown as Array<{ number: number } & Record<string, unknown>>,
        totalDecisions: sortedEntries.length,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(
        `Failed to render index: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Write index file to disk
   */
  async writeIndexFile(entries: IndexEntry[], customTemplate?: string): Promise<void> {
    try {
      const content = await this.renderIndex(entries, customTemplate);
      const absoluteDir = this.fileManager.getAbsolutePath(this.decisionsDir);
      const indexPath = this.fileManager.joinPaths(absoluteDir, this.indexFilename);

      await this.fileManager.writeFile(indexPath, content);
    } catch (error) {
      throw new Error(
        `Failed to write index file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update the title index (main entry point)
   */
  async updateIndex(customTemplate?: string): Promise<void> {
    try {
      const entries = await this.parseDecisionFiles();
      await this.writeIndexFile(entries, customTemplate);
    } catch (error) {
      throw new Error(
        `Failed to update index: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
