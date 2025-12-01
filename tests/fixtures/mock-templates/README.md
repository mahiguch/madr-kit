# Mock Templates Fixtures

These are template files used for testing template rendering and validation.

## Structure

Each template file demonstrates different features and edge cases:

## Available Templates

- `basic-template.md` - Standard MADR decision record template
- `minimal-template.md` - Minimal template with required fields only
- `custom-template.md` - Custom template with additional metadata fields
- `invalid-template.md` - Intentionally broken template for error testing

## Using Mock Templates

When testing template functionality, reference these templates:

```bash
madrkit --template tests/fixtures/mock-templates/custom-template.md
```

## Template Format

All templates use Handlebars syntax for variable substitution:
- `{{number}}` - Zero-padded decision number (001, 002, etc.)
- `{{title}}` - Decision title
- `{{status}}` - Decision status (proposed, accepted, etc.)
- `{{context}}` - Context section
- `{{decision}}` - Decision section
- `{{consequences}}` - Consequences section
- `{{date}}` - Date in ISO format
- `{{deciders}}` - List of deciders
- `{{related}}` - Related decision numbers
