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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to scan");
      }

      const data = await response.json();

      if (typeof window !== "undefined") {
        localStorage.setItem(`scan_${data.scanId}`, JSON.stringify(data));
      }

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
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Navigation ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '62px',
        background: 'rgba(19,18,16,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bdr)',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '8px',
            background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800, color: '#fff',
          }}>TD</div>
          <span style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>ToffeeDev</span>
        </a>

        {/* CTA button */}
        <a
          href="#hero-form"
          style={{
            background: 'var(--orange)',
            color: '#fff',
            borderRadius: '99px',
            padding: '9px 20px',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange-h)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
        >
          Cek Brand Gratis
        </a>
      </nav>

      {/* ── Hero ── */}
      <section
        id="hero-form"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '7rem 2rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid texture */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* Orange glow */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '860px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(232,80,10,0.22) 0%, rgba(232,80,10,0.06) 45%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', width: '100%' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(232,80,10,0.08)',
            border: '1px solid rgba(232,80,10,0.25)',
            borderRadius: '99px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#f0904a',
            marginBottom: '2rem',
            letterSpacing: '0.02em',
          }}>
            <span style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: 'var(--orange)',
              display: 'inline-block',
            }} />
            Free AI Visibility Audit &nbsp;·&nbsp; Hasil Instan
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(56px, 9vw, 108px)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            marginBottom: '1.75rem',
          }}>
            <span style={{ color: '#fff', display: 'block' }}>Does AI</span>
            <span style={{ color: 'var(--orange)', display: 'block' }}>recommend</span>
            <span style={{ color: 'rgba(255,255,255,0.28)', display: 'block' }}>your brand?</span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: 1.7,
            color: 'var(--muted)',
            maxWidth: '460px',
            margin: '0 auto 2.5rem',
          }}>
            Saat calon customer bertanya ke ChatGPT atau Gemini,
            apakah nama kamu yang muncul — atau nama kompetitor?
          </p>

          {/* Form */}
          <div style={{ marginBottom: '3.5rem' }}>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            border: '1px solid var(--bdr)',
            borderRadius: '14px',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            {[
              { value: '73%', label: 'brand tidak disebut AI sama sekali' },
              { value: '4.2×', label: 'lebih tinggi intent dari AI search' },
              { value: '1.000+', label: 'brand sudah diaudit ToffeeDev' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '1.2rem 1rem',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid var(--bdr)' : 'none',
              }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2rem' }}>
          Trusted by 700+ companies across Indonesia
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem 3rem',
        }}>
          {[
            "🏆 Google Premier Partner 2026",
            "📈 700+ Happy Clients",
            "🚀 9+ Years in SEO",
            "🌍 Serving Indonesia & Beyond",
          ].map((b, i) => (
            <span key={i} style={{ fontSize: '13px', color: 'var(--muted)' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bdr)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textAlign: 'center',
            color: '#fff',
            marginBottom: '2.5rem',
          }}>
            What You&apos;ll Learn
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { icon: "🤖", title: "AI Platform Presence", desc: "How often ChatGPT, Perplexity, and other AI platforms mention your brand in relevant searches." },
              { icon: "🔧", title: "Website AI-Readiness", desc: "Technical factors that affect how well AI crawlers understand and recommend your website." },
              { icon: "⭐", title: "Content Authority", desc: "How trustworthy and authoritative AI considers your content based on industry signals." },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'var(--bg3)',
                border: '1px solid var(--bdr)',
                borderRadius: '14px',
                padding: '1.75rem',
              }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--bdr)',
        padding: '1.6rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '13px',
        color: 'var(--muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            borderRadius: '6px',
            background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 800, color: '#fff',
          }}>TD</div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>ToffeeDev</span>
        </div>
        <div>© 2025 PT Toffee International · Jakarta, Indonesia</div>
        <div>Google Premier Partner · SEMrush Official Partner · Penyelenggara SEOCon</div>
      </footer>
    </div>
  );
}
