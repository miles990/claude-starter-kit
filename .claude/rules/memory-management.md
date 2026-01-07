# Memory Management Rules

## When to Create Memories

### Learnings (`.claude/memory/learnings/`)
Create when:
- Solved a non-trivial problem
- Found a better approach to something
- Learned something project-specific

Format: `{date}-{slug}.md`

### Failures (`.claude/memory/failures/`)
Create when:
- Encountered a bug that took >30min to solve
- Made a mistake worth documenting
- Found a pitfall others should avoid

### Decisions (`.claude/memory/decisions/`)
Create when:
- Making architectural decisions
- Choosing between technologies
- Establishing new patterns

Format: `{number}-{title}.md` (ADR format)

### Patterns (`.claude/memory/patterns/`)
Create when:
- Identifying reusable reasoning patterns
- Documenting debugging approaches
- Creating checklists for common tasks

## Memory Lifecycle

1. **Create** - Document immediately after learning
2. **Use** - Search before starting related tasks: `Grep pattern="keyword" path=".claude/memory/"`
3. **Curate** - Monthly review:
   - Merge similar entries
   - Mark outdated with `status: deprecated`
   - Delete irrelevant entries

## Index Maintenance

Always update `.claude/memory/index.md` when adding new entries:
```markdown
<!-- LEARNINGS_START -->
- [Title](learnings/2025-01-07-slug.md) - tag1, tag2
<!-- LEARNINGS_END -->
```
