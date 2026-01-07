---
paths: **/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}
---

# Testing Standards

## Test Structure

- Use descriptive test names: `it('should return user when valid ID provided')`
- Follow AAA pattern: Arrange, Act, Assert
- One assertion per test when possible

## Coverage Requirements

- Minimum 80% code coverage for new code
- Critical paths must have 100% coverage
- Include edge cases and error scenarios

## Test Types

| Type | Location | Purpose |
|------|----------|---------|
| Unit | `__tests__/` | Test individual functions |
| Integration | `tests/integration/` | Test module interactions |
| E2E | `tests/e2e/` | Test user workflows |

## Mocking Guidelines

- Mock external dependencies (APIs, databases)
- Don't mock what you don't own
- Use realistic test data
