# Data Model: MADR Decision Command

**Feature**: MADR Decision Command
**Branch**: 001-madr-decide-command
**Date**: 2025-11-30

## Overview

This document defines the core data entities for the MADR Decision Command feature. These entities represent the domain model without implementation details, serving as the foundation for the TypeScript type definitions.

---

## Core Entities

### 1. Decision Record

Represents a documented architectural decision with all required MADR fields.

**Attributes**:
- `number` (integer, required): Sequential decision number (001, 002, etc.)
- `title` (string, required): Human-readable decision title
- `status` (string, required): Decision status (proposed, accepted, rejected, deprecated, superseded)
- `date` (ISO 8601 date, required): Date decision was made or proposed
- `deciders` (array of strings, optional): List of people involved in decision
- `context` (markdown string, required): Problem statement and background
- `decision` (markdown string, required): The decision that was made
- `consequences` (markdown string, required): Positive and negative consequences
- `alternatives` (array of Alternative, optional): Considered alternatives
- `related` (array of integers, optional): Related decision numbers
- `metadata` (object, optional): Custom key-value pairs

**Relationships**:
- One Decision Record may reference many other Decision Records (via `related`)
- One Decision Record may supersede another (via `status: superseded` + `related`)

**Validation Rules**:
- `number`: Must be unique, positive integer, zero-padded to 3 digits
- `title`: Non-empty, max 200 characters, safe for filenames (kebab-case conversion)
- `status`: Must be one of: proposed, accepted, rejected, deprecated, superseded
- `date`: Valid ISO 8601 date string (YYYY-MM-DD)
- `context`, `decision`, `consequences`: Non-empty markdown strings

**State Transitions**:
```
proposed → accepted
proposed → rejected
accepted → deprecated
accepted → superseded (requires `related` field)
```

**Filename Format**: `{number}-{title-kebab-case}.md`
- Example: `001-use-madr-for-architecture-decisions.md`

---

### 2. Title Index

A catalog file listing all decision records, serving as a navigation aid.

**Attributes**:
- `entries` (array of IndexEntry, required): List of all decisions
- `lastUpdated` (ISO 8601 datetime, required): When index was last updated
- `totalDecisions` (integer, required): Count of decision records

**IndexEntry Sub-entity**:
- `number` (integer, required): Decision number
- `title` (string, required): Decision title
- `status` (string, required): Decision status
- `date` (ISO 8601 date, required): Decision date
- `filePath` (string, required): Relative path to decision file

**Relationships**:
- One Title Index contains many IndexEntry items
- Each IndexEntry references one Decision Record

**Validation Rules**:
- `entries`: Sorted by `number` ascending
- No duplicate `number` values
- All referenced files must exist

**Filename**: Fixed as `000-titles.md` (reserved number)

**Format Example**:
```markdown
# Architecture Decision Records

Last updated: 2025-11-30T12:00:00Z
Total decisions: 5

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [001](./001-use-madr.md) | Use MADR for architecture decisions | accepted | 2025-11-30 |
| [002](./002-choose-database.md) | Choose PostgreSQL for data storage | accepted | 2025-11-30 |
```

---

### 3. MADR Template

Standard template structure defining the format and sections of each decision record.

**Attributes**:
- `version` (string, required): MADR template version (e.g., "3.0.0")
- `sections` (array of TemplateSection, required): Ordered list of template sections
- `metadata` (object, optional): Template configuration

**TemplateSection Sub-entity**:
- `name` (string, required): Section name (e.g., "Context", "Decision")
- `required` (boolean, required): Whether section must be filled
- `placeholder` (string, optional): Help text for the section
- `format` (string, optional): Expected content format (markdown, list, table)

**Relationships**:
- One MADR Template contains many TemplateSection items
- Decision Records are created from MADR Template

**Validation Rules**:
- `version`: Semantic version string (MAJOR.MINOR.PATCH)
- `sections`: At minimum must include Context, Decision, Consequences

**Storage**: File at `.madrkit/templates/adr-template.md`

---

### 4. Project State

Represents the current state of an MADR project in the codebase.

**Attributes**:
- `initialized` (boolean, required): Whether MADR is set up
- `decisionsPath` (string, required): Path to decisions directory (e.g., "docs/decisions")
- `templatePath` (string, required): Path to template directory (e.g., ".madrkit/templates")
- `highestNumber` (integer, required): Highest decision number in use
- `madrVersion` (string, optional): Installed MADR package version
- `customTemplate` (boolean, required): Whether user has customized template

**Validation Rules**:
- `decisionsPath`: Must be a valid directory path
- `highestNumber`: Non-negative integer, represents last used number (not count)
- Both `decisionsPath` and `templatePath` must exist if `initialized: true`

**Detection Logic**:
- Project is `initialized` if `decisionsPath` directory exists with template files
- `highestNumber` is determined by scanning decision files and extracting max number
- `customTemplate` is `true` if `.madrkit/templates/adr-template.md` differs from vendored version

---

### 5. Questionnaire Schema

Defines the interactive questions asked when creating a decision record.

**Attributes**:
- `questions` (array of Question, required): Ordered list of questions
- `version` (string, required): Schema version for backwards compatibility

