/**
 * Business Agents Index
 * Exports all 14 business agents
 */

// Base
import { BaseBusinessAgent } from './base-business-agent';
export { BaseBusinessAgent, BusinessAgentConfig, BusinessTask, BusinessResult } from './base-business-agent';

// Marketing Agents (5)
import { MarketResearchAgent } from './marketing/market-research';
import { PersonaAgent } from './marketing/persona';
import { SnsStrategyAgent } from './marketing/sns-strategy';
import { MarketingAgent } from './marketing/marketing';
import { ContentCreationAgent } from './marketing/content-creation';

export { MarketResearchAgent, PersonaAgent, SnsStrategyAgent, MarketingAgent, ContentCreationAgent };

// Sales Agents (3)
import { SalesAgent } from './sales/sales';
import { FunnelDesignAgent } from './sales/funnel-design';
import { CrmAgent } from './sales/crm';

export { SalesAgent, FunnelDesignAgent, CrmAgent };

// Product Agents (2)
import { ProductConceptAgent } from './product/product-concept';
import { ProductDesignAgent } from './product/product-design';

export { ProductConceptAgent, ProductDesignAgent };

// Analytics Agents (2)
import { AnalyticsAgent } from './analytics/analytics';
import { YoutubeAgent } from './analytics/youtube';

export { AnalyticsAgent, YoutubeAgent };

// Strategy Agents (2)
import { EntrepreneurAgent } from './strategy/entrepreneur';
import { SelfAnalysisAgent } from './strategy/self-analysis';

export { EntrepreneurAgent, SelfAnalysisAgent };

// Agent type definitions
export type BusinessAgentType =
  | 'market_research'
  | 'persona'
  | 'sns_strategy'
  | 'marketing'
  | 'content_creation'
  | 'sales'
  | 'funnel_design'
  | 'crm'
  | 'product_concept'
  | 'product_design'
  | 'analytics'
  | 'youtube'
  | 'entrepreneur'
  | 'self_analysis';

// Factory function to create agents
export function createBusinessAgent(type: BusinessAgentType): BaseBusinessAgent {
  switch (type) {
    // Marketing
    case 'market_research':
      return new MarketResearchAgent();
    case 'persona':
      return new PersonaAgent();
    case 'sns_strategy':
      return new SnsStrategyAgent();
    case 'marketing':
      return new MarketingAgent();
    case 'content_creation':
      return new ContentCreationAgent();
    // Sales
    case 'sales':
      return new SalesAgent();
    case 'funnel_design':
      return new FunnelDesignAgent();
    case 'crm':
      return new CrmAgent();
    // Product
    case 'product_concept':
      return new ProductConceptAgent();
    case 'product_design':
      return new ProductDesignAgent();
    // Analytics
    case 'analytics':
      return new AnalyticsAgent();
    case 'youtube':
      return new YoutubeAgent();
    // Strategy
    case 'entrepreneur':
      return new EntrepreneurAgent();
    case 'self_analysis':
      return new SelfAnalysisAgent();
    default:
      throw new Error(`Unknown business agent type: ${type}`);
  }
}

// Get all business agent types
export function getAllBusinessAgentTypes(): BusinessAgentType[] {
  return [
    'market_research',
    'persona',
    'sns_strategy',
    'marketing',
    'content_creation',
    'sales',
    'funnel_design',
    'crm',
    'product_concept',
    'product_design',
    'analytics',
    'youtube',
    'entrepreneur',
    'self_analysis',
  ];
}

// Create all business agents
export function createAllBusinessAgents(): Map<BusinessAgentType, BaseBusinessAgent> {
  const agents = new Map<BusinessAgentType, BaseBusinessAgent>();
  for (const type of getAllBusinessAgentTypes()) {
    agents.set(type, createBusinessAgent(type));
  }
  return agents;
}
