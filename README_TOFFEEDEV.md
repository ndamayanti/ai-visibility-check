# AI Visibility Score Tool - ToffeeDev

A free lead magnet web tool for ToffeeDev that checks how visible your brand is across AI-powered search platforms (ChatGPT, Perplexity, Google AI Overviews, Gemini).

## 🎯 Overview

This tool helps marketing managers discover if their brand appears in AI search results and provides actionable recommendations to improve visibility. It's designed to feed leads into ToffeeDev's paid SEO packages (Rp9M–50M/month).

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (leads + scan results)
- **APIs**: OpenAI (ChatGPT) + Perplexity (real-time web search)
- **Web Scraping**: Cheerio + fetch
- **Deployment**: Vercel
- **Email**: Resend (for PDF reports)

## 📁 Project Structure

```
/app
  /page.tsx                    ← Landing page with form
  /api
    /scan/route.ts             ← Main scan orchestrator
    /results/[scanId]/route.ts ← Get specific scan results
  /results/[scanId]/page.tsx   ← Results display page
/components
  /InputForm.tsx               ← Form component
  /LoadingAnimation.tsx        ← Scanning progress animation
  /ScoreGauge.tsx              ← Circular score display
  /CategoryCard.tsx            ← Category score card
/lib
  /types.ts                    ← TypeScript interfaces
  /supabase.ts                 ← Database client
  /scoring.ts                  ← Score calculation logic
  /site-analyzer.ts            ← Website analysis
  /ai-check.ts                 ← AI platform queries
```

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in required variables:
- `OPENAI_API_KEY` - From OpenAI API
- `PERPLEXITY_API_KEY` - From Perplexity API
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase
- `RESEND_API_KEY` - From Resend

### 2. Database Setup

Run in Supabase SQL editor:
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  keyword TEXT NOT NULL,
  industry TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scan_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  overall_score INTEGER NOT NULL,
  ai_presence_score INTEGER NOT NULL,
  site_readiness_score INTEGER NOT NULL,
  content_authority_score INTEGER NOT NULL,
  ai_presence_data JSONB,
  site_readiness_data JSONB,
  content_authority_data JSONB,
  findings JSONB,
  quick_wins JSONB,
  competitors_found JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## ✅ What's Implemented

- ✅ Landing page with hero section
- ✅ Input form with validation
- ✅ Loading animation with progress
- ✅ Site readiness analysis
- ✅ Content authority assessment  
- ✅ AI presence checking (OpenAI + Perplexity)
- ✅ Scoring logic
- ✅ Results page with visualizations
- ✅ Score gauge and category cards
- ✅ Key findings display
- ✅ Quick wins recommendations
- ✅ Competitor snapshot
- ✅ Dark theme with branding

## 🏗️ Still To Build

1. **Email & PDF**
   - PDF report generation
   - Email sending via Resend
   - Automatic delivery

2. **Share Features**
   - LinkedIn share
   - Twitter share
   - WhatsApp share

3. **Admin Dashboard**
   - Lead management
   - Analytics
   - CSV export

4. **Polish**
   - Rate limiting
   - API caching
   - Error improvements
   - SEO optimization

## 🔑 Key Features

### AI Visibility Check
Queries ChatGPT and Perplexity to see if your brand appears in recommendations.

### Website Analysis
- Schema markup detection
- Content structure evaluation
- Technical SEO signals
- AI-specific readiness (llms.txt, etc)

### Content Authority
- Brand mentions tracking
- Wikipedia/Knowledge Panel checks
- Content depth analysis
- Trust signals assessment

### Smart Scoring
- 0-30: Critical
- 31-50: Needs Work
- 51-70: Average
- 71-85: Good
- 86-100: Excellent

## 🎨 Design

**Colors:**
- Primary: #FF6B35 (Orange)
- Background: #0F172A (Dark Navy)
- Surface: #1E293B (Cards)

**Mobile-First:** Fully responsive, WhatsApp-ready

## 📊 API Endpoints

### POST `/api/scan`
```json
{
  "websiteUrl": "https://yoursite.com",
  "primaryKeyword": "keyword",
  "industry": "Technology",
  "businessName": "Company",
  "email": "you@company.com",
  "name": "Your Name"
}
```

### GET `/api/results/[scanId]`
Returns full scan data with scores and findings.

## 🚨 Important Notes

- **Rate Limiting**: Not yet implemented (add 3/day per email)
- **Caching**: Not yet implemented (cache results 24h)
- **Error Handling**: Graceful degradation in place
- **Mobile**: Fully optimized
- **Responsive**: Desktop, tablet, mobile

## 📈 Next Steps

1. Test the tool end-to-end
2. Add PDF report generation
3. Add email sending
4. Implement share buttons
5. Build admin dashboard
6. Add rate limiting & caching
7. Deploy to Vercel

## 📝 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Perplexity API](https://docs.perplexity.ai)

---

Built for ToffeeDev - Indonesia's Leading AI-First SEO Agency
