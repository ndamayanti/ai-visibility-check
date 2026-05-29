"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryCard from "@/components/CategoryCard";
import { ScanResult, Finding } from "@/lib/types";
import { getScoreBadge } from "@/lib/scoring";

export default function ResultsPage() {
  const params = useParams();
  const scanId = params?.scanId as string;
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    const fetchResults = async () => {
      try {
        // First, try to get from localStorage (for scans without Supabase)
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(`scan_${scanId}`);
          if (cached) {
            const data = JSON.parse(cached);
            // Transform API response to match ScanResult format
            setResult({
              id: data.scanId,
              leadId: data.leadId,
              overallScore: data.overallScore,
              aiPresenceScore: data.aiPresenceScore,
              siteReadinessScore: data.siteReadinessScore,
              contentAuthorityScore: data.contentAuthorityScore,
              aiPresenceData: data.aiPresenceData,
              siteReadinessData: data.siteReadinessData,
              contentAuthorityData: data.contentAuthorityData,
              findings: data.findings,
              quickWins: data.quickWins,
              competitorsFound: data.competitorsFound,
              createdAt: new Date(),
            });
            setLoading(false);
            return;
          }
        }

        // Fall back to API (for Supabase-enabled scans)
        const response = await fetch(`/api/results/${scanId}`);
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-white text-lg">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error || "No results found"}</p>
          <a href="/" className="text-orange-500 mt-4 inline-block hover:underline">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  const overallBadge = getScoreBadge(result.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-orange-500">🔍</span>
            <span className="text-white">ToffeeDev</span>
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Section 1: Hero Score */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-8">
            Your AI Visibility Score
          </h1>
          <ScoreGauge score={result.overallScore} />
          <div className="mt-8 inline-block px-4 py-2 rounded-full border" style={{ borderColor: overallBadge.color }}>
            <span
              className={`font-semibold ${overallBadge.color}`}
            >
              {overallBadge.label}
            </span>
          </div>
        </div>

        {/* Section 2: Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <CategoryCard
            title="AI Search Presence"
            icon="🤖"
            score={result.aiPresenceScore}
            description="How often AI platforms mention your brand"
            findings={[
              result.aiPresenceData.summary,
              `Checked across ${result.aiPresenceData.platformResults.length} AI queries`,
            ]}
          />
          <CategoryCard
            title="Website AI-Readiness"
            icon="🔧"
            score={result.siteReadinessScore}
            description="How well your site is structured for AI"
            findings={[
              `${result.siteReadinessData.schemaTypes.length} schema types found`,
              result.siteReadinessData.hasLLMsTxt
                ? "✓ llms.txt configured"
                : "✗ Missing llms.txt file",
              result.siteReadinessData.hasMetaDescription
                ? "✓ Meta descriptions present"
                : "✗ Missing meta descriptions",
            ]}
          />
          <CategoryCard
            title="Content Authority"
            icon="⭐"
            score={result.contentAuthorityScore}
            description="How trustworthy AI considers your content"
            findings={[
              result.contentAuthorityData.hasAboutPage
                ? "✓ About page present"
                : "✗ No About page",
              result.contentAuthorityData.hasTestimonials
                ? "✓ Testimonials included"
                : "✗ No testimonials",
              result.contentAuthorityData.hasCaseStudies
                ? "✓ Case studies available"
                : "✗ No case studies",
            ]}
          />
        </div>

        {/* Section 3: Key Findings */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Key Findings</h2>
          <div className="space-y-3">
            {result.findings.map((finding: Finding, index: number) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex gap-4"
              >
                <div className="flex-shrink-0 text-2xl">
                  {finding.type === "success"
                    ? "✅"
                    : finding.type === "warning"
                    ? "⚠️"
                    : "❌"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{finding.title}</h3>
                  <p className="text-slate-300 text-sm">{finding.description}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                    Impact: {finding.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Quick Wins */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Top 3 Quick Wins</h2>
          <div className="space-y-4">
            {result.quickWins.map((win, index: number) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{win.title}</h3>
                  <span className="text-sm font-semibold">
                    {index + 1 === 1 ? "⭐" : index + 1 === 2 ? "⭐⭐" : "⭐⭐⭐"}
                  </span>
                </div>
                <p className="text-slate-300 mb-3">{win.description}</p>
                <div className="flex gap-4 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                    Difficulty: {win.difficulty}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300">
                    Impact: {win.estimatedImpact}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  <p className="font-semibold mb-2">Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {win.actionSteps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Competitor Snapshot */}
        {result.competitorsFound.length > 0 && (
          <div className="mb-16 bg-red-950/20 border border-red-900/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">⚠️ Competitor Snapshot</h2>
            <p className="text-slate-300 mb-4">
              When we asked AI about your keyword, these competitors appeared instead:
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {result.competitorsFound.slice(0, 5).map((competitor, index) => (
                <div key={index} className="bg-slate-800 rounded p-3 text-slate-200">
                  {index + 1}. {competitor}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Your competitors are being recommended by AI. You're not visible yet. This is
              urgent.
            </p>
          </div>
        )}

        {/* Section 6: CTA Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Want to Fix Your AI Visibility?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Your score is {result.overallScore}/100. Companies working with ToffeeDev improve their AI
            Visibility Score by an average of 40+ points in 90 days.
          </p>
          <div className="space-y-2 mb-8 text-left max-w-sm mx-auto">
            {[
              "✅ AI Visibility Monitoring (up to 100 prompts)",
              "✅ Schema Markup Optimization",
              "✅ GEO / AI Search Optimization",
              "✅ Monthly Strategy & Reporting",
            ].map((feature, index) => (
              <p key={index} className="text-white">
                {feature}
              </p>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-all">
              Schedule a Free Strategy Call
            </button>
            <button className="bg-orange-500 text-white hover:bg-orange-600 font-bold py-3 px-8 rounded-lg transition-all">
              Download Full Report as PDF
            </button>
          </div>
          <p className="text-orange-100 text-sm mt-6">
            "If customers can't find you, they can't choose you." — Ryan Kristo, ToffeeDev
          </p>
        </div>

        {/* Section 7: Share Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Share Your Score</h2>
          <p className="text-slate-400 mb-4">
            Let your network know about your AI visibility
          </p>
          <div className="flex justify-center gap-4">
            {[
              { name: "LinkedIn", emoji: "💼" },
              { name: "Twitter", emoji: "𝕏" },
              { name: "WhatsApp", emoji: "💬" },
            ].map((platform) => (
              <button
                key={platform.name}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
              >
                <span>{platform.emoji}</span>
                Share on {platform.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 bg-slate-900 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Made by ToffeeDev • Indonesia's Leading AI-First SEO Agency</p>
        </div>
      </footer>
    </div>
  );
}
