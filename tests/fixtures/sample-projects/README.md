# Sample Projects Fixtures

These are sample MADR projects used for testing and development.

## Structure

Each sample project directory contains a complete, initialized MADR project with:
- `docs/decisions/` - Directory containing decision records
- `.madrkit/templates/` - Custom or standard templates
- Sample decision files for testing

## Using Sample Projects

When testing madrkit functionality, copy these directories to a temporary location:

```bash
cp -r sample-projects/basic-project /tmp/test-project
cd /tmp/test-project
madrkit  # Run the tool against this project
```

## Available Fixtures

- `basic-project/` - A minimal initialized MADR project
- `with-decisions/` - A project with existing decision records
- `with-custom-template/` - A project with a custom template
