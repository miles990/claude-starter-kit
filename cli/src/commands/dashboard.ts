/**
 * Dashboard Command
 *
 * Web UI for project monitoring and memory browsing
 *
 * Features:
 * - Project health overview
 * - Memory browser (learnings, decisions, patterns)
 * - Skills management
 * - Real-time updates
 */
import chalk from 'chalk';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { execSync } from 'child_process';
import { parse as parseUrl } from 'url';

interface DashboardOptions {
  port?: number;
  open?: boolean;
}

interface MemoryFile {
  name: string;
  path: string;
  category: string;
  date: string;
  tags: string[];
  preview: string;
  content?: string;
}

interface ProjectData {
  name: string;
  path: string;
  type: string;
  health: number;
  memory: {
    learnings: MemoryFile[];
    failures: MemoryFile[];
    decisions: MemoryFile[];
    patterns: MemoryFile[];
  };
  skills: string[];
  recentCommits: Array<{ message: string; date: string }>;
}

export async function dashboard(options: DashboardOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const port = options.port || 3456;

  console.log(chalk.bold.cyan('\n📊 Claude Starter Kit Dashboard\n'));

  // Check if this is a Claude project
  if (!existsSync(join(cwd, 'CLAUDE.md')) && !existsSync(join(cwd, '.claude'))) {
    console.log(chalk.yellow('Warning: This doesn\'t appear to be a Claude project.'));
    console.log(chalk.dim('Run `npx claude-starter-kit` to initialize.\n'));
  }

  // Create server
  const server = createServer((req, res) => handleRequest(req, res, cwd));

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(chalk.green(`✓ Dashboard running at ${chalk.bold(url)}`));
    console.log(chalk.dim('\nPress Ctrl+C to stop\n'));

    // Open browser if requested
    if (options.open) {
      try {
        const openCmd = process.platform === 'darwin' ? 'open' :
          process.platform === 'win32' ? 'start' : 'xdg-open';
        execSync(`${openCmd} ${url}`);
      } catch {
        console.log(chalk.dim(`Open ${url} in your browser`));
      }
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.dim('\n\nShutting down dashboard...'));
    server.close();
    process.exit(0);
  });
}

function handleRequest(req: IncomingMessage, res: ServerResponse, cwd: string): void {
  const url = parseUrl(req.url || '/', true);
  const pathname = url.pathname || '/';

  // Set CORS headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    // API routes
    if (pathname.startsWith('/api/')) {
      handleApiRequest(pathname, url.query, res, cwd);
      return;
    }

    // Static routes
    if (pathname === '/' || pathname === '/index.html') {
      serveHtml(res);
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

function handleApiRequest(
  pathname: string,
  query: Record<string, string | string[] | undefined>,
  res: ServerResponse,
  cwd: string
): void {
  res.setHeader('Content-Type', 'application/json');

  switch (pathname) {
    case '/api/project':
      res.writeHead(200);
      res.end(JSON.stringify(getProjectData(cwd)));
      break;

    case '/api/memory':
      const category = String(query.category || 'learnings');
      res.writeHead(200);
      res.end(JSON.stringify(getMemoryFiles(cwd, category)));
      break;

    case '/api/memory/file':
      const filePath = String(query.path || '');
      res.writeHead(200);
      res.end(JSON.stringify(getMemoryFileContent(cwd, filePath)));
      break;

    case '/api/skills':
      res.writeHead(200);
      res.end(JSON.stringify(getSkillsData(cwd)));
      break;

    case '/api/health':
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
  }
}

function getProjectData(cwd: string): ProjectData {
  const name = basename(cwd);
  let type = 'unknown';

  if (existsSync(join(cwd, 'package.json'))) type = 'node';
  else if (existsSync(join(cwd, 'pyproject.toml'))) type = 'python';
  else if (existsSync(join(cwd, 'Cargo.toml'))) type = 'rust';
  else if (existsSync(join(cwd, 'go.mod'))) type = 'go';

  // Calculate health
  let health = 0;
  if (existsSync(join(cwd, '.git'))) health += 20;
  if (existsSync(join(cwd, 'CLAUDE.md'))) health += 20;
  if (existsSync(join(cwd, '.claude', 'memory'))) health += 20;
  if (existsSync(join(cwd, '.claude', 'skills'))) health += 20;
  if (existsSync(join(cwd, '.mcp.json'))) health += 20;

  // Get skills
  const skillsDir = join(cwd, '.claude', 'skills');
  const skills = existsSync(skillsDir) ?
    readdirSync(skillsDir).filter(f => !f.startsWith('.')) : [];

  // Get recent commits
  let recentCommits: Array<{ message: string; date: string }> = [];
  try {
    const gitLog = execSync('git log --oneline -5 --format="%s|%cr" 2>/dev/null', {
      cwd,
      encoding: 'utf-8',
    });
    recentCommits = gitLog.trim().split('\n').filter(Boolean).map(line => {
      const [message, date] = line.split('|');
      return { message, date };
    });
  } catch {
    // No git or no commits
  }

  return {
    name,
    path: cwd,
    type,
    health,
    memory: {
      learnings: getMemoryFiles(cwd, 'learnings'),
      failures: getMemoryFiles(cwd, 'failures'),
      decisions: getMemoryFiles(cwd, 'decisions'),
      patterns: getMemoryFiles(cwd, 'patterns'),
    },
    skills,
    recentCommits,
  };
}

function getMemoryFiles(cwd: string, category: string): MemoryFile[] {
  const dir = join(cwd, '.claude', 'memory', category);
  if (!existsSync(dir)) return [];

  try {
    const files = readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const filePath = join(dir, f);
        const content = readFileSync(filePath, 'utf-8');
        const stats = statSync(filePath);

        // Extract metadata
        const titleMatch = content.match(/^#\s+(.+)/m);
        const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);
        const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})/);

        const tags = tagsMatch ?
          tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, '')) : [];

        return {
          name: titleMatch ? titleMatch[1] : f.replace('.md', ''),
          path: `${category}/${f}`,
          category,
          date: dateMatch ? dateMatch[1] : stats.mtime.toISOString().split('T')[0],
          tags,
          preview: content.slice(0, 200).replace(/^---[\s\S]*?---\s*/, '').replace(/#.+\n/, '').trim(),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return files;
  } catch {
    return [];
  }
}

