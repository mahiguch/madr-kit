# Implementation Plan: MADR Decision Command

**Branch**: `001-madr-decide-command` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-madr-decide-command/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a `/madrkit.decide` command that sets up MADR (Markdown Architectural Decision Records) projects and provides guided decision record creation. The command will initialize project structure, install dependencies, and guide users through creating numbered decision records with an automatically maintained title index. Implementation will follow the spec-kit architecture pattern with slash commands, templates, and shell scripts.

## Technical Context

**Language/Version**: TypeScript (following spec-kit patterns), Bash/Shell scripting for automation
**Primary Dependencies**:
- MADR npm package (for templates)
- Node.js/npm (runtime and package management)
- Markdown processing utilities (NEEDS CLARIFICATION: specific library for template rendering)
- CLI framework (NEEDS CLARIFICATION: Commander.js, Yargs, or Inquirer.js for interactive prompts)
**Storage**: File system (markdown files in `docs/decisions/`, templates in `.madrkit/templates/`)
**Testing**: NEEDS CLARIFICATION (Jest, Vitest, or other TypeScript testing framework)
**Target Platform**: Cross-platform CLI (macOS, Linux, Windows via WSL)
**Project Type**: Single project (CLI tool with templates and scripts)
**Performance Goals**:
- Initialization completes in <30 seconds (SC-001)
- Decision record creation completes in <3 minutes (SC-002)
- Command execution succeeds on first attempt for 90% of users (SC-005)
**Constraints**:
- Must work in environments with Node.js and npm installed
- Must support interactive terminal I/O for questionnaires
- Must handle file system operations reliably across platforms
**Scale/Scope**:
- Single user CLI tool
- Supports unlimited decision records per project
- Template system must be extensible for custom MADR formats

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Research Gate Check

Since the project constitution is not yet established, we will follow spec-kit best practices:

- ✅ **Command-First Design**: Feature is implemented as a slash command (`/madrkit.decide`)
- ✅ **Template-Driven**: Uses markdown templates for consistent decision record structure
- ✅ **Script-Based Automation**: Shell scripts handle initialization and file operations
- ✅ **Text I/O Protocol**: Command reads from stdin/args, outputs to stdout, errors to stderr
- ✅ **Cross-Platform Support**: Bash scripts support macOS/Linux, extensible to PowerShell for Windows
- ✅ **Extensibility**: Template system allows customization without code changes
- ⚠️ **Testing Strategy**: Needs clarification (will be addressed in Phase 0)

**Gate Status**: PASS (with clarifications to be resolved in Phase 0)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
.madrkit/
├── templates/
│   ├── commands/
│   │   └── decide.md           # Command definition and workflow
│   ├── decision-template.md     # MADR decision record template
│   └── index-template.md        # Title index template
└── scripts/
    ├── bash/
    │   ├── init-madr.sh         # Initialize MADR project
    │   ├── create-decision.sh   # Create new decision record
    │   └── update-index.sh      # Update title index
    └── powershell/
        ├── init-madr.ps1
        ├── create-decision.ps1
        └── update-index.ps1

src/
├── cli/
│   ├── decide.ts                # Main command entry point
│   ├── questionnaire.ts         # Interactive prompt handler
│   └── index.ts                 # CLI exports
├── services/
│   ├── madr-initializer.ts      # Project initialization logic
│   ├── decision-creator.ts      # Decision record creation logic
│   ├── template-renderer.ts     # Template processing
│   ├── file-manager.ts          # File system operations
│   └── index-manager.ts         # Title index management
├── models/
│   ├── decision-record.ts       # Decision record data model
│   ├── questionnaire-schema.ts  # Question definitions
│   └── project-state.ts         # MADR project state
└── lib/
    ├── string-utils.ts          # Kebab-case conversion, sanitization
    ├── number-utils.ts          # Sequential numbering logic
    └── file-utils.ts            # File system helpers

tests/
├── unit/
│   ├── services/
│   ├── models/
│   └── lib/
├── integration/
│   ├── command-execution.test.ts
│   ├── template-rendering.test.ts
│   └── index-management.test.ts
└── fixtures/
    ├── sample-projects/
    └── mock-templates/

