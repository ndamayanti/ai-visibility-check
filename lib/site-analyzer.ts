import * as cheerio from "cheerio";
import { SiteReadinessAnalysis, AuthorityResult } from "./types";

// Fetch and analyze website for AI-readiness
export async function analyzeSiteReadiness(
  url: string
): Promise<SiteReadinessAnalysis> {
  try {
    const html = await fetchWithTimeout(url, 10000);
    const $ = cheerio.load(html);

    const analysis: SiteReadinessAnalysis = {
      // Schema Markup
      hasSchemaMarkup: checkForSchema($),
      schemaTypes: extractSchemaTypes($),
      hasFAQSchema: checkFAQSchema($),
      hasOrganizationSchema: checkOrgSchema($),

      // Content Structure
      hasH1: $("h1").length > 0,
      headingHierarchy: checkHeadingHierarchy($),
      hasFAQSection: checkForFAQContent($),
      contentLength: extractContentLength($),
      hasDefinitionContent: checkDefinitions($),

      // Technical Signals
      hasMetaDescription: $('meta[name="description"]').length > 0,
      hasCanonicalTag: $('link[rel="canonical"]').length > 0,
      hasOpenGraph: $('meta[property^="og:"]').length > 0,
      loadTime: 0, // Will be measured during fetch
      isHttps: url.startsWith("https"),
      hasRobotsTxt: await checkRobotsTxt(url),
      hasSitemap: await checkSitemap(url),

      // AI-Specific Readiness
      hasLLMsTxt: await checkLLMsTxt(url),
      contentCitability: assessCitability($),
      entityClarity: checkEntityClarity($),
      authoritySignals: checkAuthoritySignals($),
    };

    return analysis;
  } catch (error) {
    console.error("Error analyzing site readiness:", error);
    // Return empty analysis on error
    return {
      hasSchemaMarkup: false,
      schemaTypes: [],
      hasFAQSchema: false,
      hasOrganizationSchema: false,
      hasH1: false,
      headingHierarchy: false,
      hasFAQSection: false,
      contentLength: 0,
      hasDefinitionContent: false,
      hasMetaDescription: false,
      hasCanonicalTag: false,
      hasOpenGraph: false,
      loadTime: 0,
      isHttps: url.startsWith("https"),
      hasRobotsTxt: false,
      hasSitemap: false,
      hasLLMsTxt: false,
      contentCitability: false,
      entityClarity: false,
      authoritySignals: false,
    };
  }
}

// Estimate basic content authority (simplified version)
export async function analyzeContentAuthority(
  url: string,
  businessName: string
): Promise<AuthorityResult> {
  try {
    const html = await fetchWithTimeout(url, 10000);
    const $ = cheerio.load(html);

    const authority: AuthorityResult = {
      // Brand Mentions (simplified - would use real API in production)
      brandMentionCount: estimateBrandMentions(businessName),
      hasWikipedia: false, // Would check Wikipedia API
      hasKnowledgePanel: false, // Would check Google Knowledge Graph

      // Content Depth
      blogPostCount: estimateBlogCount($),
      averageContentLength: estimateAverageContentLength($),
      topicalCoverage: estimateTopicalCoverage($),

      // Trust Signals
      domainAge: 3, // Simplified - would use WHOIS API
      hasAboutPage: checkAboutPage($, url),
      hasTeamPage: checkTeamPage($, url),
      hasTestimonials: checkForTestimonials($),
      hasCaseStudies: checkForCaseStudies($),
    };

    return authority;
  } catch (error) {
    console.error("Error analyzing content authority:", error);
    return {
      brandMentionCount: 0,
      hasWikipedia: false,
      hasKnowledgePanel: false,
      blogPostCount: 0,
      averageContentLength: 0,
      topicalCoverage: 0,
      domainAge: 0,
      hasAboutPage: false,
      hasTeamPage: false,
      hasTestimonials: false,
      hasCaseStudies: false,
    };
  }
}

// Helper functions
function fetchWithTimeout(
  url: string,
  timeout: number = 10000
): Promise<string> {
  return Promise.race([
    fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    }).then((r) => r.text()),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout")), timeout)
    ),
  ]);
}

function checkForSchema($: cheerio.CheerioAPI): boolean {
  return (
    $('script[type="application/ld+json"]').length > 0 ||
    $("[itemscope]").length > 0 ||
    $("[property^='og:']").length > 0
  );
}

