"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface DashboardStats {
  totalScans: number;
  totalLeads: number;
  avgScore: number;
  scansToday: number;
  topIndustry: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    totalLeads: 0,
    avgScore: 0,
    scansToday: 0,
    topIndustry: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const client = getSupabase();
        if (!client) {
          throw new Error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        }

        // Fetch total leads
        const { data: leadsData, error: leadsError } = await client
          .from("leads")
          .select("id", { count: "exact" });

        if (leadsError) throw leadsError;

        // Fetch total scans
        const { data: scansData, error: scansError } = await client
          .from("scan_results")
          .select("id, overall_score, created_at", { count: "exact" });

        if (scansError) throw scansError;

        // Calculate today's scans
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayScans = scansData?.filter((scan) => {
          const scanDate = new Date(scan.created_at || "");
          return scanDate >= today;
        }).length || 0;

        // Calculate average score
        const avgScore =
          scansData && scansData.length > 0
            ? Math.round(
                scansData.reduce((sum, scan) => sum + scan.overall_score, 0) /
                  scansData.length
              )
            : 0;

        // Fetch top industry
        const { data: industryData } = await client
          .from("leads")
          .select("industry")
          .limit(100);

        const industries: Record<string, number> = {};
        industryData?.forEach((lead) => {
          industries[lead.industry] = (industries[lead.industry] || 0) + 1;
        });

        const topIndustry = Object.entries(industries).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || "N/A";

        setStats({
          totalScans: scansData?.length || 0,
          totalLeads: leadsData?.length || 0,
          avgScore,
          scansToday: todayScans,
          topIndustry,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your AI Visibility Score tool performance.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total Leads",
            value: stats.totalLeads,
            icon: "👥",
            color: "from-blue-600 to-blue-700",
          },
          {
            label: "Total Scans",
            value: stats.totalScans,
            icon: "📊",
            color: "from-purple-600 to-purple-700",
          },
          {
            label: "Avg Score",
            value: `${stats.avgScore}/100`,
            icon: "⭐",
            color: "from-yellow-600 to-yellow-700",
          },
          {
            label: "Scans Today",
            value: stats.scansToday,
            icon: "📈",
            color: "from-green-600 to-green-700",
          },
          {
            label: "Top Industry",
            value: stats.topIndustry,
            icon: "🏢",
            color: "from-orange-600 to-orange-700",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm text-gray-200 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/leads">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all cursor-pointer">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Leads</h3>
            <p className="text-slate-400 text-sm mb-4">
              View and manage all collected leads
            </p>
            <div className="text-orange-500 text-sm font-semibold">
              View Leads →
            </div>
          </div>
        </Link>

        <Link href="/admin/analytics">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all cursor-pointer">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-slate-400 text-sm mb-4">
              Detailed scan statistics and trends
            </p>
            <div className="text-orange-500 text-sm font-semibold">
              View Analytics →
            </div>
          </div>
        </Link>

        <Link href="/admin/exports">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all cursor-pointer">
            <div className="text-4xl mb-3">📥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
            <p className="text-slate-400 text-sm mb-4">
              Download leads and scan results as CSV
            </p>
            <div className="text-orange-500 text-sm font-semibold">
              Export Data →
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">📝 Recent Scans</h2>
        <p className="text-slate-400 text-sm">
          View recent scans in the <Link href="/admin/leads" className="text-orange-500 hover:underline">Leads</Link> section
        </p>
      </div>
    </div>
  );
}
