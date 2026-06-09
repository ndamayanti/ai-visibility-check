import { AIPresenceResult, SiteReadinessAnalysis, AuthorityResult, Finding, QuickWin, CompetitorAnalysis, AIPlatform } from "./types";
import { PROMPT_PLATFORM_MAP } from "./ai-check";

const ALL_PLATFORMS: AIPlatform[] = ["ChatGPT", "Perplexity", "Google AI"];

// Queries per platform (based on PROMPT_PLATFORM_MAP)
const PLATFORM_QUERY_COUNT: Record<AIPlatform, number> = {
  ChatGPT: PROMPT_PLATFORM_MAP.filter(p => p === "ChatGPT").length,
  Perplexity: PROMPT_PLATFORM_MAP.filter(p => p === "Perplexity").length,
  "Google AI": PROMPT_PLATFORM_MAP.filter(p => p === "Google AI").length,
};

// Derive per-competitor per-platform scores from existing platformResults (no extra API calls)
export function computeCompetitorAnalysis(
  platformResults: AIPresenceResult["platformResults"]
): CompetitorAnalysis[] {
  // Map: competitor name → platform → mention count
  const mentionMap = new Map<string, Map<AIPlatform, number>>();

  platformResults.forEach((result, idx) => {
    const platform: AIPlatform = PROMPT_PLATFORM_MAP[idx] ?? "ChatGPT";
    result.competitorsMentioned.forEach(raw => {
      const name = raw.trim();
      if (!name || name.length < 2) return;
      if (!mentionMap.has(name)) mentionMap.set(name, new Map());
      const byPlatform = mentionMap.get(name)!;
      byPlatform.set(platform, (byPlatform.get(platform) ?? 0) + 1);
    });
  });

  const analyses: CompetitorAnalysis[] = [];

  mentionMap.forEach((byPlatform, name) => {
    const platformScores = ALL_PLATFORMS.map(platform => {
      const mentions = byPlatform.get(platform) ?? 0;
      const total = PLATFORM_QUERY_COUNT[platform] || 1;
      return {
        platform,
        mentioned: mentions > 0,
        score: Math.min(100, Math.round((mentions / total) * 100)),
      };
    });

    const totalMentions = Array.from(byPlatform.values()).reduce((s, n) => s + n, 0);
    const overallScore = Math.round(
      platformScores.reduce((s, p) => s + p.score, 0) / ALL_PLATFORMS.length
    );

    analyses.push({ name, overallScore, totalMentions, platformScores });
  });

  return analyses.sort((a, b) => b.overallScore - a.overallScore).slice(0, 6);
}

// Calculate AI Presence Score (0-100)
export function calculateAIPresenceScore(
  results: AIPresenceResult["platformResults"]
): number {
  if (results.length === 0) return 0;

  let score = 0;
  const totalChecks = results.length;

  for (const result of results) {
    if (result.mentioned && (result.position === 1 || result.position === 2)) {
      score += 10; // Mentioned AND in top position
    } else if (result.mentioned) {
      score += 7; // Mentioned but not top
    }
    // 0 if not mentioned at all
  }

  return Math.min(100, Math.round((score / (totalChecks * 10)) * 100));
}

// Calculate Site Readiness Score (0-100)
export function calculateSiteReadinessScore(
  analysis: SiteReadinessAnalysis
): number {
  let score = 0;

  // Schema Markup (25 points)
  if (analysis.hasSchemaMarkup) score += 8;
  if (analysis.hasFAQSchema) score += 8;
  if (analysis.hasOrganizationSchema) score += 5;
  if (analysis.schemaTypes.length >= 3) score += 4;

  // Content Structure (25 points)
  if (analysis.hasH1) score += 5;
  if (analysis.headingHierarchy) score += 5;
  if (analysis.hasFAQSection) score += 8;
  if (analysis.contentLength > 2000) score += 4;
  if (analysis.hasDefinitionContent) score += 3;

  // Technical Signals (25 points)
  if (analysis.hasMetaDescription) score += 5;
  if (analysis.hasCanonicalTag) score += 3;
  if (analysis.hasOpenGraph) score += 4;
  if (analysis.isHttps) score += 5;
  if (analysis.hasSitemap) score += 4;
  if (analysis.hasRobotsTxt) score += 4;

  // AI-Specific Readiness (25 points)
  if (analysis.hasLLMsTxt) score += 8;
  if (analysis.contentCitability) score += 7;
  if (analysis.entityClarity) score += 5;
  if (analysis.authoritySignals) score += 5;

  return Math.min(100, score);
}

