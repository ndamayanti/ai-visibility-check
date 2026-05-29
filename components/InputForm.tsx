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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {/* Website URL */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Nama brand atau domain <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <input
          type="url"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleChange}
          placeholder="https://yourcompany.com"
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        />
        {errors.websiteUrl && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.websiteUrl}</p>
        )}
      </div>

      {/* Primary Keyword */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Keyword utama <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <input
          type="text"
          name="primaryKeyword"
          value={formData.primaryKeyword}
          onChange={handleChange}
          placeholder="e.g., agency SEO Jakarta"
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        />
        <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          Apa yang seharusnya AI rekomendasikan untuk kamu?
        </p>
        {errors.primaryKeyword && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.primaryKeyword}</p>
        )}
      </div>

      {/* Industry */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Industri <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        >
          <option value="">Pilih industri</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.industry}</p>
        )}
      </div>

      {/* Business Name */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Nama bisnis <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Nama brand atau perusahaan kamu"
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        />
        {errors.businessName && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.businessName}</p>
        )}
      </div>

      {/* Email */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Email <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        />
        <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--muted)' }}>
          Kami akan mengirim laporan lengkap ke email ini
        </p>
        {errors.email && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.email}</p>
        )}
      </div>

      {/* Name */}
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '8px'
        }}>
          Nama lengkap <span style={{ color: 'var(--orange)' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={isLoading}
          style={{
            width: '100%',
            background: 'var(--bg2)',
            border: '1.5px solid var(--bdr2)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: isLoading ? 0.5 : 1
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--bdr2)'}
        />
        {errors.name && (
          <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--red)' }}>{errors.name}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          maxWidth: '540px',
          background: isLoading ? 'var(--muted2)' : 'var(--orange)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 26px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '15px',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, transform 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isLoading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.currentTarget.style.background = 'var(--orange-h)';
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.currentTarget.style.background = 'var(--orange)';
        }}
      >
        {isLoading ? "Memindai..." : "Cek Sekarang"}
        {!isLoading && (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ marginLeft: '4px' }}>
            <path d="M2.5 7.5h10m-4.5-4.5 4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {errors.submit && (
        <p style={{ fontSize: '12px', color: 'var(--red)', textAlign: 'center', maxWidth: '540px' }}>{errors.submit}</p>
      )}

      <p style={{ fontSize: '12px', color: 'var(--muted2)', textAlign: 'center', maxWidth: '540px' }}>
        ✓ Gratis · ✓ Tanpa daftar · ✓ Hasil instan di halaman ini
      </p>
    </form>
  );
}
