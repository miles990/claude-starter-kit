/**
 * Smart Command
 *
 * Intelligent project analysis with predictive recommendations
 *
 * Features:
 * - Context-aware analysis
 * - Action recommendations based on project state
 * - Usage pattern learning
 * - Predictive issue detection
 */
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

interface SmartOptions {
  quick?: boolean;
  action?: string;
  verbose?: boolean;
}

interface ProjectContext {
  name: string;
  type: 'node' | 'python' | 'rust' | 'go' | 'unknown';
  hasGit: boolean;
  hasClaude: boolean;
  hasMemory: boolean;
  hasSkills: boolean;
  recentActivity: ActivityRecord[];
  healthScore: number;
  warnings: string[];
  opportunities: string[];
}

interface ActivityRecord {
  type: 'git' | 'memory' | 'skill' | 'file';
  action: string;
  timestamp: Date;
  details?: string;
}

interface SmartAction {
  id: string;
  label: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'setup' | 'maintenance' | 'improvement' | 'learning';
  execute: () => Promise<void>;
}

interface UsageStats {
  lastRun: string;
  runCount: number;
  commonActions: Record<string, number>;
  projectPatterns: string[];
}

export async function smart(options: SmartOptions = {}): Promise<void> {
  const cwd = process.cwd();

  console.log(chalk.bold.cyan('\n🧠 Claude Starter Kit - Smart Assistant\n'));

  // Quick mode - just show recommendations
  if (options.quick) {
    await showQuickRecommendations(cwd);
    return;
  }

  // Direct action execution
  if (options.action) {
    await executeAction(cwd, options.action);
    return;
  }

  // Full interactive mode
  await runInteractiveMode(cwd, options);
}

async function showQuickRecommendations(cwd: string): Promise<void> {
  const context = await analyzeProjectContext(cwd);
  const actions = generateSmartActions(context, cwd);

  console.log(chalk.dim(`Project: ${context.name}`));
  console.log(chalk.dim(`Health Score: ${getHealthBadge(context.healthScore)}\n`));

  if (actions.length === 0) {
    console.log(chalk.green('✨ Your project is in great shape! No immediate actions needed.'));
    return;
  }

  console.log(chalk.bold('Recommended Actions:'));
  console.log('');

  const topActions = actions.slice(0, 3);
  for (const action of topActions) {
    const priorityColor = action.priority === 'high' ? chalk.red :
      action.priority === 'medium' ? chalk.yellow : chalk.dim;
    console.log(`  ${priorityColor('●')} ${chalk.bold(action.label)}`);
    console.log(chalk.dim(`    ${action.description}`));
    console.log(chalk.cyan(`    Run: npx claude-starter-kit smart --action=${action.id}`));
    console.log('');
  }
}

async function runInteractiveMode(cwd: string, options: SmartOptions): Promise<void> {
  // Track usage
  await trackUsage(cwd, 'interactive');

  // Analyze project
  console.log(chalk.dim('Analyzing project...\n'));
  const context = await analyzeProjectContext(cwd);

  // Display project overview
  displayProjectOverview(context);

  // Check for warnings
  if (context.warnings.length > 0) {
    console.log(chalk.bold.yellow('\n⚠️ Attention Needed:\n'));
    for (const warning of context.warnings) {
      console.log(`  ${chalk.yellow('•')} ${warning}`);
    }
  }

  // Show opportunities
  if (context.opportunities.length > 0) {
    console.log(chalk.bold.green('\n💡 Opportunities:\n'));
    for (const opp of context.opportunities) {
      console.log(`  ${chalk.green('•')} ${opp}`);
    }
  }

  // Generate and display smart actions
  const actions = generateSmartActions(context, cwd);

  if (actions.length === 0) {
    console.log(chalk.green('\n✨ Everything looks great! No recommended actions.\n'));
    return;
  }

  console.log(chalk.bold('\n📋 Smart Actions:\n'));

  const actionChoices = actions.map((action, index) => ({
    name: `${getPriorityIcon(action.priority)} ${action.label} ${chalk.dim(`(${action.category})`)}`,
    value: action.id,
    short: action.label,
  }));

  actionChoices.push({
    name: chalk.dim('Skip - I\'ll handle it myself'),
    value: 'skip',
    short: 'Skip',
  });

  const { selectedAction } = await inquirer.prompt([{
    type: 'list',
    name: 'selectedAction',
    message: 'What would you like to do?',
    choices: actionChoices,
  }]);

  if (selectedAction === 'skip') {
    console.log(chalk.dim('\nNo problem! Run `npx claude-starter-kit smart` anytime.\n'));
    return;
  }

  const action = actions.find(a => a.id === selectedAction);
  if (action) {
    console.log('');
    await action.execute();
    await trackUsage(cwd, action.id);
  }
}