// Calculate Content Authority Score (0-100)
export function calculateContentAuthorityScore(
  authority: AuthorityResult
): number {
  let score = 0;

  // Brand Visibility (40 points)
  if (authority.brandMentionCount > 100) score += 16;
  else if (authority.brandMentionCount > 50) score += 12;
  else if (authority.brandMentionCount > 10) score += 8;
  else if (authority.brandMentionCount > 0) score += 4;

  if (authority.hasWikipedia) score += 12;
  if (authority.hasKnowledgePanel) score += 12;

  // Content Depth (30 points)
  if (authority.blogPostCount > 20) score += 10;
  else if (authority.blogPostCount > 10) score += 7;
  else if (authority.blogPostCount > 0) score += 4;

  if (authority.averageContentLength > 2000) score += 10;
  else if (authority.averageContentLength > 1000) score += 6;
  else if (authority.averageContentLength > 300) score += 3;

  if (authority.topicalCoverage > 0.7) score += 10;
  else if (authority.topicalCoverage > 0.4) score += 6;
  else if (authority.topicalCoverage > 0) score += 3;

  // Trust Signals (30 points)
  if (authority.domainAge > 5) score += 7;
  else if (authority.domainAge > 2) score += 4;

  if (authority.hasAboutPage) score += 5;
  if (authority.hasTeamPage) score += 5;
  if (authority.hasTestimonials) score += 7;
  if (authority.hasCaseStudies) score += 6;

  return Math.min(100, score);
}

// Calculate overall score (average of three components)
export function calculateOverallScore(
  aiPresence: number,
  siteReadiness: number,
  contentAuthority: number
): number {
  return Math.round((aiPresence + siteReadiness + contentAuthority) / 3);
}

// Get score badge based on numeric score
export function getScoreBadge(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score <= 30) {
    return {
      label: "Critical",
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200",
    };
  }
  if (score <= 50) {
    return {
      label: "Needs Work",
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200",
    };
  }
  if (score <= 70) {
    return {
      label: "Average",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200",
    };
  }
  if (score <= 85) {
    return {
      label: "Good",
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200",
    };
  }
  return {
    label: "Excellent",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 border-emerald-200",
  };
}

// Get color for score gauge
export function getScoreColor(score: number): string {
  if (score <= 30) return "#EF4444"; // red
  if (score <= 50) return "#F97316"; // orange
  if (score <= 70) return "#EAB308"; // yellow
  if (score <= 85) return "#22C55E"; // green
  return "#10B981"; // emerald
}

