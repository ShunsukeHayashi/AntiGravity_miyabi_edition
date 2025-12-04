/**
 * Sales Agent (うるるん)
 * Lead conversion and sales optimization
 */

import { BaseBusinessAgent, BusinessTask, BusinessAgentConfig } from '../base-business-agent';

const config: BusinessAgentConfig = {
  name: 'sales',
  displayName: 'Sales Agent',
  emoji: '💼',
  role: 'sales',
  description: 'Lead → Customer conversion maximization and sales process optimization',
  capabilities: [
    'sales_funnel_optimization',
    'lead_qualification',
    'conversion_optimization',
    'sales_automation',
  ],
  priority: 7,
  maxConcurrent: 2,
};

export class SalesAgent extends BaseBusinessAgent {
  constructor() {
    super(config);
  }

  protected async onInitialize(): Promise<void> {}

  protected async onExecute(_task: BusinessTask): Promise<Record<string, unknown>> {
    return {
      salesProcess: this.defineSalesProcess(),
      qualificationCriteria: this.defineQualificationCriteria(),
      scripts: this.createSalesScripts(),
      automations: this.planAutomations(),
      metrics: this.defineMetrics(),
    };
  }

  protected async onShutdown(): Promise<void> {}

  private defineSalesProcess(): Record<string, unknown> {
    return {
      stages: [
        { name: 'Lead', actions: ['Capture', 'Initial outreach'] },
        { name: 'Qualified', actions: ['Discovery call', 'Needs assessment'] },
        { name: 'Demo', actions: ['Product demonstration', 'Q&A'] },
        { name: 'Proposal', actions: ['Custom proposal', 'Negotiation'] },
        { name: 'Closed', actions: ['Contract', 'Onboarding handoff'] },
      ],
      timeframes: {
        leadToQualified: '24-48 hours',
        qualifiedToDemo: '3-5 days',
        demoToProposal: '1-2 weeks',
        proposalToClosed: '1-2 weeks',
      },
    };
  }

  private defineQualificationCriteria(): Record<string, unknown> {
    return {
      budget: 'Has budget authority or can influence',
      authority: 'Decision maker or strong influencer',
      need: 'Clear pain point that product solves',
      timeline: 'Looking to implement within 3 months',
      scoring: {
        hot: '80-100',
        warm: '50-79',
        cold: '0-49',
      },
    };
  }

  private createSalesScripts(): Record<string, string> {
    return {
      coldCall: 'Hi [Name], I noticed [observation]. We help companies like yours [value prop]. Would you be open to a brief conversation?',
      discoveryQuestions: 'What challenges are you facing with [area]? What have you tried? What would ideal look like?',
      objectionHandling: 'I understand [objection]. Many of our customers felt the same way. What we found is [counter].',
      closing: 'Based on our conversation, [product] can help you [benefit]. Shall we move forward with [next step]?',
    };
  }

  private planAutomations(): Record<string, unknown>[] {
    return [
      { trigger: 'Lead form submission', action: 'Send welcome email + assign to rep' },
      { trigger: 'No response in 3 days', action: 'Automated follow-up sequence' },
      { trigger: 'Demo scheduled', action: 'Send calendar invite + prep materials' },
      { trigger: 'Proposal sent', action: 'Schedule follow-up reminder' },
    ];
  }

  private defineMetrics(): Record<string, string> {
    return {
      conversionRate: 'Leads to customers %',
      averageDealSize: 'Revenue per closed deal',
      salesCycleLength: 'Days from lead to close',
      winRate: 'Proposals won vs total',
      pipelineValue: 'Total value of active opportunities',
    };
  }
}
