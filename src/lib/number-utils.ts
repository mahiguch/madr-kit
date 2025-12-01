/**
 * Number utility functions for MADR Decision Command
 */

/**
 * Pad a number with leading zeros to make it 3 digits (001, 002, etc.)
 * @param num - The number to pad
 * @returns The zero-padded number as a string
 */
export function padNumber(num: number): string {
  return String(num).padStart(3, '0');
}

/**
 * Extract decision number from filename
 * @param filename - The filename (e.g., "001-my-decision.md")
 * @returns The extracted number as a number, or -1 if not found
 */
export function extractNumberFromFilename(filename: string): number {
  const match = filename.match(/^(\d{3})-/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return -1;
}

/**
 * Validate if a filename matches the expected pattern (NNN-title.md)
 * @param filename - The filename to validate
 * @returns True if valid, false otherwise
 */
export function isValidDecisionFilename(filename: string): boolean {
  return /^\d{3}-[a-z0-9-]+\.md$/.test(filename);
}

/**
 * Calculate the next decision number based on a list of existing filenames
 * Scans for all files matching pattern NNN-*.md and returns max + 1
 * @param existingNumbers - Array of existing decision numbers
 * @returns The next decision number (1-999), or -1 if overflow
 */
export function getNextNumber(existingNumbers: number[]): number {
  if (existingNumbers.length === 0) {
    return 1;
  }

  const maxNumber = Math.max(...existingNumbers);

  // Check for overflow - return -1 to indicate error
  if (maxNumber >= 999) {
    return -1;
  }

  return maxNumber + 1;
}

/**
 * Validate if a number is in the valid range for decision numbers
 * @param num - The number to validate
 * @returns True if valid (1-999), false otherwise
 */
export function isValidDecisionNumber(num: number): boolean {
  return Number.isInteger(num) && num >= 1 && num <= 999;
}
