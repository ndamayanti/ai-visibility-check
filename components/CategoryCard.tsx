"use client";

import { getScoreBadge, getScoreColor } from "@/lib/scoring";

interface CategoryCardProps {
  title: string;
  icon: string;
  score: number;
  description: string;
  findings: string[];
}

export default function CategoryCard({
  title,
  icon,
  score,
  description,
  findings,
}: CategoryCardProps) {
  const badge = getScoreBadge(score);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${badge.color}`}>{score}</div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${score}%`,
              backgroundColor: getScoreColor(score),
            }}
          ></div>
        </div>
      </div>

      {/* Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${badge.bgColor} ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* Findings */}
      <div className="space-y-2">
        {findings.map((finding, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-slate-400 mt-0.5">•</span>
            <span className="text-slate-300">{finding}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
