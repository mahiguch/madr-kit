# Quickstart: MADR Decision Command Development

**Feature**: MADR Decision Command
**Branch**: 001-madr-decide-command
**Date**: 2025-11-30

## Overview

This quickstart guide walks developers through setting up the development environment and implementing the `/madrkit.decide` command from the ground up.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** >= 18.0.0 ([download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** (for version control)
- **Code editor** (VS Code recommended)
- **Terminal** (Bash on macOS/Linux, WSL on Windows)

---

## Project Setup

### Step 1: Initialize Project

```bash
# Create project directory
mkdir madr-kit
cd madr-kit

# Initialize git repository
git init
git checkout -b 001-madr-decide-command

# Initialize npm project
npm init -y

# Install TypeScript and development tools
npm install --save-dev typescript @types/node ts-node vitest

# Install project dependencies
npm install commander inquirer handlebars
npm install --save-dev @types/inquirer @types/handlebars

# Initialize TypeScript configuration
npx tsc --init
```

### Step 2: Configure TypeScript

Edit `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Step 3: Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'json'],
      exclude: ['tests/**', 'dist/**', '**/*.test.ts']
    }
  }
});
```

### Step 4: Update package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/cli/index.ts",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage",
    "lint": "eslint src tests --ext .ts",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\""
  }
}
```

---

## Project Structure Creation

### Step 5: Create Directory Structure

```bash
# Create source directories
mkdir -p src/{cli,services,models,lib}

# Create template directories
mkdir -p .madrkit/templates/commands
mkdir -p .madrkit/scripts/{bash,powershell}

# Create test directories
mkdir -p tests/{unit/{services,models,lib},integration,fixtures}
```

### Step 6: Create Initial Files

Create placeholder files for the main components:

```bash
# CLI entry point
touch src/cli/index.ts
touch src/cli/decide.ts
touch src/cli/questionnaire.ts

# Services
touch src/services/madr-initializer.ts
touch src/services/decision-creator.ts
touch src/services/template-renderer.ts
touch src/services/file-manager.ts
touch src/services/index-manager.ts

# Models
touch src/models/decision-record.ts
touch src/models/questionnaire-schema.ts
touch src/models/project-state.ts

# Utilities
touch src/lib/string-utils.ts
touch src/lib/number-utils.ts
touch src/lib/file-utils.ts

# Scripts
touch .madrkit/scripts/bash/init-madr.sh
touch .madrkit/scripts/bash/create-decision.sh
touch .madrkit/scripts/bash/update-index.sh

# Templates
touch .madrkit/templates/adr-template.md
touch .madrkit/templates/index-template.md
touch .madrkit/templates/commands/decide.md
```

---

## Implementation Workflow

### Phase 1: Core Models (Priority 1)

Start by implementing data models to establish type safety:

1. **decision-record.ts**: Define `DecisionRecord` interface
2. **project-state.ts**: Define `ProjectState` interface
3. **questionnaire-schema.ts**: Define question flow

**Test-Driven Development**:
```bash
# Write tests first
touch tests/unit/models/decision-record.test.ts

# Run tests (they should fail)
npm test

# Implement model
# Edit src/models/decision-record.ts

# Tests should pass
npm test
```

---

### Phase 2: Utilities (Priority 1)

Implement helper functions with unit tests:

1. **string-utils.ts**: `toKebabCase()`, `sanitizeFilename()`
2. **number-utils.ts**: `getNextDecisionNumber()`, `padNumber()`
3. **file-utils.ts**: `ensureDir()`, `fileExists()`, `atomicWrite()`

**Example: String Utils Test**

```typescript
// tests/unit/lib/string-utils.test.ts
import { describe, it, expect } from 'vitest';
import { toKebabCase } from '../../../src/lib/string-utils';

describe('toKebabCase', () => {
  it('converts title to kebab-case', () => {
    expect(toKebabCase('Use MADR for Decisions')).toBe('use-madr-for-decisions');
  });

  it('handles special characters', () => {
    expect(toKebabCase('API: Design & Implementation')).toBe('api-design-implementation');
  });
});
```

---

### Phase 3: Services (Priority 2)

Implement core business logic services:

1. **file-manager.ts**: File system operations
2. **template-renderer.ts**: Handlebars template rendering
3. **madr-initializer.ts**: Project initialization logic
4. **decision-creator.ts**: Decision record creation
5. **index-manager.ts**: Title index management

**Integration Testing**:
```typescript
// tests/integration/init-command.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MADRInitializer } from '../../src/services/madr-initializer';
import fs from 'fs/promises';
import path from 'path';

