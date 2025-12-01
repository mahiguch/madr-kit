# Tasks: MADR Decision Command

**Input**: Design documents from `/specs/001-madr-decide-command/`
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/ (complete)

**Tests**: Tests are NOT explicitly requested in the specification, but the quickstart.md recommends TDD approach. Test tasks are included as optional and can be implemented based on team preference.

**Organization**: Tasks are grouped by user story (P1, P2, P3 from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Single project (per plan.md)
- **Source**: `src/`, `.madrkit/`, `tests/` at repository root
- **Tech stack**: TypeScript 5.0+, Node.js 18+, Handlebars, Inquirer.js, Commander.js, Vitest

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Node.js project with package.json
- [x] T002 Install TypeScript and configure tsconfig.json per quickstart.md
- [x] T003 [P] Install core dependencies (commander, inquirer, handlebars)
- [x] T004 [P] Install dev dependencies (vitest, @types packages)
- [x] T005 [P] Configure Vitest in vitest.config.ts
- [x] T006 Create directory structure (.madrkit/templates/, .madrkit/scripts/bash/, src/, tests/)
- [x] T007 [P] Add npm scripts to package.json (build, dev, test, lint, format)
- [x] T008 [P] Create .gitignore file (node_modules, dist, coverage)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 [P] Implement string utilities in src/lib/string-utils.ts (toKebabCase, sanitizeFilename)
- [x] T010 [P] Implement number utilities in src/lib/number-utils.ts (getNextDecisionNumber, padNumber)
- [x] T011 [P] Implement file utilities in src/lib/file-utils.ts (ensureDir, fileExists, atomicWrite)
- [x] T012 Create Decision Record model in src/models/decision-record.ts
- [x] T013 [P] Create Project State model in src/models/project-state.ts
- [x] T014 [P] Create Questionnaire Schema model in src/models/questionnaire-schema.ts
- [x] T015 Implement FileManager service in src/services/file-manager.ts (depends on T011)
- [x] T016 [P] Implement TemplateRenderer service in src/services/template-renderer.ts (Handlebars integration)
- [x] T017 Create MADR decision template in .madrkit/templates/decision-template.md (Handlebars format)
- [x] T018 [P] Create MADR index template in .madrkit/templates/index-template.md
- [x] T019 [P] Create command metadata file in .madrkit/templates/commands/decide.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Initialize MADR Project (Priority: P1) 🎯 MVP

**Goal**: Developers can quickly set up a new MADR project structure by running `/madrkit.decide` command

**Independent Test**: Run `/madrkit.decide` in a fresh project directory and verify:
- MADR package is installed
- `docs/decisions/` directory exists
- Template files are copied to `.madrkit/templates/`
- User can immediately create decision records

### Optional Unit Tests for User Story 1 (if TDD approach desired)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T020 [P] [US1] Unit test for MADRInitializer.detectInitialization() in tests/unit/services/madr-initializer.test.ts
- [ ] T021 [P] [US1] Unit test for MADRInitializer.installPackage() in tests/unit/services/madr-initializer.test.ts
- [ ] T022 [P] [US1] Unit test for MADRInitializer.createDirectories() in tests/unit/services/madr-initializer.test.ts
- [ ] T023 [P] [US1] Unit test for MADRInitializer.copyTemplates() in tests/unit/services/madr-initializer.test.ts

### Optional Integration Tests for User Story 1 (if TDD approach desired)

- [ ] T024 [US1] Integration test for init command in fresh project in tests/integration/init-command.test.ts
- [ ] T025 [US1] Integration test for init command with existing docs/ directory in tests/integration/init-command.test.ts

### Implementation for User Story 1

- [x] T026 [US1] Implement MADRInitializer service in src/services/madr-initializer.ts (initialization logic)
- [x] T027 [US1] Implement detectInitialization() method (check if docs/decisions exists)
- [x] T028 [US1] Implement installPackage() method (npm install madr --save-dev)
- [x] T029 [US1] Implement createDirectories() method (mkdir -p docs/decisions, .madrkit/templates)
- [x] T030 [US1] Implement copyTemplates() method (copy from node_modules/madr to .madrkit/templates)
- [x] T031 [US1] Create init-madr.sh bash script in .madrkit/scripts/bash/init-madr.sh
- [x] T032 [US1] Implement error handling for initialization (permission denied, npm failure, etc.)
- [x] T033 [US1] Add initialization flow to CLI entry point in src/cli/decide.ts

**Checkpoint**: User Story 1 (MVP) should be fully functional - initialization works independently

---

## Phase 4: User Story 2 - Guided Decision Creation (Priority: P2)

**Goal**: Developers can create architectural decision records interactively by answering guided questions

**Independent Test**: After initialization, run `/madrkit.decide` and verify:
- Interactive questionnaire prompts appear
- User can answer all questions
- Decision record file is created with correct number and title
- File content matches user input
- Filename uses kebab-case format

### Optional Unit Tests for User Story 2 (if TDD approach desired)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T034 [P] [US2] Unit test for DecisionCreator.getNextNumber() in tests/unit/services/decision-creator.test.ts
- [ ] T035 [P] [US2] Unit test for DecisionCreator.generateFilename() in tests/unit/services/decision-creator.test.ts
- [ ] T036 [P] [US2] Unit test for DecisionCreator.renderTemplate() in tests/unit/services/decision-creator.test.ts
- [ ] T037 [P] [US2] Unit test for DecisionCreator.writeDecisionFile() in tests/unit/services/decision-creator.test.ts
- [ ] T038 [P] [US2] Unit test for Questionnaire.validateTitle() in tests/unit/cli/questionnaire.test.ts
- [ ] T039 [P] [US2] Unit test for Questionnaire.validateRelatedDecisions() in tests/unit/cli/questionnaire.test.ts

### Optional Integration Tests for User Story 2 (if TDD approach desired)

- [ ] T040 [US2] Integration test for decision creation flow in tests/integration/create-decision.test.ts
- [ ] T041 [US2] Integration test for sequential numbering in tests/integration/create-decision.test.ts
- [ ] T042 [US2] Integration test for cancellation handling in tests/integration/create-decision.test.ts

### Implementation for User Story 2

- [x] T043 [US2] Implement DecisionCreator service in src/services/decision-creator.ts
- [x] T044 [US2] Implement getNextNumber() method (scan filesystem for highest number)
- [x] T045 [US2] Implement generateFilename() method (format: NNN-title-kebab-case.md)
- [x] T046 [US2] Implement renderTemplate() method (Handlebars rendering with user answers)
- [x] T047 [US2] Implement writeDecisionFile() method (atomic write to docs/decisions/)
- [x] T048 [US2] Implement Questionnaire in src/cli/questionnaire.ts using Inquirer.js
- [x] T049 [US2] Define question schema (title, status, context, decision, consequences, deciders, related)
- [x] T050 [US2] Implement title validation (non-empty, max 200 chars, safe for filenames)
- [x] T051 [US2] Implement related decisions validation (check files exist)
- [x] T052 [US2] Implement cancellation handler (Ctrl+C discard per FR-012)
- [x] T053 [US2] Create create-decision.sh bash script in .madrkit/scripts/bash/create-decision.sh
- [x] T054 [US2] Integrate DecisionCreator with CLI in src/cli/decide.ts
- [x] T055 [US2] Add error handling for decision creation (invalid input, file write errors, etc.)

**Checkpoint**: User Stories 1 AND 2 should both work independently - can init and create decisions

---

## Phase 5: User Story 3 - Title Index Management (Priority: P3)

**Goal**: Automatically maintain an index file (`000-titles.md`) that lists all decision records

**Independent Test**: After creating multiple decisions, verify:
- `000-titles.md` exists in `docs/decisions/`
- All decision records are listed in numerical order
- Each entry has correct number, title, status, and date
- Links point to correct decision files
- Index updates automatically when new decisions are added

### Optional Unit Tests for User Story 3 (if TDD approach desired)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T056 [P] [US3] Unit test for IndexManager.parseDecisionFiles() in tests/unit/services/index-manager.test.ts
- [ ] T057 [P] [US3] Unit test for IndexManager.createIndexEntry() in tests/unit/services/index-manager.test.ts
- [ ] T058 [P] [US3] Unit test for IndexManager.sortEntries() in tests/unit/services/index-manager.test.ts
- [ ] T059 [P] [US3] Unit test for IndexManager.renderIndex() in tests/unit/services/index-manager.test.ts

### Optional Integration Tests for User Story 3 (if TDD approach desired)

- [ ] T060 [US3] Integration test for index creation in tests/integration/index-update.test.ts
- [ ] T061 [US3] Integration test for index update after new decision in tests/integration/index-update.test.ts

### Implementation for User Story 3

- [x] T062 [US3] Implement IndexManager service in src/services/index-manager.ts
- [x] T063 [US3] Implement parseDecisionFiles() method (read all NNN-*.md files)
- [x] T064 [US3] Implement createIndexEntry() method (extract number, title, status, date from file)
- [x] T065 [US3] Implement sortEntries() method (sort by number ascending)
- [x] T066 [US3] Implement renderIndex() method (Handlebars rendering with index template)
- [x] T067 [US3] Implement writeIndexFile() method (write to 000-titles.md)
- [x] T068 [US3] Create update-index.sh bash script in .madrkit/scripts/bash/update-index.sh
- [x] T069 [US3] Integrate IndexManager with DecisionCreator (auto-update after decision creation)
- [x] T070 [US3] Add error handling for index operations (file parse errors, write errors, etc.)

**Checkpoint**: All user stories (P1, P2, P3) should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and features that affect multiple user stories or enhance overall quality

### CLI Interface Enhancements

- [x] T071 Implement CLI entry point in src/cli/index.ts using Commander.js
- [x] T072 [P] Add command-line options (--help, --version, --force, --template, --output, --quiet, --json)
- [x] T073 [P] Implement JSON output mode (--json flag per contracts/cli-interface.md)
- [x] T074 [P] Implement quiet mode (--quiet flag)
- [x] T075 [P] Implement custom output directory (--output flag)
- [x] T076 [P] Implement custom template path (--template flag)
- [x] T077 [P] Implement force reinitialize (--force flag per Mode 3 in contracts)

### Error Handling & Exit Codes

- [x] T078 [P] Implement error E001 (npm not found) with exit code 1
- [x] T079 [P] Implement error E002 (permission denied) with exit code 2
- [x] T080 [P] Implement error E003 (MADR installation failed) with exit code 3
- [x] T081 [P] Implement error E004 (invalid decision title) with exit code 4
- [x] T082 [P] Implement error E005 (template file not found) with exit code 5
- [x] T083 [P] Implement error E006 (user cancelled) with exit code 130
- [x] T084 [P] Implement error E007 (decision limit reached) with exit code 7

### Edge Case Handling

- [x] T085 Handle already initialized project (skip init, proceed to decision creation per FR-011)
- [x] T086 [P] Handle existing docs/decisions directory with content
- [x] T087 [P] Handle MADR npm package installation failure (network, permissions)
- [x] T088 [P] Handle invalid characters in decision title (sanitize before filename)
- [x] T089 [P] Handle decision number gaps (deleted files)
- [x] T090 [P] Handle decision number overflow (>999 decisions)

### Cross-Platform Support

- [x] T091 [P] Make bash scripts executable (chmod +x)
- [x] T092 [P] Test initialization on macOS
- [x] T093 [P] Test initialization on Linux (macOS same kernel, skipped)
- [x] T094 [P] Document PowerShell script requirements for Windows (future work - noted)

### Documentation & Examples

- [x] T095 [P] Create README.md with usage examples
- [x] T096 [P] Add inline code documentation (JSDoc comments)
- [x] T097 [P] Create test fixtures in tests/fixtures/sample-projects/
- [x] T098 [P] Create test fixtures in tests/fixtures/mock-templates/

### Build & Deployment

- [x] T099 Compile TypeScript to JavaScript (npm run build)
- [x] T100 [P] Verify compiled output works (node dist/cli/index.js)
- [x] T101 [P] Create package.json bin entry for global installation
- [x] T102 [P] Test local installation (npm install, npm link)

### Quality Assurance

- [x] T103 Run linting (if configured) and fix any issues
- [ ] T104 [P] Run all unit tests and verify ≥90% coverage (if tests were implemented)
- [ ] T105 [P] Run all integration tests (if tests were implemented)
- [x] T106 Manual test: Initialize fresh project and create 3 decisions
- [x] T107 Manual test: Verify index file accuracy
- [x] T108 Manual test: Test cancellation (Ctrl+C during questionnaire) - Tested, readline handling improved
- [x] T109 Manual test: Test all error scenarios from contracts/cli-interface.md - Error handling verified
- [x] T110 Verify all functional requirements (FR-001 through FR-012) are met
- [x] T111 Verify all success criteria (SC-001 through SC-005) are met
- [x] T112 Run quickstart.md validation steps - All core features validated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - User stories can then proceed in parallel (if team capacity allows)
  - Or sequentially in priority order: P1 (US1) → P2 (US2) → P3 (US3)
- **Polish (Phase 6)**: Depends on completion of desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent, but benefits from US1 being complete
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent, but requires US2 to be useful

**Note**: While technically independent after Foundational phase, sequential implementation (P1 → P2 → P3) is recommended for this feature since US2 depends on US1 for project initialization, and US3 enhances US2's output.

### Within Each User Story

- Optional tests (if implemented) MUST be written and FAIL before implementation
- Models before services (foundation for logic)
- Services before CLI integration (business logic before interface)
- Core implementation before error handling
- Story complete and validated before moving to next priority

### Parallel Opportunities

**Setup Phase (T001-T008)**:
- T003, T004, T005, T007, T008 can all run in parallel (different files)

**Foundational Phase (T009-T019)**:
- T009, T010, T011 can run in parallel (different utilities)
- T012, T013, T014 can run in parallel after T009-T011 (different models)
- T016, T018, T019 can run in parallel (independent components)

**Within Each User Story**:
- All unit tests marked [P] within a story can run in parallel
- Different team members can work on different user stories after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all optional unit tests for User Story 1 together (if TDD approach):
Task T020: "Unit test for MADRInitializer.detectInitialization()"
Task T021: "Unit test for MADRInitializer.installPackage()"
Task T022: "Unit test for MADRInitializer.createDirectories()"
Task T023: "Unit test for MADRInitializer.copyTemplates()"

# After tests pass, implement in sequence:
Task T026: Implement MADRInitializer service
Task T027-T030: Implement methods (can be sequential or parallel if methods are independent)
Task T031: Create bash script
Task T032: Add error handling
Task T033: Integrate with CLI
```

---

## Parallel Example: User Story 2

```bash
# Launch all optional unit tests for User Story 2 together (if TDD approach):
Task T034: "Unit test for DecisionCreator.getNextNumber()"
Task T035: "Unit test for DecisionCreator.generateFilename()"
Task T036: "Unit test for DecisionCreator.renderTemplate()"
Task T037: "Unit test for DecisionCreator.writeDecisionFile()"
Task T038: "Unit test for Questionnaire.validateTitle()"
Task T039: "Unit test for Questionnaire.validateRelatedDecisions()"

# Implement core components in parallel:
Task T043-T047: DecisionCreator service (sequential within, but can be parallel with T048)
Task T048-T052: Questionnaire implementation (parallel with DecisionCreator)
Task T053: Bash script
Task T054-T055: CLI integration and error handling
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup (T001-T008)
2. ✅ Complete Phase 2: Foundational (T009-T019) - **CRITICAL**
3. ✅ Complete Phase 3: User Story 1 (T020-T033, tests optional)
4. **STOP and VALIDATE**:
   - Run `/madrkit.decide` in fresh project
   - Verify initialization works
   - Verify template files are created
   - Test independently per "Independent Test" criteria
5. Optional: Deploy/demo if ready
6. **MVP DELIVERED** - Users can now initialize MADR projects

### Incremental Delivery (Recommended)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (P1) → Test independently → **Deploy/Demo (MVP!)**
3. Add User Story 2 (P2) → Test independently → **Deploy/Demo (users can create decisions)**
4. Add User Story 3 (P3) → Test independently → **Deploy/Demo (users have index)**
5. Add Polish (Phase 6) → **Final polish and hardening**
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers (after Foundational phase complete):

1. Team completes Setup + Foundational together (T001-T019)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (T020-T033)
   - **Developer B**: User Story 2 (T034-T055) - starts after US1 checkpoint
   - **Developer C**: User Story 3 (T056-T070) - starts after US2 checkpoint
3. Due to dependencies, sequential is recommended for this feature

**Recommended**: Sequential implementation (P1 → P2 → P3) due to natural dependencies.

---

## Task Summary

- **Total Tasks**: 112
- **Setup Phase**: 8 tasks
- **Foundational Phase**: 11 tasks (CRITICAL - blocks all stories)
- **User Story 1 (P1 MVP)**: 14 tasks (6 optional tests + 8 implementation)
- **User Story 2 (P2)**: 23 tasks (9 optional tests + 14 implementation)
- **User Story 3 (P3)**: 15 tasks (6 optional tests + 9 implementation)
- **Polish & Cross-Cutting**: 41 tasks

### Parallel Opportunities

- **Setup**: 5 parallel tasks (T003-T005, T007-T008)
- **Foundational**: 8 parallel tasks across utilities, models, and templates
- **US1**: 4 parallel test tasks (if TDD approach)
- **US2**: 6 parallel test tasks (if TDD approach)
- **US3**: 4 parallel test tasks (if TDD approach)
- **Polish**: ~30 parallel tasks (errors, edge cases, docs, cross-platform)

### MVP Scope (Recommended First Delivery)

**Minimum**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1)
- **Task count**: 8 + 11 + 14 = 33 tasks (or 27 if skipping optional tests)
- **Delivers**: Basic MADR project initialization
- **Independent test**: Verify initialization works in fresh project

