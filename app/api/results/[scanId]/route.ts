import { NextRequest, NextResponse } from "next/server";
import { getScanResult } from "@/lib/supabase";
import { ScanResult } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  try {
    const { scanId } = await params;

    if (!scanId) {
      return NextResponse.json(
        { error: "Scan ID is required" },
        { status: 400 }
      );
    }

    const scanResultDB = await getScanResult(scanId);

    if (!scanResultDB) {
      return NextResponse.json(
        { error: "Scan result not found" },
        { status: 404 }
      );
    }

    // Format the response
    const result: ScanResult = {
      id: scanResultDB.id || scanId,
      leadId: scanResultDB.lead_id,
      overallScore: scanResultDB.overall_score,
      aiPresenceScore: scanResultDB.ai_presence_score,
      siteReadinessScore: scanResultDB.site_readiness_score,
      contentAuthorityScore: scanResultDB.content_authority_score,
      aiPresenceData: scanResultDB.ai_presence_data,
      siteReadinessData: scanResultDB.site_readiness_data,
      contentAuthorityData: scanResultDB.content_authority_data,
      findings: scanResultDB.findings,
      quickWins: scanResultDB.quick_wins,
      competitorsFound: scanResultDB.competitors_found || [],
      createdAt: new Date(scanResultDB.created_at || Date.now()),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching scan result:", error);
    return NextResponse.json(
      { error: "Failed to fetch scan result" },
      { status: 500 }
    );
  }
}
