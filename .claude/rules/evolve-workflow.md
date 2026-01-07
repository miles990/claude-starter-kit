# Self-Evolving Workflow Rules

## Triggering Evolution

Use `/evolve [goal]` when:
- Starting a new feature or complex task
- Goal requires learning new skills
- Task has unclear requirements needing exploration

## Mandatory Checkpoints

### Before Starting Any Task
```bash
# Search existing knowledge
Grep pattern="relevant_keyword" path=".github/memory/"
```
If related memory exists, read and apply it.

### After Code Changes
- Run build: ensure no compilation errors
- Run tests: ensure no regressions
- If either fails, fix before proceeding

### After Milestone Completion
Ask yourself:
- Does current progress align with original goal?
- Any scope creep?
- Need to adjust remaining tasks?

## Failure Handling

When encountering failures:
1. **Diagnose** - Classify failure type (A-E)
2. **Record** - Create failure memory if novel
3. **Strategize** - Pick alternative from strategy pool
4. **Retry** - Apply new strategy
5. **Escalate** - After 3 attempts, ask user

## Progress Reporting

Report progress at each major step:
```
Progress: [====>     ] 40%

Completed:
- Task A
- Task B

Current:
- Task C (in progress)

Remaining:
- Task D
- Task E
```