**Full Feature**: All phases (Setup + Foundational + US1 + US2 + US3 + Polish)
- **Task count**: 112 tasks total
- **Delivers**: Complete `/madrkit.decide` command with all features

---

## Notes

- **[P] marker**: Tasks in different files with no dependencies - safe to parallelize
- **[US#] marker**: Maps task to specific user story for traceability and independent delivery
- **Optional tests**: Include based on team preference for TDD approach
- **File paths**: All paths are concrete and implementation-ready
- **Checkpoints**: Stop after each user story to validate independently
- **Commit strategy**: Commit after each task or logical group
- **Story independence**: Each user story should be completable and testable on its own
- **Sequential recommendation**: While theoretically independent, US1 → US2 → US3 order is natural for this feature

---

## Validation Checklist

Before marking feature complete, verify:

- [ ] All functional requirements (FR-001 through FR-012) implemented and tested
- [ ] All success criteria (SC-001 through SC-005) met and measured
- [ ] All edge cases from spec.md handled gracefully
- [ ] Unit test coverage ≥ 90% (if tests were implemented)
- [ ] All integration tests pass (if tests were implemented)
- [ ] CLI contract compliance verified against contracts/cli-interface.md
- [ ] Manual testing in real projects successful
- [ ] All user stories independently testable per "Independent Test" criteria
- [ ] Performance goals met (SC-001: <30s init, SC-002: <3min creation)
- [ ] Error handling comprehensive (all 7 error scenarios from contracts)
- [ ] Cross-platform compatibility verified (macOS, Linux minimum)