function getMemoryFileContent(cwd: string, relativePath: string): { content: string } | { error: string } {
  // Sanitize path to prevent directory traversal
  const safePath = relativePath.replace(/\.\./g, '');
  const filePath = join(cwd, '.claude', 'memory', safePath);

  if (!existsSync(filePath)) {
    return { error: 'File not found' };
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return { content };
  } catch {
    return { error: 'Failed to read file' };
  }
}

function getSkillsData(cwd: string): Array<{ name: string; description: string; loaded: boolean }> {
  const skillsDir = join(cwd, '.claude', 'skills');
  if (!existsSync(skillsDir)) return [];

  try {
    return readdirSync(skillsDir)
      .filter(f => !f.startsWith('.'))
      .map(name => {
        const skillPath = join(skillsDir, name);
        const skillMdPath = join(skillPath, 'SKILL.md');

        let description = 'No description';
        if (existsSync(skillMdPath)) {
          const content = readFileSync(skillMdPath, 'utf-8');
          const descMatch = content.match(/description:\s*["']?([^"'\n]+)/);
          if (descMatch) {
            description = descMatch[1];
          }
        }

        return {
          name,
          description,
          loaded: true,
        };
      });
  } catch {
    return [];
  }
}

function serveHtml(res: ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(generateDashboardHtml());
}

function generateDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Starter Kit Dashboard</title>
  <style>
    :root {
      --bg: #0d1117;
      --bg-secondary: #161b22;
      --border: #30363d;
      --text: #e6edf3;
      --text-secondary: #8b949e;
      --accent: #58a6ff;
      --success: #3fb950;
      --warning: #d29922;
      --danger: #f85149;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    h1 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .health-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .health-excellent { background: var(--success); color: #000; }
    .health-good { background: #3fb95080; color: var(--success); }
    .health-fair { background: #d2992280; color: var(--warning); }
    .health-poor { background: #f8514980; color: var(--danger); }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1.25rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .stat {
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent);
    }

    .memory-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .tab {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .tab:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .tab.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #000;
    }

    .memory-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .memory-item {
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .memory-item:hover {
      border-color: var(--accent);
      background: rgba(88, 166, 255, 0.1);
    }

    .memory-item-title {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .memory-item-meta {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .memory-item-preview {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tag {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      background: var(--border);
      border-radius: 0.25rem;
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }

    .skill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-item {
      padding: 0.5rem 1rem;
      background: var(--border);
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .commit-list {
      list-style: none;
    }

    .commit-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.875rem;
    }

    .commit-item:last-child {
      border-bottom: none;
    }

    .commit-message {
      color: var(--text);
    }

    .commit-date {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 100;
      padding: 2rem;
      overflow-y: auto;
    }

    .modal.active {
      display: block;
    }

    .modal-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.5rem;
      cursor: pointer;
    }

    .modal-body {
      white-space: pre-wrap;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.875rem;
      line-height: 1.8;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>
        <span>📊</span>
        <span id="project-name">Loading...</span>
      </h1>
      <span id="health-badge" class="health-badge">--</span>
    </header>

    <div class="grid">
      <!-- Stats Cards -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📚 Learnings</span>
        </div>
        <div class="stat" id="stat-learnings">-</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">📋 Decisions</span>
        </div>
        <div class="stat" id="stat-decisions">-</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">🛠️ Skills</span>
        </div>
        <div class="stat" id="stat-skills">-</div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">⚠️ Failures</span>
        </div>
        <div class="stat" id="stat-failures">-</div>
      </div>

      <!-- Memory Browser -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title">🧠 Memory Browser</span>
        </div>
        <div class="memory-tabs">
          <button class="tab active" data-category="learnings">Learnings</button>
          <button class="tab" data-category="decisions">Decisions</button>
          <button class="tab" data-category="failures">Failures</button>
          <button class="tab" data-category="patterns">Patterns</button>
        </div>
        <div class="memory-list" id="memory-list">
          <div class="loading">Loading...</div>
        </div>
      </div>

      <!-- Skills -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🛠️ Installed Skills</span>
        </div>
        <div class="skill-list" id="skill-list">
          <div class="loading">Loading...</div>
        </div>
      </div>

      <!-- Recent Commits -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📝 Recent Commits</span>
        </div>
        <ul class="commit-list" id="commit-list">
          <li class="loading">Loading...</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Modal for viewing memory content -->
  <div class="modal" id="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Title</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>

  <script>
    let projectData = null;
    let currentCategory = 'learnings';

    async function loadProjectData() {
      try {
        const res = await fetch('/api/project');
        projectData = await res.json();
        updateUI();
      } catch (error) {
        console.error('Failed to load project data:', error);
      }
    }

    function updateUI() {
      if (!projectData) return;

      // Header
      document.getElementById('project-name').textContent = projectData.name;

      const healthBadge = document.getElementById('health-badge');
      healthBadge.textContent = projectData.health + '%';
      healthBadge.className = 'health-badge ' + getHealthClass(projectData.health);

      // Stats
      document.getElementById('stat-learnings').textContent = projectData.memory.learnings.length;
      document.getElementById('stat-decisions').textContent = projectData.memory.decisions.length;
      document.getElementById('stat-failures').textContent = projectData.memory.failures.length;
      document.getElementById('stat-skills').textContent = projectData.skills.length;

      // Memory list
      updateMemoryList();

      // Skills
      const skillList = document.getElementById('skill-list');
      if (projectData.skills.length === 0) {
        skillList.innerHTML = '<div class="empty-state">No skills installed</div>';
      } else {
        skillList.innerHTML = projectData.skills
          .map(s => '<span class="skill-item">' + s + '</span>')
          .join('');
      }

      // Commits
      const commitList = document.getElementById('commit-list');
      if (projectData.recentCommits.length === 0) {
        commitList.innerHTML = '<li class="empty-state">No commits yet</li>';
      } else {
        commitList.innerHTML = projectData.recentCommits
          .map(c => '<li class="commit-item"><div class="commit-message">' + escapeHtml(c.message) + '</div><div class="commit-date">' + c.date + '</div></li>')
          .join('');
      }
    }

    function updateMemoryList() {
      const list = document.getElementById('memory-list');
      const items = projectData.memory[currentCategory] || [];

      if (items.length === 0) {
        list.innerHTML = '<div class="empty-state">No items in this category</div>';
        return;
      }

      list.innerHTML = items.map(item => {
        const tags = item.tags.map(t => '<span class="tag">' + escapeHtml(t) + '</span>').join('');
        return '<div class="memory-item" onclick="openMemory(\\'' + item.path + '\\')">' +
          '<div class="memory-item-title">' + escapeHtml(item.name) + '</div>' +
          '<div class="memory-item-meta">' + item.date + ' ' + tags + '</div>' +
          '<div class="memory-item-preview">' + escapeHtml(item.preview) + '</div>' +
          '</div>';
      }).join('');
    }

    function getHealthClass(health) {
      if (health >= 80) return 'health-excellent';
      if (health >= 60) return 'health-good';
      if (health >= 40) return 'health-fair';
      return 'health-poor';
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    async function openMemory(path) {
      try {
        const res = await fetch('/api/memory/file?path=' + encodeURIComponent(path));
        const data = await res.json();

        if (data.error) {
          alert('Failed to load file: ' + data.error);
          return;
        }

        document.getElementById('modal-title').textContent = path.split('/').pop();
        document.getElementById('modal-body').textContent = data.content;
        document.getElementById('modal').classList.add('active');
      } catch (error) {
        console.error('Failed to load memory file:', error);
      }
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.dataset.category;
        updateMemoryList();
      });
    });

    // Close modal on escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    // Close modal on background click
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target.id === 'modal') closeModal();
    });

    // Initial load
    loadProjectData();

    // Auto-refresh every 30 seconds
    setInterval(loadProjectData, 30000);
  </script>
</body>
</html>`;
}
