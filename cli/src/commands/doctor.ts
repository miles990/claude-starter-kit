/**
 * Doctor Command
 *
 * Diagnose, fix, and discover for Claude Code ecosystem setup
 */
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: string;
  fixCommand?: string; // Executable command for auto-fix
  autoFixable?: boolean; // Whether this can be auto-fixed
}

interface DoctorOptions {
  fix?: boolean;
  discover?: boolean;
}

interface ProjectAnalysis {
  packageJson?: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
  };
  fileTypes: Record<string, number>;
  detectedStack: string[];
  suggestedSkills: Array<{
    name: string;
    reason: string;
    source: string;
  }>;
}

export async function doctor(options: DoctorOptions = {}): Promise<void> {
  const cwd = process.cwd();

  if (options.discover) {
    await runDiscover(cwd);
    return;
  }

  console.log(chalk.bold.cyan('\n🩺 Claude Code Ecosystem Doctor\n'));
  console.log(chalk.dim(`Checking: ${cwd}\n`));

  const results: CheckResult[] = [];

  // Check 1: Git repository
  results.push(checkGit(cwd));

  // Check 2: CLAUDE.md
  results.push(checkClaudeMd(cwd));

  // Check 3: Memory system
  results.push(checkMemorySystem(cwd));

  // Check 4: Skills directory
  results.push(checkSkillsDirectory(cwd));

  // Check 5: MCP configuration
  results.push(checkMcpConfig(cwd));

  // Check 6: skillpkg.json
  results.push(checkSkillpkgJson(cwd));

  // Check 7: Claude Code CLI
  results.push(checkClaudeCli());

  // Check 8: Rules directory
  results.push(checkRulesDirectory(cwd));

  // Print results
  console.log(chalk.bold('Results:\n'));

  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  for (const result of results) {
    const icon = result.status === 'pass' ? chalk.green('✓') :
                 result.status === 'warn' ? chalk.yellow('⚠') :
                 chalk.red('✗');

    const statusColor = result.status === 'pass' ? chalk.green :
                        result.status === 'warn' ? chalk.yellow :
                        chalk.red;

    console.log(`  ${icon} ${chalk.bold(result.name)}`);
    console.log(`    ${statusColor(result.message)}`);

    if (result.fix && result.status !== 'pass') {
      console.log(chalk.dim(`    Fix: ${result.fix}`));
    }
    console.log('');

    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else failCount++;
  }

  // Summary
  console.log(chalk.bold('─'.repeat(50)));
  console.log('');
  console.log(chalk.bold('Summary:'));
  console.log(`  ${chalk.green(`✓ ${passCount} passed`)}`);
  if (warnCount > 0) console.log(`  ${chalk.yellow(`⚠ ${warnCount} warnings`)}`);
  if (failCount > 0) console.log(`  ${chalk.red(`✗ ${failCount} failed`)}`);
  console.log('');

  // Overall status
  if (failCount === 0 && warnCount === 0) {
    console.log(chalk.green.bold('🎉 Your ecosystem setup is healthy!'));
  } else if (failCount === 0) {
    console.log(chalk.yellow.bold('⚠️  Setup is functional but has some warnings.'));
  } else {
    console.log(chalk.red.bold('❌ Some issues need to be fixed.'));
    if (!options.fix) {
      console.log(chalk.dim('\nRun with --fix to auto-repair, or use: npx claude-starter-kit'));
    }
  }
  console.log('');

  // Auto-fix mode
  if (options.fix) {
    await runAutoFix(cwd, results);
  }
}

/**
 * Auto-fix mode: repair fixable issues
 */
