---
task_type: feature-development
last_updated: 2025-01-07
---

# Feature Development Strategy Pool

## Strategy Selection Logic

```
New Feature Request
       │
       ▼
┌─────────────────┐
│ Assess Scope    │
│ - Small (<1 day)│──→ S1: Direct Implementation
│ - Medium (1-3d) │──→ S2: Incremental Development
│ - Large (>3d)   │──→ S3: Phased Delivery
└─────────────────┘
```

---

## S1: Direct Implementation

**Priority**: 1 (try first for small features)
**Applicable**: Bug fixes, simple features, config changes
**Success Rate**: 90%

### Steps
1. Understand requirement (read, clarify if needed)
2. Implement solution
3. Test locally
4. Commit with clear message

### When to Escalate
- Taking >2x expected time
- Scope expanding
- Blocked by unknowns

---

## S2: Incremental Development

**Priority**: 2 (for medium complexity)
**Applicable**: New features, refactoring, integrations
**Success Rate**: 80%

### Steps
1. Break into sub-tasks (3-5 tasks)
2. Implement core functionality first
3. Add edge cases and error handling
4. Write tests alongside implementation
5. Review and refactor

### Checkpoints
- [ ] After core: Does basic flow work?
- [ ] After edges: Are errors handled?
- [ ] After tests: Is coverage adequate?

### When to Escalate
- More than 5 sub-tasks needed
- Architectural decisions required
- Cross-team dependencies

---

## S3: Phased Delivery

**Priority**: 3 (for complex features)
**Applicable**: Major features, system redesigns, migrations
**Success Rate**: 70%

### Phases

| Phase | Focus | Deliverable |
|-------|-------|-------------|
| 1. Discovery | Understand scope | Requirements doc |
| 2. Design | Plan architecture | Technical design |
| 3. Foundation | Core infrastructure | Working skeleton |
| 4. Features | Incremental features | Feature branches |
| 5. Polish | Edge cases, tests | Production-ready |

### Phase Gates
- Each phase needs explicit approval before proceeding
- Can pivot or cancel between phases
- Document decisions in `.claude/memory/decisions/`

---

## Strategy Switching

```
If current strategy fails:
│
├─ S1 failed → Try S2 (add structure)
│
├─ S2 failed → Try S3 (add phases)
│
└─ S3 failed → Escalate to human
              (likely scope/resource issue)
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Big Bang | All at once, hard to debug | Incremental delivery |
| Gold Plating | Over-engineering | MVP first, iterate |
| Scope Creep | Ever-expanding | Document scope, say no |
| Tunnel Vision | Ignoring feedback | Checkpoint reviews |
