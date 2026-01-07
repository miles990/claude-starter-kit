---
category: debugging
name: Standard Debug Workflow
applicable_to: [all-projects, troubleshooting]
success_rate: 85%
---

# Standard Debug Workflow Pattern

## When to Use

When encountering:
- Unexpected errors
- Failed tests
- Incorrect behavior
- Performance issues

## Diagnostic Steps

### Step 1: Reproduce

```
Can I reliably reproduce the issue?
├─ Yes → Continue to Step 2
└─ No  → Gather more context
        ├─ Check logs
        ├─ Ask for reproduction steps
        └─ Add logging to identify pattern
```

### Step 2: Isolate

```
Where does the issue originate?
├─ Input? → Validate input data
├─ Logic? → Add breakpoints/logs
├─ Output? → Check transformations
└─ External? → Test dependencies
```

### Step 3: Hypothesize

Form a specific hypothesis:
- "The issue occurs because X is null when Y expects a value"
- NOT "Something is wrong with the data"

### Step 4: Test

Design minimal test to prove/disprove hypothesis:
```
If hypothesis is correct:
  → This specific input should produce this specific error

Test result:
  → Confirmed: Fix the identified issue
  → Rejected: Form new hypothesis
```

### Step 5: Fix & Verify

1. Make minimal change to fix
2. Verify original issue is resolved
3. Verify no new issues introduced (run tests)
4. Document if novel (create failure memory)

## Failure Classification

| Type | Symptoms | Action |
|------|----------|--------|
| A: Knowledge Gap | Don't know how | Learn/search |
| B: Execution Error | Typo, wrong params | Review carefully |
| C: Environment | Missing deps, permissions | Fix environment |
| D: Wrong Strategy | Approach doesn't fit | Try alternative |
| E: Resource Limit | Memory, timeout | Optimize/scale |

## Example Application

**Issue**: API returns 500 error

1. **Reproduce**: Call API with same params → Error confirmed
2. **Isolate**: Add try-catch → Exception at database query
3. **Hypothesize**: Connection pool exhausted
4. **Test**: Check connection count → Confirmed: 100/100 used
5. **Fix**: Increase pool size, add connection release