async function runAutoFix(cwd: string, results: CheckResult[]): Promise<void> {
  const fixableResults = results.filter(r => r.status !== 'pass' && r.autoFixable && r.fixCommand);

  if (fixableResults.length === 0) {
    console.log(chalk.yellow('\nNo auto-fixable issues found.'));
    console.log(chalk.dim('Some issues require manual intervention or npx claude-starter-kit'));
    return;
  }

  console.log(chalk.bold.cyan('\n🔧 Auto-Fix Mode\n'));
  console.log('The following issues can be automatically fixed:\n');

  for (const result of fixableResults) {
    console.log(`  ${chalk.yellow('•')} ${result.name}: ${result.message}`);
    console.log(chalk.dim(`    Command: ${result.fixCommand}`));
  }
  console.log('');

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to apply these fixes?',
    default: true,
  }]);

  if (!confirm) {
    console.log(chalk.dim('\nAuto-fix cancelled.'));
    return;
  }

  console.log('');
  let fixedCount = 0;
  let failedCount = 0;

  for (const result of fixableResults) {
    process.stdout.write(`  Fixing ${result.name}... `);
    try {
      execSync(result.fixCommand!, { cwd, stdio: 'pipe' });
      console.log(chalk.green('✓'));
      fixedCount++;
    } catch (error) {
      console.log(chalk.red('✗'));
      console.log(chalk.dim(`    Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      failedCount++;
    }
  }

  console.log('');
  console.log(chalk.bold('Fix Summary:'));
  console.log(`  ${chalk.green(`✓ ${fixedCount} fixed`)}`);
  if (failedCount > 0) {
    console.log(`  ${chalk.red(`✗ ${failedCount} failed`)}`);
  }

  if (fixedCount > 0) {
    console.log(chalk.dim('\nRun `npx claude-starter-kit doctor` again to verify.'));
  }
}

/**
 * Discover mode: analyze project and recommend skills
 */
async function runDiscover(cwd: string): Promise<void> {
  console.log(chalk.bold.cyan('\n🔍 Project Discovery Mode\n'));
  console.log(chalk.dim(`Analyzing: ${cwd}\n`));

  const analysis = analyzeProject(cwd);

  // Show detected stack
  if (analysis.detectedStack.length > 0) {
    console.log(chalk.bold('Detected Tech Stack:'));
    for (const tech of analysis.detectedStack) {
      console.log(`  ${chalk.cyan('•')} ${tech}`);
    }
    console.log('');
  }

  // Show file type distribution
  const topTypes = Object.entries(analysis.fileTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (topTypes.length > 0) {
    console.log(chalk.bold('File Types:'));
    for (const [ext, count] of topTypes) {
      console.log(`  ${chalk.dim(ext.padEnd(10))} ${count} files`);
    }
    console.log('');
  }

  // Show skill recommendations
  if (analysis.suggestedSkills.length > 0) {
    console.log(chalk.bold('Recommended Skills:'));
    console.log('');
    for (const skill of analysis.suggestedSkills) {
      console.log(`  ${chalk.green('➤')} ${chalk.bold(skill.name)}`);
      console.log(chalk.dim(`    Reason: ${skill.reason}`));
      console.log(chalk.dim(`    Source: ${skill.source}`));
      console.log('');
    }

    // Ask to install
    const { install } = await inquirer.prompt([{
      type: 'confirm',
      name: 'install',
      message: 'Would you like to install these recommended skills?',
      default: false,
    }]);

    if (install) {
      console.log('');
      for (const skill of analysis.suggestedSkills) {
        process.stdout.write(`  Installing ${skill.name}... `);
        try {
          execSync(`npx skillpkg-cli install ${skill.source}`, { cwd, stdio: 'pipe' });
          console.log(chalk.green('✓'));
        } catch {
          console.log(chalk.yellow('⚠ (may already be installed)'));
        }
      }

      // Sync skills
      console.log('');
      process.stdout.write('  Syncing skills to Claude Code... ');
      try {
        execSync('npx skillpkg-cli sync', { cwd, stdio: 'pipe' });
        console.log(chalk.green('✓'));
      } catch {
        console.log(chalk.yellow('⚠'));
      }

      console.log(chalk.green.bold('\n✅ Skills installed! Restart Claude Code to use them.'));
    }
  } else {
    console.log(chalk.dim('No additional skills recommended for this project.'));
  }

  console.log('');
}

/**
 * Analyze project structure and suggest skills
 */
function analyzeProject(cwd: string): ProjectAnalysis {
  const analysis: ProjectAnalysis = {
    fileTypes: {},
    detectedStack: [],
    suggestedSkills: [],
  };

  // Read package.json if exists
  const packageJsonPath = join(cwd, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      analysis.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    } catch {
      // Ignore parse errors
    }
  }

  // Count file types recursively (limited depth)
  countFileTypes(cwd, analysis.fileTypes, 0, 3);

  // Detect tech stack
  detectStack(analysis);

  // Generate skill recommendations
  generateSkillRecommendations(analysis, cwd);

  return analysis;
}

function countFileTypes(dir: string, types: Record<string, number>, depth: number, maxDepth: number): void {
  if (depth >= maxDepth) return;

  const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 'venv', '.venv'];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!ignoreDirs.includes(entry.name) && !entry.name.startsWith('.')) {
          countFileTypes(join(dir, entry.name), types, depth + 1, maxDepth);
        }
      } else if (entry.isFile()) {
        const ext = entry.name.includes('.') ?
          '.' + entry.name.split('.').pop()!.toLowerCase() :
          '(no ext)';
        types[ext] = (types[ext] || 0) + 1;
      }
    }
  } catch {
    // Ignore read errors
  }
}

function detectStack(analysis: ProjectAnalysis): void {
  const { packageJson, fileTypes } = analysis;

  // Detect from package.json dependencies
  if (packageJson?.dependencies || packageJson?.devDependencies) {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // Frontend frameworks
    if (allDeps['react']) analysis.detectedStack.push('React');
    if (allDeps['vue']) analysis.detectedStack.push('Vue');
    if (allDeps['svelte']) analysis.detectedStack.push('Svelte');
    if (allDeps['next']) analysis.detectedStack.push('Next.js');
    if (allDeps['nuxt']) analysis.detectedStack.push('Nuxt');

    // Backend frameworks
    if (allDeps['express']) analysis.detectedStack.push('Express');
    if (allDeps['fastify']) analysis.detectedStack.push('Fastify');
    if (allDeps['nestjs'] || allDeps['@nestjs/core']) analysis.detectedStack.push('NestJS');
    if (allDeps['hono']) analysis.detectedStack.push('Hono');

    // Databases
    if (allDeps['prisma'] || allDeps['@prisma/client']) analysis.detectedStack.push('Prisma');
    if (allDeps['mongoose']) analysis.detectedStack.push('MongoDB');
    if (allDeps['pg']) analysis.detectedStack.push('PostgreSQL');
    if (allDeps['mysql2']) analysis.detectedStack.push('MySQL');
    if (allDeps['redis'] || allDeps['ioredis']) analysis.detectedStack.push('Redis');

    // Testing
    if (allDeps['jest']) analysis.detectedStack.push('Jest');
    if (allDeps['vitest']) analysis.detectedStack.push('Vitest');
    if (allDeps['playwright']) analysis.detectedStack.push('Playwright');
    if (allDeps['cypress']) analysis.detectedStack.push('Cypress');

    // TypeScript
    if (allDeps['typescript']) analysis.detectedStack.push('TypeScript');
  }

  // Detect from file types
  if (fileTypes['.py'] > 0) analysis.detectedStack.push('Python');
  if (fileTypes['.go'] > 0) analysis.detectedStack.push('Go');
  if (fileTypes['.rs'] > 0) analysis.detectedStack.push('Rust');
  if (fileTypes['.java'] > 0) analysis.detectedStack.push('Java');
  if (fileTypes['.rb'] > 0) analysis.detectedStack.push('Ruby');
  if (fileTypes['.php'] > 0) analysis.detectedStack.push('PHP');
}

function generateSkillRecommendations(analysis: ProjectAnalysis, cwd: string): void {
  const { detectedStack } = analysis;
  const suggestions = analysis.suggestedSkills;

  // Check what's already installed
  const installedSkills = getInstalledSkills(cwd);

  // Core skill (always recommend if not installed)
  if (!installedSkills.includes('self-evolving-agent') && !installedSkills.includes('evolve')) {
    suggestions.push({
      name: 'self-evolving-agent',
      reason: 'Core autonomous development capability',
      source: 'github:miles990/self-evolving-agent',
    });
  }

  // Frontend skills
  const frontendFrameworks = ['React', 'Vue', 'Svelte', 'Next.js', 'Nuxt'];
  if (frontendFrameworks.some(f => detectedStack.includes(f))) {
    if (!installedSkills.includes('frontend')) {
      suggestions.push({
        name: 'frontend',
        reason: `Detected ${frontendFrameworks.filter(f => detectedStack.includes(f)).join(', ')}`,
        source: 'github:miles990/claude-software-skills#skills/frontend',
      });
    }
  }

  // Backend skills
  const backendFrameworks = ['Express', 'Fastify', 'NestJS', 'Hono'];
  if (backendFrameworks.some(f => detectedStack.includes(f))) {
    if (!installedSkills.includes('backend')) {
      suggestions.push({
        name: 'backend',
        reason: `Detected ${backendFrameworks.filter(f => detectedStack.includes(f)).join(', ')}`,
        source: 'github:miles990/claude-software-skills#skills/backend',
      });
    }
  }

  // Database skills
  const databases = ['Prisma', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'];
  if (databases.some(d => detectedStack.includes(d))) {
    if (!installedSkills.includes('database')) {
      suggestions.push({
        name: 'database',
        reason: `Detected ${databases.filter(d => detectedStack.includes(d)).join(', ')}`,
        source: 'github:miles990/claude-software-skills#skills/database',
      });
    }
  }

  // Testing skills
  const testFrameworks = ['Jest', 'Vitest', 'Playwright', 'Cypress'];
  if (testFrameworks.some(t => detectedStack.includes(t))) {
    if (!installedSkills.includes('testing-strategies')) {
      suggestions.push({
        name: 'testing-strategies',
        reason: `Detected ${testFrameworks.filter(t => detectedStack.includes(t)).join(', ')}`,
        source: 'github:miles990/claude-software-skills#skills/testing-strategies',
      });
    }
  }

  // Python skills
  if (detectedStack.includes('Python')) {
    if (!installedSkills.includes('python')) {
      suggestions.push({
        name: 'python',
        reason: 'Detected Python files in project',
        source: 'github:miles990/claude-software-skills#skills/python',
      });
    }
  }

  // TypeScript skills
  if (detectedStack.includes('TypeScript')) {
    if (!installedSkills.includes('typescript')) {
      suggestions.push({
        name: 'typescript',
        reason: 'Detected TypeScript configuration',
        source: 'github:miles990/claude-software-skills#skills/typescript',
      });
    }
  }

  // API Design (if both frontend and backend detected)
  if (frontendFrameworks.some(f => detectedStack.includes(f)) &&
      backendFrameworks.some(f => detectedStack.includes(f))) {
    if (!installedSkills.includes('api-design')) {
      suggestions.push({
        name: 'api-design',
        reason: 'Full-stack project detected - API design recommended',
        source: 'github:miles990/claude-software-skills#skills/api-design',
      });
    }
  }
}

function getInstalledSkills(cwd: string): string[] {
  const skillsDir = join(cwd, '.claude', 'skills');
  if (!existsSync(skillsDir)) return [];

  try {
    return readdirSync(skillsDir).filter(f => !f.startsWith('.'));
  } catch {
    return [];
  }
}

// ============================================================================
// Check Functions
// ============================================================================

function checkGit(cwd: string): CheckResult {
  const gitDir = join(cwd, '.git');
  if (existsSync(gitDir)) {
    return {
      name: 'Git Repository',
      status: 'pass',
      message: 'Git repository initialized',
    };
  }
  return {
    name: 'Git Repository',
    status: 'warn',
    message: 'Not a git repository (memory won\'t be version controlled)',
    fix: 'git init',
    fixCommand: 'git init',
    autoFixable: true,
  };
}

function checkClaudeMd(cwd: string): CheckResult {
  const claudeMd = join(cwd, 'CLAUDE.md');
  if (existsSync(claudeMd)) {
    const content = readFileSync(claudeMd, 'utf-8');
    if (content.length > 100) {
      return {
        name: 'CLAUDE.md',
        status: 'pass',
        message: 'Project context file exists and has content',
      };
    }
    return {
      name: 'CLAUDE.md',
      status: 'warn',
      message: 'CLAUDE.md exists but seems empty',
      fix: 'npx claude-starter-kit to regenerate',
      autoFixable: false,
    };
  }
  return {
    name: 'CLAUDE.md',
    status: 'fail',
    message: 'CLAUDE.md not found (Claude won\'t have project context)',
    fix: 'npx claude-starter-kit',
    autoFixable: false,
  };
}

function checkMemorySystem(cwd: string): CheckResult {
  const memoryDir = join(cwd, '.claude', 'memory');
  const indexFile = join(memoryDir, 'index.md');

  if (!existsSync(memoryDir)) {
    return {
      name: 'Memory System',
      status: 'fail',
      message: '.claude/memory/ directory not found',
      fix: 'mkdir -p .claude/memory/{learnings,failures,decisions,patterns}',
      fixCommand: 'mkdir -p .claude/memory/learnings .claude/memory/failures .claude/memory/decisions .claude/memory/patterns',
      autoFixable: true,
    };
  }

  if (!existsSync(indexFile)) {
    return {
      name: 'Memory System',
      status: 'warn',
      message: 'Memory directory exists but index.md is missing',
      fix: 'Create index.md template',
      fixCommand: createIndexMdCommand(cwd),
      autoFixable: true,
    };
  }

  // Check subdirectories
  const requiredDirs = ['learnings', 'failures', 'decisions', 'patterns'];
  const missingDirs = requiredDirs.filter(dir => !existsSync(join(memoryDir, dir)));

  if (missingDirs.length > 0) {
    return {
      name: 'Memory System',
      status: 'warn',
      message: `Missing memory subdirectories: ${missingDirs.join(', ')}`,
      fix: `mkdir -p ${missingDirs.map(d => `.claude/memory/${d}`).join(' ')}`,
      fixCommand: `mkdir -p ${missingDirs.map(d => `.claude/memory/${d}`).join(' ')}`,
      autoFixable: true,
    };
  }

  return {
    name: 'Memory System',
    status: 'pass',
    message: 'Memory system initialized with all directories',
  };
}

function createIndexMdCommand(cwd: string): string {
  const indexContent = `# 專案記憶索引

> 自動維護，請勿手動編輯主要區塊

## 最近學習
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## 重要決策
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## 失敗經驗
<!-- FAILURES_START -->
<!-- FAILURES_END -->

## 推理模式
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->
`;
  // Use echo with heredoc - escape for shell
  return `cat > .claude/memory/index.md << 'INDEXEOF'
${indexContent}
INDEXEOF`;
}

function checkSkillsDirectory(cwd: string): CheckResult {
  const skillsDir = join(cwd, '.claude', 'skills');

  if (!existsSync(skillsDir)) {
    return {
      name: 'Skills Directory',
      status: 'warn',
      message: '.claude/skills/ directory not found',
      fix: 'npx skillpkg-cli sync',
      fixCommand: 'npx skillpkg-cli sync',
      autoFixable: true,
    };
  }

  try {
    const skills = readdirSync(skillsDir).filter(f => !f.startsWith('.'));
    if (skills.length === 0) {
      return {
        name: 'Skills Directory',
        status: 'warn',
        message: 'Skills directory exists but is empty',
        fix: 'npx skillpkg-cli install github:miles990/self-evolving-agent && npx skillpkg-cli sync',
        fixCommand: 'npx skillpkg-cli install github:miles990/self-evolving-agent && npx skillpkg-cli sync',
        autoFixable: true,
      };
    }

    return {
      name: 'Skills Directory',
      status: 'pass',
      message: `${skills.length} skill(s) installed: ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? '...' : ''}`,
    };
  } catch {
    return {
      name: 'Skills Directory',
      status: 'warn',
      message: 'Could not read skills directory',
      fix: 'npx skillpkg-cli sync',
      fixCommand: 'npx skillpkg-cli sync',
      autoFixable: true,
    };
  }
}

function checkMcpConfig(cwd: string): CheckResult {
  const mcpJson = join(cwd, '.mcp.json');

  if (!existsSync(mcpJson)) {
    return {
      name: 'MCP Configuration',
      status: 'warn',
      message: '.mcp.json not found (MCP tools won\'t be available)',
      fix: 'npx claude-starter-kit',
      autoFixable: false,
    };
  }

  try {
    const content = JSON.parse(readFileSync(mcpJson, 'utf-8'));
    const servers = Object.keys(content.mcpServers || {});

    if (servers.length === 0) {
      return {
        name: 'MCP Configuration',
        status: 'warn',
        message: '.mcp.json exists but no servers configured',
        fix: 'npx claude-starter-kit',
        autoFixable: false,
      };
    }

    const hasSkillpkg = servers.includes('skillpkg');

    return {
      name: 'MCP Configuration',
      status: hasSkillpkg ? 'pass' : 'warn',
      message: hasSkillpkg
        ? `MCP configured with ${servers.length} server(s): ${servers.join(', ')}`
        : `MCP configured but skillpkg not found (${servers.length} server(s))`,
      fix: hasSkillpkg ? undefined : 'Add skillpkg to .mcp.json',
      autoFixable: false,
    };
  } catch {
    return {
      name: 'MCP Configuration',
      status: 'fail',
      message: '.mcp.json exists but is invalid JSON',
      fix: 'Check .mcp.json syntax or regenerate with npx claude-starter-kit',
      autoFixable: false,
    };
  }
}

function checkSkillpkgJson(cwd: string): CheckResult {
  const skillpkgJson = join(cwd, 'skillpkg.json');

  if (!existsSync(skillpkgJson)) {
    return {
      name: 'skillpkg.json',
      status: 'warn',
      message: 'skillpkg.json not found (skill dependencies not tracked)',
      fix: 'npx claude-starter-kit',
      autoFixable: false,
    };
  }

  try {
    const content = JSON.parse(readFileSync(skillpkgJson, 'utf-8'));
    const skillCount = Object.keys(content.skills || {}).length;

    return {
      name: 'skillpkg.json',
      status: 'pass',
      message: `skillpkg.json configured with ${skillCount} skill(s)`,
    };
  } catch {
    return {
      name: 'skillpkg.json',
      status: 'fail',
      message: 'skillpkg.json exists but is invalid JSON',
      fix: 'Check skillpkg.json syntax',
      autoFixable: false,
    };
  }
}

function checkClaudeCli(): CheckResult {
  try {
    const version = execSync('claude --version 2>&1', { encoding: 'utf-8' }).trim();
    return {
      name: 'Claude Code CLI',
      status: 'pass',
      message: `Claude Code installed: ${version}`,
    };
  } catch {
    return {
      name: 'Claude Code CLI',
      status: 'fail',
      message: 'Claude Code CLI not found or not in PATH',
      fix: 'npm install -g @anthropic-ai/claude-code',
      autoFixable: false, // Global install requires explicit permission
    };
  }
}

function checkRulesDirectory(cwd: string): CheckResult {
  const rulesDir = join(cwd, '.claude', 'rules');

  if (!existsSync(rulesDir)) {
    return {
      name: 'Rules Directory',
      status: 'warn',
      message: '.claude/rules/ not found (no auto-loaded rules)',
      fix: 'mkdir -p .claude/rules',
      fixCommand: 'mkdir -p .claude/rules',
      autoFixable: true,
    };
  }

  try {
    const rules = readdirSync(rulesDir).filter(f => f.endsWith('.md'));
    if (rules.length === 0) {
      return {
        name: 'Rules Directory',
        status: 'warn',
        message: 'Rules directory exists but no .md rules found',
        fix: 'Add .md files to .claude/rules/',
        autoFixable: false,
      };
    }

    return {
      name: 'Rules Directory',
      status: 'pass',
      message: `${rules.length} rule(s) configured: ${rules.slice(0, 3).join(', ')}${rules.length > 3 ? '...' : ''}`,
    };
  } catch {
    return {
      name: 'Rules Directory',
      status: 'warn',
      message: 'Could not read rules directory',
    };
  }
}
