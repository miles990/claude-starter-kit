/**
 * Domain configurations
 *
 * Each domain can have:
 * - Built-in rules (included in CLI)
 * - External skill (downloaded via skillpkg)
 */

export type DomainKey =
  // Technical
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'ai-ml'
  // Business
  | 'quant-trading'
  | 'finance'
  | 'marketing'
  | 'sales'
  | 'product'
  | 'project-management'
  | 'strategy'
  // Professional
  | 'research'
  // Creative
  | 'game-design'
  | 'ui-ux'
  | 'content'
  | 'brand'
  | 'brainstorming'
  // Lifestyle
  | 'personal-growth';

interface DomainConfig {
  name: string;
  category: 'technical' | 'business' | 'creative' | 'professional' | 'lifestyle';
  description: string;
  rules?: Record<string, string>;
  skill?: string; // skillpkg source (future)
  skillName?: string;
}

export const DOMAINS: Record<DomainKey, DomainConfig> = {
  // Technical Domains
  frontend: {
    name: 'Frontend Development',
    category: 'technical',
    description: 'React, Vue, CSS, responsive design',
    rules: {
      'frontend.md': `---
paths: src/components/**/*.{tsx,jsx}, src/pages/**/*.{tsx,jsx}
---

# Frontend Rules

- Use functional components with hooks
- Keep components small (<200 lines)
- Use CSS modules or styled-components
- Implement responsive design mobile-first
- Handle loading and error states
`,
    },
    // skill: 'github:miles990/claude-software-skills#frontend',
    // skillName: 'frontend-skills',
  },

  backend: {
    name: 'Backend Development',
    category: 'technical',
    description: 'Node.js, API design, database',
    rules: {
      'backend.md': `---
paths: src/api/**/*.ts, src/services/**/*.ts
---

# Backend Rules

- Use dependency injection
- Validate all inputs (zod/joi)
- Return consistent error format
- Implement proper logging
- Handle database transactions
`,
    },
  },

  devops: {
    name: 'DevOps',
    category: 'technical',
    description: 'CI/CD, Docker, Kubernetes',
    rules: {
      'devops.md': `# DevOps Rules

- Use multi-stage Docker builds
- Never commit secrets
- Use environment variables for config
- Implement health checks
- Set up proper monitoring
`,
    },
  },

  'ai-ml': {
    name: 'AI/ML',
    category: 'technical',
    description: 'Machine learning, model training, data processing',
    rules: {
      'ai-ml.md': `# AI/ML Rules

- Version control datasets and models
- Document model architecture decisions
- Implement proper train/val/test splits
- Log experiments with metrics
- Handle model drift monitoring
`,
    },
  },

  // Business Domains
  'quant-trading': {
    name: 'Quantitative Trading',
    category: 'business',
    description: 'Trading strategies, backtesting, risk management',
    rules: {
      'quant-trading.md': `# Quantitative Trading Rules

## Strategy Development
- Define clear entry/exit signals
- Account for transaction costs
- Implement position sizing

## Backtesting
- Use walk-forward optimization
- Avoid overfitting (out-of-sample testing)
- Account for survivorship bias

## Risk Management
- Set maximum drawdown limits
- Diversify across strategies
- Implement stop-loss rules
`,
    },
    skill: 'github:miles990/claude-domain-skills#finance/quant-trading',
    skillName: 'quant-trading',
  },

  finance: {
    name: 'Financial Analysis',
    category: 'business',
    description: 'Financial statements, valuation, investment analysis',
    rules: {
      'finance.md': `# Financial Analysis Rules

## Analysis Framework
- Start with industry context
- Use multiple valuation methods
- Cross-check with comparable companies

## Key Metrics
- Profitability: ROE, ROIC, margins
- Liquidity: Current ratio, quick ratio
- Leverage: D/E ratio, interest coverage

## Reporting
- Source all data
- State assumptions explicitly
- Include sensitivity analysis
`,
    },
    skill: 'github:miles990/claude-domain-skills#finance/investment-analysis',
    skillName: 'investment-analysis',
  },

  marketing: {
    name: 'Marketing',
    category: 'business',
    description: 'Marketing strategy, growth, analytics',
    rules: {
      'marketing.md': `# Marketing Rules

## Strategy
- Define target audience clearly
- Use AIDA framework for content
- A/B test everything

## Analytics
- Set up proper attribution
- Track CAC and LTV
- Monitor funnel metrics

## Content
- Write benefit-focused copy
- Use power words
- Include clear CTAs
`,
    },
  },

  sales: {
    name: 'Sales & E-Commerce',
    category: 'business',
    description: 'B2B sales, e-commerce, CRM, negotiation',
    rules: {
      'sales.md': `# Sales & E-Commerce Rules

## B2B Sales
- Use SPIN selling (Situation, Problem, Implication, Need-payoff)
- Handle objections with LAER (Listen, Acknowledge, Explore, Respond)
- Always have a BATNA in negotiations

## E-Commerce
- Track AOV, conversion rate, cart abandonment
- Optimize checkout flow (minimize steps)
- Use RFM for customer segmentation

## CRM
- Keep customer data up to date
- Track all interactions
- Set follow-up reminders
`,
    },
    skill: 'github:miles990/claude-domain-skills#business/sales',
    skillName: 'sales',
  },

  product: {
    name: 'Product Management',
    category: 'business',
    description: 'PRD, user stories, OKRs, roadmap',
    rules: {
      'product.md': `# Product Management Rules

## PRD Structure
- Problem statement first
- User stories with acceptance criteria
- Success metrics (OKRs)

## Prioritization
- Use RICE or ICE framework
- Consider dependencies
- Balance quick wins with big bets

## Communication
- Write clear release notes
- Document decisions (ADRs)
- Keep stakeholders informed
`,
    },
    skill: 'github:miles990/claude-domain-skills#business/product-management',
    skillName: 'product-management',
  },

  'project-management': {
    name: 'Project Management',
    category: 'business',
    description: 'Agile, Scrum, sprint planning, risk management',
    rules: {
      'project-management.md': `# Project Management Rules

## Agile/Scrum
- Use user stories with acceptance criteria
- Sprint planning and retrospectives
- Daily standups (15 min max)

## Planning
- Break work into estimable tasks
- Identify dependencies and risks
- Track velocity and burndown

## Communication
- Clear status updates
- Document decisions (ADRs)
- Manage stakeholders expectations
`,
    },
    skill: 'github:miles990/claude-domain-skills#business/project-management',
    skillName: 'project-management',
  },

  strategy: {
    name: 'Business Strategy',
    category: 'business',
    description: 'Blue Ocean, differentiation, competitive advantage, business models',
    rules: {
      'strategy.md': `# Business Strategy Rules

## Blue Ocean Strategy
- Use ERRC framework (Eliminate, Reduce, Raise, Create)
- Create strategy canvas to visualize differentiation
- Focus on non-customers

## Competitive Strategy
- Choose: cost leadership, differentiation, or focus
- Identify sustainable competitive advantages
- Build moats (network effects, switching costs, brand)

## Business Model
- Use Business Model Canvas for design
- Define clear value proposition
- Validate product-market fit
`,
    },
    skill: 'github:miles990/claude-domain-skills#business/strategy',
    skillName: 'business-strategy',
  },

  // Professional Domains
  research: {
    name: 'Research & Analysis',
    category: 'professional',
    description: 'Market research, competitive analysis, user research',
    rules: {
      'research.md': `# Research & Analysis Rules

## Research Process
- Define clear research questions
- Choose appropriate methodology
- Document assumptions and limitations

## Data Collection
- Primary: interviews, surveys, observation
- Secondary: literature, reports, databases

## Analysis & Synthesis
- Use frameworks (SWOT, PEST, Porter's 5)
- Triangulate findings
- Present actionable insights
`,
    },
    skill: 'github:miles990/claude-domain-skills#professional/research-analysis',
    skillName: 'research-analysis',
  },

  // Creative Domains
  'game-design': {
    name: 'Game Design',
    category: 'creative',
    description: 'Game mechanics, narrative, balance',
    rules: {
      'game-design.md': `# Game Design Rules

## Core Loop
- Define primary gameplay loop
- Create secondary engagement loops
- Balance progression pacing

## Mechanics
- Keep rules simple to learn
- Add depth through interaction
- Playtest early and often

## Balance
- Use spreadsheets for numbers
- Create difficulty curves
- Implement adaptive systems

## Narrative
- Show, don't tell
- Integrate story with gameplay
- Create memorable moments
`,
    },
    // skill: 'github:miles990/claude-creative-skills#game-design',
    // skillName: 'game-design',
  },

  'ui-ux': {
    name: 'UI/UX Design',
    category: 'creative',
    description: 'Prototyping, usability, accessibility',
    rules: {
      'ui-ux.md': `# UI/UX Design Rules

## Principles
- Consistency across screens
- Clear visual hierarchy
- Provide feedback for actions

## Usability
- Follow platform conventions
- Make actions reversible
- Minimize cognitive load

## Accessibility
- Meet WCAG 2.1 AA standards
- Support keyboard navigation
- Use semantic HTML
- Test with screen readers
`,
    },
    skill: 'github:miles990/claude-domain-skills#creative/ui-ux-design',
    skillName: 'ui-ux-design',
  },

  content: {
    name: 'Content Creation',
    category: 'creative',
    description: 'Copywriting, SEO, storytelling',
    rules: {
      'content.md': `# Content Creation Rules

## Writing
- Lead with the most important info
- Use active voice
- Keep sentences short

## SEO
- Research keywords first
- Optimize title and meta
- Use proper heading hierarchy
- Add internal links

## Storytelling
- Hook readers in first line
- Use specific details
- End with clear takeaway
`,
    },
  },

  brand: {
    name: 'Brand Design',
    category: 'creative',
    description: 'Brand identity, guidelines, strategy',
    rules: {
      'brand.md': `# Brand Design Rules

## Identity
- Define brand personality (5 traits)
- Create consistent visual language
- Develop tone of voice guide

## Assets
- Maintain logo usage rules
- Define color palette (primary + accent)
- Specify typography hierarchy

## Application
- Create templates for consistency
- Document do's and don'ts
- Include real-world examples
`,
    },
  },

  brainstorming: {
    name: 'Brainstorming & Ideation',
    category: 'creative',
    description: 'Creative thinking, idea generation, innovation',
    rules: {
      'brainstorming.md': `# Brainstorming Rules

## Divergent Thinking
- Quantity over quality first
- Defer judgment
- Welcome wild ideas
- Build on others' ideas

## Techniques
- SCAMPER: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse
- Six Thinking Hats
- Random stimulus
- Reverse brainstorming

## Convergent Thinking
- Evaluate feasibility vs impact
- Prioritize ruthlessly
- Create action plan
`,
    },
    skill: 'github:miles990/claude-domain-skills#creative/brainstorming',
    skillName: 'brainstorming',
  },

  // Lifestyle Domains
  'personal-growth': {
    name: 'Personal Growth',
    category: 'lifestyle',
    description: 'Life planning, personal brand, time management, career',
    rules: {
      'personal-growth.md': `# Personal Growth Rules

## Goal Setting
- Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Create personal OKRs for quarterly planning
- Regular review and adjustment

## Time Management
- Use Eisenhower Matrix (urgent/important)
- Focus on "important but not urgent" quadrant
- Pomodoro Technique for deep work

## Personal Brand
- Define your unique positioning
- Consistent presence across platforms
- Content strategy with 2-3 focus topics

## Habits
- Atomic habits: make it obvious, attractive, easy, satisfying
- Track habits, aim for consistency not perfection
`,
    },
    skill: 'github:miles990/claude-domain-skills#lifestyle/personal-growth',
    skillName: 'personal-growth',
  },
};

/**
 * Get domains by category
 */
export function getDomainsByCategory(category: 'technical' | 'business' | 'creative' | 'professional' | 'lifestyle'): DomainKey[] {
  return (Object.entries(DOMAINS) as [DomainKey, DomainConfig][])
    .filter(([_, config]) => config.category === category)
    .map(([key]) => key);
}
