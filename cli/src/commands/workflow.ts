/**
 * Workflow Command
 *
 * Quick access to professional development workflows (superpowers)
 *
 * Usage:
 *   npx claude-starter-kit workflow           # List workflows
 *   npx claude-starter-kit workflow tdd       # Show TDD workflow
 *   npx claude-starter-kit workflow debug     # Show debugging workflow
 */
import chalk from 'chalk';
import inquirer from 'inquirer';

interface Workflow {
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  tips: string[];
  related: string[];
}

// ============================================
// Workflow Definitions (from superpowers)
// ============================================

const WORKFLOWS: Record<string, Workflow> = {
  'tdd': {
    name: 'Test-Driven Development',
    description: 'RED → GREEN → REFACTOR cycle for quality code',
    trigger: 'Use when implementing any feature or bugfix, before writing implementation code',
    steps: [
      '1. RED: Write a failing test that defines the expected behavior',
      '2. GREEN: Write minimal code to make the test pass',
      '3. REFACTOR: Improve the code while keeping tests green',
      '4. Repeat for each feature/behavior',
    ],
    tips: [
      'Start with the simplest case',
      'One behavior per test',
      'Refactor only when tests pass',
      'Test behavior, not implementation',
    ],
    related: ['verification-before-completion', 'code-review'],
  },

  'debug': {
    name: 'Systematic Debugging',
    description: 'Hypothesis → Isolate → Verify cycle for efficient bug fixing',
    trigger: 'Use when encountering any bug, test failure, or unexpected behavior',
    steps: [
      '1. REPRODUCE: Consistently reproduce the issue',
      '2. ISOLATE: Narrow down the scope (binary search)',
      '3. HYPOTHESIZE: Form a theory about the cause',
      '4. VERIFY: Test the hypothesis with evidence',
      '5. FIX: Apply the minimal fix',
      '6. VALIDATE: Ensure the fix works and no regression',
    ],
    tips: [
      'Never assume - verify everything',
      'One change at a time',
      'Keep notes on what you tried',
      'Check recent changes first',
    ],
    related: ['verification-before-completion'],
  },

  'brainstorm': {
    name: 'Brainstorming',
    description: 'Diverge → Converge → Actionable for creative solutions',
    trigger: 'Use before any creative work - features, components, functionality',
    steps: [
      '1. DIVERGE: Generate many ideas without judgment (10+)',
      '2. CLUSTER: Group related ideas together',
      '3. CONVERGE: Evaluate and select the best options',
      '4. REFINE: Develop selected ideas into actionable plans',
    ],
    tips: [
      'Quantity over quality in diverge phase',
      'No criticism during ideation',
      'Build on others\' ideas',
      'Define clear evaluation criteria',
    ],
    related: ['writing-plans', 'professional-thinking-frameworks'],
  },

  'plan': {
    name: 'Writing Plans',
    description: 'Structured approach to planning multi-step tasks',
    trigger: 'Use when you have specs or requirements for a multi-step task',
    steps: [
      '1. GOAL: Define the end state clearly',
      '2. SCOPE: Set boundaries (in/out of scope)',
      '3. BREAKDOWN: Decompose into actionable steps',
      '4. DEPENDENCIES: Identify prerequisites and blockers',
      '5. RISKS: Anticipate potential issues',
      '6. CRITERIA: Define acceptance criteria',
    ],
    tips: [
      'Be specific about success criteria',
      'Include verification steps',
      'Plan for rollback if needed',
      'Review with stakeholders before executing',
    ],
    related: ['executing-plans', 'brainstorming'],
  },

  'execute': {
    name: 'Executing Plans',
    description: 'Execute implementation plans with review checkpoints',
    trigger: 'Use when you have a written plan to execute',
    steps: [
      '1. REVIEW: Read and understand the full plan',
      '2. CHECKPOINT: Verify prerequisites are met',
      '3. EXECUTE: Work through steps sequentially',
      '4. VALIDATE: Check each step\'s acceptance criteria',
      '5. DOCUMENT: Record any deviations or learnings',
      '6. COMPLETE: Run final verification',
    ],
    tips: [
      'Don\'t skip verification steps',
      'Document deviations immediately',
      'Ask for clarification when blocked',
      'Update plan if scope changes',
    ],
    related: ['writing-plans', 'verification-before-completion'],
  },

  'review': {
    name: 'Code Review',
    description: 'Structured approach to reviewing and receiving code reviews',
    trigger: 'Use when completing tasks or reviewing others\' work',
    steps: [
      '1. UNDERSTAND: Read to understand, not to critique',
      '2. VERIFY: Check that requirements are met',
      '3. QUALITY: Look for code quality issues',
      '4. SECURITY: Check for security concerns',
      '5. PERFORMANCE: Identify potential bottlenecks',
      '6. FEEDBACK: Provide constructive, actionable feedback',
    ],
    tips: [
      'Be specific in feedback',
      'Explain the "why"',
      'Praise good patterns',
      'Suggest, don\'t demand',
    ],
    related: ['verification-before-completion', 'tdd'],
  },

  'verify': {
    name: 'Verification Before Completion',
    description: 'Final checks before claiming work is complete',
    trigger: 'Use when about to claim work is complete, before committing or creating PRs',
    steps: [
      '1. BUILD: Verify the build passes',
      '2. TEST: Run all relevant tests',
      '3. LINT: Check for linting errors',
      '4. TYPES: Verify type checking passes',
      '5. MANUAL: Do a quick manual test',
      '6. COMMIT: Only commit if all checks pass',
    ],
    tips: [
      'Evidence before assertions',
      'Run verification commands, don\'t assume',
      'Check edge cases manually',
      'Review diff before committing',
    ],
    related: ['tdd', 'code-review'],
  },

  'think': {
    name: 'Professional Thinking Frameworks',
    description: '25 frameworks for multi-perspective analysis',
    trigger: 'Use when facing complex problems needing multi-perspective analysis',
    steps: [
      '1. SELECT: Choose relevant frameworks for the problem',
      '2. ANALYZE: Apply each framework systematically',
      '3. SYNTHESIZE: Combine insights from multiple perspectives',
      '4. DECIDE: Make an informed decision',
    ],
    tips: [
      'Use at least 3 different perspectives',
      'Document reasoning for each',
      'Look for conflicts between frameworks',
      'Consider stakeholder viewpoints',
    ],
    related: ['brainstorming', 'writing-plans'],
  },
};

