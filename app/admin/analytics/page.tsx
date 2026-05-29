"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/types";

interface Analytics {
  byIndustry: Record<string, number>;
  scoreDistribution: Record<string, number>;
  topKeywords: Array<[string, number]>;
  dailyScans: Array<[string, number]>;
  avgScoreByIndustry: Record<string, number>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    byIndustry: {},
    scoreDistribution: {},
    topKeywords: [],
    dailyScans: [],
    avgScoreByIndustry: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const client = getSupabase();
        if (!client) {
          throw new Error("Supabase is not configured.");
        }

        // Fetch all leads and scans
        const { data: leadsData } = await client
          .from("leads")
          .select("*");

        const { data: scansData } = await client
          .from("scan_results")
          .select("*");

        if (!leadsData || !scansData) return;

        // Industry breakdown
        const byIndustry: Record<string, number> = {};
        const avgScoreByIndustry: Record<string, number[]> = {};

        leadsData.forEach((lead) => {
          byIndustry[lead.industry] = (byIndustry[lead.industry] || 0) + 1;
          if (!avgScoreByIndustry[lead.industry]) {
            avgScoreByIndustry[lead.industry] = [];
          }

          const scanForLead = scansData.find((s) => s.lead_id === lead.id);
          if (scanForLead) {
            avgScoreByIndustry[lead.industry].push(scanForLead.overall_score);
          }
        });

        const avgScoreByIndustryFinal: Record<string, number> = {};
        Object.entries(avgScoreByIndustry).forEach(([ind, scores]) => {
          if (scores.length > 0) {
            avgScoreByIndustryFinal[ind] = Math.round(
              scores.reduce((a, b) => a + b, 0) / scores.length
            );
          }
        });

        // Score distribution
        const scoreDistribution: Record<string, number> = {
          "0-30": 0,
          "31-50": 0,
          "51-70": 0,
          "71-85": 0,
          "86-100": 0,
        };

        scansData.forEach((scan) => {
          const score = scan.overall_score;
          if (score <= 30) scoreDistribution["0-30"]++;
          else if (score <= 50) scoreDistribution["31-50"]++;
          else if (score <= 70) scoreDistribution["51-70"]++;
          else if (score <= 85) scoreDistribution["71-85"]++;
          else scoreDistribution["86-100"]++;
        });

        // Top keywords
        const keywordCount: Record<string, number> = {};
        leadsData.forEach((lead) => {
          const keyword = lead.keyword.toLowerCase();
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
        });

        const topKeywords = Object.entries(keywordCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        // Daily scans
        const dailyScanMap: Record<string, number> = {};
        scansData.forEach((scan) => {
          const date = new Date(scan.created_at || "").toLocaleDateString();
          dailyScanMap[date] = (dailyScanMap[date] || 0) + 1;
        });

        const dailyScans = Object.entries(dailyScanMap).sort(
          ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
        );

        setAnalytics({
          byIndustry,
          scoreDistribution,
          topKeywords,
          dailyScans,
          avgScoreByIndustry: avgScoreByIndustryFinal,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">
          Detailed statistics and trends from your scans
        </p>
      </div>

      {/* Score Distribution */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Score Distribution</h2>
        <div className="space-y-3">
          {Object.entries(analytics.scoreDistribution).map(
            ([range, count]) => (
              <div key={range}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">{range}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all"
                    style={{
                      width: `${
                        (count /
                          Object.values(analytics.scoreDistribution).reduce(
                            (a, b) => a + b,
                            1
                          )) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Industry Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Scans by Industry</h2>
          <div className="space-y-2">
            {Object.entries(analytics.byIndustry)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([industry, count]) => (
                <div key={industry} className="flex justify-between text-slate-300">
                  <span>{industry}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Avg Score by Industry
          </h2>
          <div className="space-y-2">
            {Object.entries(analytics.avgScoreByIndustry)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([industry, score]) => (
                <div key={industry} className="flex justify-between text-slate-300">
                  <span>{industry}</span>
                  <span className="font-semibold text-orange-400">{score}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Top Keywords</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {analytics.topKeywords.map(([keyword, count]) => (
            <div
              key={keyword}
              className="bg-slate-700 rounded-lg p-3 text-center"
            >
              <p className="text-white font-semibold text-sm mb-1 truncate">
                {keyword}
              </p>
              <p className="text-orange-400 text-lg font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Scans Over Time</h2>
        <div className="space-y-2">
          {analytics.dailyScans.slice(-7).map(([date, count]) => (
            <div key={date}>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm">{date}</span>
                <span className="font-semibold text-white">{count} scans</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                  style={{
                    width: `${(count / Math.max(...analytics.dailyScans.map(([, c]) => c), 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
