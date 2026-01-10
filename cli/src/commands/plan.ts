/**
 * Unified Planning Command
 *
 * Intelligent routing between spec-workflow (formal) and evolve PDCA (quick)
 */
import chalk from 'chalk';
import inquirer from 'inquirer';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface PlanOptions {
  formal?: boolean;
  quick?: boolean;
  fromSpec?: string;
  status?: boolean;
  list?: boolean;
}

interface RoutingResult {
  route: 'spec-workflow' | 'evolve';
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

interface SpecStatus {
  name: string;
  path: string;
  totalTasks: number;
  completedTasks: number;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
}

// Keywords that suggest large/formal tasks
const LARGE_KEYWORDS = [
  'feature', 'system', 'architecture', 'redesign', 'migration',
  'refactor entire', 'implement', 'build', 'create new',
  '功能', '系統', '架構', '重構', '遷移', '建立', '實作'
];

// Keywords that suggest small/quick tasks
const SMALL_KEYWORDS = [
  'fix', 'improve', 'add', 'update', 'change', 'tweak', 'adjust',
  '修復', '改進', '新增', '更新', '修改', '調整'
];

/**
 * Analyze goal complexity and determine routing
 */
function analyzeGoal(goal: string): RoutingResult {
  const lowerGoal = goal.toLowerCase();

  // Check for large task indicators
  const hasLargeKeyword = LARGE_KEYWORDS.some(k => lowerGoal.includes(k.toLowerCase()));
  const hasSmallKeyword = SMALL_KEYWORDS.some(k => lowerGoal.includes(k.toLowerCase()));

  // Estimate complexity by word count and structure
  const wordCount = goal.split(/\s+/).length;
  const hasMultipleParts = goal.includes('and') || goal.includes('與') || goal.includes('並');

  // Scoring
  let formalScore = 0;
  let quickScore = 0;

  if (hasLargeKeyword) formalScore += 3;
  if (hasSmallKeyword) quickScore += 2;
  if (wordCount > 15) formalScore += 1;
  if (wordCount < 8) quickScore += 1;
  if (hasMultipleParts) formalScore += 1;

  // Determine route
  if (formalScore > quickScore) {
    return {
      route: 'spec-workflow',
      reason: hasLargeKeyword
        ? `包含大型任務關鍵詞 (${LARGE_KEYWORDS.find(k => lowerGoal.includes(k.toLowerCase()))})`
        : '任務複雜度較高',
      confidence: formalScore - quickScore >= 2 ? 'high' : 'medium'
    };
  } else if (quickScore > formalScore) {
    return {
      route: 'evolve',
      reason: hasSmallKeyword
        ? `包含快速任務關鍵詞 (${SMALL_KEYWORDS.find(k => lowerGoal.includes(k.toLowerCase()))})`
        : '任務相對簡單',
      confidence: quickScore - formalScore >= 2 ? 'high' : 'medium'
    };
  } else {
    // Default to evolve for equal scores
    return {
      route: 'evolve',
      reason: '預設使用快速模式',
      confidence: 'low'
    };
  }
}

/**
 * Get status of all specs
 */
function getSpecsStatus(): SpecStatus[] {
  const specsDir = join(process.cwd(), 'specs', '.specs');
  const specs: SpecStatus[] = [];

  if (!existsSync(specsDir)) {
    return specs;
  }

  const specDirs = readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const specName of specDirs) {
    const tasksPath = join(specsDir, specName, 'tasks.md');
    if (existsSync(tasksPath)) {
      const content = readFileSync(tasksPath, 'utf-8');
      const totalTasks = (content.match(/^- \[[ x-]\]/gm) || []).length;
      const completedTasks = (content.match(/^- \[x\]/gm) || []).length;
      const inProgressTasks = (content.match(/^- \[-\]/gm) || []).length;

      let status: SpecStatus['status'] = 'pending';
      if (completedTasks === totalTasks && totalTasks > 0) {
        status = 'completed';
      } else if (completedTasks > 0 || inProgressTasks > 0) {
        status = 'in-progress';
      }

      specs.push({
        name: specName,
        path: join(specsDir, specName),
        totalTasks,
        completedTasks,
        status
      });
    }
  }

