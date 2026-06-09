import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ScanInput } from "@/lib/types";
import { saveLead, saveScanResult } from "@/lib/supabase";
import { checkAIPresence } from "@/lib/ai-check";
import {
  analyzeSiteReadiness,
  analyzeContentAuthority,
} from "@/lib/site-analyzer";
import {
  calculateAIPresenceScore,
  calculateSiteReadinessScore,
  calculateContentAuthorityScore,
  calculateOverallScore,
  generateFindings,
  generateQuickWins,
  computeCompetitorAnalysis,
} from "@/lib/scoring";

// Simple UUID generator for scanId
function generateScanId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validation schema
const ScanInputSchema = z.object({
  websiteUrl: z.string().url(),
  primaryKeyword: z.string().min(2),
  industry: z.string(),
  businessName: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = ScanInputSchema.parse(body);
    const input: ScanInput = validated;

    // Extract domain from URL
    const domain = new URL(input.websiteUrl).hostname.replace("www.", "");

    console.log(`Starting scan for ${input.businessName} (${domain})`);

    // Generate scan ID
    const scanId = generateScanId();

    // Try to save lead to database (optional - won't block scan if it fails)
    let leadId = scanId;
    try {
      const lead = await saveLead({
        name: input.name,
        email: input.email,
        business_name: input.businessName,
        website_url: input.websiteUrl,
        keyword: input.primaryKeyword,
        industry: input.industry,
      });
      if (lead?.id) {
        leadId = lead.id;
      }
    } catch (error) {
      console.warn("Could not save lead to database (Supabase not configured):", error);
      // Continue without database - use generated scanId
    }

    // Step 1: Check AI Presence (0-30%)
    console.log("Step 1: Checking AI presence...");
    const aiPresence = await checkAIPresence(
      input.primaryKeyword,
      input.industry,
      input.businessName,
      domain
    );
    const aiScore = calculateAIPresenceScore(aiPresence.platformResults);

    // Step 2: Analyze Site Readiness (30-60%)
    console.log("Step 2: Analyzing site readiness...");
    const siteReadiness = await analyzeSiteReadiness(input.websiteUrl);
    const siteScore = calculateSiteReadinessScore(siteReadiness);

    // Step 3: Analyze Content Authority (60-85%)
    console.log("Step 3: Analyzing content authority...");
    const contentAuthority = await analyzeContentAuthority(
      input.websiteUrl,
      input.businessName
    );
    const authorityScore = calculateContentAuthorityScore(contentAuthority);

    // Step 4: Calculate overall score and generate insights (85-100%)
    console.log("Step 4: Calculating final score...");
    const overallScore = calculateOverallScore(
      aiScore,
      siteScore,
      authorityScore
    );

    const findings = generateFindings(
      aiPresence,
      siteReadiness,
      contentAuthority,
      input.businessName,
      input.primaryKeyword
    );

    const quickWins = generateQuickWins(siteReadiness, aiPresence, contentAuthority);

    // Extract competitors + per-platform analysis
    const competitors = new Set<string>();
    aiPresence.platformResults.forEach((result) => {
      result.competitorsMentioned.forEach((c) => competitors.add(c));
    });
    const competitorAnalysis = computeCompetitorAnalysis(aiPresence.platformResults);

    // Try to save scan result to database (optional)
    try {
      const scanResult = await saveScanResult({
        lead_id: leadId,
        overall_score: overallScore,
        ai_presence_score: aiScore,
        site_readiness_score: siteScore,
        content_authority_score: authorityScore,
        ai_presence_data: aiPresence,
        site_readiness_data: siteReadiness,
        content_authority_data: contentAuthority,
        findings: findings,
        quick_wins: quickWins,
        competitors_found: Array.from(competitors),
      });
      if (scanResult?.id) {
        // Use database ID if available
        console.log(`Scan saved to database with ID: ${scanResult.id}`);
      }
    } catch (error) {
      console.warn("Could not save scan result to database (Supabase not configured):", error);
      // Continue without database save - results will be passed in response
    }

    console.log(`Scan completed for ${input.businessName}. Score: ${overallScore}`);

    // Return full scan results (so they can be stored in localStorage on client)
    return NextResponse.json({
      scanId,
      leadId,
      overallScore,
      aiPresenceScore: aiScore,
      siteReadinessScore: siteScore,
      contentAuthorityScore: authorityScore,
      // Include full data for client-side storage
      aiPresenceData: aiPresence,
      siteReadinessData: siteReadiness,
      contentAuthorityData: contentAuthority,
      findings,
      quickWins,
      competitorsFound: Array.from(competitors),
      competitorAnalysis,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Failed to complete scan" },
      { status: 500 }
    );
  }
}
