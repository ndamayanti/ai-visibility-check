// Type definitions for the AI Visibility Check tool

export interface ScanInput {
  websiteUrl: string;
  primaryKeyword: string;
  industry: string;
  businessName: string;
  email: string;
  name: string;
}

export interface AIPresenceResult {
  score: number;
  platformResults: {
    platform: "Web Search" | "ChatGPT" | "Perplexity";
    prompt: string;
    mentioned: boolean;
    mentionContext: string;
    position: number | null;
    competitorsMentioned: string[];
  }[];
  summary: string;
}

export interface SiteReadinessAnalysis {
  // Schema Markup
  hasSchemaMarkup: boolean;
  schemaTypes: string[];
  hasFAQSchema: boolean;
  hasOrganizationSchema: boolean;

  // Content Structure
  hasH1: boolean;
  headingHierarchy: boolean;
  hasFAQSection: boolean;
  contentLength: number;
  hasDefinitionContent: boolean;

  // Technical Signals
  hasMetaDescription: boolean;
  hasCanonicalTag: boolean;
  hasOpenGraph: boolean;
  loadTime: number;
  isHttps: boolean;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;

  // AI-Specific Readiness
  hasLLMsTxt: boolean;
  contentCitability: boolean;
  entityClarity: boolean;
  authoritySignals: boolean;
}

export interface AuthorityResult {
  // Brand Mentions
  brandMentionCount: number;
  hasWikipedia: boolean;
  hasKnowledgePanel: boolean;

  // Content Depth
  blogPostCount: number;
  averageContentLength: number;
  topicalCoverage: number;

  // Trust Signals
  domainAge: number;
  hasAboutPage: boolean;
  hasTeamPage: boolean;
  hasTestimonials: boolean;
  hasCaseStudies: boolean;
}

export interface ScanResult {
  id: string;
  leadId: string;
  overallScore: number;
  aiPresenceScore: number;
  siteReadinessScore: number;
  contentAuthorityScore: number;
  aiPresenceData: AIPresenceResult;
  siteReadinessData: SiteReadinessAnalysis;
  contentAuthorityData: AuthorityResult;
  findings: Finding[];
  quickWins: QuickWin[];
  competitorsFound: string[];
  createdAt: Date;
}

export interface Finding {
  type: "success" | "warning" | "error";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
}

export interface QuickWin {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedImpact: "low" | "medium" | "high";
  actionSteps: string[];
}

export type Industry =
  | "Technology"
  | "Finance & Banking"
  | "Healthcare"
  | "Education"
  | "E-commerce & Retail"
  | "Property & Real Estate"
  | "Manufacturing"
  | "Professional Services"
  | "F&B / Hospitality"
  | "Other";

export const INDUSTRIES: Industry[] = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "E-commerce & Retail",
  "Property & Real Estate",
  "Manufacturing",
  "Professional Services",
  "F&B / Hospitality",
  "Other",
];
