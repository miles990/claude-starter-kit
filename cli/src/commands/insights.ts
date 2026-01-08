/**
 * Insights Command
 *
 * Cross-project insights and pattern analysis
 *
 * Features:
 * - Aggregate learnings across projects
 * - Identify common patterns
 * - Discover optimization opportunities
 * - Generate usage statistics
 */
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { homedir } from 'os';
import inquirer from 'inquirer';

interface InsightsOptions {
  global?: boolean;
  export?: boolean;
  format?: 'json' | 'markdown';
}

interface ProjectInsight {
  path: string;
  name: string;
  lastActivity: Date;
  memoryCount: {
    learnings: number;
    failures: number;
    decisions: number;
    patterns: number;
  };
  skills: string[];
  healthScore: number;
  tags: string[];
}

interface PatternInsight {
  pattern: string;
  frequency: number;
  projects: string[];
  examples: string[];
}

interface AggregatedInsights {
  timestamp: string;
  projectCount: number;
  projects: ProjectInsight[];
  topPatterns: PatternInsight[];
  commonSkills: Array<{ skill: string; count: number }>;
  totalLearnings: number;
  totalDecisions: number;
  recommendations: string[];
  crossProjectOpportunities: string[];
}

export async function insights(options: InsightsOptions = {}): Promise<void> {
  console.log(chalk.bold.cyan('\n📊 Claude Starter Kit - Insights\n'));

  // Determine scope
  const scope = options.global ? 'global' : 'local';
  console.log(chalk.dim(`Scope: ${scope}\n`));

  // Gather project data
  console.log(chalk.dim('Scanning for Claude projects...\n'));
  const projects = await discoverProjects(scope);

  if (projects.length === 0) {
    console.log(chalk.yellow('No Claude projects found.'));
    console.log(chalk.dim('\nTry:'));
    console.log(chalk.dim('  - Run from a project directory'));
    console.log(chalk.dim('  - Use --global to scan home directory'));
    return;
  }

  // Analyze projects
  const insights = await analyzeProjects(projects);

  // Display or export
  if (options.export) {
    await exportInsights(insights, options.format || 'markdown');
  } else {
    displayInsights(insights);
  }

  // Save to global insights index
  await saveGlobalIndex(insights);
}

