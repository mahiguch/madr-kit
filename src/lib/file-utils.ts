/**
 * File system utility functions for MADR Decision Command
 */

import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Ensure a directory exists, creating it if necessary
 * @param dirPath - The directory path to ensure
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Check if a file exists
 * @param filePath - The file path to check
 * @returns True if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a path is a directory
 * @param dirPath - The directory path to check
 * @returns True if path is a directory, false otherwise
 */
export async function isDirectory(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Read a text file
 * @param filePath - The file path to read
 * @returns The file contents as a string
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

/**
 * Write to a file atomically (write to temp file, then rename)
 * @param filePath - The file path to write to
 * @param content - The content to write
 */
export async function atomicWrite(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  const filename = path.basename(filePath);

  // Ensure directory exists
  await ensureDir(dir);

  // Create temp file in same directory
  const tempPath = path.join(dir, `.${filename}.tmp`);

  try {
    // Write to temp file
    await fs.writeFile(tempPath, content, 'utf-8');

    // Rename temp file to final destination
    await fs.rename(tempPath, filePath);
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * List files in a directory matching a pattern
 * @param dirPath - The directory path to list
 * @param pattern - Regular expression pattern to match filenames
 * @returns Array of matching filenames
 */
export async function listFiles(dirPath: string, pattern: RegExp): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    return files.filter((file) => pattern.test(file));
  } catch {
    return [];
  }
}

/**
 * Delete a file
 * @param filePath - The file path to delete
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, which is fine
    const err = error as Record<string, unknown>;
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Copy a file
 * @param sourcePath - The source file path
 * @param destPath - The destination file path
 */
export async function copyFile(sourcePath: string, destPath: string): Promise<void> {
  await ensureDir(path.dirname(destPath));
  await fs.copyFile(sourcePath, destPath);
}

/**
 * Copy directory recursively
 * @param sourceDir - The source directory
 * @param destDir - The destination directory
 */
export async function copyDirectory(sourceDir: string, destDir: string): Promise<void> {
  await ensureDir(destDir);

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    const stats = await fs.stat(sourcePath);

    if (stats.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await copyFile(sourcePath, destPath);
    }
  }
}
