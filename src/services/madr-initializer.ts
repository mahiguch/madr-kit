/**
 * MADR Initializer Service - handles MADR project initialization
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { FileManager } from './file-manager.js';
import { ProjectState, createDefaultProjectState, validateProjectState } from '../models/project-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface InitializationResult {
  success: boolean;
  projectState: ProjectState;
  message: string;
}

interface InitializationOptions {
  outputDir?: string;
  templateDir?: string;
  force?: boolean;
}

export class MADRInitializer {
  private fileManager: FileManager;
  private decisionsPath: string;
  private templatePath: string;

  constructor(
    decisionsPath: string = 'docs/decisions',
    templatePath: string = '.madrkit/templates'
  ) {
    this.fileManager = new FileManager();
    this.decisionsPath = decisionsPath;
    this.templatePath = templatePath;
  }

  /**
   * Detect if MADR is already initialized in the project
   */
  async detectInitialization(): Promise<boolean> {
    try {
      const decisionsDir = this.fileManager.getAbsolutePath(this.decisionsPath);
      const isInitialized = await this.fileManager.directoryExists(decisionsDir);
      return isInitialized;
    } catch {
      return false;
    }
  }

  /**
   * Install MADR package via npm
   */
  async installPackage(): Promise<void> {
    try {
      // Use npm install with --save-dev for development dependency
      execSync('npm install madr --save-dev', {
        cwd: process.cwd(),
        stdio: 'inherit',
      });
    } catch (error) {
      throw new Error(`Failed to install MADR package: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create required directory structure
   */
  async createDirectories(): Promise<void> {
    try {
      // Create decisions directory
      const decisionsDir = this.fileManager.getAbsolutePath(this.decisionsPath);
      await this.fileManager.createDirectory(decisionsDir);

      // Create template directory
      const templatesDir = this.fileManager.getAbsolutePath(this.templatePath);
      await this.fileManager.createDirectory(templatesDir);

      // Create commands subdirectory for metadata
      const commandsDir = this.fileManager.joinPaths(templatesDir, 'commands');
      await this.fileManager.createDirectory(commandsDir);
    } catch (error) {
      throw new Error(`Failed to create directories: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Copy templates from node_modules/madr to .madrkit/templates
   */
  async copyTemplates(): Promise<void> {
    try {
      // Determine source path from node_modules
      const nodeModulesPath = this.fileManager.getAbsolutePath('node_modules/madr/template');

      // Check if MADR was installed
      const madrExists = await this.fileManager.directoryExists(nodeModulesPath);
      if (!madrExists) {
        throw new Error('MADR package not found in node_modules. Ensure npm install succeeded.');
      }

      // Copy template files
      const templateDir = this.fileManager.getAbsolutePath(this.templatePath);
      await this.fileManager.copyDirectory(nodeModulesPath, templateDir);
    } catch (error) {
      throw new Error(`Failed to copy templates: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Complete initialization process
   */
  async initialize(options: InitializationOptions = {}): Promise<InitializationResult> {
    const decisionsPath = options.outputDir || this.decisionsPath;
    const templatePath = options.templateDir || this.templatePath;

    // Check if already initialized
    const isInitialized = await this.detectInitialization();
    if (isInitialized && !options.force) {
      // Already initialized, return current state
      const projectState = createDefaultProjectState();
      projectState.decisionsPath = decisionsPath;
      projectState.templatePath = templatePath;
      projectState.initialized = true;
      return {
        success: true,
        projectState,
        message: 'MADR project is already initialized',
      };
    }

    try {
      // Step 1: Install MADR package
      console.log('✓ Installing MADR package...');
      await this.installPackage();

      // Step 2: Create directories
      console.log('✓ Creating directory structure: ' + decisionsPath);
      await this.createDirectories();

      // Step 3: Copy templates
      console.log('✓ Setting up templates in ' + templatePath);
      await this.copyTemplates();

      // Step 4: Create project state
      const projectState = createDefaultProjectState();
      projectState.decisionsPath = decisionsPath;
      projectState.templatePath = templatePath;
      projectState.initialized = true;
      projectState.madrVersion = this.getMadrVersion();

      // Validate project state
      const validationErrors = validateProjectState(projectState);
      if (validationErrors.length > 0) {
        throw new Error(`Invalid project state: ${validationErrors.join(', ')}`);
      }

      return {
        success: true,
        projectState,
        message: 'MADR project initialized successfully',
      };
    } catch (error) {
      throw new Error(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get installed MADR package version
   */
  private getMadrVersion(): string {
    try {
      const packageJsonPath = this.fileManager.getAbsolutePath('node_modules/madr/package.json');
      const packageJson = require(packageJsonPath);
      return packageJson.version || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}
