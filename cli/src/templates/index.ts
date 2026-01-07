/**
 * Built-in templates (core functionality)
 *
 * These templates are built into the CLI for offline support.
 */

export const TEMPLATES = {
  claudeMd: (projectName: string) => `# ${projectName}

> Project configured with Claude Starter Kit

## Quick Reference

- \`/evolve [goal]\` - Trigger self-evolving agent
- \`/memory\` - Edit memory files
- \`skillpkg list\` - Show installed skills

## Project Structure

See @.claude/rules/ for coding standards.
See @.github/memory/index.md for project knowledge.
`,

  codeQuality: `---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Code Quality Standards

- Write clean, readable code with meaningful names
- Follow DRY principle
- Keep functions small and focused
- Handle errors explicitly
`,

  testing: `---
paths: **/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}
---

# Testing Standards

- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Minimum 80% coverage for new code
`,

  memoryManagement: `# Memory Management

## When to Create Memories

- **Learnings**: Solved a non-trivial problem
- **Failures**: Bug took >30min to solve
- **Decisions**: Architectural choices (ADR)
- **Patterns**: Reusable reasoning approaches

## Memory Workflow

1. Search before starting: \`Grep pattern="keyword" path=".github/memory/"\`
2. Create memory after learning
3. Update index.md
`,

  evolveWorkflow: `# Self-Evolving Workflow

## Mandatory Checkpoints

1. Before task: Search memory for related experience
2. After changes: Run build + tests
3. After milestone: Verify goal alignment

## Failure Handling

1. Diagnose failure type (A-E)
2. Record if novel
3. Try alternative strategy
4. Escalate after 3 attempts
`,

  mcpJson: JSON.stringify(
    {
      mcpServers: {
        skillpkg: {
          command: 'npx',
          args: ['-y', 'skillpkg-mcp-server'],
        },
        context7: {
          command: 'npx',
          args: ['-y', '@anthropic-ai/claude-code-mcp-context7'],
        },
      },
    },
    null,
    2
  ),

  settingsJson: JSON.stringify(
    {
      permissions: {
        allow: ['Bash(npm:*)', 'Bash(git:*)', 'Read', 'Write', 'Edit', 'Glob', 'Grep'],
      },
    },
    null,
    2
  ),

  memoryIndex: `# Project Memory Index

> Search with: \`Grep pattern="keyword" path=".github/memory/"\`

## Learnings
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## Decisions
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## Failures
<!-- FAILURES_START -->
<!-- FAILURES_END -->

## Patterns
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->
`,
};