describe('MADR Initialization', () => {
  const testDir = path.join(__dirname, '../fixtures/test-project');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('creates directory structure', async () => {
    const initializer = new MADRInitializer(testDir);
    await initializer.initialize();

    const decisionsDir = path.join(testDir, 'docs/decisions');
    const exists = await fs.access(decisionsDir).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
```

---

### Phase 4: CLI Layer (Priority 3)

Implement command-line interface:

1. **questionnaire.ts**: Interactive prompts using Inquirer
2. **decide.ts**: Command handler
3. **index.ts**: CLI entry point using Commander

**Example: Questionnaire Implementation**

```typescript
// src/cli/questionnaire.ts
import inquirer from 'inquirer';
import { QuestionnaireAnswers } from '../models/questionnaire-schema';

export async function runQuestionnaire(): Promise<QuestionnaireAnswers> {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Decision title:',
      validate: (input) => input.length > 0 || 'Title is required'
    },
    {
      type: 'list',
      name: 'status',
      message: 'Decision status:',
      choices: ['proposed', 'accepted', 'rejected', 'deprecated', 'superseded']
    },
    {
      type: 'editor',
      name: 'context',
      message: 'Context (press Enter to open editor):'
    },
    // ... more questions
  ]);
}
```

---

### Phase 5: Templates (Priority 3)

Create markdown templates:

1. **decision-template.md**: MADR decision record template
2. **index-template.md**: Title index template
3. **commands/decide.md**: Command metadata

**Example: Decision Template**

```markdown
<!-- .madrkit/templates/adr-template.md -->
---
status: {{status}}
date: {{date}}
deciders: {{#each deciders}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
---

# {{number}}. {{title}}

## Context and Problem Statement

{{context}}

## Decision

{{decision}}

## Consequences

{{consequences}}

{{#if alternatives}}
## Considered Alternatives

{{#each alternatives}}
### {{this.title}}

{{this.description}}

**Pros:**
{{#each this.pros}}
- {{this}}
{{/each}}

**Cons:**
{{#each this.cons}}
- {{this}}
{{/each}}
{{/each}}
{{/if}}

{{#if related}}
## Related Decisions

{{#each related}}
- [{{this}}](./{{this}}-*.md)
{{/each}}
{{/if}}
```

---

### Phase 6: Shell Scripts (Priority 4)

Create bash scripts for file operations:

**Example: init-madr.sh**

```bash
#!/usr/bin/env bash
# .madrkit/scripts/bash/init-madr.sh

set -euo pipefail

DECISIONS_DIR="${1:-docs/decisions}"
TEMPLATE_DIR=".madrkit/templates"

# Create directories
mkdir -p "$DECISIONS_DIR"
mkdir -p "$TEMPLATE_DIR"

# Install MADR package
npm install madr --save-dev

# Copy templates
if [ -d "node_modules/madr/template" ]; then
  cp -r node_modules/madr/template/* "$TEMPLATE_DIR/"
fi

echo "✓ MADR initialized: $DECISIONS_DIR"
```

Make scripts executable:
```bash
chmod +x .madrkit/scripts/bash/*.sh
```

---

## Development Workflow

### Running the Command Locally

```bash
# Development mode (TypeScript)
npm run dev

# Build and run (JavaScript)
npm run build
node dist/cli/index.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- decision-record.test.ts

# Run with coverage
npm run coverage

# Watch mode for TDD
npm test -- --watch
```

### Linting and Formatting

```bash
# Install linting tools
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier

# Run linter
npm run lint

# Format code
npm run format
```

---

## Testing Strategy

### Unit Tests (High Priority)

Focus on testing individual functions in isolation:

- ✅ Models: Data validation, transformations
- ✅ Utilities: String manipulation, file operations
- ✅ Services: Business logic without I/O

**Coverage Goal**: ≥ 90% for models and utilities

---

### Integration Tests (Medium Priority)

Test end-to-end workflows:

- ✅ Project initialization
- ✅ Decision creation flow
- ✅ Index updating
- ✅ Template rendering

**Coverage Goal**: All user scenarios from spec.md

---

### Contract Tests (Low Priority)

Verify CLI interface adheres to contract:

- ✅ Command options parsing
- ✅ Exit codes
- ✅ Error messages
- ✅ JSON output format

---

## Debugging Tips

### Enable Debug Logging

```typescript
// Add to src/lib/logger.ts
export const DEBUG = process.env.DEBUG === '1';

export function debug(message: string, ...args: any[]) {
  if (DEBUG) {
    console.error('[DEBUG]', message, ...args);
  }
}
```

Run with debug enabled:
```bash
DEBUG=1 npm run dev
```

---

### Inspect Questionnaire Answers

```typescript
// In src/cli/decide.ts
const answers = await runQuestionnaire();
console.log('User answers:', JSON.stringify(answers, null, 2));
```

---

### Test File System Operations

Use a temporary directory for testing:

```typescript
import os from 'os';
import path from 'path';
import { mkdtemp } from 'fs/promises';

const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'madrkit-test-'));
// ... run tests in tmpDir
// ... cleanup after
```

---

## Common Issues

### Issue: "Cannot find module 'inquirer'"

**Solution**: Install type definitions
```bash
npm install --save-dev @types/inquirer
```

---

### Issue: Editor doesn't open for multi-line input

**Solution**: Set `$EDITOR` environment variable
```bash
export EDITOR=vim  # or nano, emacs, code --wait
npm run dev
```

---

### Issue: Tests fail with "ENOENT: no such file or directory"

**Solution**: Ensure test fixtures directory exists
```bash
mkdir -p tests/fixtures/sample-projects
```

---

## Next Steps

After completing implementation:

1. **Generate tasks.md**: Use `/speckit.tasks` command
2. **Implement features**: Follow task breakdown
3. **Write tests**: TDD approach (Red → Green → Refactor)
4. **Manual testing**: Run command in real projects
5. **Documentation**: Update README, add examples
6. **Code review**: Submit PR for review

---

## Resources

- [Spec Document](./spec.md)
- [Data Model](./data-model.md)
- [CLI Contract](./contracts/cli-interface.md)
- [Research Findings](./research.md)
- [MADR Documentation](https://adr.github.io/madr/)
- [Inquirer.js Docs](https://github.com/SBoudrias/Inquirer.js)
- [Handlebars Docs](https://handlebarsjs.com/)
- [Vitest Docs](https://vitest.dev/)

---

## Support

For questions or issues during development:
- Review the spec and contracts first
- Check existing tests for examples
- Reference spec-kit implementation patterns
- Ask for clarification in team chat

Happy coding! 🚀
