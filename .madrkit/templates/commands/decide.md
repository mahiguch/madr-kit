# MADR Decision Command

**Feature ID**: 001-madr-decide-command
**Command**: `/madrkit.decide`
**Purpose**: Initialize MADR projects and create architectural decision records
**Status**: Active

## Overview

The `/madrkit.decide` command provides a complete workflow for managing architectural decision records:

1. **Initialization**: Set up a new MADR project
   - Create `docs/decisions/` directory
   - Install MADR package
   - Copy templates to `.madrkit/templates/`

2. **Decision Creation**: Guided interactive creation of new decision records
   - Answer questions about the decision
   - Automatically number records sequentially
   - Generate markdown files with MADR format
   - Update title index

3. **Index Management**: Automatically maintain `000-titles.md`
   - List all decisions
   - Track metadata (date, status)
   - Enable cross-referencing

## Command Usage

```bash
# Initialize MADR in current project
madrkit.decide init

# Create a new decision record
madrkit.decide create

# Show help
madrkit.decide --help
```

## User Stories

### US1: Initialize MADR Project (P1)
Developers can quickly set up a new MADR project structure.

**Flow**:
1. Run `/madrkit.decide` in fresh project
2. System detects no MADR installation
3. Prompts to initialize
4. Installs MADR package
5. Creates directory structure
6. Copies templates

**Success Criteria**:
- `docs/decisions/` directory exists
- `.madrkit/templates/` contains template files
- `000-titles.md` can be created

### US2: Guided Decision Creation (P2)
Developers can create decision records via interactive questionnaire.

**Flow**:
1. Run command in initialized project
2. Answer guided questions
3. System generates filename
4. File is written with proper numbering
5. Index is updated

**Success Criteria**:
- Decision record created with correct number
- Filename matches MADR convention
- All fields populated correctly
- Index shows new record

### US3: Title Index Management (P3)
Automatically maintain index file listing all decisions.

**Flow**:
1. New decision is created
2. System scans existing decisions
3. Generates index entries
4. Updates 000-titles.md
5. Index shows metadata

**Success Criteria**:
- Index shows all decisions
- Entries are sorted by number
- Links are correct
- Metadata is accurate

## Technical Details

**Technology Stack**:
- TypeScript 5.0+
- Node.js 18+
- Commander.js (CLI routing)
- Inquirer.js (Interactive prompts)
- Handlebars (Template rendering)
- Vitest (Testing)

**Core Services**:
- MADRInitializer: Project setup
- DecisionCreator: Record creation
- IndexManager: Index generation
- FileManager: File operations
- TemplateRenderer: Handlebars rendering

**Data Models**:
- Decision Record: Core ADR format
- Project State: Initialization tracking
- Title Index: Record listing
- Questionnaire Schema: Interactive questions

## Configuration

**Default Paths**:
- Decisions: `docs/decisions/`
- Templates: `.madrkit/templates/`
- Index: `docs/decisions/000-titles.md`

**Reserved Names**:
- `000-titles.md`: Title index (reserved number)
- `000`: Cannot be used for decision numbers

**Template Variables**:
- `{{number}}`: Zero-padded number (001, 002, etc.)
- `{{title}}`: Decision title
- `{{status}}`: Status (proposed, accepted, etc.)
- `{{date}}`: ISO 8601 date
- `{{context}}`: Problem statement
- `{{decision}}`: Decision made
- `{{consequences}}`: Outcomes
- `{{deciders}}`: Decision makers
- `{{alternatives}}`: Options considered
- `{{related}}`: Related decision numbers

## Error Handling

**Initialization Errors**:
- E001: Permission denied creating directories
- E002: npm installation failed
- E003: Template files not found
- E004: MADR already initialized

**Creation Errors**:
- E005: Project not initialized
- E006: Invalid filename or title
- E007: File write failed

## Future Enhancements

- [ ] Support multiple template variants
- [ ] Decision search and filtering
- [ ] Export to PDF/HTML
- [ ] Approval workflow
- [ ] Change history tracking
- [ ] Custom templates library
- [ ] Integration with version control

## References

- [MADR Specification](https://adr.github.io/madr/)
- [Design Document](../plan.md)
- [Data Model](../data-model.md)
- [CLI Interface](../contracts/cli-interface.md)
