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

const program = new Command();

program
  .name('claude-starter-kit')
  .description('One-command Claude Code project setup with multi-domain support')
  .version('1.0.0');

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

program.parse();
