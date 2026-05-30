export interface BusinessRoadmapItem {
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface TargetLead {
  companyName: string;
  contactName: string;
  role: string;
  estimatedContractValue: string;
  status: 'contacted' | 'negotiating' | 'converted' | 'leads';
}

export interface AdCampaign {
  platform: 'Google' | 'Meta' | 'LinkedIn' | 'X';
  headline: string;
  dailyBudget: number;
  clicks: number;
  conversions: number;
  status: 'active' | 'generating' | 'paused';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SupportTicketExchange {
  sender: 'customer' | 'support_agent';
  message: string;
  timestamp: string;
}

export interface FinancialMetric {
  mrr: number;
  revenue: number;
  cac: number;
  ltv: number;
  margin: number;
  monthlyHistory: { month: string; revenue: number; mrr: number }[];
  ledger: { date: string; description: string; type: 'income' | 'expense'; amount: number }[];
}

export interface LogEvent {
  timestamp: string;
  agent: 'Planner' | 'Developer' | 'Outreach' | 'Ads' | 'Support' | 'Financial';
  text: string;
  level: 'info' | 'success' | 'warning';
}

export interface PolsiaCompany {
  id: string;
  name: string;
  tagline: string;
  businessIdea: string;
  createdAt: string;
  status: 'planning' | 'scaffolding' | 'launching' | 'operating' | 'sleeping';
  
  // Agent Outputs
  planner: {
    valueProp: string;
    roadmap: BusinessRoadmapItem[];
  };
  developer: {
    techStack: string[];
    schema: string;
    code: string;
    repoName: string;
  };
  outreach: {
    emailSubject: string;
    emailBody: string;
    leads: TargetLead[];
  };
  ads: {
    audienceProfile: string;
    campaigns: AdCampaign[];
  };
  support: {
    faqs: FAQItem[];
    tickets: SupportTicketExchange[];
  };
  financials: FinancialMetric;
  logs: LogEvent[];
}
