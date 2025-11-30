# CLI Interface Contract: /madrkit.decide

**Feature**: MADR Decision Command
**Branch**: 001-madr-decide-command
**Date**: 2025-11-30
**Version**: 1.0.0

## Overview

This document defines the command-line interface contract for the `/madrkit.decide` command. It specifies command syntax, options, arguments, input/output formats, and error handling according to text I/O protocol standards.

---

## Command Signature

```bash
/madrkit.decide [options]
```

### Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--help` | `-h` | boolean | false | Display help information |
| `--version` | `-v` | boolean | false | Display version information |
| `--force` | `-f` | boolean | false | Reinitialize even if already initialized |
| `--template <path>` | `-t` | string | `.madrkit/templates/decision-template.md` | Use custom template file |
| `--output <dir>` | `-o` | string | `docs/decisions` | Specify decisions directory |
| `--quiet` | `-q` | boolean | false | Suppress non-error output |
| `--json` | `-j` | boolean | false | Output results in JSON format |

---

## Execution Modes

### Mode 1: Initialization (First Run)

**Condition**: MADR project not yet initialized (no `docs/decisions/` directory)

**Behavior**:
1. Display initialization message
2. Install MADR package (`npm install madr --save-dev`)
3. Create directory structure (`docs/decisions/`)
4. Copy MADR templates to `.madrkit/templates/`
5. Transition to Mode 2 (decision creation)

**Output (stdout)**:
```
✓ Installing MADR package...
✓ Creating directory structure: docs/decisions/
✓ Setting up templates in .madrkit/templates/
✓ MADR project initialized successfully

Ready to create your first decision record.
```

**Exit Code**: 0 (success)

---

### Mode 2: Decision Creation (Normal Operation)

**Condition**: MADR project already initialized

**Behavior**:
1. Detect initialization status (skip initialization if already done per FR-011)
2. Calculate next decision number
3. Launch interactive questionnaire
4. Validate user inputs
5. Generate decision record file
6. Update title index (`000-titles.md`)

**Interactive Questionnaire Flow**:

```
? Decision title: [user input]
? Decision status: (Use arrow keys)
  ❯ proposed
    accepted
    rejected
    deprecated
    superseded

? Context (press Enter to open editor): [launches editor]
? Decision (press Enter to open editor): [launches editor]
? Consequences (press Enter to open editor): [launches editor]
? Deciders (comma-separated, optional): [user input]
? Related decision numbers (comma-separated, optional): [user input]

✓ Creating decision record: 001-decision-title.md
✓ Updating title index: 000-titles.md

Decision record created successfully!
  File: docs/decisions/001-decision-title.md
  Number: 001
```

**Output (stdout)**:
```
Decision record created successfully!
  File: docs/decisions/001-decision-title.md
  Number: 001
  Title: Decision Title
  Status: proposed
```

**JSON Output (with --json flag)**:
```json
{
  "success": true,
  "decisionRecord": {
    "number": 1,
    "title": "Decision Title",
    "status": "proposed",
    "filePath": "docs/decisions/001-decision-title.md",
    "createdAt": "2025-11-30T12:00:00Z"
  },
  "indexUpdated": true
}
```

**Exit Code**: 0 (success)

---

### Mode 3: Reinitialization (with --force flag)

**Condition**: User runs command with `--force` flag on initialized project

**Behavior**:
1. Display warning message
2. Confirm with user (unless `--quiet` flag)
3. Update MADR templates (overwrite existing)
4. Preserve existing decision records
5. Rebuild title index

**Output (stdout)**:
```
⚠ MADR project already initialized
? Reinitialize templates? This will overwrite custom templates. (y/N)

✓ Updating templates...
✓ Rebuilding title index...

Reinitialization complete.
  Existing decisions preserved: 5 files
  Templates updated from MADR version 3.0.0
```

**Exit Code**: 0 (success)

---

## Error Handling

### Error Response Format

**stdout**: Empty (all errors go to stderr)

**stderr**:
```
Error: [Error type]
[Detailed error message]

[Optional: Suggested fix]
```

**JSON Error Format** (with --json flag):
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional context",
    "suggestion": "Suggested fix"
  }
}
```

---

### Error Scenarios

#### E001: npm not found

**Trigger**: npm command not available in PATH

**stderr**:
```
Error: npm not found
MADR installation requires npm (Node Package Manager).

