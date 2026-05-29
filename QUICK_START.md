# Quick Start Guide - AI Visibility Score Tool

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
Already done! The project is set up with all required packages.

### Step 2: Configure Environment

Copy the example file and add your credentials:
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
```
OPENAI_API_KEY=your_openai_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_key_here (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run SQL in the SQL Editor:

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
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
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

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_scan_results_lead_id ON scan_results(lead_id);
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Test the Tool

1. Fill out the form:
   - Website URL: `https://toffeedev.com` (or any website)
   - Primary Keyword: `best SEO agency Jakarta`
   - Industry: Select one
   - Business Name: `ToffeeDev`
   - Email: `test@example.com`
   - Name: `John Doe`

2. Click "Check My AI Visibility"

3. Wait 30-60 seconds for scan to complete

4. View results page with all analysis

## 📁 Project Structure at a Glance

```
ai-visibility-check/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── layout.tsx            ← Root layout
│   ├── globals.css           ← Global styles
│   ├── api/
│   │   ├── scan/route.ts     ← POST /api/scan
│   │   └── results/[scanId]/
│   │       └── route.ts      ← GET /api/results/:scanId
│   └── results/[scanId]/
│       └── page.tsx          ← Results display
├── components/
│   ├── InputForm.tsx         ← Form component
│   ├── LoadingAnimation.tsx   ← Progress animation
│   ├── ScoreGauge.tsx        ← Score visualization
│   └── CategoryCard.tsx      ← Category cards
├── lib/
│   ├── types.ts              ← TypeScript types
│   ├── supabase.ts           ← Database client
│   ├── scoring.ts            ← Scoring logic
│   ├── site-analyzer.ts      ← Website analysis
│   └── ai-check.ts           ← AI API queries
└── public/                   ← Static assets
```

## 🔑 API Keys Needed

### 1. OpenAI API Key
- Get from: https://platform.openai.com/api-keys
- Used for ChatGPT queries
- Model: `gpt-4o-mini`

### 2. Perplexity API Key
- Get from: https://www.perplexity.ai/api
- Used for real-time web search presence checks
- Model: `sonar`

### 3. Supabase Credentials
- Create project: https://supabase.com
- Get URL and anon key from project settings
- Already created tables above

### 4. Resend API Key (Optional, Phase 2)
- Get from: https://resend.com
- Used for sending PDF reports via email
- Not required for core functionality

## 🧪 Testing Scenarios

### Test 1: Full Happy Path
- Input any real website URL
- Fill all fields correctly
- Watch loading animation
- See complete results page

### Test 2: Invalid URL
- Try: `invalid-url`
- Should show error: "Must start with http:// or https://"
- Form shouldn't submit

### Test 3: Missing Fields
- Leave email blank
- Try to submit
- Should show error: "Email is required"

### Test 4: Results Page
- After successful scan, redirect works
- Results load correctly
- All three scores display
- Findings and quick wins visible
- Competitor snapshot shown
- CTA section prominent

## 🔍 What Gets Analyzed

### AI Presence Check
- Queries ChatGPT with 5 different prompts
- Queries Perplexity for real-time web data
- Checks if your brand/domain is mentioned
- Tracks position (1st, 2nd, 3rd, etc.)
- Identifies competitors mentioned

### Site Readiness
- Schema markup (JSON-LD, microdata)
- Content structure (H1-H6 hierarchy)
- Technical signals (HTTPS, sitemap, robots.txt)
- AI-specific (llms.txt, citability, entity clarity)

### Content Authority
- Brand mention count estimation
- Wikipedia/Knowledge Panel presence
- Blog post count & content depth
- Trust signals (about page, team page, testimonials, case studies)

## 📊 Scoring Breakdown

```
AI Presence Score (0-100)
├─ Mentioned in top position: 10 pts
├─ Mentioned anywhere: 7 pts
└─ Domain cited as source: 4 pts

Site Readiness Score (0-100)
├─ Schema markup: 25 pts max
├─ Content structure: 25 pts max
├─ Technical signals: 25 pts max
└─ AI-specific: 25 pts max

Content Authority Score (0-100)
├─ Brand visibility: 40 pts max
├─ Content depth: 30 pts max
└─ Trust signals: 30 pts max

Overall = (AI + Site + Authority) / 3
```

## 🎨 Customization

### Brand Colors
Edit `lib/scoring.ts`:
```typescript
// Change score colors
export function getScoreColor(score: number): string {
  // Colors for 0-100 range
}
```

Edit `app/globals.css`:
```css
:root {
  --primary: #FF6B35; /* Change here */
  --background: #0F172A;
}
```

### Form Fields
Edit `components/InputForm.tsx`:
```typescript
// Add/remove fields
// Customize validation
// Change placeholders
```

### Results Sections
Edit `app/results/[scanId]/page.tsx`:
```typescript
// Customize findings display
// Change CTA wording
// Add/remove sections
```

## 🐛 Troubleshooting

### "Supabase connection failed"
- Check your `.env.local` credentials
- Verify URL format: `https://xxxxx.supabase.co`
- Check anon key is correct

### "OpenAI API error"
- Verify API key is valid
- Check you have credits in OpenAI account
- Try with `gpt-4o-mini` (cheaper model)

### "Perplexity API error"
- Verify API key is correct
- Check Perplexity account has credits
- Try Perplexity API docs for model updates

### "Fetch timeout"
- Website might be slow to load
- Check if URL is accessible
- Timeout is set to 10 seconds

## 📈 Next Steps After Setup

1. ✅ Test the complete flow locally
2. ⏳ Add PDF report generation (`@react-pdf/renderer`)
3. ⏳ Add email sending (Resend)
4. ⏳ Add share buttons (LinkedIn, Twitter, WhatsApp)
5. ⏳ Build admin dashboard
6. ⏳ Deploy to Vercel
7. ⏳ Set up monitoring & analytics

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel
- [ ] Supabase production database configured
- [ ] API keys rotated and secured
- [ ] Email service configured (Resend)
- [ ] Rate limiting implemented
- [ ] Error logging set up
- [ ] Analytics added
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] Monitoring alerts set up

## 📞 Support

For issues, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- OpenAI API Docs: https://platform.openai.com/docs
- Tailwind CSS: https://tailwindcss.com

## ✨ Features Roadmap

### Released ✅
- Landing page with hero
- Form with validation
- Loading animation
- AI presence checking
- Site readiness analysis
- Content authority assessment
- Results page with visualizations
- Supabase integration

### Coming Soon 🔄
- PDF report generation
- Email delivery
- Share buttons
- Admin dashboard
- Rate limiting
- API caching
- Bilingual support (EN/ID)
- Google Analytics
- More AI platforms (Google, Gemini)

---

**ToffeeDev AI Visibility Score Tool**
Built with ❤️ for Indonesian businesses
