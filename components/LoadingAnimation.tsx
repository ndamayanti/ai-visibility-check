"use client";

import { useEffect, useState } from "react";

interface Step {
  label: string;
  progress: number;
  completed: boolean;
}

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const steps: Step[] = [
    { label: "Checking AI search platforms...", progress: 30, completed: false },
    { label: "Analyzing your website structure...", progress: 60, completed: false },
    { label: "Evaluating content authority...", progress: 85, completed: false },
    { label: "Calculating your AI Visibility Score...", progress: 100, completed: false },
  ];

  useEffect(() => {
    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setOverallProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 8000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-10 blur-lg animate-pulse delay-100"></div>
            <div className="relative w-full h-full rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 animate-spin flex items-center justify-center">
              <div className="text-3xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Main Text */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Scanning Your AI Visibility
        </h2>
        <p className="text-slate-400 text-center mb-8">
          We're checking ChatGPT, Perplexity, and other AI platforms...
        </p>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div key={index}>
              <div
                className={`flex items-center gap-3 mb-2 transition-all duration-300 ${
                  index <= currentStep ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {index < currentStep ? "✓" : index === currentStep ? "⟳" : index + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index <= currentStep ? "text-white" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden ml-9">
                <div
                  className={`h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ${
                    index < currentStep ? "w-full" : index === currentStep ? "animate-pulse" : "w-0"
                  }`}
                  style={{
                    width:
                      index === currentStep
                        ? `${(overallProgress - (index * 25)) / 0.25}%`
                        : index < currentStep
                        ? "100%"
                        : "0%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-sm font-bold text-orange-500">
              {Math.round(Math.min(overallProgress, 95))}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
              style={{ width: `${Math.min(overallProgress, 95)}%` }}
            ></div>
          </div>
        </div>

        {/* Estimated Time */}
        <p className="text-center text-xs text-slate-500">
          ⏱️ Estimated time: 30-60 seconds
        </p>
      </div>
    </div>
  );
}
