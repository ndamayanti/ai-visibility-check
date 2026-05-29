"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryCard from "@/components/CategoryCard";
import { ScanResult, Finding } from "@/lib/types";
import { getScoreBadge } from "@/lib/scoring";

export default function ResultsPage() {
  const params = useParams();
  const scanId = params?.scanId as string;
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    const fetchResults = async () => {
      try {
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem(`scan_${scanId}`);
          if (cached) {
            const data = JSON.parse(cached);
            setResult({
              id: data.scanId,
              leadId: data.leadId,
              overallScore: data.overallScore,
              aiPresenceScore: data.aiPresenceScore,
              siteReadinessScore: data.siteReadinessScore,
              contentAuthorityScore: data.contentAuthorityScore,
              aiPresenceData: data.aiPresenceData,
              siteReadinessData: data.siteReadinessData,
              contentAuthorityData: data.contentAuthorityData,
              findings: data.findings,
              quickWins: data.quickWins,
              competitorsFound: data.competitorsFound,
              createdAt: new Date(),
            });
            setLoading(false);
            return;
          }
        }

        const response = await fetch(`/api/results/${scanId}`);
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</div>
          <p style={{ color: '#fff', fontSize: '18px' }}>Memproses hasil audit...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--red)', fontSize: '18px' }}>Error: {error || "No results found"}</p>
          <a href="/" style={{ color: 'var(--orange)', marginTop: '1rem', display: 'inline-block', textDecoration: 'underline' }}>
            Kembali ke beranda
          </a>
        </div>
      </div>
    );
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

      {/* Score Banner */}
      <div style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--bdr)',
        borderBottom: '1px solid var(--bdr)',
        padding: '3.5rem 2rem',
        marginTop: '62px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--muted)', marginBottom: '.5rem' }}>
              Laporan AI Visibility Audit
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-.02em', marginBottom: '.25rem' }}>
              —
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '99px',
                background: 'var(--orange-dim)',
                color: '#f0904a',
                border: '1px solid var(--orange-bdr)'
              }}>
                Cukup Baik
              </div>
              <div style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '380px', lineHeight: 1.6 }}>
                Brand ini sudah punya dasar yang baik di AI. Fokus pada niche tertentu bisa mendorong score lebih tinggi.
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ScoreGauge score={result.overallScore} />
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>
              AI Visibility Score
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2.5rem 2rem'
      }}>
        {/* Category Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <CategoryCard
            title="AI Search Presence"
            icon="🤖"
            score={result.aiPresenceScore}
            description="Seberapa sering AI platform menyebut brand kamu"
            findings={[
              result.aiPresenceData.summary,
              `Diperiksa di ${result.aiPresenceData.platformResults.length} platform AI`,
            ]}
          />
          <CategoryCard
            title="Website AI-Readiness"
            icon="🔧"
            score={result.siteReadinessScore}
            description="Seberapa baik struktur website untuk AI"
            findings={[
              `${result.siteReadinessData.schemaTypes.length} tipe schema ditemukan`,
              result.siteReadinessData.hasLLMsTxt
                ? "✓ llms.txt dikonfigurasi"
                : "✗ Belum ada llms.txt",
              result.siteReadinessData.hasMetaDescription
                ? "✓ Meta descriptions ada"
                : "✗ Belum ada meta descriptions",
            ]}
          />
          <CategoryCard
            title="Content Authority"
            icon="⭐"
            score={result.contentAuthorityScore}
            description="Kredibilitas content menurut AI"
            findings={[
              result.contentAuthorityData.hasAboutPage
                ? "✓ About page ada"
                : "✗ Belum ada about page",
              result.contentAuthorityData.hasTestimonials
                ? "✓ Testimonial ada"
                : "✗ Belum ada testimonial",
              result.contentAuthorityData.hasCaseStudies
                ? "✓ Case studies ada"
                : "✗ Belum ada case studies",
            ]}
          />
        </div>

        {/* Key Findings */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            color: 'var(--muted)',
            marginTop: '1.5rem'
          }}>
            Key Findings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.findings.map((finding: Finding, index: number) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ fontSize: '20px', flexShrink: 0 }}>
                    {finding.type === "success"
                      ? "✅"
                      : finding.type === "warning"
                      ? "⚠️"
                      : "❌"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '3px', color: '#fff' }}>
                      {finding.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '14px' }}>
                      {finding.description}
                    </p>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: 'var(--green-dim)',
                      color: 'var(--green)',
                      border: '1px solid var(--green-bdr)',
                      padding: '4px 12px',
                      borderRadius: '99px'
                    }}>
                      ↑ +{finding.impact} estimasi
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Wins */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            color: 'var(--muted)',
            marginBottom: '1rem',
            marginTop: '1.5rem'
          }}>
            Top 3 Quick Wins
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.quickWins.map((win, index: number) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--bdr)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--orange-dim)',
                    border: '1px solid var(--orange-bdr)',
                    color: 'var(--orange)',
                    fontSize: '16px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '3px', color: '#fff' }}>
                      {win.title}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>
                      Content Authority
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '14px', paddingLeft: '50px' }}>
                  {win.description}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', paddingLeft: '50px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: 'var(--green-dim)',
                    color: 'var(--green)',
                    border: '1px solid var(--green-bdr)',
                    padding: '4px 12px',
                    borderRadius: '99px'
                  }}>
                    ↑ {win.estimatedImpact}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Effort: {win.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitors */}
        {result.competitorsFound.length > 0 && (
          <div style={{
            marginBottom: '2rem',
            background: 'var(--red-dim)',
            border: '1px solid var(--red-bdr)',
            borderRadius: '14px',
            padding: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '.25rem',
              color: '#fff'
            }}>
              ⚠️ Kompetitor yang Muncul di AI
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Ketika AI ditanya tentang keyword kamu, kompetitor ini yang muncul:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px'
            }}>
              {result.competitorsFound.slice(0, 5).map((competitor, index) => (
                <div key={index} style={{
                  background: 'var(--bg2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,.7)'
                }}>
                  {index + 1}. {competitor}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div style={{
          background: 'var(--bg2)',
          borderTop: '1px solid var(--bdr)',
          padding: '3rem 2rem',
          marginTop: '2rem'
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-.01em', marginBottom: '.5rem', color: '#fff' }}>
                Mau score naik dari <span style={{ color: 'var(--orange)' }}>{result.overallScore}</span> ke 80+?
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '460px' }}>
                Tim ToffeeDev siap bantu buat strategi GEO (Generative Engine Optimization) yang konkret. Konsultasi pertama gratis, tanpa komitmen.
              </p>
            </div>
            <button style={{
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s, transform 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--orange-h)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--orange)'}
            >
              Konsultasi Gratis
            </button>
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
