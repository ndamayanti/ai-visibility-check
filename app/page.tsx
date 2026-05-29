"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputForm from "@/components/InputForm";
import LoadingAnimation from "@/components/LoadingAnimation";
import { ScanInput } from "@/lib/types";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: ScanInput) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to scan");
      }

      const data = await response.json();

      // Store scan results in localStorage for retrieval on results page
      if (typeof window !== 'undefined') {
        localStorage.setItem(`scan_${data.scanId}`, JSON.stringify(data));
      }

      // Redirect to results page
      router.push(`/results/${data.scanId}`);
    } catch (error) {
      console.error("Submission error:", error);
      setIsLoading(false);
      alert("Failed to complete scan. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071E22] via-[#0d2530] to-[#071E22]">
      {/* Navigation */}
      <nav className="border-b border-[#1a3a40] sticky top-0 z-50 bg-[#071E22]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded bg-[#FF3506] flex items-center justify-center text-white text-xs font-bold">
              TD
            </div>
            <span className="text-white">ToffeeDev</span>
          </a>
          <div className="text-sm text-slate-400">
            Google Premier Partner 2026
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Is Your Brand Visible in AI Search?
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Find out if ChatGPT, Perplexity, and Google AI recommend your business — in 60 seconds.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                "Check AI search visibility across 2+ platforms",
                "Analyze your website's AI-readiness",
                "Get actionable recommendations",
                "See which competitors AI recommends instead",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF3506] flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-slate-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <p className="text-sm text-slate-400">
              ⏱️ Takes about 30-60 seconds • 100% free • No credit card required
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#0d2530] border border-[#1a3a40] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Quick Visibility Check
            </h2>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-16 border-t border-[#1a3a40]">
          <p className="text-center text-sm text-slate-400 mb-8">
            Trusted by 700+ companies across Indonesia
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              "🏆 Google Premier Partner 2026",
              "📈 700+ Happy Clients",
              "🚀 9+ Years in SEO",
              "🌍 Serving Indonesia & Beyond",
            ].map((badge, index) => (
              <div key={index} className="text-slate-300 text-sm">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-[#0d2530]/50 border-t border-[#1a3a40] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Platform Presence",
                description:
                  "How often ChatGPT, Perplexity, and other AI platforms mention your brand in relevant searches.",
              },
              {
                icon: "🔧",
                title: "Website AI-Readiness",
                description:
                  "Technical factors that affect how well AI crawlers understand and recommend your website.",
              },
              {
                icon: "⭐",
                title: "Content Authority",
                description:
                  "How trustworthy and authoritative AI considers your content based on industry signals.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-[#0f3a45]/50 border border-[#1a5a65] rounded-xl p-6">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a3a40] py-8 bg-[#071E22]">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Made by ToffeeDev • Indonesia's Leading AI-First SEO Agency</p>
          <p className="mt-2">
            This free tool is powered by ToffeeDev's proprietary AI analysis technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
