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
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    websiteUrl: "",
    primaryKeyword: "",
    industry: "",
    businessName: "",
    email: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.websiteUrl) {
      setErrors({ websiteUrl: "URL wajib diisi" });
      return;
    }
    if (!formData.websiteUrl.startsWith("http")) {
      setErrors({ websiteUrl: "Harus diawali http:// atau https://" });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.primaryKeyword) newErrors.primaryKeyword = "Keyword utama wajib diisi";
    if (!formData.industry) newErrors.industry = "Industri wajib dipilih";
    if (!formData.businessName) newErrors.businessName = "Nama bisnis wajib diisi";
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!formData.email.includes("@")) newErrors.email = "Email tidak valid";
    if (!formData.name) newErrors.name = "Nama wajib diisi";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: "Gagal submit form. Coba lagi." });
    }
  };

  /* ── Step 1: single inline input in hero ── */
  if (step === 1) {
    return (
      <form onSubmit={handleStep1Submit} style={{ width: '100%' }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          maxWidth: '580px',
          margin: '0 auto',
        }}>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="Nama brand atau domain kamu..."
            disabled={isLoading}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              borderRadius: '12px',
              padding: '16px 20px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              color: '#fff',
              outline: 'none',
              minWidth: 0,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(232,80,10,0.6)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 26px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--orange-h)'; }}
            onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--orange)'; }}
          >
            Cek Sekarang
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {errors.websiteUrl && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--red)', textAlign: 'center' }}>
            {errors.websiteUrl}
          </p>
        )}
        <p style={{ marginTop: '14px', fontSize: '12px', color: 'var(--muted2)', textAlign: 'center', letterSpacing: '0.01em' }}>
          ✓ Gratis &nbsp;·&nbsp; ✓ Tanpa daftar &nbsp;·&nbsp; ✓ Hasil instan di halaman ini
        </p>
      </form>
    );
  }

  /* ── Step 2: modal overlay with remaining fields ── */
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--bdr2)',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--orange-dim)',
            border: '1px solid var(--orange-bdr)',
            borderRadius: '99px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#f0904a',
            marginBottom: '12px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }}></span>
            Langkah 2 dari 2
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '4px' }}>
            Satu langkah lagi!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Scanning: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{formData.websiteUrl}</span>
          </p>
        </div>

        <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Keyword */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
              Keyword utama <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              type="text" name="primaryKeyword" value={formData.primaryKeyword}
              onChange={handleChange} placeholder="e.g., agency SEO Jakarta" disabled={isLoading}
              style={{ width: '100%', background: 'var(--bg3)', border: '1.5px solid var(--bdr2)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#fff', outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr2)')}
            />
            {errors.primaryKeyword && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{errors.primaryKeyword}</p>}
          </div>

          {/* Industry */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
              Industri <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <select
              name="industry" value={formData.industry} onChange={handleChange} disabled={isLoading}
              style={{ width: '100%', background: 'var(--bg3)', border: '1.5px solid var(--bdr2)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: formData.industry ? '#fff' : 'var(--muted2)', outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr2)')}
            >
              <option value="">Pilih industri</option>
              {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            {errors.industry && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{errors.industry}</p>}
          </div>

          {/* Business Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
              Nama bisnis <span style={{ color: 'var(--orange)' }}>*</span>
            </label>
            <input
              type="text" name="businessName" value={formData.businessName}
              onChange={handleChange} placeholder="Nama brand atau perusahaan kamu" disabled={isLoading}
              style={{ width: '100%', background: 'var(--bg3)', border: '1.5px solid var(--bdr2)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#fff', outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr2)')}
            />
            {errors.businessName && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{errors.businessName}</p>}
          </div>

          {/* Email + Name side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
                Email <span style={{ color: 'var(--orange)' }}>*</span>
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@company.com" disabled={isLoading}
                style={{ width: '100%', background: 'var(--bg3)', border: '1.5px solid var(--bdr2)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#fff', outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr2)')}
              />
              {errors.email && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '6px' }}>
                Nama lengkap <span style={{ color: 'var(--orange)' }}>*</span>
              </label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="John Doe" disabled={isLoading}
                style={{ width: '100%', background: 'var(--bg3)', border: '1.5px solid var(--bdr2)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: '#fff', outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr2)')}
              />
              {errors.name && <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--red)' }}>{errors.name}</p>}
            </div>
          </div>

          {errors.submit && (
            <p style={{ fontSize: '12px', color: 'var(--red)', textAlign: 'center' }}>{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? 'var(--muted2)' : 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--orange-h)'; }}
            onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = 'var(--orange)'; }}
          >
            {isLoading ? "Memindai..." : "Mulai Scan Sekarang →"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={isLoading}
            style={{
              background: 'transparent',
              color: 'var(--muted)',
              border: 'none',
              padding: '6px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            ← Ubah URL
          </button>
        </form>
      </div>
    </div>
  );
}
