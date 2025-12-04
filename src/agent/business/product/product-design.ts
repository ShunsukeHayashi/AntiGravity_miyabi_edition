/**
 * Product Design Agent
 * Service design and MVP definition
 */

import { BaseBusinessAgent, BusinessTask, BusinessAgentConfig } from '../base-business-agent';

const config: BusinessAgentConfig = {
  name: 'product_design',
  displayName: 'Product Design Agent',
  emoji: '🏗️',
  role: 'service_design',
  description: '6-month content, tech stack, and MVP definition',
  capabilities: ['content_planning', 'tech_stack_selection', 'mvp_definition', 'roadmap_creation'],
  priority: 7,
  maxConcurrent: 1,
};

export class ProductDesignAgent extends BaseBusinessAgent {
  constructor() {
    super(config);
  }

  protected async onInitialize(): Promise<void> {}

  protected async onExecute(_task: BusinessTask): Promise<Record<string, unknown>> {
    return {
      mvp: this.defineMvp(),
      techStack: this.selectTechStack(),
      roadmap: this.createRoadmap(),
      milestones: this.defineMilestones(),
    };
  }

  protected async onShutdown(): Promise<void> {}

  private defineMvp(): Record<string, unknown> {
    return {
      coreFeatures: ['Basic agent system', 'VS Code integration', 'Task queue'],
      outOfScope: ['Enterprise features', 'Multi-language support', 'Mobile app'],
      successCriteria: ['100 beta users', '80% satisfaction', 'Core workflow functional'],
      timeline: '8 weeks',
    };
  }

  private selectTechStack(): Record<string, string[]> {
    return {
      frontend: ['Electron', 'React', 'TypeScript', 'Tailwind'],
      backend: ['Node.js', 'WebSocket', 'Express'],
      ai: ['Claude API', 'MCP SDK'],
      infrastructure: ['GitHub Actions', 'Firebase', 'CloudFlare'],
      database: ['SQLite (local)', 'PostgreSQL (cloud)'],
    };
  }

  private createRoadmap(): Record<string, string[]> {
    return {
      month1: ['Core architecture', 'Basic agents', 'Local development'],
      month2: ['VS Code extension', 'Task management', 'Agent communication'],
      month3: ['Beta release', 'User feedback', 'Bug fixes'],
      month4: ['Advanced agents', 'Business agents', 'Performance optimization'],
      month5: ['Enterprise features', 'SSO', 'Team collaboration'],
      month6: ['General availability', 'Marketing launch', 'Scale infrastructure'],
    };
  }

  private defineMilestones(): Record<string, unknown>[] {
    return [
      { milestone: 'Alpha', date: 'Week 4', criteria: 'Core agents working locally' },
      { milestone: 'Beta', date: 'Week 8', criteria: '100 users, feedback collection' },
      { milestone: 'RC', date: 'Week 16', criteria: 'Feature complete, stable' },
      { milestone: 'GA', date: 'Week 24', criteria: 'Public launch ready' },
    ];
  }
}
