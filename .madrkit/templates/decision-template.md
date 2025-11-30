# {{padNumber number}} - {{title}}

**Date**: {{date}}
**Status**: {{status}}
{{#if decidersArray}}
**Deciders**: {{#each decidersArray}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

## Context

{{context}}

## Decision

{{decision}}

## Consequences

{{consequences}}

{{#ifAny alternativesArray}}
## Alternatives

{{#each alternativesArray}}
### {{this.title}}

{{this.description}}

{{#ifAny this.pros}}
**Pros:**
{{#each this.pros}}- {{this}}
{{/each}}
{{/ifAny}}

{{#ifAny this.cons}}
**Cons:**
{{#each this.cons}}- {{this}}
{{/each}}
{{/ifAny}}

{{/each}}
{{/ifAny}}

{{#ifAny relatedArray}}
## Related

- [{{#each relatedArray}}{{padNumber this}}{{#unless @last}}, {{/unless}}{{/each}}]
{{/ifAny}}