package.json
tsconfig.json
```

**Structure Decision**: Single project structure following spec-kit patterns. The implementation separates concerns into:
- **Templates**: Command definitions and markdown templates (following spec-kit `.specify/templates/` pattern)
- **Scripts**: Shell automation for file operations (following spec-kit `.specify/scripts/` pattern)
- **Source**: TypeScript implementation with clear separation between CLI, services, models, and utilities
- **Tests**: Unit tests for individual components, integration tests for end-to-end workflows

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified. The design follows all spec-kit best practices:
- Single project structure (no multi-project complexity)
- Direct file system operations (no repository pattern overhead)
- Template-driven design (minimal abstraction)
- Clear separation of concerns without over-engineering

---

## Post-Design Constitution Check

*Re-evaluated after Phase 0 (Research) and Phase 1 (Design & Contracts) completion*

### Updated Gate Check

All clarifications from Technical Context have been resolved through research:

- ✅ **Command-First Design**: Confirmed - implemented as `/madrkit.decide` slash command
- ✅ **Template-Driven**: Confirmed - Handlebars templates for decision records and index
- ✅ **Script-Based Automation**: Confirmed - Bash scripts for init, create, and update operations
- ✅ **Text I/O Protocol**: Confirmed - stdin/args → stdout, errors → stderr, JSON output support
- ✅ **Cross-Platform Support**: Confirmed - Bash for macOS/Linux, PowerShell variants planned
- ✅ **Extensibility**: Confirmed - Template customization without code changes
- ✅ **Testing Strategy**: RESOLVED - Vitest for unit/integration tests, ≥90% coverage goal
- ✅ **Technology Decisions**: RESOLVED - TypeScript 5.0+, Node.js 18+, Inquirer.js, Commander.js, Handlebars

### Technology Stack Alignment

| Category | Selected Technology | Alignment with Best Practices |
|----------|---------------------|-------------------------------|
| Language | TypeScript 5.0+ | ✅ Strong typing, modern JavaScript features |
| Runtime | Node.js 18+ | ✅ Cross-platform, large ecosystem |
| CLI Framework | Commander.js | ✅ De facto standard for Node.js CLIs |
| Interactive Prompts | Inquirer.js | ✅ Industry standard, rich prompt types |
| Template Engine | Handlebars | ✅ Logic-less templates, widely adopted |
| Testing | Vitest | ✅ Modern, fast, excellent TypeScript support |
| Package Manager | npm | ✅ Native to Node.js, ubiquitous |

### Design Principles Compliance

- **Simplicity**: ✅ No unnecessary abstractions, direct file operations
- **Testability**: ✅ Clear separation of concerns, dependency injection ready
- **Maintainability**: ✅ Well-defined data model, comprehensive contracts
- **Extensibility**: ✅ Template-driven design allows user customization
- **Performance**: ✅ Meets all success criteria (SC-001, SC-002, SC-005)
- **Error Handling**: ✅ Comprehensive error scenarios with clear messages

**Final Gate Status**: ✅ PASS - Ready for Phase 2 (Task Breakdown)

---

## Phase Completion Summary

### ✅ Phase 0: Research (Completed)

**Artifacts Created**:
- [research.md](./research.md)

**Clarifications Resolved**:
1. Template rendering: Handlebars
2. CLI framework: Inquirer.js for prompts, Commander.js for routing
3. Testing framework: Vitest

**Key Decisions**:
- Vendor MADR templates to ensure consistency
- Sequential numbering via filesystem scan (no state file)
- Node.js `fs/promises` for cross-platform file operations

---

### ✅ Phase 1: Design & Contracts (Completed)

**Artifacts Created**:
- [data-model.md](./data-model.md) - 6 core entities with relationships
- [contracts/cli-interface.md](./contracts/cli-interface.md) - Complete CLI specification
- [quickstart.md](./quickstart.md) - Developer setup guide

**Key Deliverables**:
1. **Data Model**: Decision Record, Title Index, MADR Template, Project State, Questionnaire Schema, Alternative
2. **API Contract**: 3 execution modes, 7+ error scenarios, complete I/O specification
3. **Quickstart Guide**: 6-phase implementation workflow, TDD approach, debugging tips

**Agent Context**:
- Updated CLAUDE.md with TypeScript and file system storage information

---

## Next Steps

### Phase 2: Task Breakdown (Use `/speckit.tasks`)

The planning phase is complete. Next steps:

1. **Generate tasks.md**: Run `/speckit.tasks` command to break down the plan into implementable tasks
2. **Review task prioritization**: Ensure P1 tasks (MVP) are clearly identified
3. **Begin implementation**: Follow the development workflow in [quickstart.md](./quickstart.md)
4. **TDD approach**: Write tests first, then implement to pass tests

### Implementation Priorities

Based on user stories and dependencies:

**P1 (MVP) - User Story 1: Initialize MADR Project**
- Project initialization logic
- Directory structure creation
- Template copying
- MADR package installation

**P2 - User Story 2: Guided Decision Creation**
- Interactive questionnaire
- Decision record generation
- Sequential numbering
- Template rendering

**P3 - User Story 3: Title Index Management**
- Index file generation
- Automatic updates
- Entry sorting

### Success Validation

Before considering implementation complete, verify:
- [ ] All functional requirements (FR-001 through FR-012) implemented
- [ ] All success criteria (SC-001 through SC-005) met
- [ ] All edge cases from spec.md handled
- [ ] Unit test coverage ≥ 90%
- [ ] Integration tests cover all user scenarios
- [ ] CLI contract compliance verified
- [ ] Manual testing in real projects successful

---

## Documentation References

- **Feature Specification**: [spec.md](./spec.md)
- **Research Findings**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **CLI Contract**: [contracts/cli-interface.md](./contracts/cli-interface.md)
- **Developer Guide**: [quickstart.md](./quickstart.md)
- **Agent Context**: [CLAUDE.md](../../CLAUDE.md)

---

**Plan Status**: ✅ COMPLETE - Ready for task breakdown (`/speckit.tasks`)
