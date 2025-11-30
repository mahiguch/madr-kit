# madrkit Project Overview

## Purpose
A command-line tool for setting up and managing MADR (Markdown Architectural Decision Records) in projects.

### Core Features
1. **Initialize MADR projects** - Set up project structure and install dependencies
2. **Create decision records** - Guided interactive questionnaire for documenting decisions
3. **Maintain title index** - Automatic index generation and updates

## Tech Stack
- **Language**: TypeScript (ES2022, strict mode, ESNext modules)
- **Runtime**: Node.js 18+
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Template Engine**: Handlebars
- **Testing**: Vitest with v8 coverage
- **Linting**: ESLint
- **Formatting**: Prettier

## Code Architecture
```
src/
├── cli/
│   ├── index.ts           # Main CLI entry point with Commander routing
│   └── questionnaire.ts   # Interactive prompts with Inquirer
├── lib/
│   ├── file-utils.ts      # File system operations (atomic writes, directory ops)
│   ├── number-utils.ts    # Decision number utilities (extraction, padding)
│   └── string-utils.ts    # String formatting (kebab-case, sanitization)
├── models/
│   ├── decision-record.ts # DecisionRecord interface with validation
│   ├── project-state.ts   # ProjectState configuration
│   └── questionnaire-schema.ts # Question definitions
└── services/
    ├── madr-initializer.ts    # Project initialization logic
    ├── decision-creator.ts    # Decision record creation and numbering
    ├── index-manager.ts       # Title index generation and updates
    ├── file-manager.ts        # File I/O wrapper with path utilities
    └── template-renderer.ts   # Handlebars rendering with custom helpers
```

## Key Patterns
- Service layer architecture (Lib → Models → Services → CLI)
- Atomic file writes (temp file + rename pattern)
- Filesystem-based decision numbering (no state file)
- Custom Handlebars helpers: padNumber, toISODate, isoNow, eq, ifAny
- Input validation with sanitization
- Comprehensive error handling with proper exit codes

## Project Deliverables
- **.madrkit/**: Templates, scripts, and command metadata
- **dist/**: Compiled JavaScript (auto-built on npm publish)
- **tests/**: Comprehensive test coverage (remaining tasks)
- **docs/decisions/**: Example decision records for documentation
- **README.md**: Complete user guide
- **PUBLISHING.md**: npm publication instructions
- **LICENSE**: MIT license for npm distribution