Please install Node.js from https://nodejs.org/ and try again.
```

**Exit Code**: 1

---

#### E002: Permission denied

**Trigger**: No write permissions for target directory

**stderr**:
```
Error: Permission denied
Cannot write to directory: docs/decisions/

Run with elevated permissions or change output directory:
  /madrkit.decide --output ./my-decisions
```

**Exit Code**: 2

---

#### E003: MADR package installation failed

**Trigger**: `npm install madr` command fails

**stderr**:
```
Error: MADR package installation failed
npm install command exited with code 1

Check your network connection and npm configuration.
See npm error log for details: /Users/user/.npm/_logs/...
```

**Exit Code**: 3

---

#### E004: Invalid decision title

**Trigger**: User provides title with unsafe characters

**stderr**:
```
Error: Invalid decision title
Title contains characters not safe for filenames: "Decision: <Title>"

Please use only letters, numbers, spaces, and hyphens.
```

**Exit Code**: 4

---

#### E005: Template file not found

**Trigger**: Custom template specified with --template doesn't exist

**stderr**:
```
Error: Template file not found
Cannot read template: /path/to/template.md

Verify the path or omit --template flag to use default template.
```

**Exit Code**: 5

---

#### E006: User cancelled questionnaire

**Trigger**: User presses Ctrl+C during questionnaire (per FR-012)

**stderr**:
```
Operation cancelled by user
No decision record was created.
```

**Exit Code**: 130 (standard SIGINT exit code)

---

#### E007: Decision number overflow

**Trigger**: More than 999 decisions exist

**stderr**:
```
Error: Maximum decisions reached
Project has reached the limit of 999 decision records.

Consider archiving old decisions or starting a new MADR project.
```

**Exit Code**: 7

---

## Input Validation

### Title Validation

**Rules**:
- Non-empty
- Max 200 characters
- Safe for filenames (converts to kebab-case)
- No special characters: `< > : " / \ | ? *`

**Transform**: `"Use MADR for Decisions"` → `"use-madr-for-decisions"`

---

### Status Validation

**Rules**:
- Must be one of: `proposed`, `accepted`, `rejected`, `deprecated`, `superseded`
- Case-insensitive input, normalized to lowercase

---

### Deciders Validation

**Rules**:
- Comma-separated list
- Each name trimmed of whitespace
- Empty string allowed (optional field)

**Transform**: `"Alice, Bob,  Charlie "` → `["Alice", "Bob", "Charlie"]`

---

### Related Decisions Validation

**Rules**:
- Comma-separated list of numbers
- Each number must be positive integer 1-999
- Numbers must reference existing decisions
- Empty string allowed (optional field)

**Transform**: `"1, 5, 12"` → `[1, 5, 12]`

**Validation**: Check that files `001-*.md`, `005-*.md`, `012-*.md` exist

---

## File System Operations

### Directory Creation

**Operation**: `mkdir -p docs/decisions`

**Error Handling**:
- EEXIST: Ignore (directory already exists)
- EACCES: Emit E002 (permission denied)
- ENOSPC: Emit "No space left on device" error

---

### File Writing

**Operation**: Write decision record to `docs/decisions/NNN-title.md`

**Atomicity**: Use temp file + rename pattern:
1. Write to `docs/decisions/.NNN-title.md.tmp`
2. Rename to `docs/decisions/NNN-title.md`
3. If rename fails, clean up temp file

**Error Handling**:
- EEXIST: Should not occur (number is sequential)
- EACCES: Emit E002 (permission denied)
- ENOSPC: Emit "No space left on device" error

---

### Template Copying

**Operation**: Copy MADR templates from `node_modules/madr/template/*` to `.madrkit/templates/`

**Files**:
- `decision-template.md`
- `index-template.md` (if exists)

**Error Handling**:
- Source not found: Emit E003 (MADR package not installed correctly)
- Destination not writable: Emit E002 (permission denied)

---

## Exit Codes Summary