  return specs;
}

/**
 * Display planning status
 */
function showStatus(): void {
  console.log(chalk.bold('\n📊 Planning Status\n'));

  // Specs status
  const specs = getSpecsStatus();
  if (specs.length > 0) {
    console.log(chalk.cyan('Active Specs:'));
    for (const spec of specs) {
      const progress = spec.totalTasks > 0
        ? `${spec.completedTasks}/${spec.totalTasks} tasks`
        : 'no tasks';
      const statusIcon = spec.status === 'completed' ? '✅'
        : spec.status === 'in-progress' ? '🔄'
        : '⏳';
      console.log(`  ${statusIcon} ${spec.name} (${progress})`);
    }
  } else {
    console.log(chalk.gray('  No active specs'));
  }

  // Memory stats
  console.log(chalk.cyan('\nMemory Stats:'));
  const memoryDir = join(process.cwd(), '.claude', 'memory');
  if (existsSync(memoryDir)) {
    const learningsDir = join(memoryDir, 'learnings');
    const failuresDir = join(memoryDir, 'failures');
    const decisionsDir = join(memoryDir, 'decisions');

    const countFiles = (dir: string) =>
      existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.md')).length : 0;

    console.log(`  📚 Learnings: ${countFiles(learningsDir)} entries`);
    console.log(`  ❌ Failures: ${countFiles(failuresDir)} entries`);
    console.log(`  📋 Decisions: ${countFiles(decisionsDir)} entries`);
  } else {
    console.log(chalk.gray('  Memory system not initialized'));
  }

  console.log();
}

/**
 * List available specs
 */
function listSpecs(): void {
  const specs = getSpecsStatus();

  console.log(chalk.bold('\n📋 Available Specs\n'));

  if (specs.length === 0) {
    console.log(chalk.gray('  No specs found. Create one with:'));
    console.log(chalk.cyan('  /plan implement [feature] --formal'));
    console.log();
    return;
  }

  for (const spec of specs) {
    const statusIcon = spec.status === 'completed' ? '✅'
      : spec.status === 'in-progress' ? '🔄'
      : '⏳';
    const progress = spec.totalTasks > 0
      ? chalk.gray(`(${spec.completedTasks}/${spec.totalTasks})`)
      : chalk.gray('(no tasks)');

    console.log(`  ${statusIcon} ${chalk.bold(spec.name)} ${progress}`);
    console.log(chalk.gray(`     ${spec.path}`));
  }

  console.log(chalk.gray('\n  Continue with: /plan --from-spec [name]'));
  console.log();
}

/**
 * Generate Claude Code command for the chosen route
 */
function generateCommand(goal: string, route: 'spec-workflow' | 'evolve', fromSpec?: string): void {
  console.log(chalk.bold('\n🚀 Recommended Action\n'));

  if (fromSpec) {
    console.log(chalk.cyan('Continue executing spec tasks:'));
    console.log(chalk.white(`\n  In Claude Code, run:\n`));
    console.log(chalk.green(`  讀取 specs/.specs/${fromSpec}/tasks.md 並執行未完成的任務`));
    console.log(chalk.green(`  使用 /evolve [任務描述] --from-spec ${fromSpec} 執行每個任務`));
  } else if (route === 'spec-workflow') {
    console.log(chalk.cyan('Use spec-workflow for formal planning:'));
    console.log(chalk.white(`\n  In Claude Code, run:\n`));
    console.log(chalk.green(`  呼叫 mcp__spec-workflow__spec-workflow-guide`));
    console.log(chalk.green(`  然後建立 spec: ${goal}`));
  } else {
    console.log(chalk.cyan('Use evolve PDCA for quick iteration:'));
    console.log(chalk.white(`\n  In Claude Code, run:\n`));
    console.log(chalk.green(`  /evolve ${goal}`));
  }

  console.log();
}

