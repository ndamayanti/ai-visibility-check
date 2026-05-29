import { AIPresenceResult } from "./types";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// Generate search queries based on keyword and industry
export function generateSearchPrompts(
  keyword: string,
  industry: string,
  businessName: string
): string[] {
  return [
    `best ${keyword} companies`,
    `top ${keyword} providers`,
    `leading ${industry} companies for ${keyword}`,
    `${keyword} services recommendation`,
    `${industry} ${keyword} solution`,
  ];
}

// Check AI presence by querying Tavily (web search + AI summary)
export async function checkTavilyPresence(
  prompts: string[],
  businessName: string,
  domain: string
): Promise<AIPresenceResult["platformResults"]> {
  if (!TAVILY_API_KEY) {
    console.warn("TAVILY_API_KEY not configured");
    return [];
  }

  const results: AIPresenceResult["platformResults"] = [];

  for (const prompt of prompts) {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: TAVILY_API_KEY,
          query: prompt,
          include_answer: true,
          max_results: 10,
        }),
      });

      if (!response.ok) {
        console.error(`Tavily API error: ${response.status}`);
        continue;
      }

      const data = (await response.json()) as any;
      const answer = data.answer || "";
      const searchResults = data.results || [];

      // Check if business name or domain is mentioned in answer or results
      let mentioned = false;
      let position: number | null = null;
      let mentionContext = "";

      if (answer.toLowerCase().includes(businessName.toLowerCase()) || answer.includes(domain)) {
        mentioned = true;
        mentionContext = answer.substring(0, 300);
      }

      // Check search results for mentions
      for (let i = 0; i < searchResults.length; i++) {
        const result = searchResults[i];
        const resultText = `${result.title || ""} ${result.content || ""}`.toLowerCase();

        if (resultText.includes(businessName.toLowerCase()) || resultText.includes(domain)) {
          mentioned = true;
          if (!position) {
            position = i + 1;
          }
          if (!mentionContext) {
            mentionContext = result.content || result.title || "Found in search results";
          }
        }
      }

      // Extract competitors from search results titles
      const competitors: string[] = [];
      for (const result of searchResults) {
        const title = result.title || "";
        // Extract company names from titles
        const companyMatch = title.match(/([A-Z][A-Za-z0-9\s&]*)/);
        if (companyMatch && !companyMatch[1].toLowerCase().includes(businessName.toLowerCase())) {
          competitors.push(companyMatch[1].trim());
        }
      }

      results.push({
        platform: "Web Search",
        prompt,
        mentioned,
        mentionContext: mentionContext || "Not found",
        position,
        competitorsMentioned: competitors.slice(0, 5),
      });
    } catch (error) {
      console.error("Error checking Tavily presence:", error);
      results.push({
        platform: "Web Search",
        prompt,
        mentioned: false,
        mentionContext: "Error - could not check",
        position: null,
        competitorsMentioned: [],
      });
    }
  }

  return results;
}


// Main function to check AI presence via web search
export async function checkAIPresence(
  keyword: string,
  industry: string,
  businessName: string,
  domain: string
): Promise<AIPresenceResult> {
  const prompts = generateSearchPrompts(keyword, industry, businessName);

  // Query Tavily for web search results
  const tavilyResults = await checkTavilyPresence(prompts, businessName, domain);

  const allResults = [...tavilyResults];

  // Generate summary
  const mentionCount = allResults.filter((r) => r.mentioned).length;
  const topMentions = allResults.filter((r) => r.position && r.position <= 3)
    .length;

  let summary = "";
  if (topMentions >= 4) {
    summary = `${businessName} appears in top recommendations across multiple AI platforms. Strong AI visibility.`;
  } else if (mentionCount >= 4) {
    summary = `${businessName} is mentioned by AI platforms but not always in top positions. Moderate AI visibility.`;
  } else if (mentionCount > 0) {
    summary = `${businessName} has limited mentions across AI platforms. Low AI visibility - improvement needed.`;
  } else {
    summary = `${businessName} does not appear in AI search results. No current AI visibility.`;
  }

  return {
    score: calculateAIScore(allResults),
    platformResults: allResults,
    summary,
  };
}

// Calculate AI presence score
function calculateAIScore(
  results: AIPresenceResult["platformResults"]
): number {
  if (results.length === 0) return 0;

  let score = 0;
  const totalChecks = results.length;

  for (const result of results) {
    if (result.mentioned && (result.position === 1 || result.position === 2)) {
      score += 10;
    } else if (result.mentioned) {
      score += 7;
    }
  }

  return Math.min(100, Math.round((score / (totalChecks * 10)) * 100));
}
