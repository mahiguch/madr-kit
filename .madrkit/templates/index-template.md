# Architecture Decision Records

**Last updated**: {{isoNow}}
**Total decisions**: {{totalDecisions}}

## Overview

This document catalogs all architectural decision records (ADRs) for this project. Each decision is numbered sequentially and can reference related decisions.

## Index

{{#if entries}}
| Number | Title | Status | Date |
|--------|-------|--------|------|
{{#each entries}}
| [{{padNumber number}}](./{{padNumber number}}-{{filename}}.md) | {{title}} | {{status}} | {{date}} |
{{/each}}
{{else}}
No decision records yet. Create your first one to get started.
{{/if}}

---

*This index is automatically maintained by the MADR toolkit.*
