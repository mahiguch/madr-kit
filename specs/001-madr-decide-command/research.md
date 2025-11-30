# Research: MADR Decision Command

**Feature**: MADR Decision Command
**Branch**: 001-madr-decide-command
**Date**: 2025-11-30

## Overview

This document consolidates research findings for technical decisions needed to implement the `/madrkit.decide` command. Research focused on resolving clarifications identified in Technical Context and establishing best practices for CLI tool development.

## Research Items

### 1. Markdown Processing Library

**Decision**: Use **Handlebars** for template rendering

**Rationale**:
- Industry-standard template engine with wide adoption
- Logic-less templates keep decision records clean and maintainable
- Strong TypeScript support via `@types/handlebars`
- Allows conditional rendering for optional MADR sections
- Compatible with MADR template structure (frontmatter + markdown body)
- Lightweight with minimal dependencies

**Alternatives Considered**:
- **Mustache**: Too limited for conditional sections and loops
- **EJS**: Too much logic in templates, harder to maintain
- **Custom string replacement**: Fragile, no escaping, difficult to extend
- **Markdown-it**: Parser not renderer, would still need template engine

**Implementation Notes**:
- Use Handlebars for decision record template rendering
- Keep templates in `.madrkit/templates/` directory
- Support custom helpers for date formatting, kebab-case conversion
- Preserve markdown formatting through `{{{triple-brace}}}` syntax

---

### 2. CLI Framework for Interactive Prompts

**Decision**: Use **Inquirer.js** for interactive questionnaires

**Rationale**:
- De facto standard for Node.js interactive CLIs
- Rich prompt types (input, confirm, list, checkbox, editor)
- Excellent TypeScript support with strong typing
- Validation and transformation built-in
- Consistent UX across platforms
- Actively maintained with large community
- Follows spec-kit pattern of text I/O protocol

**Alternatives Considered**:
- **Commander.js**: Excellent for command parsing but lacks interactive prompts
- **Yargs**: Good for command-line args but weak interactive support
- **Prompts**: Simpler but less feature-rich, smaller ecosystem
- **Enquirer**: Modern alternative but smaller community, less stable API

**Implementation Notes**:
- Use Commander.js for command routing (`/madrkit.decide`)
- Use Inquirer.js for questionnaire flow
- Define question schemas in `src/models/questionnaire-schema.ts`
- Support cancellation (Ctrl+C) with graceful cleanup per FR-012
- Validate user input (e.g., title sanitization for filenames)

---

### 3. Testing Framework

**Decision**: Use **Vitest** for unit and integration testing

**Rationale**:
- Modern, fast testing framework with excellent TypeScript support
- Drop-in replacement for Jest with better performance
- Native ESM support aligns with modern Node.js practices
- Built-in coverage reporting with c8
- Watch mode for rapid development
- Compatible with existing Jest assertions and matchers
- Matches spec-kit testing philosophy (fast, reliable, isolated)

**Alternatives Considered**:
- **Jest**: Industry standard but slower, complex ESM configuration
- **Node.js built-in test runner**: Too new, lacking ecosystem
- **AVA**: Concurrent execution good but smaller ecosystem
- **Mocha + Chai**: Older stack, more configuration needed

**Testing Strategy**:
- **Unit tests**: Individual services, models, utilities (high coverage)
- **Integration tests**: End-to-end command execution scenarios
- **Contract tests**: Template rendering with real MADR examples
- **Fixtures**: Mock projects, sample decision records for testing

**Test Structure**:
```text
tests/
├── unit/
│   ├── services/
│   │   ├── madr-initializer.test.ts
│   │   ├── decision-creator.test.ts
│   │   ├── template-renderer.test.ts
│   │   └── index-manager.test.ts
│   ├── models/
│   │   └── decision-record.test.ts
│   └── lib/
│       ├── string-utils.test.ts
│       └── number-utils.test.ts
├── integration/
│   ├── init-command.test.ts
│   ├── create-decision.test.ts
│   └── index-update.test.ts
└── fixtures/
    ├── sample-projects/
    │   ├── empty-project/
    │   ├── existing-madr/
    │   └── with-decisions/
    └── templates/
        ├── decision-template.md
        └── index-template.md
```

---

## Additional Best Practices Research

### 4. MADR Template Integration

**Decision**: Vendor MADR templates with customization support

**Rationale**:
- MADR package templates may change (breaking FR-004 reliability)
- Vendoring ensures consistent user experience across versions
- Allows project-specific customization without modifying node_modules
- Follows spec-kit pattern of template management

**Implementation**:
1. Copy MADR templates to `.madrkit/templates/decision-template.md` during init
2. Check for existing custom templates before overwriting
3. Support template versioning in frontmatter metadata
4. Allow users to customize templates without reinstallation

---

### 5. Sequential Numbering Strategy

**Decision**: Scan filesystem for highest number, increment by 1

**Rationale**:
- Simple, reliable, no state file needed
- Handles gaps from manual deletion (per Edge Cases)
- Works with git branch workflows (no merge conflicts)
- Matches MADR community conventions

**Implementation**:
- Use regex pattern `/^(\d{3})-.*\.md$/` to find decision files
- Extract numbers, find max, add 1
- Zero-pad to 3 digits (e.g., `001`, `002`, ..., `999`)
- Special case: `000-titles.md` (reserved for index)

---

### 6. Cross-Platform File Operations

**Decision**: Use Node.js `fs/promises` API exclusively

**Rationale**:
- Native Node.js API, no external dependencies
- Async/await pattern for clean error handling
- Works consistently across Windows/macOS/Linux
- Shell scripts handle platform-specific concerns separately

**Implementation**:
- Prefer `fs.promises.mkdir()` over shell `mkdir -p`
- Use `path.join()` for cross-platform path construction
- Handle EEXIST, ENOENT, EACCES errors explicitly per FR-010
- Validate paths to prevent directory traversal

---

## Technology Stack Summary

| Category | Technology | Version |
|----------|------------|---------|
| Language | TypeScript | ^5.0.0 |
| Runtime | Node.js | >=18.0.0 |
| Template Engine | Handlebars | ^4.7.0 |
| CLI Framework | Commander.js | ^11.0.0 |
| Interactive Prompts | Inquirer.js | ^9.0.0 |
| Testing Framework | Vitest | ^1.0.0 |
| Package Manager | npm | >=9.0.0 |

## Dependencies Resolved

All "NEEDS CLARIFICATION" items from Technical Context have been resolved:

✅ **Markdown processing**: Handlebars for template rendering
✅ **CLI framework**: Inquirer.js for interactive prompts
✅ **Testing**: Vitest for unit and integration tests

## Next Steps

Proceed to Phase 1:
- Generate data-model.md with entity definitions
- Create API contracts (CLI command interface)
- Generate quickstart.md for development setup
- Update agent context with technology decisions
