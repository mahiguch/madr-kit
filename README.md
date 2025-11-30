# MADR Decision Command (madrkit)

A command-line tool for setting up and managing MADR (Markdown Architectural Decision Records) in your projects.

## Overview

`madrkit` simplifies the process of:
1. **Initializing MADR projects** - Set up project structure and install dependencies
2. **Creating decision records** - Guided interactive questionnaire for documenting decisions
3. **Maintaining title index** - Automatic index generation and updates

## Quick Start

### Installation

```bash
npm install -g madrkit
```

### Usage

#### Initialize a new MADR project

```bash
cd your-project
madrkit
```

This will:
- Create `docs/decisions/` directory
- Install the MADR package
- Set up template files in `.madrkit/templates/`
- Prepare your project for decision tracking

#### Create a decision record

```bash
madrkit
```

When MADR is already initialized, the tool will:
- Prompt you with guided questions about your decision
- Generate a numbered decision record file (001-decision-title.md)
- Automatically update the title index (000-titles.md)

### Options

```bash
madrkit [options]

Options:
  -f, --force          Reinitialize even if already initialized
  -o, --output <dir>   Specify decisions directory (default: docs/decisions)
  -t, --template <path> Use custom template file
  -q, --quiet          Suppress non-error output
  -j, --json           Output results in JSON format
  -h, --help           Show help message
  -v, --version        Show version
```

## Example Workflow

### Step 1: Initialize MADR

```bash
$ madrkit
✓ Installing MADR package...
✓ Creating directory structure: docs/decisions/
✓ Setting up templates in .madrkit/templates/

MADR project initialized successfully!

Ready to create your first decision record.
```

### Step 2: Create a Decision Record

```bash
$ madrkit
Creating new decision record...

? Decision title: Use TypeScript for the codebase
? Decision status: (Use arrow keys)
❯ proposed
  accepted
  rejected
  deprecated
  superseded
? Context (press Enter to open editor):
...
? Decision (press Enter to open editor):
...
? Consequences (press Enter to open editor):
...
? Deciders (comma-separated, optional): John Doe, Jane Smith
? Related decision numbers (comma-separated, optional):

✓ Decision record created successfully!
  File: docs/decisions/001-use-typescript-for-the-codebase.md
  Number: 001
  Title: Use TypeScript for the codebase
```

### Step 3: View Your Decisions

The index file (`docs/decisions/000-titles.md`) automatically lists all your decisions:

```markdown
# Architecture Decision Records

**Last updated**: 2025-11-30T12:00:00Z
**Total decisions**: 1

## Index

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](./001-use-typescript-for-the-codebase.md) | Use TypeScript for the codebase | proposed | 2025-11-30 |
```

## Decision Record Format

Each decision record follows the MADR 3.0 format:

```markdown
# 001 - Use TypeScript for the codebase

**Date**: 2025-11-30
**Status**: proposed
**Deciders**: John Doe, Jane Smith

## Context

Background and problem statement explaining why the decision was needed.

## Decision

The decision that was made.

## Consequences

Positive and negative consequences of this decision.

## Alternatives

(Optional) Alternative options that were considered.

## Related

(Optional) References to other related decision records.
```

## Project Structure

```
your-project/
├── docs/
│   └── decisions/
│       ├── 000-titles.md              # Auto-generated index
│       ├── 001-decision-title.md      # Decision record 1
│       ├── 002-another-decision.md    # Decision record 2
│       └── ...
├── .madrkit/
│   ├── templates/
│   │   ├── decision-template.md       # Custom decision template
│   │   ├── index-template.md          # Custom index template
│   │   └── commands/
│   │       └── decide.md              # Command metadata
│   └── scripts/
│       └── bash/
│           ├── init-madr.sh           # Initialization script
│           ├── create-decision.sh     # Decision creation script
│           └── update-index.sh        # Index update script
└── package.json
```

## Features

### Interactive Questionnaire
- **Title** - The decision subject (required, max 200 chars, validated for filename safety)
- **Status** - Decision state: proposed, accepted, rejected, deprecated, superseded
- **Context** - Background and problem statement (supports Markdown)
- **Decision** - Description of the chosen solution
- **Consequences** - Positive and negative outcomes
- **Deciders** - Who made the decision (optional)
- **Related Decisions** - References to other decision records (optional)

### Automatic Features
- Sequential decision numbering (001, 002, etc.)
- Title-to-filename conversion with kebab-case formatting
- Atomic file writes (safe from corruption)
- Automatic index generation and updates
- Template-based rendering using Handlebars

### Validation
- Title length and character safety
- Related decision number validation
- Date format validation (ISO 8601)
- Status value validation

## Customization

### Custom Templates

Edit templates in `.madrkit/templates/`:

**decision-template.md** - Customize the decision record format
**index-template.md** - Customize the index listing format

Templates use Handlebars syntax with custom helpers:
- `{{padNumber number}}` - Zero-pads numbers (001, 002, etc.)
- `{{isoNow}}` - Current ISO timestamp
- `{{#ifAny array}}...{{/ifAny}}` - Conditional rendering for arrays

### Custom Output Directory

```bash
madrkit -o "adr" # Use 'adr/' instead of 'docs/decisions/'
```

### Silent Mode

```bash
madrkit -q # Suppress all non-error output
```

### JSON Output

```bash
madrkit -j # Output decision metadata in JSON format
```

## Requirements

- Node.js 18+
- npm or yarn

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `EACCES: permission denied` | No write permission | Check directory permissions |
| `MADR package not found` | npm install failed | Run `npm install` manually |
| `Invalid decision title` | Unsafe filename characters | Remove special characters (< > : " / \ \| ? *) |
| `Decision 001 not found` | Invalid related decision number | Check the decision exists |

## Development

### Setup

```bash
git clone <repository>
cd madrkit
npm install
npm run build
npm run dev
```

### Testing

```bash
npm run test
npm run test:ui        # Interactive test UI
npm run coverage       # Coverage report
```

### Linting & Formatting

```bash
npm run lint           # Check code style
npm run format         # Auto-format code
```

## Project Architecture

```
src/
├── cli/
│   ├── index.ts           # Main CLI entry point
│   └── questionnaire.ts   # Interactive prompts
├── lib/
│   ├── file-utils.ts      # File system operations
│   ├── number-utils.ts    # Number/ID utilities
│   └── string-utils.ts    # String formatting
├── models/
│   ├── decision-record.ts # Core data model
│   ├── project-state.ts   # Project configuration
│   └── questionnaire-schema.ts # Question definitions
└── services/
    ├── decision-creator.ts    # Record creation logic
    ├── file-manager.ts        # File operations wrapper
    ├── index-manager.ts       # Index generation
    ├── madr-initializer.ts    # Project setup
    └── template-renderer.ts   # Handlebars rendering
```

## License

MIT

## Support

For issues, feature requests, or documentation improvements, please visit:
- [GitHub Issues](https://github.com/yourorg/madrkit/issues)
- [Discussions](https://github.com/yourorg/madrkit/discussions)

## References

- [MADR - Markdown Architectural Decision Records](https://adr.github.io/madr/)
- [ADR GitHub Organization](https://adr.github.io/)
- [Architecture Decision Record Guide](https://github.com/joelparkerhenderson/architecture-decision-record)
