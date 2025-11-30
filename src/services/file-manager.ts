/**
 * File Manager Service - handles all file system operations
 */

import {
  ensureDir,
  fileExists,
  isDirectory,
  readFile,
  atomicWrite,
  listFiles,
  copyDirectory,
  copyFile,
} from '../lib/file-utils.js';
import * as path from 'path';

export class FileManager {
  /**
   * Check if a directory exists and is accessible
   */
  async directoryExists(dirPath: string): Promise<boolean> {
    return isDirectory(dirPath);
  }

  /**
   * Create a directory with all parent directories
   */
  async createDirectory(dirPath: string): Promise<void> {
    await ensureDir(dirPath);
  }

  /**
   * Write content to a file atomically
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await atomicWrite(filePath, content);
  }

  /**
   * Read a text file
   */
  async readFileContent(filePath: string): Promise<string> {
    return readFile(filePath);
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    return fileExists(filePath);
  }

  /**
   * List all decision files (NNN-*.md) in a directory
   */
  async listDecisionFiles(dirPath: string): Promise<string[]> {
    const pattern = /^\d{3}-.*\.md$/;
    return listFiles(dirPath, pattern);
  }

  /**
   * Copy a file from source to destination
   */
  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    await copyFile(sourcePath, destPath);
  }

  /**
   * Copy a directory recursively
   */
  async copyDirectory(sourceDir: string, destDir: string): Promise<void> {
    await copyDirectory(sourceDir, destDir);
  }

  /**
   * Get the absolute path for a relative path
   */
  getAbsolutePath(relativePath: string): string {
    if (path.isAbsolute(relativePath)) {
      return relativePath;
    }
    return path.resolve(process.cwd(), relativePath);
  }

  /**
   * Get the relative path from one directory to another
   */
  getRelativePath(from: string, to: string): string {
    return path.relative(from, to);
  }

  /**
   * Join path segments
   */
  joinPaths(...segments: string[]): string {
    return path.join(...segments);
  }

  /**
   * Get directory name from a path
   */
  getDirname(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Get basename from a path
   */
  getBasename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }
}