// ============================================
// Workflow Command
// ============================================

export async function workflow(workflowName?: string): Promise<void> {
  if (!workflowName) {
    // Show workflow list
    console.log(chalk.bold.cyan('\n🔄 Available Development Workflows\n'));

    console.log(chalk.dim('Use: npx claude-starter-kit workflow <name>\n'));

    Object.entries(WORKFLOWS).forEach(([key, wf]) => {
      console.log(`  ${chalk.bold.cyan(key.padEnd(12))} ${wf.description}`);
    });

    console.log(chalk.dim('\nOr use in Claude Code:'));
    console.log(chalk.dim('  /brainstorm [topic]'));
    console.log(chalk.dim('  /write-plan [task]'));
    console.log(chalk.dim('  /execute-plan'));
    return;
  }

  const wf = WORKFLOWS[workflowName.toLowerCase()];
  if (!wf) {
    console.error(chalk.red(`\n❌ Unknown workflow: ${workflowName}`));
    console.log(chalk.dim('\nAvailable workflows:'));
    Object.keys(WORKFLOWS).forEach(k => console.log(`  - ${k}`));
    process.exit(1);
  }

  // Show workflow details
  console.log(chalk.bold.cyan(`\n🔄 ${wf.name}\n`));
  console.log(chalk.dim(wf.description));
  console.log('');

  console.log(chalk.bold('📍 When to use:'));
  console.log(`  ${wf.trigger}`);
  console.log('');

  console.log(chalk.bold('📋 Steps:'));
  wf.steps.forEach(step => {
    console.log(`  ${step}`);
  });
  console.log('');

  console.log(chalk.bold('💡 Tips:'));
  wf.tips.forEach(tip => {
    console.log(`  • ${tip}`);
  });
  console.log('');

  if (wf.related.length > 0) {
    console.log(chalk.bold('🔗 Related workflows:'));
    console.log(`  ${wf.related.join(', ')}`);
    console.log('');
  }

  console.log(chalk.dim('─'.repeat(50)));
  console.log(chalk.dim('Use this workflow in Claude Code by describing your task.'));
  console.log(chalk.dim('Claude will automatically apply the appropriate workflow.'));
}

// Interactive workflow selection
export async function interactiveWorkflow(): Promise<void> {
  const choices = Object.entries(WORKFLOWS).map(([key, wf]) => ({
    name: `${chalk.bold(key)} - ${wf.description}`,
    value: key,
  }));

  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Select a workflow to learn about:',
      choices,
    },
  ]);

  await workflow(selected);
}
