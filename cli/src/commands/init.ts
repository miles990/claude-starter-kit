/**
 * init command - Interactive Claude Code project setup
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { TEMPLATES } from '../templates/index.js';
import { DOMAINS, type DomainKey } from '../domains/index.js';

interface InitOptions {
  yes?: boolean;
  preset?: 'minimal' | 'standard' | 'full';
  install?: boolean;
}

// Preset configurations
const PRESETS: Record<string, {
  name: string;
  description: string;
  components: string[];
  skills: string[];
  domains: string[];
}> = {
  minimal: {
    name: '最小配置',
    description: '只有 CLAUDE.md + 基本規則',
    components: ['claude-md', 'basic-rules'],
    skills: [],
    domains: [],
  },
  standard: {
    name: '標準配置 (推薦)',
    description: 'Memory 系統 + 自進化 Agent',
    components: ['claude-md', 'basic-rules', 'mcp-config', 'memory-system'],
    skills: ['self-evolving-agent'],
    domains: [],
  },
  full: {
    name: '完整配置',
    description: '包含軟體開發技能',
    components: ['claude-md', 'all-rules', 'mcp-config', 'memory-system'],
    skills: ['self-evolving-agent', 'software-skills'],
    domains: ['software'],
  },
};

/**
 * Print banner
 */
function printBanner() {
  console.log('');
  console.log(chalk.cyan('  Claude Starter Kit'));
  console.log(chalk.dim('  ─────────────────────────────────'));
  console.log(chalk.dim('  One-command Claude Code setup'));
  console.log('');
}

/**
 * Safely write file (skip if exists)
 */
function safeWriteFile(filePath: string, content: string): boolean {
  if (existsSync(filePath)) {
    console.log(chalk.yellow('  ○') + ` ${filePath} ` + chalk.dim('(已存在，跳過)'));
    return false;
  }

  const dir = join(filePath, '..');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, content, 'utf-8');
  console.log(chalk.green('  ✓') + ` ${filePath}`);
  return true;
}

/**
 * Get project name from directory
 */
function getProjectName(): string {
  return basename(process.cwd())
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'my-project';
}

/**
 * Update .gitignore
 */
function updateGitignore(cwd: string): void {
  const gitignorePath = join(cwd, '.gitignore');
  const additions = `
# Claude Code
.claude/CLAUDE.local.md
.claude/skills/*
!.claude/skills/.gitkeep
.skillpkg/
`;

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf-8');
    if (!content.includes('# Claude Code')) {
      writeFileSync(gitignorePath, content + additions, 'utf-8');
      console.log(chalk.green('  ✓') + ' 更新 .gitignore');
    } else {
      console.log(chalk.yellow('  ○') + ' .gitignore ' + chalk.dim('(Claude 區塊已存在)'));
    }
  } else {
    writeFileSync(gitignorePath, additions.trim() + '\n', 'utf-8');
    console.log(chalk.green('  ✓') + ' .gitignore');
  }
}

/**
 * Install skills using skillpkg
 */
async function installSkills(skills: string[]): Promise<void> {
  if (skills.length === 0) return;

  const spinner = ora('安裝技能中...').start();

  try {
    const { execSync } = await import('child_process');

    // Try to run skillpkg install
    execSync('npx skillpkg-cli install', {
      stdio: 'pipe',
      timeout: 120000,
    });

    spinner.succeed(`已安裝 ${skills.length} 個技能`);
  } catch (error) {
    spinner.warn('技能安裝跳過 (可稍後執行 skillpkg install)');
  }
}

/**
 * Main init function
 */