async function executeAction(cwd: string, actionId: string): Promise<void> {
  const context = await analyzeProjectContext(cwd);
  const actions = generateSmartActions(context, cwd);
  const action = actions.find(a => a.id === actionId);

  if (!action) {
    console.log(chalk.red(`Unknown action: ${actionId}`));
    console.log(chalk.dim('Available actions:'));
    for (const a of actions) {
      console.log(`  - ${a.id}: ${a.description}`);
    }
    return;
  }

  await action.execute();
  await trackUsage(cwd, actionId);
}

async function analyzeProjectContext(cwd: string): Promise<ProjectContext> {
  const context: ProjectContext = {
    name: basename(cwd),
    type: 'unknown',
    hasGit: existsSync(join(cwd, '.git')),
    hasClaude: existsSync(join(cwd, 'CLAUDE.md')),
    hasMemory: existsSync(join(cwd, '.claude', 'memory')),
    hasSkills: existsSync(join(cwd, '.claude', 'skills')),
    recentActivity: [],
    healthScore: 0,
    warnings: [],
    opportunities: [],
  };

  // Detect project type
  context.type = detectProjectType(cwd);

  // Analyze recent activity
  context.recentActivity = await getRecentActivity(cwd);

  // Calculate health score
  context.healthScore = calculateHealthScore(context, cwd);

  // Identify warnings
  context.warnings = identifyWarnings(context, cwd);

  // Identify opportunities
  context.opportunities = identifyOpportunities(context, cwd);

  return context;
}

function detectProjectType(cwd: string): 'node' | 'python' | 'rust' | 'go' | 'unknown' {
  if (existsSync(join(cwd, 'package.json'))) return 'node';
  if (existsSync(join(cwd, 'pyproject.toml')) || existsSync(join(cwd, 'requirements.txt'))) return 'python';
  if (existsSync(join(cwd, 'Cargo.toml'))) return 'rust';
  if (existsSync(join(cwd, 'go.mod'))) return 'go';
  return 'unknown';
}

