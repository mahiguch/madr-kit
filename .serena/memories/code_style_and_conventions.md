# Code Style and Conventions

## TypeScript
- **Strict Mode**: Enabled - no `any` or `unknown` types
- **Target**: ES2022 with ESNext modules
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Functions**: Prefer arrow functions and functions over classes (use classes only when extending Error)
- **No Classes**: Avoid TypeScript classes unless absolutely necessary (e.g., extending Error for instanceof checks)
- **Modules**: Use ES6 import/export with explicit .js extensions for relative imports

## File Structure
- **Services**: Use constructor injection for dependencies (FileManager, TemplateRenderer)
- **Error Handling**: Throw descriptive Error with context, catch at CLI layer
- **Async/Await**: All file operations are async via fs/promises
- **Validation**: Centralize in models or at input boundaries (CLI questionnaire)

## Naming Conventions
- **Files**: kebab-case (e.g., file-utils.ts, decision-creator.ts)
- **Directories**: lowercase (e.g., src/lib, src/services)
- **Functions**: Descriptive names (getNextNumber, createIndexEntry, renderTemplate)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects
- **Private Members**: Use underscore prefix (e.g., _decisionRecord)

## Template Patterns
- **Handlebars**: Use for both decision records and index generation
- **Custom Helpers**: padNumber (001), toISODate, isoNow, eq, ifAny
- **Data Preparation**: Transform all data before passing to template engine
- **Logic-less**: Keep templates simple, do computations in TypeScript

## Formatting
- **Prettier**: 2-space indentation, 80-character line length preference
- **Import Order**: Standard library → npm packages → local files
- **Comments**: Only for non-obvious logic, not for stating what code does

## File Operations
- **Atomic Writes**: Use temp file + rename pattern to prevent corruption
- **Error Messages**: Include context (file path, operation, error details)
- **Path Handling**: Always use FileManager utilities (joinPaths, getAbsolutePath)
- **Directory Creation**: Use ensureDir for safety

## Unit of Work (Task Completion)
When completing any task:
1. Run `npm run build` - TypeScript compilation
2. Run `npm run lint` - ESLint validation
3. Run `npm run format` - Auto-format code
4. Run `npm test` - Ensure all tests pass
5. Review changes with `git diff` and `git status`
6. Verify no regressions in manual testing if applicable
