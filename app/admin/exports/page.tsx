"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ExportStatus {
  loading: boolean;
  message: string;
  type: "success" | "error" | "info" | null;
}

export default function ExportsPage() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    loading: false,
    message: "",
    type: null,
  });

  const downloadCSV = (filename: string, data: string) => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          })
          .join(",")
      ),
    ].join("\n");

    return csv;
  };

  const handleExportLeads = async () => {
    setExportStatus({ loading: true, message: "Exporting leads...", type: "info" });

    try {
      const { data, error } = await supabase.from("leads").select("*");

      if (error) throw error;

      if (!data || data.length === 0) {
        setExportStatus({
          loading: false,
          message: "No leads to export",
          type: "error",
        });
        return;
      }

      const csv = convertToCSV(data);
      const filename = `leads_${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(filename, csv);

      setExportStatus({
        loading: false,
        message: `✅ Successfully exported ${data.length} leads`,
        type: "success",
      });
    } catch (error) {
      setExportStatus({
        loading: false,
        message: error instanceof Error ? error.message : "Export failed",
        type: "error",
      });
    }
  };

  const handleExportScans = async () => {
    setExportStatus({ loading: true, message: "Exporting scans...", type: "info" });

    try {
      const { data, error } = await supabase
        .from("scan_results")
        .select(
          "id, lead_id, overall_score, ai_presence_score, site_readiness_score, content_authority_score, created_at"
        );

      if (error) throw error;

      if (!data || data.length === 0) {
        setExportStatus({
          loading: false,
          message: "No scans to export",
          type: "error",
        });
        return;
      }

      const csv = convertToCSV(data);
      const filename = `scans_${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(filename, csv);

      setExportStatus({
        loading: false,
        message: `✅ Successfully exported ${data.length} scans`,
        type: "success",
      });
    } catch (error) {
      setExportStatus({
        loading: false,
        message: error instanceof Error ? error.message : "Export failed",
        type: "error",
      });
    }
  };

  const handleExportCombined = async () => {
    setExportStatus({ loading: true, message: "Exporting combined data...", type: "info" });

    try {
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*");

      const { data: scansData, error: scansError } = await supabase
        .from("scan_results")
        .select("*");

      if (leadsError || scansError) throw new Error("Failed to fetch data");

      if (!leadsData) {
        setExportStatus({
          loading: false,
          message: "No data to export",
          type: "error",
        });
        return;
      }

      // Combine leads with their latest scan scores
      const combined = leadsData.map((lead) => {
        const latestScan = scansData?.find((s) => s.lead_id === lead.id);
        return {
          ...lead,
          overall_score: latestScan?.overall_score || "N/A",
          ai_presence_score: latestScan?.ai_presence_score || "N/A",
          site_readiness_score: latestScan?.site_readiness_score || "N/A",
          content_authority_score: latestScan?.content_authority_score || "N/A",
          scanned_at: latestScan?.created_at || "N/A",
        };
      });

      const csv = convertToCSV(combined);
      const filename = `toffeedev_leads_${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(filename, csv);

      setExportStatus({
        loading: false,
        message: `✅ Successfully exported ${leadsData.length} leads with scores`,
        type: "success",
      });
    } catch (error) {
      setExportStatus({
        loading: false,
        message: error instanceof Error ? error.message : "Export failed",
        type: "error",
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Export Data</h1>
        <p className="text-slate-400">
          Download your leads and scan results as CSV files
        </p>
      </div>

      {/* Status Message */}
      {exportStatus.message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            exportStatus.type === "success"
              ? "bg-green-900/20 border-green-700 text-green-300"
              : exportStatus.type === "error"
              ? "bg-red-900/20 border-red-700 text-red-300"
              : "bg-blue-900/20 border-blue-700 text-blue-300"
          }`}
        >
          {exportStatus.message}
        </div>
      )}

      {/* Export Options */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-white mb-2">Export Leads</h3>
          <p className="text-slate-400 text-sm mb-6">
            Download all collected leads with contact information and keywords
          </p>
          <button
            onClick={handleExportLeads}
            disabled={exportStatus.loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {exportStatus.loading ? "Exporting..." : "Download CSV"}
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Export Scans</h3>
          <p className="text-slate-400 text-sm mb-6">
            Download all scan results with scores for each category
          </p>
          <button
            onClick={handleExportScans}
            disabled={exportStatus.loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {exportStatus.loading ? "Exporting..." : "Download CSV"}
          </button>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-bold text-white mb-2">Export Combined</h3>
          <p className="text-slate-400 text-sm mb-6">
            Download leads with their latest scan scores in one file
          </p>
          <button
            onClick={handleExportCombined}
            disabled={exportStatus.loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {exportStatus.loading ? "Exporting..." : "Download CSV"}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-3">📌 About CSV Exports</h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>✓ Files are downloaded in CSV format, compatible with Excel</li>
          <li>✓ Leads export includes: name, email, company, website, keyword, industry</li>
          <li>✓ Scans export includes: scores for AI presence, site readiness, content authority</li>
          <li>✓ Combined export merges both datasets for easier analysis</li>
          <li>✓ Timestamps are included in ISO 8601 format</li>
          <li>✓ Files are generated on-demand from your database</li>
        </ul>
      </div>
    </div>
  );
}
