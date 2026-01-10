/**
 * Scaffold Command
 *
 * Create professional project structures with pre-configured Claude Code setup
 *
 * Usage:
 *   npx claude-starter-kit scaffold express-api my-api
 *   npx claude-starter-kit scaffold nextjs my-app
 *   npx claude-starter-kit scaffold cli my-tool
 */
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

interface ScaffoldOptions {
  yes?: boolean;
  install?: boolean;
  git?: boolean;
}

interface ProjectTemplate {
  name: string;
  description: string;
  stack: string[];
  suggestedSkills: string[];
  files: Record<string, string | ((name: string) => string)>;
  postCreate?: string[];
}

// ============================================
// Project Templates
// ============================================

const TEMPLATES: Record<string, ProjectTemplate> = {
  'express-api': {
    name: 'Express.js REST API',
    description: 'Production-ready Express.js API with TypeScript',
    stack: ['express', 'typescript', 'jest', 'prisma'],
    suggestedSkills: ['backend', 'database', 'testing', 'api-design'],
    files: {
      'package.json': (name: string) => JSON.stringify({
        name,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'tsx watch src/index.ts',
          build: 'tsc',
          start: 'node dist/index.js',
          test: 'jest',
          lint: 'eslint src --ext .ts',
          typecheck: 'tsc --noEmit',
        },
        dependencies: {
          express: '^4.18.2',
          cors: '^2.8.5',
          helmet: '^7.1.0',
          dotenv: '^16.3.1',
          zod: '^3.22.4',
        },
        devDependencies: {
          '@types/express': '^4.17.21',
          '@types/cors': '^2.8.17',
          '@types/node': '^20.10.0',
          'typescript': '^5.3.2',
          'tsx': '^4.6.2',
          'jest': '^29.7.0',
          '@types/jest': '^29.5.11',
          'ts-jest': '^29.1.1',
          'eslint': '^8.55.0',
          '@typescript-eslint/eslint-plugin': '^6.13.2',
          '@typescript-eslint/parser': '^6.13.2',
        },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          declaration: true,
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist'],
      }, null, 2),
      'src/index.ts': `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});

export { app };
`,
      'src/routes/index.ts': `import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Add your routes here
`,
      'src/middleware/error.ts': `import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error]', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
`,
      '.env.example': `PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/db
`,
      '.gitignore': `node_modules/
dist/
.env
*.log
.DS_Store
coverage/
`,
    },
    postCreate: ['npm install'],
  },

  'nextjs': {
    name: 'Next.js Application',
    description: 'Full-stack Next.js with App Router and TypeScript',
    stack: ['nextjs', 'react', 'typescript', 'tailwindcss'],
    suggestedSkills: ['frontend', 'react', 'nextjs', 'tailwindcss'],
    files: {
      'package.json': (name: string) => JSON.stringify({
        name,
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
          typecheck: 'tsc --noEmit',
        },
        dependencies: {
          next: '^14.0.0',
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
        devDependencies: {
          '@types/node': '^20.10.0',
          '@types/react': '^18.2.0',
          '@types/react-dom': '^18.2.0',
          typescript: '^5.3.2',
          tailwindcss: '^3.3.6',
          postcss: '^8.4.32',
          autoprefixer: '^10.4.16',
          eslint: '^8.55.0',
          'eslint-config-next': '^14.0.0',
        },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./src/*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
        exclude: ['node_modules'],
      }, null, 2),
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
`,
      'tailwind.config.ts': `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`,
      'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
      'src/app/layout.tsx': `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js and Claude Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      'src/app/page.tsx': `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
      <p className="mt-4 text-gray-600">
        Start editing src/app/page.tsx to customize this page.
      </p>
    </main>
  );
}
`,
      'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
      '.gitignore': `node_modules/
.next/
out/
.env*.local
*.log
.DS_Store
`,
    },
    postCreate: ['npm install'],
  },

  'cli': {
    name: 'CLI Tool',
    description: 'Node.js CLI tool with Commander.js and TypeScript',
    stack: ['nodejs', 'typescript', 'commander'],
    suggestedSkills: ['nodejs', 'cli-development', 'testing'],
    files: {
      'package.json': (name: string) => JSON.stringify({
        name,
        version: '1.0.0',
        type: 'module',
        bin: {
          [name]: './dist/index.js',
        },
        scripts: {
          dev: 'tsx watch src/index.ts',
          build: 'tsc',
          start: 'node dist/index.js',
          test: 'jest',
          prepublishOnly: 'npm run build',
        },
        dependencies: {
          commander: '^11.1.0',
          chalk: '^5.3.0',
          inquirer: '^9.2.12',
          ora: '^8.0.1',
        },
        devDependencies: {
          '@types/node': '^20.10.0',
          '@types/inquirer': '^9.0.7',
          typescript: '^5.3.2',
          tsx: '^4.6.2',
          jest: '^29.7.0',
          '@types/jest': '^29.5.11',
          'ts-jest': '^29.1.1',
        },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          declaration: true,
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist'],
      }, null, 2),
      'src/index.ts': (name: string) => `#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('${name}')
  .description('Your CLI tool description')
  .version('1.0.0');

program
  .command('hello')
  .description('Say hello')
  .argument('[greetName]', 'Name to greet', 'World')
  .action((greetName: string) => {
    console.log(chalk.green(\`Hello, \${greetName}!\`));
  });

program.parse();
`,
      '.gitignore': `node_modules/
dist/
*.log
.DS_Store
`,
    },
    postCreate: ['npm install'],
  },

  'monorepo': {
    name: 'Monorepo',
    description: 'pnpm workspace monorepo with shared packages',
    stack: ['pnpm', 'typescript', 'turborepo'],
    suggestedSkills: ['monorepo', 'typescript', 'ci-cd'],
    files: {
      'package.json': (name: string) => JSON.stringify({
        name,
        private: true,
        scripts: {
          dev: 'turbo dev',
          build: 'turbo build',
          test: 'turbo test',
          lint: 'turbo lint',
          clean: 'turbo clean',
        },
        devDependencies: {
          turbo: '^1.11.0',
          typescript: '^5.3.2',
        },
      }, null, 2),
      'pnpm-workspace.yaml': `packages:
  - "apps/*"
  - "packages/*"
`,
      'turbo.json': JSON.stringify({
        $schema: 'https://turbo.build/schema.json',
        globalDependencies: ['**/.env.*local'],
        pipeline: {
          build: {
            dependsOn: ['^build'],
            outputs: ['dist/**', '.next/**', '!.next/cache/**'],
          },
          dev: {
            cache: false,
            persistent: true,
          },
          test: {
            dependsOn: ['build'],
          },
          lint: {},
          clean: {
            cache: false,
          },
        },
      }, null, 2),
      'apps/.gitkeep': '',
      'packages/.gitkeep': '',
      '.gitignore': `node_modules/
dist/
.next/
.turbo/
*.log
.DS_Store
`,
    },
    postCreate: ['pnpm install'],
  },
};

