/**
 * Persona Agent
 * Customer persona creation and journey mapping
 */

import { BaseBusinessAgent, BusinessTask, BusinessAgentConfig } from '../base-business-agent';

const config: BusinessAgentConfig = {
  name: 'persona',
  displayName: 'Persona Agent',
  emoji: '👥',
  role: 'customer_persona',
  description: 'Detailed customer persona (3-5 personas) and journey design',
  capabilities: [
    'persona_creation',
    'customer_journey_mapping',
    'pain_point_analysis',
    'behavior_modeling',
  ],
  priority: 6,
  maxConcurrent: 1,
};

interface PersonaInput {
  productType?: string;
  targetDemographics?: string[];
  painPoints?: string[];
  personaCount?: number;
}

interface Persona {
  name: string;
  age: number;
  occupation: string;
  income: string;
  goals: string[];
  painPoints: string[];
  behaviors: string[];
  preferredChannels: string[];
  buyingMotivations: string[];
  objections: string[];
}

interface CustomerJourney {
  stage: string;
  touchpoints: string[];
  emotions: string;
  actions: string[];
  opportunities: string[];
}

interface PersonaOutput {
  personas: Persona[];
  journeys: Record<string, CustomerJourney[]>;
  recommendations: string[];
}

export class PersonaAgent extends BaseBusinessAgent {
  constructor() {
    super(config);
  }

  protected async onInitialize(): Promise<void> {
    // Initialize persona templates
  }

  protected async onExecute(task: BusinessTask): Promise<Record<string, unknown>> {
    const input = task.input as unknown as PersonaInput;
    const count = input.personaCount || 3;
    const productType = input.productType || 'SaaS Product';

    const personas = this.generatePersonas(productType, count);
    const journeys: Record<string, CustomerJourney[]> = {};

    for (const persona of personas) {
      journeys[persona.name] = this.mapCustomerJourney(persona);
    }

    const result: PersonaOutput = {
      personas,
      journeys,
      recommendations: this.generateRecommendations(personas),
    };

    return result as unknown as Record<string, unknown>;
  }

  protected async onShutdown(): Promise<void> {
    // Cleanup
  }

  private generatePersonas(productType: string, count: number): Persona[] {
    const basePersonas: Persona[] = [
      {
        name: 'Tech-Savvy Taro',
        age: 28,
        occupation: 'Software Engineer',
        income: '$80,000-120,000',
        goals: ['Career advancement', 'Efficiency improvement', 'Skill development'],
        painPoints: ['Time constraints', 'Information overload', 'Tool fragmentation'],
        behaviors: ['Early adopter', 'Online researcher', 'Peer recommendation driven'],
        preferredChannels: ['Twitter', 'GitHub', 'Tech blogs'],
        buyingMotivations: ['Productivity gains', 'Innovation', 'Community'],
        objections: ['Learning curve', 'Integration complexity', 'Cost'],
      },
      {
        name: 'Enterprise Emma',
        age: 42,
        occupation: 'IT Director',
        income: '$150,000-200,000',
        goals: ['Team efficiency', 'Cost reduction', 'Security compliance'],
        painPoints: ['Budget constraints', 'Legacy systems', 'Change resistance'],
        behaviors: ['ROI focused', 'Vendor comparison', 'Reference checking'],
        preferredChannels: ['LinkedIn', 'Industry reports', 'Conferences'],
        buyingMotivations: ['Proven ROI', 'Enterprise features', 'Support'],
        objections: ['Security concerns', 'Scalability', 'Vendor lock-in'],
      },
      {
        name: 'Startup Steve',
        age: 32,
        occupation: 'Founder/CEO',
        income: 'Variable',
        goals: ['Rapid growth', 'Funding', 'Market validation'],
        painPoints: ['Resource constraints', 'Speed to market', 'Competition'],
        behaviors: ['Fast decision maker', 'Network driven', 'Trend follower'],
        preferredChannels: ['Product Hunt', 'Twitter', 'VC networks'],
        buyingMotivations: ['Speed', 'Flexibility', 'Pricing'],
        objections: ['Long-term viability', 'Support availability', 'Customization'],
      },
      {
        name: 'Freelance Fiona',
        age: 35,
        occupation: 'Freelance Developer',
        income: '$60,000-100,000',
        goals: ['Client satisfaction', 'Work-life balance', 'Skill expansion'],
        painPoints: ['Client management', 'Income stability', 'Isolation'],
        behaviors: ['Self-directed learner', 'Community active', 'Tool optimizer'],
        preferredChannels: ['YouTube', 'Discord', 'Online courses'],
        buyingMotivations: ['Value for money', 'Ease of use', 'Portability'],
        objections: ['Subscription fatigue', 'Overkill features', 'Learning time'],
      },
      {
        name: 'Academic Alex',
        age: 45,
        occupation: 'Professor/Researcher',
        income: '$70,000-120,000',
        goals: ['Research output', 'Student success', 'Grant acquisition'],
        painPoints: ['Administrative burden', 'Funding competition', 'Publication pressure'],
        behaviors: ['Methodical evaluator', 'Peer influenced', 'Documentation focused'],
        preferredChannels: ['Academic journals', 'Conferences', 'Institutional channels'],
        buyingMotivations: ['Academic features', 'Collaboration', 'Citation support'],
        objections: ['Budget approval', 'Institutional policies', 'Learning curve'],
      },
    ];

    return basePersonas.slice(0, count).map(p => ({
      ...p,
      goals: p.goals.map(g => `${g} (for ${productType})`),
    }));
  }