async function getRecentActivity(cwd: string): Promise<ActivityRecord[]> {
  const activities: ActivityRecord[] = [];

  // Get recent git commits
  if (existsSync(join(cwd, '.git'))) {
    try {
      const gitLog = execSync('git log --oneline -5 --format="%s|%ci" 2>/dev/null', {
        cwd,
        encoding: 'utf-8',
      });
      const commits = gitLog.trim().split('\n').filter(Boolean);
      for (const commit of commits) {
        const [message, date] = commit.split('|');
        activities.push({
          type: 'git',
          action: 'commit',
          timestamp: new Date(date),
          details: message,
        });
      }
    } catch {
      // Ignore git errors
    }
  }

  // Get recent memory files
  const memoryDir = join(cwd, '.claude', 'memory');
  if (existsSync(memoryDir)) {
    const subdirs = ['learnings', 'failures', 'decisions', 'patterns'];
    for (const subdir of subdirs) {
      const dir = join(memoryDir, subdir);
      if (existsSync(dir)) {
        try {
          const files = readdirSync(dir)
            .filter(f => f.endsWith('.md'))
            .map(f => ({
              name: f,
              mtime: statSync(join(dir, f)).mtime,
            }))
            .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
            .slice(0, 3);

          for (const file of files) {
            activities.push({
              type: 'memory',
              action: subdir,
              timestamp: file.mtime,
              details: file.name,
            });
          }
        } catch {
          // Ignore errors
        }
      }
    }
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
}

function calculateHealthScore(context: ProjectContext, cwd: string): number {
  let score = 0;
  const maxScore = 100;

  // Basic setup (40 points)
  if (context.hasGit) score += 10;
  if (context.hasClaude) score += 15;
  if (context.hasMemory) score += 10;
  if (context.hasSkills) score += 5;

  // Memory utilization (20 points)
  const memoryDir = join(cwd, '.claude', 'memory');
  if (existsSync(memoryDir)) {
    const learnings = countFiles(join(memoryDir, 'learnings'));
    const decisions = countFiles(join(memoryDir, 'decisions'));
    if (learnings > 0) score += 10;
    if (decisions > 0) score += 10;
  }

  // Skills utilization (20 points)
  const skillsDir = join(cwd, '.claude', 'skills');
  if (existsSync(skillsDir)) {
    const skillCount = countDirs(skillsDir);
    if (skillCount >= 1) score += 10;
    if (skillCount >= 3) score += 10;
  }

  // Recent activity (20 points)
  const recentCommits = context.recentActivity.filter(
    a => a.type === 'git' && daysSince(a.timestamp) < 7
  ).length;
  if (recentCommits >= 1) score += 10;
  if (recentCommits >= 3) score += 10;

  return Math.min(score, maxScore);
}

function identifyWarnings(context: ProjectContext, cwd: string): string[] {
  const warnings: string[] = [];

  if (!context.hasGit) {
    warnings.push('Not a git repository - memory won\'t be version controlled');
  }

  if (!context.hasClaude) {
    warnings.push('Missing CLAUDE.md - Claude won\'t have project context');
  }

  if (!context.hasMemory) {
    warnings.push('Memory system not initialized - learnings won\'t be persisted');
  }

  // Check for outdated memory
  const memoryDir = join(cwd, '.claude', 'memory');
  if (existsSync(memoryDir)) {
    const indexPath = join(memoryDir, 'index.md');
    if (existsSync(indexPath)) {
      const indexStat = statSync(indexPath);
      if (daysSince(indexStat.mtime) > 30) {
        warnings.push('Memory index hasn\'t been updated in 30+ days');
      }
    }
  }

  // Check for MCP config
  if (!existsSync(join(cwd, '.mcp.json'))) {
    warnings.push('Missing .mcp.json - MCP tools won\'t be available');
  }

  return warnings;
}

function identifyOpportunities(context: ProjectContext, cwd: string): string[] {
  const opportunities: string[] = [];

  // Skill recommendations based on project type
  const skillsDir = join(cwd, '.claude', 'skills');
  const installedSkills = existsSync(skillsDir) ?
    readdirSync(skillsDir).filter(f => !f.startsWith('.')) : [];

  if (context.type === 'node' && !installedSkills.some(s => s.includes('typescript'))) {
    if (existsSync(join(cwd, 'tsconfig.json'))) {
      opportunities.push('Consider installing the TypeScript skill for better type assistance');
    }
  }

  // Memory utilization
  const memoryDir = join(cwd, '.claude', 'memory');
  if (existsSync(memoryDir)) {
    const learnings = countFiles(join(memoryDir, 'learnings'));
    if (learnings === 0) {
      opportunities.push('Start documenting learnings to build project knowledge');
    }

    const decisions = countFiles(join(memoryDir, 'decisions'));
    if (decisions === 0 && context.recentActivity.filter(a => a.type === 'git').length > 10) {
      opportunities.push('Consider documenting architectural decisions (ADR)');
    }
  }

  // Self-evolving agent
  if (!installedSkills.includes('self-evolving-agent') && !installedSkills.includes('evolve')) {
    opportunities.push('Install self-evolving-agent for autonomous development capabilities');
  }

  return opportunities;
}

function generateSmartActions(context: ProjectContext, cwd: string): SmartAction[] {
  const actions: SmartAction[] = [];

  // Setup actions
  if (!context.hasGit) {
    actions.push({
      id: 'init-git',
      label: 'Initialize Git Repository',
      description: 'Set up version control for your project',
      priority: 'high',
      category: 'setup',
      execute: async () => {
        console.log(chalk.cyan('Initializing git repository...'));
        execSync('git init', { cwd, stdio: 'inherit' });
        console.log(chalk.green('✓ Git repository initialized'));
      },
    });
  }

  if (!context.hasClaude) {
    actions.push({
      id: 'setup-claude',
      label: 'Setup Claude Configuration',
      description: 'Create CLAUDE.md and initialize memory system',
      priority: 'high',
      category: 'setup',
      execute: async () => {
        console.log(chalk.cyan('Running claude-starter-kit setup...'));
        execSync('npx claude-starter-kit -y', { cwd, stdio: 'inherit' });
      },
    });
  }

  if (!context.hasMemory && context.hasClaude) {
    actions.push({
      id: 'init-memory',
      label: 'Initialize Memory System',
      description: 'Set up the memory directories for learnings and decisions',
      priority: 'high',
      category: 'setup',
      execute: async () => {
        console.log(chalk.cyan('Creating memory structure...'));
        const dirs = ['learnings', 'failures', 'decisions', 'patterns', 'strategies'];
        for (const dir of dirs) {
          const path = join(cwd, '.claude', 'memory', dir);
          if (!existsSync(path)) {
            execSync(`mkdir -p "${path}"`, { cwd });
          }
        }
        console.log(chalk.green('✓ Memory system initialized'));
      },
    });
  }

  // Maintenance actions
  if (context.warnings.some(w => w.includes('index hasn\'t been updated'))) {
    actions.push({
      id: 'curate-memory',
      label: 'Curate Memory',
      description: 'Review and organize accumulated learnings',
      priority: 'medium',
      category: 'maintenance',
      execute: async () => {
        console.log(chalk.cyan('\nMemory curation guide:'));
        console.log(chalk.dim('1. Review .claude/memory/learnings/ for outdated entries'));
        console.log(chalk.dim('2. Merge similar entries'));
        console.log(chalk.dim('3. Mark deprecated entries with [SUPERSEDED]'));
        console.log(chalk.dim('4. Update index.md with new entries'));
        console.log(chalk.dim('\nTip: Use /evolve in Claude Code to automate this'));
      },
    });
  }

  // Improvement actions
  const skillsDir = join(cwd, '.claude', 'skills');
  const installedSkills = existsSync(skillsDir) ?
    readdirSync(skillsDir).filter(f => !f.startsWith('.')) : [];

  if (!installedSkills.includes('self-evolving-agent') && !installedSkills.includes('evolve')) {
    actions.push({
      id: 'install-evolve',
      label: 'Install Self-Evolving Agent',
      description: 'Enable autonomous development with PDCA loop',
      priority: 'medium',
      category: 'improvement',
      execute: async () => {
        console.log(chalk.cyan('Installing self-evolving-agent...'));
        try {
          execSync('npx skillpkg-cli install github:miles990/self-evolving-agent', { cwd, stdio: 'inherit' });
          execSync('npx skillpkg-cli sync', { cwd, stdio: 'inherit' });
          console.log(chalk.green('✓ Self-evolving agent installed'));
          console.log(chalk.dim('Use /evolve [goal] in Claude Code to start'));
        } catch {
          console.log(chalk.yellow('⚠ Installation may have partially succeeded'));
        }
      },
    });
  }

  // Learning action
  actions.push({
    id: 'run-doctor',
    label: 'Run Health Check',
    description: 'Diagnose ecosystem setup and get detailed recommendations',
    priority: 'low',
    category: 'maintenance',
    execute: async () => {
      console.log(chalk.cyan('Running doctor...'));
      execSync('npx claude-starter-kit doctor', { cwd, stdio: 'inherit' });
    },
  });

  actions.push({
    id: 'discover-skills',
    label: 'Discover Skills',
    description: 'Analyze project and get skill recommendations',
    priority: 'low',
    category: 'learning',
    execute: async () => {
      console.log(chalk.cyan('Discovering skills...'));
      execSync('npx claude-starter-kit doctor --discover', { cwd, stdio: 'inherit' });
    },
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

function displayProjectOverview(context: ProjectContext): void {
  console.log(chalk.bold('Project Overview:\n'));

  // Project info
  console.log(`  ${chalk.dim('Name:')}        ${context.name}`);
  console.log(`  ${chalk.dim('Type:')}        ${context.type}`);
  console.log(`  ${chalk.dim('Health:')}      ${getHealthBadge(context.healthScore)}`);
  console.log('');

  // Setup status
  console.log(chalk.bold('Setup Status:'));
  console.log(`  ${getStatusIcon(context.hasGit)} Git Repository`);
  console.log(`  ${getStatusIcon(context.hasClaude)} CLAUDE.md`);
  console.log(`  ${getStatusIcon(context.hasMemory)} Memory System`);
  console.log(`  ${getStatusIcon(context.hasSkills)} Skills`);

  // Recent activity
  if (context.recentActivity.length > 0) {
    console.log(chalk.bold('\nRecent Activity:'));
    for (const activity of context.recentActivity.slice(0, 5)) {
      const timeAgo = getTimeAgo(activity.timestamp);
      const icon = activity.type === 'git' ? '📝' :
        activity.type === 'memory' ? '🧠' : '📁';
      console.log(`  ${icon} ${chalk.dim(timeAgo)} ${activity.details || activity.action}`);
    }
  }
}

// Helper functions
function countFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  try {
    return readdirSync(dir).filter(f => f.endsWith('.md')).length;
  } catch {
    return 0;
  }
}

function countDirs(dir: string): number {
  if (!existsSync(dir)) return 0;
  try {
    return readdirSync(dir).filter(f => !f.startsWith('.')).length;
  } catch {
    return 0;
  }
}

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function getHealthBadge(score: number): string {
  if (score >= 80) return chalk.green(`${score}% 💚 Excellent`);
  if (score >= 60) return chalk.green(`${score}% 💛 Good`);
  if (score >= 40) return chalk.yellow(`${score}% 🧡 Fair`);
  return chalk.red(`${score}% ❤️ Needs Attention`);
}

function getStatusIcon(status: boolean): string {
  return status ? chalk.green('✓') : chalk.red('✗');
}

function getPriorityIcon(priority: 'high' | 'medium' | 'low'): string {
  if (priority === 'high') return chalk.red('●');
  if (priority === 'medium') return chalk.yellow('●');
  return chalk.dim('●');
}

function getTimeAgo(date: Date): string {
  const days = daysSince(date);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

async function trackUsage(cwd: string, action: string): Promise<void> {
  const statsPath = join(cwd, '.claude', 'smart-stats.json');

  let stats: UsageStats = {
    lastRun: new Date().toISOString(),
    runCount: 0,
    commonActions: {},
    projectPatterns: [],
  };

  // Load existing stats
  if (existsSync(statsPath)) {
    try {
      stats = JSON.parse(readFileSync(statsPath, 'utf-8'));
    } catch {
      // Use default stats
    }
  }

  // Update stats
  stats.lastRun = new Date().toISOString();
  stats.runCount++;
  stats.commonActions[action] = (stats.commonActions[action] || 0) + 1;

  // Save stats
  try {
    writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  } catch {
    // Ignore write errors
  }
}
