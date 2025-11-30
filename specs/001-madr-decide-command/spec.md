# Feature Specification: MADR Decision Command

**Feature Branch**: `001-madr-decide-command`
**Created**: 2025-11-30
**Status**: Draft
**Input**: User description: "I create a command of `/madrkit.decide` that set up MADR projects using a command of `npm install madr && mkdir -p docs/decisions && cp node_modules/madr/template/* docs/decisions/` and write MADR in `decisions/000-titles.md` to ask some questions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Initialize MADR Project (Priority: P1)

Developers need to quickly set up a new MADR (Markdown Architectural Decision Records) project structure in their codebase to start documenting architectural decisions.

**Why this priority**: This is the foundational capability - without project initialization, no other decision documentation can occur. It delivers immediate value by creating a working MADR environment.

**Independent Test**: Can be fully tested by running the `/madrkit.decide` command in a fresh project directory and verifying that all required directories and template files are created correctly.

**Acceptance Scenarios**:

1. **Given** a project without MADR setup, **When** user runs `/madrkit.decide` command, **Then** system installs MADR package and creates `docs/decisions` directory structure with template files
2. **Given** an empty project, **When** initialization completes, **Then** user can immediately start creating decision records using the provided templates
3. **Given** a project with existing `docs` directory, **When** user runs `/madrkit.decide`, **Then** system creates `decisions` subdirectory without affecting existing documentation

---

### User Story 2 - Guided Decision Creation (Priority: P2)

Developers need an interactive way to create new architectural decision records by answering guided questions, making the decision documentation process easier and more consistent.

**Why this priority**: While users can manually create decision records after initialization, guided creation significantly improves adoption and consistency. This adds substantial value but depends on P1 being complete.

**Independent Test**: Can be tested by running the command after initialization and verifying that the system prompts for decision details and generates a properly formatted MADR file with a sequential number.

**Acceptance Scenarios**:

1. **Given** an initialized MADR project, **When** user runs `/madrkit.decide` for decision creation, **Then** system presents a series of questions to guide decision documentation
2. **Given** user answers all prompted questions, **When** submission is complete, **Then** system creates a new numbered decision file (e.g., `001-decision-title.md`) in `docs/decisions`
3. **Given** existing decision records numbered 001-005, **When** user creates a new decision, **Then** system assigns number 006 to the new record
4. **Given** user provides decision title in questions, **When** file is created, **Then** filename uses kebab-case format derived from the title

---

### User Story 3 - Title Index Management (Priority: P3)

Users need an automatically maintained index file (`000-titles.md`) that lists all decision records by title and number, making it easy to browse and locate specific decisions.

**Why this priority**: While helpful for navigation, this is a convenience feature that enhances the experience but isn't critical for core functionality. Users can still access individual decision files directly.

**Independent Test**: Can be tested by creating multiple decision records and verifying that `docs/decisions/000-titles.md` contains an up-to-date list of all decisions with links.

**Acceptance Scenarios**:

1. **Given** an initialized MADR project, **When** system creates the first decision record, **Then** `000-titles.md` is created or updated with the decision entry
2. **Given** multiple decision records exist, **When** user views `000-titles.md`, **Then** all decisions are listed in numerical order with titles and links
3. **Given** a new decision is added, **When** creation completes, **Then** `000-titles.md` is automatically updated to include the new entry

---

### Edge Cases

- What happens when user runs `/madrkit.decide` in a project that already has MADR initialized?
- How does system handle cases where `docs/decisions` directory exists but is not empty?
- What if the MADR npm package installation fails due to network issues or permission problems?
- How does the system behave when user cancels the guided question flow midway?
- What happens if user provides invalid characters in decision title (e.g., special characters not suitable for filenames)?
- How does numbering work if decision files are manually deleted, creating gaps in the sequence?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a `/madrkit.decide` command that can be invoked by developers
- **FR-002**: System MUST install the MADR npm package when initializing a new project
- **FR-003**: System MUST create a `docs/decisions` directory structure if it does not exist
- **FR-004**: System MUST copy MADR template files into the `docs/decisions` directory during initialization
- **FR-005**: System MUST present an interactive questionnaire to gather decision information
- **FR-006**: System MUST generate a new decision record file with sequential numbering based on existing records
- **FR-007**: System MUST format decision filenames using the pattern `NNN-decision-title.md` where NNN is a zero-padded three-digit number
- **FR-008**: System MUST create or update `000-titles.md` index file with all decision records
- **FR-009**: System MUST populate the generated decision file with user responses from the questionnaire
- **FR-010**: System MUST handle errors gracefully (e.g., permission issues, network failures) and provide clear feedback to users
- **FR-011**: System MUST detect if MADR is already initialized and skip initialization, proceeding directly to decision creation
- **FR-012**: Users MUST be able to cancel the questionnaire process, and all partial progress will be discarded upon cancellation

### Key Entities *(include if feature involves data)*

- **Decision Record**: Represents a documented architectural decision with attributes including decision number, title, status, context, decision, consequences, and metadata
- **Title Index**: A catalog file listing all decision records with their numbers and titles, serving as a navigation aid
- **MADR Template**: Standard template structure that defines the format and sections of each decision record

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can initialize a complete MADR project structure in under 30 seconds
- **SC-002**: Users can create a new decision record by answering guided questions in under 3 minutes
- **SC-003**: 95% of decision records follow consistent formatting and structure
- **SC-004**: Title index remains accurate and synchronized with actual decision files 100% of the time
- **SC-005**: Command execution succeeds on first attempt for 90% of users in standard development environments

## Assumptions *(optional)*

- Users have Node.js and npm installed in their development environment
- Users have write permissions to the project directory
- Project uses a standard file system that supports directory creation and file operations
- Users are familiar with command-line interfaces and markdown formatting
- Decision records will be stored in version control (Git) alongside source code
- The MADR npm package template structure remains compatible with the command implementation

## Dependencies *(optional)*

- MADR npm package must be available in the npm registry
- System requires file system access for directory and file creation
- Command execution environment must support interactive input/output for questionnaire

## Out of Scope *(optional)*

- Migration of existing decision records from other formats to MADR
- Automated decision impact analysis or dependency tracking
- Integration with specific project management or documentation tools
- Decision record versioning or history tracking beyond git version control
- Multi-language support for decision record templates
- Decision record validation or compliance checking against organizational standards
- Exporting decision records to other formats (PDF, HTML, etc.)
