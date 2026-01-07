/**
 * init command - Interactive Claude Code project setup
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { homedir } from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { TEMPLATES } from '../templates/index.js';
import { DOMAINS, type DomainKey } from '../domains/index.js';

type InstallScope = 'global' | 'local' | 'both';

interface InitOptions {
  yes?: boolean;
  preset?: 'minimal' | 'standard' | 'full';
  install?: boolean;
  global?: boolean;
  local?: boolean;
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
    description: '包含軟體開發技能 + Hooks',
    components: ['claude-md', 'all-rules', 'mcp-config', 'memory-system', 'hooks-config'],
    skills: ['self-evolving-agent', 'software-skills'],
    domains: ['software'],
  },
};

/**
 * Check if a command exists
 */
async function commandExists(cmd: string): Promise<boolean> {
  try {
    const { execSync } = await import('child_process');
    execSync(`which ${cmd}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check prerequisites
 */
async function checkPrerequisites(): Promise<{ missing: string[]; warnings: string[] }> {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (majorVersion < 18) {
    warnings.push(`Node.js ${nodeVersion} 偏舊，建議升級到 v18+`);
  }

  // Check Claude Code
  const hasClaude = await commandExists('claude');
  if (!hasClaude) {
    missing.push('claude');
  }

  // Check Git (optional but recommended)
  const hasGit = await commandExists('git');
  if (!hasGit) {
    warnings.push('Git 未安裝，部分功能可能受限');
  }

  return { missing, warnings };
}

type ProjectType = 'node' | 'python' | 'rust' | 'go' | 'unknown';

/**
 * Detect project type based on config files
 */
function detectProjectType(cwd: string): { type: ProjectType; confidence: 'high' | 'medium' | 'low' } {
  // High confidence: main config files
  if (existsSync(join(cwd, 'package.json'))) {
    return { type: 'node', confidence: 'high' };
  }
  if (existsSync(join(cwd, 'pyproject.toml')) || existsSync(join(cwd, 'setup.py'))) {
    return { type: 'python', confidence: 'high' };
  }
  if (existsSync(join(cwd, 'Cargo.toml'))) {
    return { type: 'rust', confidence: 'high' };
  }
  if (existsSync(join(cwd, 'go.mod'))) {
    return { type: 'go', confidence: 'high' };
  }

  // Medium confidence: secondary indicators
  if (existsSync(join(cwd, 'requirements.txt')) || existsSync(join(cwd, 'Pipfile'))) {
    return { type: 'python', confidence: 'medium' };
  }
  if (existsSync(join(cwd, 'yarn.lock')) || existsSync(join(cwd, 'pnpm-lock.yaml'))) {
    return { type: 'node', confidence: 'medium' };
  }

  return { type: 'unknown', confidence: 'low' };
}

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
function safeWriteFile(filePath: string, content: string, forceOverwrite = false): boolean {
  if (existsSync(filePath) && !forceOverwrite) {
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
 * Update .gitignore (only for local install)
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
async function installSkills(skills: string[], scope: 'global' | 'local'): Promise<void> {
  if (skills.length === 0) return;

  const spinner = ora(`安裝技能中... (${scope === 'global' ? '全域' : '專案'})`).start();

  try {
    const { execSync } = await import('child_process');

    if (scope === 'global') {
      // For global install, run from ~/.skillpkg directory
      const globalSkillpkgDir = join(homedir(), '.skillpkg');
      execSync('npx skillpkg-cli install', {
        stdio: 'pipe',
        timeout: 120000,
        cwd: globalSkillpkgDir,
      });
      // Auto-sync to ~/.claude/skills/ (Boris Tip #8)
      execSync('npx skillpkg-cli sync', {
        stdio: 'pipe',
        timeout: 60000,
        cwd: globalSkillpkgDir,
      });
    } else {
      // For local install, run from current directory
      execSync('npx skillpkg-cli install', {
        stdio: 'pipe',
        timeout: 120000,
      });
      // Auto-sync to .claude/skills/
      execSync('npx skillpkg-cli sync', {
        stdio: 'pipe',
        timeout: 60000,
      });
    }

    spinner.succeed(`已安裝並同步 ${skills.length} 個技能 (${scope === 'global' ? '全域' : '專案'})`);
  } catch (error) {
    const cmd = scope === 'global'
      ? `cd ~/.skillpkg && npx skillpkg-cli install`
      : 'npx skillpkg-cli install';
    spinner.warn(`技能安裝跳過 (可稍後執行: ${cmd})`);
  }
}

/**
 * Verify installation (Boris Tip #13: Verification loop)
 */
function verifyInstallation(scope: 'global' | 'local' | 'both', cwd: string): void {
  const checks: { name: string; path: string; exists: boolean }[] = [];

  if (scope === 'global' || scope === 'both') {
    const globalDir = join(homedir(), '.claude');
    checks.push(
      { name: '全域設定', path: join(globalDir, 'settings.json'), exists: false },
      { name: '全域規則', path: join(globalDir, 'rules'), exists: false },
      { name: '全域技能', path: join(globalDir, 'skills'), exists: false },
    );
  }

  if (scope === 'local' || scope === 'both') {
    checks.push(
      { name: 'CLAUDE.md', path: join(cwd, 'CLAUDE.md'), exists: false },
      { name: 'Memory 索引', path: join(cwd, '.claude', 'memory', 'index.md'), exists: false },
      { name: '專案規則', path: join(cwd, '.claude', 'rules'), exists: false },
    );
  }

  // Check each item
  for (const check of checks) {
    check.exists = existsSync(check.path);
  }

  const passed = checks.filter((c) => c.exists);
  const failed = checks.filter((c) => !c.exists);

  console.log('');
  console.log(chalk.bold('驗證安裝：'));

  for (const check of passed) {
    console.log(chalk.green('  ✓') + ` ${check.name}`);
  }

  for (const check of failed) {
    console.log(chalk.red('  ✗') + ` ${check.name} ` + chalk.dim(`(${check.path})`));
  }

  if (failed.length === 0) {
    console.log(chalk.green.bold('  → 全部通過！'));
  } else {
    console.log(chalk.yellow(`  → ${passed.length}/${checks.length} 項目通過`));
  }
}

/**
 * Install global configuration
 * Global only includes: MCP config + Skills (no rules, no memory)
 */
function installGlobal(config: typeof PRESETS['standard']): Record<string, string> {
  const globalDir = join(homedir(), '.claude');
  const globalMcpPath = join(homedir(), '.mcp.json');
  const globalSkillpkgDir = join(homedir(), '.skillpkg');

  console.log(chalk.dim('  [全域配置 ~/.claude/]'));

  // Create global .claude directory
  if (!existsSync(globalDir)) {
    mkdirSync(globalDir, { recursive: true });
  }

  // MCP config (global)
  if (config.components.includes('mcp-config')) {
    safeWriteFile(join(globalDir, 'settings.json'), TEMPLATES.settingsJson);
    safeWriteFile(globalMcpPath, TEMPLATES.mcpJson);
  }

  // Note: Rules are project-specific, not created in global installation

  // Create skills directory
  const skillsDir = join(globalDir, 'skills');
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  // Build global skills object
  const skills: Record<string, string> = {};
  if (config.skills.includes('self-evolving-agent')) {
    skills['self-evolving-agent'] = 'github:miles990/self-evolving-agent';
  }
  if (config.skills.includes('software-skills')) {
    skills['software-skills'] = 'github:miles990/claude-software-skills';
  }

  // Create global skillpkg.json if skills are needed
  if (Object.keys(skills).length > 0) {
    if (!existsSync(globalSkillpkgDir)) {
      mkdirSync(globalSkillpkgDir, { recursive: true });
    }
    const globalSkillpkgJson = {
      name: 'global',
      skills,
      sync_targets: { 'claude-code': true },
    };
    safeWriteFile(join(globalSkillpkgDir, 'skillpkg.json'), JSON.stringify(globalSkillpkgJson, null, 2));
  }

  return skills;
}

/**
 * Install local (project) configuration
 */
function installLocal(
  cwd: string,
  projectName: string,
  config: typeof PRESETS['standard'],
  selectedDomains: DomainKey[]
): Record<string, string> {
  const claudeDir = join(cwd, '.claude');

  console.log(chalk.dim('  [專案配置 ./.claude/]'));

  // Create .claude directory
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }

  // CLAUDE.md (project only)
  if (config.components.includes('claude-md')) {
    safeWriteFile(join(cwd, 'CLAUDE.md'), TEMPLATES.claudeMd(projectName));
  }

  // Rules
  if (config.components.includes('basic-rules') || config.components.includes('all-rules')) {
    safeWriteFile(join(cwd, '.claude/rules/code-quality.md'), TEMPLATES.codeQuality);
    safeWriteFile(join(cwd, '.claude/rules/testing.md'), TEMPLATES.testing);
  }

  if (config.components.includes('all-rules')) {
    safeWriteFile(join(cwd, '.claude/rules/memory-management.md'), TEMPLATES.memoryManagement);
    safeWriteFile(join(cwd, '.claude/rules/evolve-workflow.md'), TEMPLATES.evolveWorkflow);
  }

  // MCP config (project level)
  if (config.components.includes('mcp-config')) {
    safeWriteFile(join(cwd, '.mcp.json'), TEMPLATES.mcpJson);
    safeWriteFile(join(cwd, '.claude/settings.json'), TEMPLATES.settingsJson);
  }

  // Memory system (project only, now under .claude/memory)
  if (config.components.includes('memory-system')) {
    safeWriteFile(join(cwd, '.claude/memory/index.md'), TEMPLATES.memoryIndex);
    for (const dir of ['learnings', 'decisions', 'failures', 'patterns', 'strategies']) {
      const dirPath = join(cwd, '.claude/memory', dir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      safeWriteFile(join(dirPath, '.gitkeep'), '');
    }
  }

  // Hooks configuration (Boris Tips #9, #12)
  if (config.components.includes('hooks-config')) {
    safeWriteFile(join(cwd, '.claude/settings.local.json'), TEMPLATES.hooksConfig);
    console.log(chalk.dim('    提示：Hooks 會在寫入檔案後自動格式化'));
  }

  // Domain-specific rules
  for (const domain of selectedDomains) {
    const domainConfig = DOMAINS[domain];
    if (domainConfig?.rules) {
      for (const [fileName, content] of Object.entries(domainConfig.rules)) {
        safeWriteFile(join(cwd, '.claude/rules', fileName), content);
      }
    }
  }

  // Build skills object
  const skills: Record<string, string> = {};
  if (config.skills.includes('self-evolving-agent')) {
    skills['self-evolving-agent'] = 'github:miles990/self-evolving-agent';
  }
  if (config.skills.includes('software-skills')) {
    skills['software-skills'] = 'github:miles990/claude-software-skills';
  }

  // Add domain skills
  for (const domain of selectedDomains) {
    const domainConfig = DOMAINS[domain];
    if (domainConfig?.skill && domainConfig?.skillName) {
      skills[domainConfig.skillName] = domainConfig.skill;
    }
  }

  // Create skillpkg.json
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

  return skills;
}

/**
 * Main init function
 */
export async function init(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const projectName = getProjectName();

  printBanner();

  // Check prerequisites
  const { missing, warnings } = await checkPrerequisites();

  // Show warnings
  for (const warning of warnings) {
    console.log(chalk.yellow('  ⚠') + ` ${warning}`);
  }

  // Detect project type
  const projectInfo = detectProjectType(cwd);
  if (projectInfo.type !== 'unknown') {
    const typeNames: Record<ProjectType, string> = {
      node: 'Node.js',
      python: 'Python',
      rust: 'Rust',
      go: 'Go',
      unknown: '未知',
    };
    const confidence = projectInfo.confidence === 'high' ? '' : chalk.dim(' (推測)');
    console.log(chalk.green('  ✓') + ` 偵測到 ${typeNames[projectInfo.type]} 專案${confidence}`);
  }

  // Handle missing prerequisites
  if (missing.includes('claude')) {
    console.log('');
    console.log(chalk.red('  ✗ Claude Code 未安裝'));
    console.log('');
    console.log(chalk.dim('  安裝方式：'));
    console.log(chalk.cyan('    npm install -g @anthropic-ai/claude-code'));
    console.log('');

    if (!options.yes) {
      const { continueAnyway } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAnyway',
          message: '是否仍要繼續設置？（之後需手動安裝 Claude Code）',
          default: true,
        },
      ]);
      if (!continueAnyway) {
        console.log(chalk.dim('  已取消'));
        return;
      }
    } else {
      console.log(chalk.dim('  繼續設置...（之後需手動安裝 Claude Code）'));
    }
    console.log('');
  }

  let preset: 'minimal' | 'standard' | 'full' = 'standard';
  let selectedDomains: DomainKey[] = [];
  let shouldInstall = options.install !== false;
  let scope: InstallScope = 'local';

  // Determine scope from options
  if (options.global && options.local) {
    scope = 'both';
  } else if (options.global) {
    scope = 'global';
  } else if (options.local) {
    scope = 'local';
  }

  // Quick mode
  if (options.yes) {
    preset = options.preset || 'standard';
    console.log(chalk.cyan(`使用預設配置: ${PRESETS[preset].name}`));
    if (scope !== 'local') {
      console.log(chalk.cyan(`安裝範圍: ${scope === 'global' ? '全域' : '全域 + 專案'}`));
    }
    console.log('');
  } else {
    // Interactive scope selection
    const scopeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'scope',
        message: '選擇安裝範圍:',
        choices: [
          {
            name: '專案 (local) - 只在當前目錄',
            value: 'local',
          },
          {
            name: '全域 (global) - ~/.claude/ 所有專案共用',
            value: 'global',
          },
          {
            name: '兩者都裝 - 全域 + 專案',
            value: 'both',
          },
        ],
        default: scope,
      },
    ]);
    scope = scopeAnswer.scope;

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
            { name: '專案管理 (Scrum, 甘特圖)', value: 'project-management' },
            new inquirer.Separator('─── 專業服務 ───'),
            { name: '研究分析 (競品、調研)', value: 'research' },
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

    // Confirm install (if there are skills to install)
    if (PRESETS[preset].skills.length > 0 || selectedDomains.length > 0) {
      const installAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: `是否立即安裝技能？${scope === 'global' ? '(全域)' : scope === 'both' ? '(全域+專案)' : '(專案)'}`,
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
  let skills: Record<string, string> = {};
  let globalSkills: Record<string, string> = {};

  // Install based on scope
  if (scope === 'global' || scope === 'both') {
    globalSkills = installGlobal(config);
    console.log('');
  }

  if (scope === 'local' || scope === 'both') {
    skills = installLocal(cwd, projectName, config, selectedDomains);
  }

  // Install skills
  if (shouldInstall) {
    // Install global skills
    if ((scope === 'global' || scope === 'both') && Object.keys(globalSkills).length > 0) {
      console.log('');
      await installSkills(Object.keys(globalSkills), 'global');
    }

    // Install local skills
    if ((scope === 'local' || scope === 'both') && Object.keys(skills).length > 0) {
      console.log('');
      await installSkills(Object.keys(skills), 'local');
    }
  }

  // Verify installation (Boris Tip #13)
  verifyInstallation(scope, cwd);

  // Done
  console.log('');
  console.log(chalk.green.bold('✓ 設置完成！'));
  console.log('');

  // Show next steps based on scope
  console.log('下一步：');
  console.log('');

  if (scope === 'global') {
    console.log(chalk.cyan('  cd your-project'));
    console.log(chalk.cyan('  npx claude-starter-kit --local') + '  # 設置專案配置');
  } else {
    console.log(chalk.cyan('  claude') + '                    # 啟動 Claude Code');
    if (config.skills.includes('self-evolving-agent')) {
      console.log(chalk.cyan('  /evolve [目標]') + '            # 觸發自進化 Agent');
    }
  }
  console.log('');

  if (selectedDomains.length > 0) {
    const domainSkillCount = selectedDomains.filter(d => DOMAINS[d]?.skill).length;
    console.log(chalk.dim(`已選擇領域: ${selectedDomains.join(', ')}`));
    if (domainSkillCount > 0) {
      console.log(chalk.dim(`(${domainSkillCount} 個領域技能已加入 skillpkg.json)`));
    }
    console.log('');
  }

  // Show summary
  if (scope === 'both') {
    console.log(chalk.dim('已安裝：'));
    console.log(chalk.dim(`  全域: ~/.claude/ (rules, settings)`));
    console.log(chalk.dim(`  專案: ./.claude/ (rules, memory, skills)`));
    console.log('');
  }
}