  private mapCustomerJourney(persona: Persona): CustomerJourney[] {
    return [
      {
        stage: 'Awareness',
        touchpoints: persona.preferredChannels.slice(0, 2),
        emotions: 'Curious, Skeptical',
        actions: ['Research online', 'Read reviews', 'Ask peers'],
        opportunities: ['Content marketing', 'Social proof', 'SEO'],
      },
      {
        stage: 'Consideration',
        touchpoints: ['Website', 'Demo', 'Free trial'],
        emotions: 'Interested, Evaluating',
        actions: ['Compare alternatives', 'Test features', 'Calculate ROI'],
        opportunities: ['Comparison content', 'Case studies', 'ROI calculator'],
      },
      {
        stage: 'Decision',
        touchpoints: ['Sales call', 'Pricing page', 'Contract'],
        emotions: 'Anxious, Hopeful',
        actions: ['Negotiate terms', 'Seek approval', 'Make decision'],
        opportunities: ['Address objections', 'Offer incentives', 'Simplify process'],
      },
      {
        stage: 'Onboarding',
        touchpoints: ['Welcome email', 'Setup wizard', 'Training'],
        emotions: 'Excited, Overwhelmed',
        actions: ['Set up account', 'Learn features', 'Import data'],
        opportunities: ['Guided onboarding', 'Quick wins', 'Support access'],
      },
      {
        stage: 'Retention',
        touchpoints: ['Product', 'Support', 'Community'],
        emotions: 'Satisfied, Habitual',
        actions: ['Daily usage', 'Feature exploration', 'Feedback provision'],
        opportunities: ['Feature education', 'Community building', 'Loyalty rewards'],
      },
      {
        stage: 'Advocacy',
        touchpoints: ['Reviews', 'Referrals', 'Case studies'],
        emotions: 'Proud, Helpful',
        actions: ['Write reviews', 'Refer others', 'Share success'],
        opportunities: ['Referral program', 'Testimonial requests', 'User conferences'],
      },
    ];
  }

  private generateRecommendations(personas: Persona[]): string[] {
    const allChannels = personas.flatMap(p => p.preferredChannels);
    const topChannels = [...new Set(allChannels)].slice(0, 3);

    return [
      `Prioritize marketing on: ${topChannels.join(', ')}`,
      'Address common objections: cost, learning curve, integration',
      'Create persona-specific landing pages',
      'Develop case studies for each persona type',
      'Build community features for peer connections',
    ];
  }
}