| Code | Meaning | Example |
|------|---------|---------|
| 0 | Success | Decision created successfully |
| 1 | npm not found | npm command not in PATH |
| 2 | Permission denied | Cannot write to target directory |
| 3 | MADR installation failed | npm install error |
| 4 | Invalid input | Bad decision title format |
| 5 | File not found | Custom template doesn't exist |
| 6 | (Reserved) | - |
| 7 | Decision limit reached | More than 999 decisions |
| 130 | User cancellation | Ctrl+C during questionnaire |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MADRKIT_TEMPLATE_DIR` | `.madrkit/templates` | Template directory path |
| `MADRKIT_DECISIONS_DIR` | `docs/decisions` | Decisions directory path |
| `MADRKIT_EDITOR` | `$EDITOR` or `vim` | Editor for multi-line input |
| `NO_COLOR` | (unset) | Disable colored output |

---

## Platform Compatibility

### macOS / Linux

- Full support for all features
- Uses Bash scripts for file operations
- Editor support via `$EDITOR` environment variable

### Windows (WSL)

- Full support via WSL (Windows Subsystem for Linux)
- Paths converted to WSL format
- Uses Bash scripts

### Windows (PowerShell) - Future

- Requires PowerShell script variants
- Path handling differs (backslashes)
- Editor integration may differ

---

## Examples

### Example 1: First Run (Initialization + Decision Creation)

```bash
$ /madrkit.decide

✓ Installing MADR package...
✓ Creating directory structure: docs/decisions/
✓ Setting up templates in .madrkit/templates/
✓ MADR project initialized successfully

Ready to create your first decision record.

? Decision title: Use MADR for architecture decisions
? Decision status: accepted
? Context (press Enter to open editor): [editor opens]
? Decision (press Enter to open editor): [editor opens]
? Consequences (press Enter to open editor): [editor opens]
? Deciders (comma-separated, optional): Alice, Bob
? Related decision numbers (comma-separated, optional):

✓ Creating decision record: 001-use-madr-for-architecture-decisions.md
✓ Updating title index: 000-titles.md

Decision record created successfully!
  File: docs/decisions/001-use-madr-for-architecture-decisions.md
  Number: 001
  Title: Use MADR for architecture decisions
  Status: accepted
```

---

### Example 2: Subsequent Decision (Already Initialized)

```bash
$ /madrkit.decide

? Decision title: Choose PostgreSQL for data storage
? Decision status: proposed
? Context (press Enter to open editor): [editor opens]
? Decision (press Enter to open editor): [editor opens]
? Consequences (press Enter to open editor): [editor opens]
? Deciders (comma-separated, optional):
? Related decision numbers (comma-separated, optional): 1

✓ Creating decision record: 002-choose-postgresql-for-data-storage.md
✓ Updating title index: 000-titles.md

Decision record created successfully!
  File: docs/decisions/002-choose-postgresql-for-data-storage.md
  Number: 002
  Title: Choose PostgreSQL for data storage
  Status: proposed
```

---

### Example 3: JSON Output

```bash
$ /madrkit.decide --json

[questionnaire interaction omitted]

{
  "success": true,
  "decisionRecord": {
    "number": 3,
    "title": "Use Redis for caching",
    "status": "accepted",
    "filePath": "docs/decisions/003-use-redis-for-caching.md",
    "createdAt": "2025-11-30T15:30:00Z",
    "deciders": ["Alice", "Charlie"],
    "related": [2]
  },
  "indexUpdated": true,
  "projectState": {
    "decisionsPath": "docs/decisions",
    "totalDecisions": 3,
    "lastUpdated": "2025-11-30T15:30:00Z"
  }
}
```

---

### Example 4: Custom Output Directory

```bash
$ /madrkit.decide --output ./architecture/decisions

? Decision title: Adopt microservices architecture
...

Decision record created successfully!
  File: architecture/decisions/001-adopt-microservices-architecture.md
  Number: 001
```

---

### Example 5: Error Handling

```bash
$ /madrkit.decide

? Decision title: Invalid: <Title>
Error: Invalid decision title
Title contains characters not safe for filenames: "Invalid: <Title>"

Please use only letters, numbers, spaces, and hyphens.

$ echo $?
4
```

---

## Notes

- All interactive prompts use Inquirer.js for consistent UX
- Editor integration respects `$EDITOR` environment variable
- Output is colorized by default (disable with `NO_COLOR=1`)
- JSON mode (`--json`) implies `--quiet` for clean parsing
- The command is idempotent: running multiple times won't break state
- Cancellation (Ctrl+C) is always safe - no partial files created
