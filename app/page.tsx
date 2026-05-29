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
    <div style={{ background: 'var(--bg)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '62px',
        background: 'rgba(19, 18, 16, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bdr)'
      }}>
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: 700
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            color: '#fff'
          }}>
            TD
          </div>
          <span style={{ color: '#fff' }}>ToffeeDev</span>
        </a>
      </nav>

      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8rem 2rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Hero Glow Effect */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(232,80,10,0.13) 0%, transparent 65%)',
          zIndex: 0
        }}></div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: 'clamp(52px, 8vw, 100px)',
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            marginBottom: '1.5rem',
            color: 'var(--white)'
          }}>
            Does AI <br />
            <span style={{ color: 'var(--orange)' }}>recommend</span> <br />
            <span style={{ color: 'rgba(255,255,255,.3)' }}>your brand?</span>
          </h1>

          <p style={{
            fontSize: '18px',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--muted)',
            maxWidth: '480px',
            margin: '0 auto 2.5rem'
          }}>
            Find out if ChatGPT, Perplexity, and Google AI recommend your business — in 60 seconds.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: 0,
            marginTop: '4rem',
            border: '1px solid var(--bdr)',
            borderRadius: '14px',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '540px',
            margin: '4rem auto 0'
          }}>
            {[
              { label: 'brand tidak disebut AI sama sekali', value: '73%' },
              { label: 'lebih tinggi intent dari AI search', value: '4.2×' },
              { label: 'brand sudah diaudit ToffeeDev', value: '1.000+' }
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '1.1rem 1rem',
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid var(--bdr)' : 'none'
              }}>
                <div style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--orange)',
                  lineHeight: 1
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginTop: '3px',
                  lineHeight: 1.4
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{
        maxWidth: '6xl',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--muted)',
          marginBottom: '2rem'
        }}>
          Trusted by 700+ companies across Indonesia
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {[
            "🏆 Google Premier Partner 2026",
            "📈 700+ Happy Clients",
            "🚀 9+ Years in SEO",
            "🌍 Serving Indonesia & Beyond",
          ].map((badge, index) => (
            <div key={index} style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Features Preview */}
      <div style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--bdr)',
        padding: '4rem 2rem'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(30px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '2rem',
            textAlign: 'center',
            color: 'var(--white)'
          }}>
            What You'll Learn
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: "🤖",
                title: "AI Platform Presence",
                description: "How often ChatGPT, Perplexity, and other AI platforms mention your brand in relevant searches.",
              },
              {
                icon: "🔧",
                title: "Website AI-Readiness",
                description: "Technical factors that affect how well AI crawlers understand and recommend your website.",
              },
              {
                icon: "⭐",
                title: "Content Authority",
                description: "How trustworthy and authoritative AI considers your content based on industry signals.",
              },
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'var(--bg3)',
                border: '1px solid var(--bdr)',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--white)'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--muted)',
                  lineHeight: 1.65
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
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
        color: 'var(--muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 800,
            color: '#fff'
          }}>
            TD
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>ToffeeDev</span>
        </div>
        <div>© 2025 PT Toffee International · Jakarta, Indonesia</div>
        <div>Google Premier Partner · SEMrush Official Partner · Penyelenggara SEOCon</div>
      </footer>
    </div>
  );
}