// ============================================
// Claude Code Configuration Templates
// ============================================

function getClaudeConfig(template: ProjectTemplate, projectName: string) {
  return {
    'CLAUDE.md': `# ${projectName}

> ${template.description}

## Tech Stack

${template.stack.map(s => `- ${s}`).join('\n')}

## Quick Reference

- \`/evolve [goal]\` - Trigger self-evolving agent
- \`/memory\` - Edit memory files
- \`skillpkg list\` - Show installed skills

## Project Structure

See @.claude/rules/ for coding standards.
See @.claude/memory/index.md for project knowledge.

## Development

\`\`\`bash
npm run dev     # Start development
npm run build   # Build for production
npm run test    # Run tests
\`\`\`
`,
    '.claude/rules/code-quality.md': `---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Code Quality Standards

- Write clean, readable code with meaningful names
- Follow DRY principle
- Keep functions small and focused
- Handle errors explicitly
- Use TypeScript strict mode
`,
    '.claude/rules/testing.md': `---
paths: **/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}
---

# Testing Standards

- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Minimum 80% coverage for new code
- Mock external dependencies
`,
    '.claude/memory/index.md': `# 專案記憶索引

> 搜尋：\`Grep pattern="關鍵字" path=".claude/memory/"\`

## Metadata

| Field | Value |
|-------|-------|
| Created | ${new Date().toISOString().split('T')[0]} |
| Stack | ${template.stack.join(', ')} |

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
`,
    '.mcp.json': JSON.stringify({
      mcpServers: {
        skillpkg: {
          command: 'npx',
          args: ['-y', 'skillpkg-mcp-server'],
        },
        context7: {
          command: 'npx',
          args: ['-y', '@anthropic-ai/claude-code-mcp-context7'],
        },
      },
    }, null, 2),
    'skillpkg.json': JSON.stringify({
      name: projectName,
      skills: {
        'self-evolving-agent': {
          source: 'github:miles990/self-evolving-agent',
          version: 'latest',
        },
      },
    }, null, 2),
  };
}

// ============================================
// Scaffold Command
// ============================================

