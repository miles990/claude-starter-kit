---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Code Quality Standards

## General Principles

- Write clean, readable code with meaningful names
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused (single responsibility)
- Add comments only for complex logic, not obvious code

## TypeScript/JavaScript Specific

- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use async/await instead of raw Promises
- Handle errors explicitly, never swallow exceptions

## Code Review Checklist

Before committing:
- [ ] No console.log in production code
- [ ] All functions have proper types
- [ ] Edge cases are handled
- [ ] No hardcoded values (use constants)
