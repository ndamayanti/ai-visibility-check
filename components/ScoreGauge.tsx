"use client";

import { useEffect, useRef } from "react";
import { getScoreColor, getScoreBadge } from "@/lib/scoring";

interface ScoreGaugeProps {
  score: number;
  label?: string;
}

export default function ScoreGauge({ score, label = "AI Visibility Score" }: ScoreGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badge = getScoreBadge(score);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 12;
    ctx.stroke();

    // Draw score arc
    const startAngle = Math.PI + Math.PI / 4;
    const endAngle = startAngle + ((Math.PI * 3) / 2) * (score / 100);

    const gradient = ctx.createLinearGradient(
      centerX - radius,
      centerY,
      centerX + radius,
      centerY
    );
    gradient.addColorStop(0, "#FF6B35");
    gradient.addColorStop(1, "#FFA500");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = getScoreColor(score);
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.stroke();

    // Draw center text
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score.toString(), centerX, centerY - 20);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Inter, sans-serif";
    ctx.fillText("out of 100", centerX, centerY + 20);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="drop-shadow-lg"
      />

      <div className="mt-6 text-center">
        <p className="text-lg text-slate-400 mb-2">{label}</p>
        <div className={`inline-block px-4 py-2 rounded-full border ${badge.bgColor}`}>
          <span className={`font-semibold ${badge.color}`}>{badge.label}</span>
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-6 text-center max-w-sm">
        <p className="text-slate-300">
          {score >= 86
            ? "🎉 Your brand is highly visible in AI search results. Great job maintaining strong AI presence!"
            : score >= 71
            ? "✅ Your brand has good visibility in AI search. There's room for optimization."
            : score >= 51
            ? "⚠️ Your brand has moderate visibility. Implementation of quick wins could help significantly."
            : score >= 31
            ? "❌ Your brand has low visibility in AI search. Consider the quick wins below to improve."
            : "🚨 Your brand is not visible in AI search results. Urgent action needed."}
        </p>
      </div>
    </div>
  );
}
