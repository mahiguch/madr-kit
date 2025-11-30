# Development Commands

## Building and Running
```bash
npm run build          # Compile TypeScript to dist/
npm run dev           # Run CLI from TypeScript source with ts-node
npm run dev -- --help # Show help message
```

## Testing
```bash
npm test              # Run all tests
npm run test:ui       # Interactive test UI
npm run coverage      # Generate coverage report
```

## Code Quality
```bash
npm run lint          # Check code style with ESLint
npm run format        # Auto-format code with Prettier
```

## Publishing
```bash
npm login             # Authenticate with npm account
npm version minor     # Bump version (patch/minor/major)
npm publish           # Publish to npm registry (auto-builds)
npm pack --dry-run    # Preview package contents
```

## Manual Testing
```bash
npm link              # Test globally installed CLI from development
madrkit --help        # Show CLI help
madrkit -j            # Test JSON output mode
```

## Git
```bash
git status            # Check current branch and changes
git log --oneline -n 10  # View recent commits
git diff              # View unstaged changes
```

## System Utilities
```bash
ls -la                # List files with details
find . -name "*.ts"   # Find TypeScript files
grep -r "pattern"     # Search code patterns
```
