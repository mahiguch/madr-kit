/**
 * String utility functions for MADR Decision Command
 */

/**
 * Convert a string to kebab-case format suitable for filenames
 * @param text - The text to convert
 * @returns The kebab-case formatted string
 */
export function toKebabCase(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove special characters, keep only alphanumeric and hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Sanitize filename by removing/replacing unsafe characters
 * @param filename - The filename to sanitize
 * @returns The sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Characters that are unsafe in filenames: < > : " / \ | ? *
  return filename
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 200); // Max 200 characters
}

/**
 * Convert title to filename format (number-kebab-case.md)
 * @param number - The decision number (zero-padded)
 * @param title - The decision title
 * @returns The formatted filename
 */
export function titleToFilename(number: string, title: string): string {
  const kebab = toKebabCase(title);
  return `${number}-${kebab}.md`;
}

/**
 * Extract title from filename (removes number and .md extension)
 * @param filename - The filename (e.g., "001-my-decision.md")
 * @returns The extracted title
 */
export function filenameToTitle(filename: string): string {
  // Remove .md extension
  let name = filename.replace(/\.md$/, '');
  // Remove leading number and hyphen (e.g., "001-")
  name = name.replace(/^\d{3}-/, '');
  // Replace hyphens with spaces and capitalize words
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate if a string is safe for use as a filename
 * @param text - The text to validate
 * @returns True if the text is safe, false otherwise
 */
export function isValidFilename(text: string): boolean {
  // Check for unsafe characters
  const unsafeChars = /[<>:"/\\|?*]/;
  if (unsafeChars.test(text)) {
    return false;
  }
  // Check for empty or whitespace-only
  if (!text.trim()) {
    return false;
  }
  // Check length
  if (text.length > 200) {
    return false;
  }
  return true;
}
