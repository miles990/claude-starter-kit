---
number: 002
title: Unified Planning Layer - spec-workflow + evolve PDCA Integration
date: 2026-01-10
status: accepted
tags: [architecture, planning, spec-workflow, evolve, pdca, integration]
---

# ADR-002: Unified Planning Layer

## Context

目前生態系統有兩個規劃/執行機制：

| 機制 | 特性 | 適用場景 |
|------|------|----------|
| **spec-workflow** | 正式文檔、審批閘門、Dashboard 追蹤 | 大型功能、需要審批 |
| **evolve PDCA** | 輕量迭代、自我修正、Memory 學習 | 快速改進、探索性任務 |

問題：
1. 用戶需要自己判斷該用哪個
2. 兩者的知識/經驗不互通
3. 沒有統一的入口

## Decision

建立 **Unified Planning Layer**，提供：

1. **單一入口** `/plan [goal]` - 智能路由到適當的工作流程
2. **自動路由** - 根據任務複雜度自動選擇
3. **共享 Memory** - 兩者共用 `.claude/memory/`
4. **任務銜接** - spec-workflow 產生的 tasks 可由 evolve 執行

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Unified Planning Layer                          │
│                                                                      │
│  User: /plan [goal]                                                  │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Planning Router                            │   │
│  │                                                               │   │
│  │  Analyze goal complexity:                                     │   │
│  │  • Keywords: "feature", "system", "architecture" → Large      │   │
│  │  • Keywords: "fix", "improve", "add" → Small                  │   │
│  │  • Estimated files: >10 → Large                               │   │
│  │  • Estimated time: >4h → Large                                │   │
│  │  • User override: --formal / --quick                          │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ├─── Small/Quick ───────────────────────────────────────┐   │
│         │                                                        │   │
│         │    ┌────────────────────────────────────────────┐     │   │
│         │    │           evolve PDCA                       │     │   │
│         │    │                                             │     │   │
│         │    │  Plan → Do → Check → Act → Memory          │     │   │
│         │    │         (self-correcting loop)              │     │   │
│         │    └────────────────────────────────────────────┘     │   │
│         │                                                        │   │
│         └─── Large/Formal ──────────────────────────────────────┘   │
│                                                                      │
│              ┌────────────────────────────────────────────┐         │
│              │         spec-workflow                       │         │
│              │                                             │         │
│              │  Requirements → Design → Tasks → Approval   │         │
│              │                    │                        │         │
│              └────────────────────┼────────────────────────┘         │
│                                   │                                  │
│                                   ▼                                  │
│              ┌────────────────────────────────────────────┐         │
│              │      Task Executor (evolve instances)       │         │
│              │                                             │         │
│              │  For each task in tasks.md:                 │         │
│              │    └─→ /evolve [task] --from-spec           │         │
│              └────────────────────────────────────────────┘         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Shared Memory Layer                        │   │
│  │                                                               │   │
│  │  .claude/memory/                                              │   │
│  │  ├── learnings/      ← Both write here                       │   │
│  │  ├── failures/       ← Both write here                       │   │
│  │  ├── decisions/      ← spec-workflow ADRs                    │   │
│  │  ├── specs/          ← spec-workflow specs (NEW)             │   │
│  │  └── strategies/     ← evolve strategies                     │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Routing Logic

```typescript
interface PlanningContext {
  goal: string;
  flags: {
    formal?: boolean;    // --formal: force spec-workflow
    quick?: boolean;     // --quick: force evolve
    fromSpec?: string;   // --from-spec: execute from existing spec
  };
}

function routePlanning(ctx: PlanningContext): 'spec-workflow' | 'evolve' {
  // User override
  if (ctx.flags.formal) return 'spec-workflow';
  if (ctx.flags.quick) return 'evolve';
  if (ctx.flags.fromSpec) return 'evolve'; // Execute mode

  // Auto-detect based on goal analysis
  const complexity = analyzeComplexity(ctx.goal);

  // Large indicators
  const largeKeywords = ['feature', 'system', 'architecture', 'redesign',
                         'migration', 'refactor entire', '重構', '系統', '功能'];
  const hasLargeKeyword = largeKeywords.some(k => ctx.goal.includes(k));

  // Estimate scope
  const estimatedFiles = estimateAffectedFiles(ctx.goal);
  const estimatedHours = estimateTime(ctx.goal);

  if (hasLargeKeyword || estimatedFiles > 10 || estimatedHours > 4) {
    return 'spec-workflow';
  }

  return 'evolve';
}
```

## Usage Examples

### Quick Task (Auto-routes to evolve)
```bash
/plan fix the login button alignment
# → Routes to evolve PDCA
# → Executes immediately with memory-based learning
```

### Large Feature (Auto-routes to spec-workflow)
```bash
/plan implement user authentication system with OAuth
# → Routes to spec-workflow
# → Creates specs/.specs/auth-system/
# → Generates requirements.md, design.md, tasks.md
# → Opens Dashboard for approval
# → After approval, executes tasks via evolve
```

### User Override
```bash
/plan add caching --formal
# → Forces spec-workflow even for small task

/plan redesign the architecture --quick
# → Forces evolve even for large task
```

### Execute from Spec
```bash
/plan --from-spec auth-system
# → Reads specs/.specs/auth-system/tasks.md
# → Executes each task via evolve
# → Logs implementation to spec-workflow
```

## Integration Points

### 1. Memory Sync
Both mechanisms write to shared memory:
- evolve → `.claude/memory/learnings/`, `failures/`, `strategies/`
- spec-workflow → `.claude/memory/specs/`, `decisions/`

### 2. Task Handoff Protocol
```yaml
# tasks.md format (spec-workflow output)
## Tasks

- [ ] 1. Setup authentication module
      context: |
        Requires JWT library, see design.md#auth-flow
      acceptance: |
        - Login endpoint returns valid JWT
        - Token validates correctly

# evolve reads this and executes:
/evolve "Setup authentication module" --context "Requires JWT library" --acceptance "Login endpoint returns valid JWT"
```

### 3. Implementation Logging
When evolve completes a task from spec:
1. Updates tasks.md: `- [ ]` → `- [x]`
2. Calls `log-implementation` MCP tool
3. Writes to shared memory

## CLI Integration

```bash
# New unified command
npx claude-starter-kit plan [goal] [options]

Options:
  --formal        Force spec-workflow (formal documentation)
  --quick         Force evolve PDCA (lightweight iteration)
  --from-spec     Execute tasks from existing spec
  --list          List active specs and their status
  --status        Show current planning status
```

## Consequences

### Positive
- Single entry point reduces cognitive load
- Auto-routing handles 90% of cases correctly
- Knowledge sharing between both mechanisms
- Formal specs when needed, lightweight when not

### Negative
- Additional complexity in routing logic
- Need to maintain two underlying systems
- Potential confusion if routing is wrong

### Mitigation
- Clear override flags (--formal, --quick)
- Transparent routing explanation in output
- Easy switch between modes mid-task

## Implementation Priority

1. **Phase 1**: Planning Router + CLI command
2. **Phase 2**: Task handoff protocol
3. **Phase 3**: Implementation logging integration
4. **Phase 4**: Dashboard unification