/**
 * Main plan command
 */
export async function plan(goal: string | undefined, options: PlanOptions): Promise<void> {
  // Handle status flag
  if (options.status) {
    showStatus();
    return;
  }

  // Handle list flag
  if (options.list) {
    listSpecs();
    return;
  }

  // Handle from-spec flag
  if (options.fromSpec) {
    const specs = getSpecsStatus();
    const spec = specs.find(s => s.name === options.fromSpec);

    if (!spec) {
      console.log(chalk.red(`\n❌ Spec "${options.fromSpec}" not found.`));
      console.log(chalk.gray('   Use --list to see available specs.\n'));
      return;
    }

    console.log(chalk.bold(`\n📖 Spec: ${spec.name}`));
    console.log(chalk.gray(`   Progress: ${spec.completedTasks}/${spec.totalTasks} tasks completed\n`));

    generateCommand('', 'evolve', options.fromSpec);
    return;
  }

  // If no goal provided, prompt for it
  if (!goal) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'goal',
        message: 'What would you like to plan?',
        validate: (input: string) => input.trim().length > 0 || 'Please enter a goal'
      }
    ]);
    goal = answers.goal;
  }

  // At this point, goal is guaranteed to be a string
  const goalText = goal as string;

  console.log(chalk.bold('\n🎯 Goal Analysis\n'));
  console.log(chalk.white(`  "${goalText}"\n`));

  // Handle forced routing
  if (options.formal) {
    console.log(chalk.cyan('🔀 Route: spec-workflow (user specified --formal)'));
    generateCommand(goalText, 'spec-workflow');
    return;
  }

  if (options.quick) {
    console.log(chalk.cyan('🔀 Route: evolve PDCA (user specified --quick)'));
    generateCommand(goalText, 'evolve');
    return;
  }

  // Auto-analyze and route
  const result = analyzeGoal(goalText);

  const confidenceColor = result.confidence === 'high' ? chalk.green
    : result.confidence === 'medium' ? chalk.yellow
    : chalk.red;

  console.log(chalk.cyan(`🔀 Route: ${result.route}`));
  console.log(chalk.gray(`   Reason: ${result.reason}`));
  console.log(chalk.gray(`   Confidence: ${confidenceColor(result.confidence)}`));

  // If low confidence, ask user
  if (result.confidence === 'low') {
    const confirm = await inquirer.prompt([
      {
        type: 'list',
        name: 'route',
        message: 'Routing confidence is low. Which approach do you prefer?',
        choices: [
          { name: 'evolve PDCA (快速迭代)', value: 'evolve' },
          { name: 'spec-workflow (正式規劃)', value: 'spec-workflow' }
        ],
        default: result.route
      }
    ]);
    result.route = confirm.route;
  }

  generateCommand(goalText, result.route);
}

/**
 * Interactive planning mode
 */
export async function interactivePlan(): Promise<void> {
  console.log(chalk.bold('\n🎯 Unified Planning\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📝 Plan a new task/feature', value: 'new' },
        { name: '📋 Continue from existing spec', value: 'continue' },
        { name: '📊 View planning status', value: 'status' },
        { name: '🔍 List all specs', value: 'list' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'new':
      await plan(undefined, {});
      break;
    case 'continue': {
      const specs = getSpecsStatus();
      if (specs.length === 0) {
        console.log(chalk.yellow('\n⚠️  No specs available to continue.\n'));
        return;
      }
      const specAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'spec',
          message: 'Which spec do you want to continue?',
          choices: specs.map(s => ({
            name: `${s.name} (${s.completedTasks}/${s.totalTasks} tasks)`,
            value: s.name
          }))
        }
      ]);
      await plan(undefined, { fromSpec: specAnswer.spec });
      break;
    }
    case 'status':
      showStatus();
      break;
    case 'list':
      listSpecs();
      break;
  }
}
