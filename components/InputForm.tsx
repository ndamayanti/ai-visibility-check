"use client";

import { useState } from "react";
import { INDUSTRIES } from "@/lib/types";

interface FormData {
  websiteUrl: string;
  primaryKeyword: string;
  industry: string;
  businessName: string;
  email: string;
  name: string;
}

interface InputFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    websiteUrl: "",
    primaryKeyword: "",
    industry: "",
    businessName: "",
    email: "",
    name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.websiteUrl) newErrors.websiteUrl = "Website URL is required";
    else if (!formData.websiteUrl.startsWith("http"))
      newErrors.websiteUrl = "Must start with http:// or https://";

    if (!formData.primaryKeyword)
      newErrors.primaryKeyword = "Primary keyword is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.businessName)
      newErrors.businessName = "Business name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address";
    if (!formData.name) newErrors.name = "Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: "Failed to submit form. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Website URL */}
      <div>
        <label
          htmlFor="websiteUrl"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Website URL <span className="text-[#FF3506]">*</span>
        </label>
        <input
          id="websiteUrl"
          type="url"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://yourcompany.com"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        />
        {errors.websiteUrl && (
          <p className="mt-1 text-sm text-red-500">{errors.websiteUrl}</p>
        )}
      </div>

      {/* Primary Keyword */}
      <div>
        <label
          htmlFor="primaryKeyword"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Primary Keyword <span className="text-[#FF3506]">*</span>
        </label>
        <input
          id="primaryKeyword"
          type="text"
          name="primaryKeyword"
          value={formData.primaryKeyword}
          onChange={handleChange}
          placeholder="e.g., best CRM software Jakarta"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        />
        <p className="mt-1 text-sm text-slate-400">
          What should AI recommend you for?
        </p>
        {errors.primaryKeyword && (
          <p className="mt-1 text-sm text-red-500">{errors.primaryKeyword}</p>
        )}
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Industry <span className="text-[#FF3506]">*</span>
        </label>
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-500">{errors.industry}</p>
        )}
      </div>

      {/* Business Name */}
      <div>
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Business Name <span className="text-[#FF3506]">*</span>
        </label>
        <input
          id="businessName"
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Your company or brand name"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Email <span className="text-[#FF3506]">*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        />
        <p className="mt-1 text-sm text-slate-400">
          We'll send your full report here
        </p>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Your Name <span className="text-[#FF3506]">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#0d2530] border border-[#1a3a40] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3506] disabled:opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#FF3506] to-[#E63000] hover:from-[#E63000] hover:to-[#CC2A00] disabled:from-[#1a3a40] disabled:to-[#0d2530] text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Scanning..." : "Check My AI Visibility"}
      </button>

      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}

      <p className="text-center text-sm text-slate-400">
        ⏱️ This takes about 30-60 seconds
      </p>
    </form>
  );
}
