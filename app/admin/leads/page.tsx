"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { INDUSTRIES } from "@/lib/types";

interface LeadWithScore {
  id: string;
  name: string;
  email: string;
  business_name: string;
  website_url: string;
  keyword: string;
  industry: string;
  created_at: string;
  overall_score?: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        let query = supabase.from("leads").select("*");

        if (industryFilter) {
          query = query.eq("industry", industryFilter);
        }

        const { data: leadsData, error } = await query;

        if (error) throw error;

        // Fetch scores for each lead
        const leadsWithScores = await Promise.all(
          (leadsData || []).map(async (lead) => {
            const { data: scanData } = await supabase
              .from("scan_results")
              .select("overall_score")
              .eq("lead_id", lead.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            return {
              ...lead,
              overall_score: scanData?.overall_score,
            };
          })
        );

        setLeads(leadsWithScores);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [industryFilter]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.website_url.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getScoreBadge = (score?: number) => {
    if (!score) return <span className="text-slate-400">No scan yet</span>;
    if (score <= 30)
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
          Critical ({score})
        </span>
      );
    if (score <= 50)
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">
          Needs Work ({score})
        </span>
      );
    if (score <= 70)
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">
          Average ({score})
        </span>
      );
    if (score <= 85)
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
          Good ({score})
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
        Excellent ({score})
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Leads</h1>
        <p className="text-slate-400">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by company, email, or website..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading leads...</div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-slate-400">No leads found</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Latest Score
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">
                        {lead.business_name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {lead.website_url}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white">{lead.name}</p>
                      <p className="text-sm text-slate-400">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-300">{lead.industry}</span>
                  </td>
                  <td className="px-6 py-4">{getScoreBadge(lead.overall_score)}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Total Leads</p>
          <p className="text-3xl font-bold text-white">{leads.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">With Scans</p>
          <p className="text-3xl font-bold text-white">
            {leads.filter((l) => l.overall_score).length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Avg Score</p>
          <p className="text-3xl font-bold text-white">
            {leads.filter((l) => l.overall_score).length > 0
              ? Math.round(
                  leads
                    .filter((l) => l.overall_score)
                    .reduce((sum, l) => sum + (l.overall_score || 0), 0) /
                    leads.filter((l) => l.overall_score).length
                )
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