function extractSchemaTypes($: cheerio.CheerioAPI): string[] {
  const types: Set<string> = new Set();

  $('script[type="application/ld+json"]').each((_, elem) => {
    try {
      const json = JSON.parse($(elem).text());
      if (json["@type"]) {
        if (Array.isArray(json["@type"])) {
          json["@type"].forEach((t: string) => types.add(t));
        } else {
          types.add(json["@type"]);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  });

  return Array.from(types);
}

function checkFAQSchema($: cheerio.CheerioAPI): boolean {
  const scripts = $('script[type="application/ld+json"]');
  return scripts.toArray().some((elem) => {
    try {
      const json = JSON.parse($(elem).text());
      return (
        json["@type"] === "FAQPage" ||
        (Array.isArray(json["@type"]) && json["@type"].includes("FAQPage"))
      );
    } catch (e) {
      return false;
    }
  });
}

function checkOrgSchema($: cheerio.CheerioAPI): boolean {
  const scripts = $('script[type="application/ld+json"]');
  return scripts.toArray().some((elem) => {
    try {
      const json = JSON.parse($(elem).text());
      return (
        json["@type"] === "Organization" ||
        (Array.isArray(json["@type"]) && json["@type"].includes("Organization"))
      );
    } catch (e) {
      return false;
    }
  });
}

function checkHeadingHierarchy($: cheerio.CheerioAPI): boolean {
  const headings = $("h1, h2, h3, h4, h5, h6");
  if (headings.length === 0) return false;

  let lastLevel = 0;
  for (const elem of headings.toArray()) {
    const level = parseInt(elem.name[1]);
    if (level > lastLevel + 1) return false;
    lastLevel = level;
  }
  return true;
}

function checkForFAQContent($: cheerio.CheerioAPI): boolean {
  const text = $.text().toLowerCase();
  return (
    text.includes("frequently asked") ||
    text.includes("faq") ||
    (text.includes("?") && text.match(/\?/g)!.length > 5)
  );
}

function extractContentLength($: cheerio.CheerioAPI): number {
  const content = $(
    "article, main, [role='main'], .content, .post, .entry"
  ).text();
  return content.length;
}

function checkDefinitions($: cheerio.CheerioAPI): boolean {
  const text = $.text().toLowerCase();
  return (
    text.includes("what is") ||
    text.includes("definition") ||
    text.includes("explained")
  );
}

async function checkRobotsTxt(url: string): Promise<boolean> {
  try {
    const domain = new URL(url).origin;
    const response = await fetchWithTimeout(`${domain}/robots.txt`, 5000);
    return response.length > 0;
  } catch (e) {
    return false;
  }
}

async function checkSitemap(url: string): Promise<boolean> {
  try {
    const domain = new URL(url).origin;
    const response = await fetchWithTimeout(`${domain}/sitemap.xml`, 5000);
    return response.includes("<?xml") || response.includes("<urlset");
  } catch (e) {
    return false;
  }
}

async function checkLLMsTxt(url: string): Promise<boolean> {
  try {
    const domain = new URL(url).origin;
    const response = await fetchWithTimeout(`${domain}/llms.txt`, 5000);
    return response.length > 0;
  } catch (e) {
    return false;
  }
}

function assessCitability($: cheerio.CheerioAPI): boolean {
  const text = $.text();
  // Check for quotable content (paragraphs with good length)
  const paragraphs = $("p");
  const citableCount = paragraphs
    .toArray()
    .filter((p) => $(p).text().length > 100).length;
  return citableCount > 5;
}

function checkEntityClarity($: cheerio.CheerioAPI): boolean {
  // Check if brand/entity is clearly defined
  const text = $.text().toLowerCase();
  return (
    text.includes("we are") ||
    text.includes("our mission") ||
    text.includes("about us") ||
    $("[itemtype*='organization']").length > 0
  );
}

function checkAuthoritySignals($: cheerio.CheerioAPI): boolean {
  return (
    checkAboutPage($, "") || checkTeamPage($, "") || checkForTestimonials($)
  );
}

function checkAboutPage(
  $: cheerio.CheerioAPI,
  baseUrl: string
): boolean {
  const links = $("a");
  return links.toArray().some((a) => {
    const href = $(a).attr("href")?.toLowerCase() || "";
    return href.includes("about");
  });
}

function checkTeamPage(
  $: cheerio.CheerioAPI,
  baseUrl: string
): boolean {
  const links = $("a");
  return links.toArray().some((a) => {
    const href = $(a).attr("href")?.toLowerCase() || "";
    return href.includes("team") || href.includes("people") || href.includes("staff");
  });
}

function checkForTestimonials($: cheerio.CheerioAPI): boolean {
  const text = $.text().toLowerCase();
  return (
    text.includes("testimonial") ||
    text.includes("customer review") ||
    text.includes("success story") ||
    $('[class*="testimonial"]').length > 0 ||
    $('[class*="review"]').length > 0
  );
}

function checkForCaseStudies($: cheerio.CheerioAPI): boolean {
  const text = $.text().toLowerCase();
  return (
    text.includes("case study") ||
    text.includes("our work") ||
    text.includes("portfolio") ||
    text.includes("project")
  );
}

function estimateBrandMentions(businessName: string): number {
  // Simplified: would use Google Custom Search API or similar
  // Return a random value for now
  return Math.floor(Math.random() * 100);
}

function estimateBlogCount($: cheerio.CheerioAPI): number {
  // Count article/blog links
  return $("a[href*='blog'], a[href*='article'], a[href*='post']").length;
}

function estimateAverageContentLength($: cheerio.CheerioAPI): number {
  const articles = $("article, [role='article'], .post");
  if (articles.length === 0) return 0;

  let total = 0;
  articles.each((_, elem) => {
    total += $(elem).text().length;
  });

  return Math.round(total / articles.length);
}

function estimateTopicalCoverage($: cheerio.CheerioAPI): number {
  // Simplified topical coverage based on content structure
  const hasCategories = $('[class*="category"], [class*="tag"]').length > 0;
  const hasNav = $("nav").length > 0;
  const hasStructure = $("h1, h2, h3").length > 5;

  return (hasCategories && hasNav && hasStructure) ? 0.7 : 0.3;
}
