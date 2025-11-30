# Task Completion Checklist

## Standard Steps After Completing Each Task

### 1. Code Quality
- [ ] Run `npm run build` (TypeScript must compile with no errors)
- [ ] Run `npm run lint` (ESLint must pass all checks)
- [ ] Run `npm run format` (Code formatted with Prettier)
- [ ] No console warnings or TypeScript compilation errors

### 2. Testing
- [ ] Run `npm test` (All tests must pass)
- [ ] If new functionality, add corresponding test cases
- [ ] Check coverage report doesn't regress: `npm run coverage`

### 3. Verification
- [ ] Review code with `git diff` for correctness
- [ ] Check `git status` for untracked files
- [ ] Manual testing if applicable (e.g., test CLI commands locally)
- [ ] No hardcoded values (use config or environment variables)

### 4. File Writing Best Practices
- After using Write or Edit tools, ALWAYS verify file contents with Read tool
- This ensures the changes were actually persisted correctly
- System reminders may show "(no content)" incorrectly, so always double-check

### 5. Documentation
- [ ] Update README.md if user-facing changes
- [ ] Add JSDoc comments for public APIs if missing
- [ ] Update PUBLISHING.md if npm-related changes

### 6. Git Management
- [ ] Don't commit unless explicitly requested by user
- [ ] Use meaningful commit messages following conventional commits
- [ ] Reference issue/task numbers in commit messages if applicable

## Special Considerations

### For Publishing Tasks
- Verify npm package.json fields (name, version, author, repository, etc.)
- Ensure "files" field correctly specifies what gets published
- Test with `npm pack --dry-run` before publishing
- Update version with `npm version patch|minor|major`
- Only push with explicit user approval

### For Test Writing
- Use Vitest syntax (similar to Jest)
- Mock FileManager and TemplateRenderer dependencies
- Test both success and error paths
- Organize tests into describe blocks by feature