async function discoverProjects(scope: 'local' | 'global'): Promise<string[]> {
  const projects: string[] = [];

  if (scope === 'local') {
    // Check current directory and immediate children
    const cwd = process.cwd();
    if (isClaudeProject(cwd)) {
      projects.push(cwd);
    }

    // Also check sibling directories
    const parent = dirname(cwd);
    try {
      const siblings = readdirSync(parent, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .map(d => join(parent, d.name));

      for (const sibling of siblings) {
        if (isClaudeProject(sibling) && sibling !== cwd) {
          projects.push(sibling);
        }
      }
    } catch {
      // Ignore errors
    }
  } else {
    // Global: scan common development directories
    const home = homedir();
    const searchDirs = [
      join(home, 'Projects'),
      join(home, 'Workspace'),
      join(home, 'workspace'),
      join(home, 'projects'),
      join(home, 'dev'),
      join(home, 'Development'),
      join(home, 'Code'),
      join(home, 'code'),
    ];

    for (const searchDir of searchDirs) {
      if (existsSync(searchDir)) {
        try {
          const dirs = readdirSync(searchDir, { withFileTypes: true })
            .filter(d => d.isDirectory() && !d.name.startsWith('.'))
            .map(d => join(searchDir, d.name));

          for (const dir of dirs) {
            if (isClaudeProject(dir)) {
              projects.push(dir);
            }
          }
        } catch {
          // Ignore errors
        }
      }
    }
  }

  return [...new Set(projects)]; // Remove duplicates
}

function isClaudeProject(dir: string): boolean {
  return existsSync(join(dir, 'CLAUDE.md')) ||
    existsSync(join(dir, '.claude', 'memory')) ||
    existsSync(join(dir, '.mcp.json'));
}

async function analyzeProjects(projectPaths: string[]): Promise<AggregatedInsights> {
  const projects: ProjectInsight[] = [];
  const allTags: Record<string, number> = {};
  const allSkills: Record<string, number> = {};
  const allPatterns: Record<string, { count: number; projects: string[]; examples: string[] }> = {};
  let totalLearnings = 0;
  let totalDecisions = 0;

  for (const projectPath of projectPaths) {
    const insight = await analyzeProject(projectPath);
    projects.push(insight);

    // Aggregate tags
    for (const tag of insight.tags) {
      allTags[tag] = (allTags[tag] || 0) + 1;
    }

    // Aggregate skills
    for (const skill of insight.skills) {
      allSkills[skill] = (allSkills[skill] || 0) + 1;
    }

    // Aggregate counts
    totalLearnings += insight.memoryCount.learnings;
    totalDecisions += insight.memoryCount.decisions;

    // Extract patterns from learnings
    const patterns = await extractPatterns(projectPath);
    for (const pattern of patterns) {
      if (!allPatterns[pattern.name]) {
        allPatterns[pattern.name] = { count: 0, projects: [], examples: [] };
      }
      allPatterns[pattern.name].count++;
      allPatterns[pattern.name].projects.push(insight.name);
      if (pattern.example) {
        allPatterns[pattern.name].examples.push(pattern.example);
      }
    }
  }

  // Sort skills by frequency
  const commonSkills = Object.entries(allSkills)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  // Sort patterns by frequency
  const topPatterns = Object.entries(allPatterns)
    .map(([pattern, data]) => ({
      pattern,
      frequency: data.count,
      projects: data.projects,
      examples: data.examples.slice(0, 2),
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Generate recommendations
  const recommendations = generateRecommendations(projects, commonSkills, topPatterns);

  // Find cross-project opportunities
  const crossProjectOpportunities = findCrossProjectOpportunities(projects, topPatterns);

  return {
    timestamp: new Date().toISOString(),
    projectCount: projects.length,
    projects,
    topPatterns,
    commonSkills: commonSkills.slice(0, 10),
    totalLearnings,
    totalDecisions,
    recommendations,
    crossProjectOpportunities,
  };
}

async function analyzeProject(projectPath: string): Promise<ProjectInsight> {
  const memoryDir = join(projectPath, '.claude', 'memory');
  const skillsDir = join(projectPath, '.claude', 'skills');

  // Count memory files
  const memoryCount = {
    learnings: countFiles(join(memoryDir, 'learnings')),
    failures: countFiles(join(memoryDir, 'failures')),
    decisions: countFiles(join(memoryDir, 'decisions')),
    patterns: countFiles(join(memoryDir, 'patterns')),
  };

  // Get installed skills
  const skills: string[] = [];
  if (existsSync(skillsDir)) {
    try {
      const entries = readdirSync(skillsDir);
      skills.push(...entries.filter(e => !e.startsWith('.')));
    } catch {
      // Ignore errors
    }
  }

  // Extract tags from memory files
  const tags = await extractTags(memoryDir);

  // Get last activity
  let lastActivity = new Date(0);
  try {
    const gitLog = require('child_process').execSync(
      'git log -1 --format="%ci" 2>/dev/null',
      { cwd: projectPath, encoding: 'utf-8' }
    ).trim();
    if (gitLog) {
      lastActivity = new Date(gitLog);
    }
  } catch {
    // Use file mtime as fallback
    if (existsSync(join(projectPath, 'CLAUDE.md'))) {
      lastActivity = statSync(join(projectPath, 'CLAUDE.md')).mtime;
    }
  }

  // Calculate health score
  const healthScore = calculateProjectHealth(projectPath, memoryCount, skills);

  return {
    path: projectPath,
    name: basename(projectPath),
    lastActivity,
    memoryCount,
    skills,
    healthScore,
    tags,
  };
}

async function extractTags(memoryDir: string): Promise<string[]> {
  const tags: Set<string> = new Set();

  const subdirs = ['learnings', 'failures', 'decisions'];
  for (const subdir of subdirs) {
    const dir = join(memoryDir, subdir);
    if (!existsSync(dir)) continue;

    try {
      const files = readdirSync(dir).filter(f => f.endsWith('.md'));
      for (const file of files.slice(0, 10)) { // Limit for performance
        const content = readFileSync(join(dir, file), 'utf-8');
        const tagMatch = content.match(/tags:\s*\[([^\]]+)\]/);
        if (tagMatch) {
          const fileTags = tagMatch[1].split(',').map(t => t.trim().replace(/["']/g, ''));
          fileTags.forEach(t => tags.add(t));
        }
      }
    } catch {
      // Ignore errors
    }
  }

  return [...tags];
}

async function extractPatterns(projectPath: string): Promise<Array<{ name: string; example?: string }>> {
  const patterns: Array<{ name: string; example?: string }> = [];
  const memoryDir = join(projectPath, '.claude', 'memory');

  // Extract from learnings
  const learningsDir = join(memoryDir, 'learnings');
  if (existsSync(learningsDir)) {
    try {
      const files = readdirSync(learningsDir).filter(f => f.endsWith('.md'));
      for (const file of files.slice(0, 20)) {
        const content = readFileSync(join(learningsDir, file), 'utf-8');

        // Look for pattern indicators
        const titleMatch = content.match(/^#\s+(.+)/m);
        if (titleMatch) {
          const title = titleMatch[1].toLowerCase();

          // Common pattern categories
          if (title.includes('error') || title.includes('fix')) {
            patterns.push({ name: 'error-resolution', example: titleMatch[1] });
          } else if (title.includes('performance') || title.includes('optimize')) {
            patterns.push({ name: 'performance-optimization', example: titleMatch[1] });
          } else if (title.includes('refactor')) {
            patterns.push({ name: 'code-refactoring', example: titleMatch[1] });
          } else if (title.includes('test')) {
            patterns.push({ name: 'testing-strategy', example: titleMatch[1] });
          } else if (title.includes('api') || title.includes('endpoint')) {
            patterns.push({ name: 'api-development', example: titleMatch[1] });
          } else if (title.includes('config') || title.includes('setup')) {
            patterns.push({ name: 'configuration', example: titleMatch[1] });
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }

  return patterns;
}

function calculateProjectHealth(
  projectPath: string,
  memoryCount: ProjectInsight['memoryCount'],
  skills: string[]
): number {
  let score = 0;

  // Basic setup (40 points)
  if (existsSync(join(projectPath, '.git'))) score += 10;
  if (existsSync(join(projectPath, 'CLAUDE.md'))) score += 15;
  if (existsSync(join(projectPath, '.claude', 'memory'))) score += 10;
  if (existsSync(join(projectPath, '.mcp.json'))) score += 5;

  // Memory utilization (30 points)
  if (memoryCount.learnings > 0) score += 10;
  if (memoryCount.learnings > 5) score += 5;
  if (memoryCount.decisions > 0) score += 10;
  if (memoryCount.patterns > 0) score += 5;

  // Skills (30 points)
  if (skills.length >= 1) score += 10;
  if (skills.length >= 3) score += 10;
  if (skills.some(s => s.includes('evolv'))) score += 10;

  return Math.min(score, 100);
}

function generateRecommendations(
  projects: ProjectInsight[],
  commonSkills: Array<{ skill: string; count: number }>,
  topPatterns: PatternInsight[]
): string[] {
  const recommendations: string[] = [];

  // Low health projects
  const lowHealthProjects = projects.filter(p => p.healthScore < 50);
  if (lowHealthProjects.length > 0) {
    recommendations.push(
      `${lowHealthProjects.length} project(s) need attention: ${lowHealthProjects.map(p => p.name).join(', ')}`
    );
  }

  // Missing evolve skill
  const withoutEvolve = projects.filter(p => !p.skills.some(s => s.includes('evolv')));
  if (withoutEvolve.length > projects.length / 2) {
    recommendations.push(
      'Consider installing self-evolving-agent across projects for autonomous development'
    );
  }

  // No learnings
  const noLearnings = projects.filter(p => p.memoryCount.learnings === 0);
  if (noLearnings.length > 0) {
    recommendations.push(
      `${noLearnings.length} project(s) have no documented learnings - start capturing knowledge`
    );
  }

  // Common patterns that could be skills
  const frequentPatterns = topPatterns.filter(p => p.frequency >= 3);
  if (frequentPatterns.length > 0) {
    recommendations.push(
      `Frequent patterns detected (${frequentPatterns.map(p => p.pattern).join(', ')}) - consider creating shared skills`
    );
  }

  return recommendations;
}

function findCrossProjectOpportunities(
  projects: ProjectInsight[],
  topPatterns: PatternInsight[]
): string[] {
  const opportunities: string[] = [];

  // Skill sharing opportunities
  const skillUsage: Record<string, string[]> = {};
  for (const project of projects) {
    for (const skill of project.skills) {
      if (!skillUsage[skill]) skillUsage[skill] = [];
      skillUsage[skill].push(project.name);
    }
  }

  // Find skills only used in some projects
  for (const [skill, usedBy] of Object.entries(skillUsage)) {
    if (usedBy.length > 0 && usedBy.length < projects.length * 0.5) {
      const notUsing = projects
        .filter(p => !p.skills.includes(skill))
        .map(p => p.name);
      if (notUsing.length > 0 && notUsing.length <= 3) {
        opportunities.push(
          `Skill "${skill}" could benefit: ${notUsing.join(', ')}`
        );
      }
    }
  }

  // Knowledge transfer opportunities
  const projectsWithDecisions = projects.filter(p => p.memoryCount.decisions > 3);
  const projectsWithoutDecisions = projects.filter(p => p.memoryCount.decisions === 0);
  if (projectsWithDecisions.length > 0 && projectsWithoutDecisions.length > 0) {
    opportunities.push(
      `Transfer ADR practices from ${projectsWithDecisions[0].name} to other projects`
    );
  }

  return opportunities;
}

function displayInsights(insights: AggregatedInsights): void {
  // Summary
  console.log(chalk.bold('Summary:\n'));
  console.log(`  ${chalk.dim('Projects:')}    ${insights.projectCount}`);
  console.log(`  ${chalk.dim('Learnings:')}   ${insights.totalLearnings}`);
  console.log(`  ${chalk.dim('Decisions:')}   ${insights.totalDecisions}`);
  console.log('');

  // Projects overview
  console.log(chalk.bold('Projects:\n'));
  for (const project of insights.projects.slice(0, 10)) {
    const healthColor = project.healthScore >= 70 ? chalk.green :
      project.healthScore >= 40 ? chalk.yellow : chalk.red;
    const activity = getTimeAgo(project.lastActivity);

    console.log(`  ${healthColor('●')} ${chalk.bold(project.name)}`);
    console.log(chalk.dim(`    Health: ${project.healthScore}% | Skills: ${project.skills.length} | Activity: ${activity}`));
  }
  console.log('');

  // Top patterns
  if (insights.topPatterns.length > 0) {
    console.log(chalk.bold('Common Patterns:\n'));
    for (const pattern of insights.topPatterns.slice(0, 5)) {
      console.log(`  ${chalk.cyan('•')} ${pattern.pattern} (${pattern.frequency}x)`);
      if (pattern.examples.length > 0) {
        console.log(chalk.dim(`    Example: ${pattern.examples[0]}`));
      }
    }
    console.log('');
  }

  // Common skills
  if (insights.commonSkills.length > 0) {
    console.log(chalk.bold('Popular Skills:\n'));
    for (const { skill, count } of insights.commonSkills.slice(0, 5)) {
      const bar = '█'.repeat(Math.min(count, 10));
      console.log(`  ${skill.padEnd(25)} ${chalk.cyan(bar)} ${count}`);
    }
    console.log('');
  }

  // Recommendations
  if (insights.recommendations.length > 0) {
    console.log(chalk.bold.yellow('\n💡 Recommendations:\n'));
    for (const rec of insights.recommendations) {
      console.log(`  ${chalk.yellow('•')} ${rec}`);
    }
    console.log('');
  }

  // Cross-project opportunities
  if (insights.crossProjectOpportunities.length > 0) {
    console.log(chalk.bold.green('\n🔗 Cross-Project Opportunities:\n'));
    for (const opp of insights.crossProjectOpportunities.slice(0, 5)) {
      console.log(`  ${chalk.green('•')} ${opp}`);
    }
    console.log('');
  }
}

async function exportInsights(insights: AggregatedInsights, format: 'json' | 'markdown'): Promise<void> {
  const timestamp = new Date().toISOString().split('T')[0];
  let filename: string;
  let content: string;

  if (format === 'json') {
    filename = `insights-${timestamp}.json`;
    content = JSON.stringify(insights, null, 2);
  } else {
    filename = `insights-${timestamp}.md`;
    content = generateMarkdownReport(insights);
  }

  writeFileSync(filename, content);
  console.log(chalk.green(`✓ Insights exported to ${filename}`));
}

function generateMarkdownReport(insights: AggregatedInsights): string {
  let md = `# Claude Starter Kit Insights Report\n\n`;
  md += `> Generated: ${insights.timestamp}\n\n`;

  md += `## Summary\n\n`;
  md += `- **Projects Analyzed:** ${insights.projectCount}\n`;
  md += `- **Total Learnings:** ${insights.totalLearnings}\n`;
  md += `- **Total Decisions:** ${insights.totalDecisions}\n\n`;

  md += `## Projects\n\n`;
  md += `| Project | Health | Skills | Learnings | Last Activity |\n`;
  md += `|---------|--------|--------|-----------|---------------|\n`;
  for (const p of insights.projects) {
    md += `| ${p.name} | ${p.healthScore}% | ${p.skills.length} | ${p.memoryCount.learnings} | ${getTimeAgo(p.lastActivity)} |\n`;
  }
  md += `\n`;

  if (insights.topPatterns.length > 0) {
    md += `## Common Patterns\n\n`;
    for (const p of insights.topPatterns) {
      md += `- **${p.pattern}** (${p.frequency}x across ${p.projects.length} projects)\n`;
    }
    md += `\n`;
  }

  if (insights.recommendations.length > 0) {
    md += `## Recommendations\n\n`;
    for (const rec of insights.recommendations) {
      md += `- ${rec}\n`;
    }
    md += `\n`;
  }

  if (insights.crossProjectOpportunities.length > 0) {
    md += `## Cross-Project Opportunities\n\n`;
    for (const opp of insights.crossProjectOpportunities) {
      md += `- ${opp}\n`;
    }
  }

  return md;
}

async function saveGlobalIndex(insights: AggregatedInsights): Promise<void> {
  const globalDir = join(homedir(), '.claude', 'insights');

  try {
    if (!existsSync(globalDir)) {
      mkdirSync(globalDir, { recursive: true });
    }

    const indexPath = join(globalDir, 'index.json');
    let index: { runs: Array<{ timestamp: string; projectCount: number; totalLearnings: number }> } = {
      runs: [],
    };

    if (existsSync(indexPath)) {
      try {
        index = JSON.parse(readFileSync(indexPath, 'utf-8'));
      } catch {
        // Use default
      }
    }

    // Add current run
    index.runs.unshift({
      timestamp: insights.timestamp,
      projectCount: insights.projectCount,
      totalLearnings: insights.totalLearnings,
    });

    // Keep only last 30 runs
    index.runs = index.runs.slice(0, 30);

    writeFileSync(indexPath, JSON.stringify(index, null, 2));
  } catch {
    // Ignore errors - this is optional
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

function getTimeAgo(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
