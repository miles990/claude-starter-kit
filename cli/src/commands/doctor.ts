/**
 * Doctor Command
 *
 * Diagnose and validate Claude Code ecosystem setup
 */
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: string;
}

export async function doctor(): Promise<void> {
  const cwd = process.cwd();
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
    console.log(chalk.dim('\nRun the suggested fixes or use: npx claude-starter-kit'));
  }
  console.log('');
}

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
    };
  }
  return {
    name: 'CLAUDE.md',
    status: 'fail',
    message: 'CLAUDE.md not found (Claude won\'t have project context)',
    fix: 'npx claude-starter-kit',
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
      fix: 'npx claude-starter-kit',
    };
  }

  if (!existsSync(indexFile)) {
    return {
      name: 'Memory System',
      status: 'warn',
      message: 'Memory directory exists but index.md is missing',
      fix: 'npx claude-starter-kit',
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
    };
  }

  return {
    name: 'Memory System',
    status: 'pass',
    message: 'Memory system initialized with all directories',
  };
}

function checkSkillsDirectory(cwd: string): CheckResult {
  const skillsDir = join(cwd, '.claude', 'skills');

  if (!existsSync(skillsDir)) {
    return {
      name: 'Skills Directory',
      status: 'warn',
      message: '.claude/skills/ directory not found',
      fix: 'npx skillpkg-cli sync',
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
    };
  } catch {
    return {
      name: 'MCP Configuration',
      status: 'fail',
      message: '.mcp.json exists but is invalid JSON',
      fix: 'Check .mcp.json syntax or regenerate with npx claude-starter-kit',
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