// Generate findings based on analysis results
export function generateFindings(
  aiPresence: AIPresenceResult,
  siteReadiness: SiteReadinessAnalysis,
  authority: AuthorityResult,
  businessName: string,
  keyword: string
): Finding[] {
  const findings: Finding[] = [];

  // AI Presence Findings
  const mentionedPlatforms = aiPresence.platformResults.filter(
    (p) => p.mentioned
  );
  const topMentions = aiPresence.platformResults.filter((p) => p.position && p.position <= 3);

  if (topMentions.length === 0) {
    findings.push({
      type: "error",
      title: `${businessName} does not appear in top AI search results`,
      description: `When queried about "${keyword}", ChatGPT and Perplexity do not mention your brand.`,
      impact: "high",
    });
  } else {
    findings.push({
      type: "success",
      title: `${businessName} appears in AI recommendations`,
      description: `Your brand was mentioned ${topMentions.length} times across AI platforms.`,
      impact: "high",
    });
  }

  // Schema Markup Findings
  if (!siteReadiness.hasSchemaMarkup) {
    findings.push({
      type: "error",
      title: "No schema markup detected",
      description:
        "Your website is missing structured data that helps AI understand your content.",
      impact: "high",
    });
  } else {
    findings.push({
      type: "success",
      title: "Schema markup is implemented",
      description: `Found ${siteReadiness.schemaTypes.length} schema types on your website.`,
      impact: "medium",
    });
  }

  if (!siteReadiness.hasFAQSchema) {
    findings.push({
      type: "warning",
      title: "FAQ schema not found",
      description:
        "Adding FAQ schema can help AI cite your content directly in responses.",
      impact: "high",
    });
  }

  // Technical Findings
  if (!siteReadiness.hasMetaDescription) {
    findings.push({
      type: "warning",
      title: "Missing meta descriptions",
      description:
        "Meta descriptions help AI understand page content and improve citations.",
      impact: "medium",
    });
  }

  if (!siteReadiness.hasLLMsTxt) {
    findings.push({
      type: "error",
      title: "No llms.txt file found",
      description:
        "AI crawlers use llms.txt to understand your content policies and preferences.",
      impact: "medium",
    });
  }

  // Authority Findings
  if (authority.brandMentionCount === 0) {
    findings.push({
      type: "error",
      title: "Limited online mentions",
      description:
        "Your brand is not widely mentioned across the web, affecting AI visibility.",
      impact: "high",
    });
  } else if (authority.brandMentionCount > 50) {
    findings.push({
      type: "success",
      title: "Strong online presence",
      description: `Your brand has ${authority.brandMentionCount}+ mentions across the web.`,
      impact: "high",
    });
  }

  if (!siteReadiness.isHttps) {
    findings.push({
      type: "error",
      title: "Website is not HTTPS",
      description: "HTTPS is required for modern web standards and AI crawling.",
      impact: "high",
    });
  }

  return findings.slice(0, 6); // Return top 6 findings
}

// Generate quick win recommendations
export function generateQuickWins(
  siteReadiness: SiteReadinessAnalysis,
  aiPresence: AIPresenceResult,
  authority: AuthorityResult
): QuickWin[] {
  const wins: QuickWin[] = [];

  // Quick Win 1: Schema Markup
  if (!siteReadiness.hasFAQSchema) {
    wins.push({
      title: "Add FAQ Schema to Top Pages",
      description:
        "FAQ schema helps AI cite your content directly in search results.",
      difficulty: "medium",
      estimatedImpact: "high",
      actionSteps: [
        "Identify top 5 pages with Q&A content",
        "Add FAQ schema markup using JSON-LD",
        "Test with Google Rich Results Test",
        "Submit to Google Search Console",
      ],
    });
  }

  // Quick Win 2: Create llms.txt
  if (!siteReadiness.hasLLMsTxt) {
    wins.push({
      title: "Create llms.txt File",
      description:
        "Guide AI crawlers on how to use and attribute your content.",
      difficulty: "easy",
      estimatedImpact: "medium",
      actionSteps: [
        "Create /llms.txt in your root domain",
        "Add content policy and attribution requirements",
        "Test accessibility at domain.com/llms.txt",
        "Monitor crawler visits in server logs",
      ],
    });
  }

  // Quick Win 3: Content Authority
  if (!authority.hasCaseStudies) {
    wins.push({
      title: "Publish Client Case Studies",
      description:
        "Case studies demonstrate expertise and provide content for AI to cite.",
      difficulty: "hard",
      estimatedImpact: "high",
      actionSteps: [
        "Select 3-5 successful client projects",
        "Document results with metrics and ROI",
        "Add as case studies on your website",
        "Include problem, solution, and results structure",
      ],
    });
  }

  return wins.slice(0, 3); // Return top 3 quick wins
}