export async function scaffold(
  templateName?: string,
  projectName?: string,
  options: ScaffoldOptions = {}
): Promise<void> {
  console.log(chalk.bold.cyan('\n🏗️  Claude Starter Kit - Project Scaffold\n'));

  // Interactive template selection if not provided
  if (!templateName) {
    const templateChoices = Object.entries(TEMPLATES).map(([key, template]) => ({
      name: `${chalk.bold(key)} - ${template.description}`,
      value: key,
    }));

    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: 'Select a project template:',
        choices: templateChoices,
      },
    ]);
    templateName = selectedTemplate;
  }

  const template = TEMPLATES[templateName!];
  if (!template) {
    console.error(chalk.red(`\n❌ Unknown template: ${templateName}`));
    console.log(chalk.dim('\nAvailable templates:'));
    Object.entries(TEMPLATES).forEach(([key, t]) => {
      console.log(`  ${chalk.cyan(key)} - ${t.description}`);
    });
    process.exit(1);
  }

  // Interactive project name if not provided
  if (!projectName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: 'my-project',
        validate: (input) => {
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name must be lowercase alphanumeric with hyphens';
          }
          return true;
        },
      },
    ]);
    projectName = name;
  }

  const projectPath = join(process.cwd(), projectName!);

  // Check if directory exists
  if (existsSync(projectPath)) {
    console.error(chalk.red(`\n❌ Directory already exists: ${projectPath}`));
    process.exit(1);
  }

  console.log(chalk.dim(`\nCreating ${template.name}...\n`));

  // Create project directory
  mkdirSync(projectPath, { recursive: true });

  // Create template files
  for (const [filePath, content] of Object.entries(template.files)) {
    const fullPath = join(projectPath, filePath);
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const fileContent = typeof content === 'function'
      ? content(projectName!)
      : content.replace(/\$\{name\}/g, projectName!);

    writeFileSync(fullPath, fileContent);
    console.log(chalk.green(`  ✓ ${filePath}`));
  }

  // Create Claude Code configuration
  const claudeConfig = getClaudeConfig(template, projectName!);
  for (const [filePath, content] of Object.entries(claudeConfig)) {
    const fullPath = join(projectPath, filePath);
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, content);
    console.log(chalk.cyan(`  ✓ ${filePath}`));
  }

  // Create additional directories
  const additionalDirs = [
    '.claude/memory/learnings',
    '.claude/memory/failures',
    '.claude/memory/decisions',
    '.claude/memory/patterns',
    '.claude/skills',
  ];

  for (const dir of additionalDirs) {
    const fullPath = join(projectPath, dir);
    mkdirSync(fullPath, { recursive: true });
    writeFileSync(join(fullPath, '.gitkeep'), '');
  }

  // Initialize git if requested
  if (options.git !== false) {
    try {
      execSync('git init', { cwd: projectPath, stdio: 'pipe' });
      console.log(chalk.green('  ✓ Git repository initialized'));
    } catch {
      console.log(chalk.yellow('  ⚠ Could not initialize git'));
    }
  }

  // Run post-create commands
  if (options.install !== false && template.postCreate) {
    console.log(chalk.dim('\nInstalling dependencies...\n'));
    for (const cmd of template.postCreate) {
      try {
        execSync(cmd, { cwd: projectPath, stdio: 'inherit' });
      } catch {
        console.log(chalk.yellow(`  ⚠ Failed to run: ${cmd}`));
      }
    }
  }

  // Success message
  console.log(chalk.bold.green(`\n✅ Project created successfully!\n`));

  console.log(chalk.bold('Next steps:'));
  console.log(chalk.dim(`
  cd ${projectName}
  claude              # Start Claude Code
  /evolve             # Trigger self-evolution
`));

  console.log(chalk.bold('Suggested skills to install:'));
  console.log(chalk.dim(`
  ${template.suggestedSkills.map(s => `skillpkg install ${s}`).join('\n  ')}
`));

  // Suggested workflows
  console.log(chalk.bold('Available workflows:'));
  console.log(chalk.dim(`
  • test-driven-development - TDD flow: RED → GREEN → REFACTOR
  • systematic-debugging     - Hypothesis → Isolate → Verify
  • brainstorming           - Diverge → Converge → Actionable
`));
}

// List available templates
export function listTemplates(): void {
  console.log(chalk.bold.cyan('\n📋 Available Project Templates\n'));

  Object.entries(TEMPLATES).forEach(([key, template]) => {
    console.log(chalk.bold(`  ${key}`));
    console.log(chalk.dim(`    ${template.description}`));
    console.log(chalk.dim(`    Stack: ${template.stack.join(', ')}`));
    console.log('');
  });
}
