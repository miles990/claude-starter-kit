#!/usr/bin/env node
/**
 * Claude Starter Kit CLI
 *
 * One-command Claude Code project setup with multi-domain support
 *
 * Usage:
 *   npx claude-starter-kit
 *   npx create-claude-project
 */
import { Command } from 'commander';
import { init } from './commands/init.js';
import { doctor } from './commands/doctor.js';
import { smart } from './commands/smart.js';
import { insights } from './commands/insights.js';
import { dashboard } from './commands/dashboard.js';
import { scaffold, listTemplates } from './commands/scaffold.js';
import { workflow, interactiveWorkflow } from './commands/workflow.js';

const program = new Command();

program
  .name('claude-starter-kit')
  .description('Intelligent Claude Code project setup with smart recommendations')
  .version('2.1.0');

program
  .command('init', { isDefault: true })
  .description('Initialize Claude Code configuration')
  .option('-y, --yes', 'Use recommended defaults without prompts')
  .option('-p, --preset <preset>', 'Use preset (minimal, standard, full)')
  .option('--persona <persona>', 'Use persona (startup-mvp, enterprise, fullstack, research)')
  .option('-g, --global', 'Install to ~/.claude/ (global)')
  .option('-l, --local', 'Install to ./.claude/ (project, default)')
  .option('--no-install', 'Skip skill installation')
  .action(init);

program
  .command('doctor')
  .description('Diagnose and validate ecosystem setup')
  .option('--fix', 'Automatically fix issues that can be repaired')
  .option('--discover', 'Analyze project and recommend skills based on tech stack')
  .action(doctor);

program
  .command('smart')
  .description('Intelligent assistant with context-aware recommendations')
  .option('-q, --quick', 'Quick mode - show recommendations without interaction')
  .option('-a, --action <action>', 'Execute a specific action directly')
  .option('-v, --verbose', 'Show detailed analysis')
  .action(smart);

program
  .command('insights')
  .description('Cross-project insights and pattern analysis')
  .option('-g, --global', 'Scan all Claude projects in common directories')
  .option('-e, --export', 'Export insights to file')
  .option('-f, --format <format>', 'Export format: json or markdown', 'markdown')
  .action(insights);

program
  .command('dashboard')
  .description('Launch web dashboard for project monitoring')
  .option('-p, --port <port>', 'Port number', '3456')
  .option('-o, --open', 'Open browser automatically')
  .action((options) => dashboard({ ...options, port: parseInt(options.port) }));

program
  .command('scaffold [template] [name]')
  .description('Create a new project from professional templates')
  .option('-y, --yes', 'Use defaults without prompts')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .option('-l, --list', 'List available templates')
  .action((template, name, options) => {
    if (options.list) {
      listTemplates();
    } else {
      scaffold(template, name, options);
    }
  });

program
  .command('workflow [name]')
  .description('Learn about professional development workflows')
  .option('-i, --interactive', 'Interactive workflow selection')
  .action((name, options) => {
    if (options.interactive) {
      interactiveWorkflow();
    } else {
      workflow(name);
    }
  });

program.parse();