export async function init(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const projectName = getProjectName();

  printBanner();

  let preset: 'minimal' | 'standard' | 'full' = 'standard';
  let selectedDomains: DomainKey[] = [];
  let shouldInstall = options.install !== false;

  // Quick mode
  if (options.yes) {
    preset = options.preset || 'standard';
    console.log(chalk.cyan(`使用預設配置: ${PRESETS[preset].name}`));
    console.log('');
  } else {
    // Interactive preset selection
    const presetAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'preset',
        message: '選擇配置模式:',
        choices: [
          {
            name: `${PRESETS.standard.name} - ${PRESETS.standard.description}`,
            value: 'standard',
          },
          {
            name: `${PRESETS.minimal.name} - ${PRESETS.minimal.description}`,
            value: 'minimal',
          },
          {
            name: `${PRESETS.full.name} - ${PRESETS.full.description}`,
            value: 'full',
          },
        ],
        default: 'standard',
      },
    ]);
    preset = presetAnswer.preset;

    // Multi-select domains (if not minimal)
    if (preset !== 'minimal') {
      const domainAnswer = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'domains',
          message: '選擇專業領域 (可多選):',
          choices: [
            new inquirer.Separator('─── 技術領域 ───'),
            { name: '前端開發 (React, Vue, CSS)', value: 'frontend' },
            { name: '後端開發 (Node, API, Database)', value: 'backend' },
            { name: 'DevOps (CI/CD, Docker)', value: 'devops' },
            { name: 'AI/ML (模型、資料處理)', value: 'ai-ml' },
            new inquirer.Separator('─── 商業領域 ───'),
            { name: '量化交易 (策略、回測)', value: 'quant-trading' },
            { name: '金融分析 (財報、估值)', value: 'finance' },
            { name: '行銷企劃 (4P, Growth)', value: 'marketing' },
            { name: '產品管理 (PRD, OKR)', value: 'product' },
            new inquirer.Separator('─── 創意領域 ───'),
            { name: '遊戲設計 (機制、敘事)', value: 'game-design' },
            { name: 'UI/UX 設計 (原型、可用性)', value: 'ui-ux' },
            { name: '內容創作 (文案、SEO)', value: 'content' },
            { name: '品牌設計 (識別、策略)', value: 'brand' },
          ],
        },
      ]);
      selectedDomains = domainAnswer.domains;
    }

    // Confirm install
    if (PRESETS[preset].skills.length > 0 || selectedDomains.length > 0) {
      const installAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: '是否立即安裝技能？',
          default: true,
        },
      ]);
      shouldInstall = installAnswer.install;
    }
  }

  console.log('');
  console.log(chalk.cyan('安裝配置中...'));
  console.log('');

  const config = PRESETS[preset];

  // Create .claude directory
  const claudeDir = join(cwd, '.claude');
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }

  // Install components
  if (config.components.includes('claude-md')) {
    safeWriteFile(join(cwd, 'CLAUDE.md'), TEMPLATES.claudeMd(projectName));
  }

  if (config.components.includes('basic-rules') || config.components.includes('all-rules')) {
    safeWriteFile(join(cwd, '.claude/rules/code-quality.md'), TEMPLATES.codeQuality);
    safeWriteFile(join(cwd, '.claude/rules/testing.md'), TEMPLATES.testing);
  }

  if (config.components.includes('all-rules')) {
    safeWriteFile(join(cwd, '.claude/rules/memory-management.md'), TEMPLATES.memoryManagement);
    safeWriteFile(join(cwd, '.claude/rules/evolve-workflow.md'), TEMPLATES.evolveWorkflow);
  }

  if (config.components.includes('mcp-config')) {
    safeWriteFile(join(cwd, '.mcp.json'), TEMPLATES.mcpJson);
    safeWriteFile(join(cwd, '.claude/settings.json'), TEMPLATES.settingsJson);
  }

  if (config.components.includes('memory-system')) {
    safeWriteFile(join(cwd, '.github/memory/index.md'), TEMPLATES.memoryIndex);
    for (const dir of ['learnings', 'decisions', 'failures', 'patterns', 'strategies']) {
      const dirPath = join(cwd, '.github/memory', dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      safeWriteFile(join(dirPath, '.gitkeep'), '');
    }
  }

  // Install domain-specific rules
  for (const domain of selectedDomains) {
    const domainConfig = DOMAINS[domain];
    if (domainConfig?.rules) {
      for (const [fileName, content] of Object.entries(domainConfig.rules)) {
        safeWriteFile(join(cwd, '.claude/rules', fileName), content);
      }
    }
  }

  // Create skillpkg.json
  const skills: Record<string, string> = {};

  // Add preset skills
  if (config.skills.includes('self-evolving-agent')) {
    skills['self-evolving-agent'] = 'github:miles990/self-evolving-agent';
  }
  if (config.skills.includes('software-skills')) {
    skills['software-skills'] = 'github:miles990/claude-software-skills';
  }

  // Add domain skills (future)
  // for (const domain of selectedDomains) {
  //   const domainConfig = DOMAINS[domain];
  //   if (domainConfig?.skill) {
  //     skills[domainConfig.skillName] = domainConfig.skill;
  //   }
  // }

  const skillpkgJson = {
    name: projectName,
    skills,
    sync_targets: { 'claude-code': true },
  };

  safeWriteFile(join(cwd, 'skillpkg.json'), JSON.stringify(skillpkgJson, null, 2));

  // Create .claude/skills/.gitkeep
  const skillsDir = join(cwd, '.claude/skills');
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }
  safeWriteFile(join(skillsDir, '.gitkeep'), '');

  // Update .gitignore
  updateGitignore(cwd);

  // Install skills
  if (shouldInstall && Object.keys(skills).length > 0) {
    console.log('');
    await installSkills(Object.keys(skills));
  }

  // Done
  console.log('');
  console.log(chalk.green.bold('✓ 設置完成！'));
  console.log('');

  console.log('下一步：');
  console.log('');
  console.log(chalk.cyan('  claude') + '                    # 啟動 Claude Code');
  if (config.skills.includes('self-evolving-agent')) {
    console.log(chalk.cyan('  /evolve [目標]') + '            # 觸發自進化 Agent');
  }
  console.log('');

  if (selectedDomains.length > 0) {
    console.log(chalk.dim(`已選擇領域: ${selectedDomains.join(', ')}`));
    console.log(chalk.dim('(領域技能包開發中，敬請期待)'));
    console.log('');
  }
}