**Question Sub-entity**:
- `name` (string, required): Unique identifier for the question
- `type` (string, required): Question type (input, confirm, list, editor)
- `message` (string, required): Prompt text shown to user
- `default` (any, optional): Default value
- `required` (boolean, required): Whether answer is mandatory
- `validate` (function, optional): Validation function reference
- `when` (function, optional): Conditional display logic

**Question Types**:
- `input`: Free-text input (for title, deciders)
- `confirm`: Yes/no question (for optional sections)
- `list`: Single selection from options (for status)
- `editor`: Multi-line markdown editor (for context, decision, consequences)

**Default Question Flow**:
1. Title (input, required, validates for filename safety)
2. Status (list, required, options: proposed/accepted/rejected)
3. Context (editor, required, markdown)
4. Decision (editor, required, markdown)
5. Consequences (editor, required, markdown)
6. Deciders (input, optional, comma-separated list)
7. Related decisions (input, optional, comma-separated numbers)

**Validation Rules**:
- `name`: Unique within schema, camelCase
- `type`: Must be one of: input, confirm, list, editor
- `message`: Non-empty string
- Questions with `required: true` cannot be skipped

---

### 6. Alternative (Sub-entity)

Represents a considered alternative to the chosen decision.

**Attributes**:
- `title` (string, required): Name of the alternative
- `description` (markdown string, required): What this alternative entails
- `pros` (array of strings, optional): Advantages
- `cons` (array of strings, optional): Disadvantages

**Relationships**:
- Many Alternatives belong to one Decision Record

**Validation Rules**:
- `title`: Non-empty, max 100 characters
- `description`: Non-empty markdown string

---

## Entity Relationships Diagram

```
┌─────────────────────┐
│   Project State     │
│  (singleton)        │
└──────────┬──────────┘
           │ manages
           ▼
┌─────────────────────┐
│   Title Index       │ 1
│  (000-titles.md)    ├─────┐
└─────────────────────┘     │ contains
                            │
                          * │
           ┌────────────────┴──────────┐
           │    Index Entry            │
           │  (reference)              │
           └────────────┬──────────────┘
                        │ references
                      1 │
                        ▼
           ┌────────────────────────┐
           │   Decision Record      │ *
           │  (001-title.md,        ├────────┐ related
           │   002-title.md, ...)   │        │ decisions
           └───────────┬────────────┘        │
                       │ contains            │
                     * │                     │
                       ▼                     │
           ┌────────────────────────┐        │
           │    Alternative         │        │
           │  (sub-entity)          │        │
           └────────────────────────┘        │
                                             │
                       ┌─────────────────────┘
                       │ self-reference
                       ▼
           ┌────────────────────────┐
           │   Decision Record      │
           │  (related)             │
           └────────────────────────┘

┌─────────────────────┐
│   MADR Template     │ 1       * ┌────────────────────┐
│  (template file)    ├───────────┤  Template Section  │
└─────────────────────┘ contains  └────────────────────┘

┌─────────────────────┐
│ Questionnaire Schema│ 1       * ┌────────────────────┐
│  (question defs)    ├───────────┤     Question       │
└─────────────────────┘ contains  └────────────────────┘
```

---

## Data Flow

### Initialization Flow
```
User runs `/madrkit.decide`
  → Check Project State (initialized?)
  → If false:
      → Install MADR package (npm install madr)
      → Create decisions directory (docs/decisions/)
      → Copy templates to .madrkit/templates/
      → Update Project State (initialized: true)
```

### Decision Creation Flow
```
User runs `/madrkit.decide` (already initialized)
  → Load Questionnaire Schema
  → Display questions sequentially
  → Collect user answers
  → Validate answers
  → Calculate next decision number (highestNumber + 1)
  → Render MADR Template with answers
  → Write Decision Record file (NNN-title.md)
  → Update Title Index (add new entry)
  → Update Project State (highestNumber)
```

### Index Update Flow
```
New Decision Record created
  → Load existing Title Index
  → Parse all decision files in directory
  → Create IndexEntry for each
  → Sort entries by number
  → Render index template
  → Write 000-titles.md
  → Update lastUpdated timestamp
```

---

## Constraints & Invariants

1. **Uniqueness**: No two Decision Records can have the same number
2. **Sequential**: Numbers must be assigned sequentially (no skipping)
3. **Immutability**: Decision numbers never change after assignment
4. **Index Consistency**: Title Index must always reflect actual files
5. **Filename Safety**: Decision titles must convert to valid filenames
6. **Reserved Number**: `000` is reserved for Title Index only

---

## Future Extensibility

The data model supports future enhancements:
- **Tags/Categories**: Add `tags: string[]` to Decision Record
- **Search Index**: Add searchable fields to Project State
- **Templates Library**: Support multiple MADR Template variants
- **Approval Workflow**: Add `approvers` and `approvalDate` fields
- **Change History**: Track amendments to accepted decisions
- **Export Formats**: Transform Decision Record to PDF, HTML, etc.

---

## Notes

- All markdown fields support full CommonMark specification
- Date fields use ISO 8601 to support internationalization
- File paths are always relative to project root
- Kebab-case conversion preserves readability: "Use MADR" → "use-madr"
- The model is technology-agnostic; TypeScript implementation will add types
