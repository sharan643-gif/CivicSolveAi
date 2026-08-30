# 🏛️ JanSetu AI — Government Innovation Portal

> **India's National Civic-Tech Operating System**
> A full-stack government innovation platform that connects citizens, officials, developers, NGOs, researchers and startups to discover, solve, and implement civic challenges at scale — powered by AI.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-3.1%20Flash--Lite-4285F4?logo=google)](https://aistudio.google.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)

---

## 📋 Table of Contents

1. [What Is JanSetu AI?](#1-what-is-jansetu-ai)
2. [Live Features Overview](#2-live-features-overview)
3. [Quick Start](#3-quick-start)
4. [Environment Variables](#4-environment-variables)
5. [Project Structure](#5-project-structure)
6. [Every File Explained](#6-every-file-explained)
7. [Pages & Routes](#7-pages--routes)
8. [Components Library](#8-components-library)
9. [Services & Data Layer](#9-services--data-layer)
10. [Database Schema](#10-database-schema)
11. [Seed & Cleanup SQL](#11-seed--cleanup-sql)
12. [Authentication & RBAC](#12-authentication--rbac)
13. [AI Integration](#13-ai-integration)
14. [Voice AI Agent](#14-voice-ai-agent)
15. [Mobile Layout](#15-mobile-layout)
16. [Design System](#16-design-system)
17. [Navigation Architecture](#17-navigation-architecture)
18. [Deployment (Vercel)](#18-deployment-vercel)
19. [Troubleshooting](#19-troubleshooting)
20. [Changelog](#20-changelog)

---

## 1. What Is JanSetu AI?

**JanSetu** (Hindi: "Bridge of the People") is a React single-page application that acts as an operating system for civic governance in India. It bridges six stakeholder groups:

| Role | What they do on the platform |
|---|---|
| 🧑 **Citizen** | Report civic challenges, upvote issues, track resolutions |
| 🏛️ **Government Official** | Review, prioritise, assign and resolve challenges |
| 💻 **Developer / Student** | Form teams, propose tech solutions, track deployment |
| 🌱 **NGO Worker** | Field-verify challenges, partner on implementations |
| 🔬 **Researcher** | Analyse trends, export data, publish insights |
| ⚙️ **Admin** | Manage users, roles, AI settings, audit logs |

**Core philosophy:** Every feature degrades gracefully. Even with no internet, no Supabase, and no Gemini API key — the app works using LocalStorage mock data. Real Supabase and Gemini AI data simply enhances the platform when available.

---

## 2. Live Features Overview

### 🎯 Civic Challenge Management
- Submit challenges with title, category, district, description, severity, and attachments
- AI auto-categorisation, duplicate detection, and priority scoring on submit
- Full challenge lifecycle: `reported → under_review → validated → team_formation → active_development → pilot → implemented → resolved`
- Upvote system, comment threads, SLA tracker per challenge
- Challenge DNA card — visual breakdown of root causes, affected population, budget estimate

### 🤖 AI-Powered Features
- **JanSetu AI Assistant** — GPT-like chatbot that answers civic questions, explains government schemes, and guides users through the platform
- **JanSetu Voice Agent** — Speak your challenge; AI transcribes, parses and auto-fills the submission form
- **AI Analysis Hub** — Deep analysis: impact score, feasibility, carbon footprint, economic impact, comparable global cases
- **Duplicate Detector** — Semantic similarity check prevents duplicate challenge submissions
- **AI Team Builder** — Matches developer skills to open challenge requirements
- **AI Copilot Modal** — On any challenge, get an instant AI action plan

### 📊 Analytics & Dashboards
- Live dashboard with stat cards (total challenges, people impacted, teams active, resolved count)
- Geospatial heatmap of challenges across India (district-level)
- Department scorecard — SLA compliance per ministry/department
- District scorecard — performance ranking by district
- Intelligence dashboard — trend forecasts, emerging problem clusters
- Digital twin — simulate the impact of proposed solutions before deployment

### 👥 Collaboration
- Team formation wizard — citizens, developers, NGOs form cross-functional teams
- Collaboration agreement generator
- Expert marketplace — domain experts offer advisory hours
- NGO matching — connect NGOs to relevant challenges in their geography

### 💰 Funding & Solutions
- Solution marketplace — browse, compare, and deploy solutions
- Funding page — CSR, government grants, impact investors
- Impact certificate modal — generate shareable proof-of-impact

### 🔐 Authentication & Roles
- Supabase email/password auth
- Sector-based onboarding (12 sectors, 18 roles)
- Role-Based Access Control (RBAC) with 10 permissions
- Protected routes based on role slug
- Super Admin login at `/super-admin`

### 📱 Mobile-First Design
- Responsive government-portal aesthetic (white + navy + saffron)
- Floating bottom pill navigation bar on mobile
- Compact top header (logo + mic + sign-in only on mobile)
- JanSetu Voice Agent accessible from both header and bottom nav
- AI chatbot positioned above bottom nav to prevent overlap

---

## 3. Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd "civiAi - Copy"

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# → Fill in your Supabase and Gemini keys (see Section 4)

# Start dev server
npm run dev
# → Opens at http://localhost:5180
```

### Build for Production
```bash
npm run build
# Output in /dist — deploy to Vercel / Netlify / any static host
```

---

## 4. Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# ── Supabase ──────────────────────────────────────────
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# ── Google Gemini AI (Server-Side ONLY) ────────────────
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite

# ── App Metadata ──────────────────────────────────────
VITE_APP_NAME=JanSetu AI
VITE_APP_VERSION=2.0.0
```

> **Tip:** The app works without any keys — it falls back to mock data from `src/services/mockData.js` automatically.

---

## 5. Project Structure

```
civiAi - Copy/
├── src/
│   ├── App.jsx                  ← Root app: router, header, all state
│   ├── main.jsx                 ← React entry point
│   ├── index.css                ← Global design system tokens + utilities
│   ├── App.css                  ← App-level overrides
│   │
│   ├── pages/                   ← 36 full-page views (route targets)
│   ├── components/              ← 37 reusable UI components
│   └── services/                ← Data, AI, auth services
│
├── supabase_schema.sql          ← Full PostgreSQL schema (run first)
├── seed_data.sql                ← 10 sample rows per table (run second)
├── cleanup.sql                  ← 3-option erase script
├── wipe_and_seed.sql            ← Combined wipe + re-seed script
│
├── .env                         ← Your secrets (gitignored)
├── .env.example                 ← Template for secrets
├── vite.config.js               ← Vite build config
├── vercel.json                  ← Vercel SPA routing config
└── package.json                 ← Dependencies & scripts
```

---

## 6. Every File Explained

### `src/App.jsx` *(53 KB — the heart of the app)*
The single root component that owns:
- **All route state** — `currentRoute`, `routeParams` (no React Router; pure state-based routing)
- **Auth state** — `currentUser`, `effectiveRole`, `isMobile`
- **Global modals** — Command Palette (Ctrl+K), Voice Agent, Login modal
- **AppHeader component** — top pill navigation bar (inline component at bottom of file)
- **MobilePillNav mount** — renders `<MobilePillNav>` when `isMobile === true`
- **CivicAssistant mount** — the floating AI chatbot
- `handleNavigate(route, params)` — the universal navigation handler

**Adding a new route:** Add a `case 'my-route': return <MyPage />;` to the `renderPage()` switch statement.

### `src/main.jsx`
React root mount. Wraps `<App />` with `React.StrictMode`. Also imports global CSS.

### `src/index.css` *(29 KB — the full design system)*
Contains:
- CSS custom properties (design tokens) under `:root`
- Government color palette: `--primary: #003087` (navy), `--accent: #FF6200` (saffron)
- Typography scale using `Inter` from Google Fonts
- All utility classes: `.btn`, `.card`, `.badge`, `.container`
- Government-specific components: `.gov-stat-card`, `.gov-section-header`
- Animation keyframes: `@keyframes pulse`, `@keyframes spin`, `@keyframes scaleIn`
- Mobile safe-area helpers via `env(safe-area-inset-*)`

---

## 7. Pages & Routes

All pages live in `src/pages/`. They are rendered by `App.jsx`'s `renderPage()` switch.

| Route Key | File | Who Sees It | Description |
|---|---|---|---|
| `landing` | `LandingPage.jsx` | All (desktop) | Hero page with stats, sector cards, recent challenges |
| `landing` | `MobileLandingPage.jsx` | All (mobile) | Mobile-optimised landing with white cards |
| `explore` | `ExplorePage.jsx` | All | Browse + filter all challenges |
| `submit` | `SubmitPage.jsx` | Authenticated | Multi-step challenge submission form + Voice AI auto-fill |
| `detail` | `DetailPage.jsx` | All | Full challenge detail with AI analysis, team, comments |
| `dashboard` | `DashboardPage.jsx` | Official / Admin | Platform management dashboard |
| `profile` | `UserProfilePage.jsx` | Authenticated | View/edit own profile, points, badges |
| `analytics` | `AnalyticsPage.jsx` | Official / Admin | Charts, trends, sector breakdown |
| `geospatial` | `GeospatialAnalyticsPage.jsx` | Official | Interactive India map with challenge heatmap |
| `ai-hub` | `AiAnalysisHubPage.jsx` | All | AI deep-dive on any challenge |
| `solutions` | `SolutionMarketplacePage.jsx` | All | Browse, compare, request solutions |
| `funding` | `FundingPage.jsx` | NGO / Industry | Grants, CSR, impact investor listings |
| `teams` | `ProjectManagementPage.jsx` | Developer / Student | Active teams, tasks, progress |
| `command-center` | `CommandCenterPage.jsx` | Official / Admin | Real-time control panel |
| `intelligence` | `IntelligenceDashboardPage.jsx` | Official | AI trend forecasts |
| `digital-twin` | `DigitalTwinPage.jsx` | Official | Solution impact simulation |
| `scorecard` | `DepartmentScorecardPage.jsx` | Official | Per-department SLA performance |
| `district-scorecard` | `DistrictScorecardPage.jsx` | Official | District-level performance ranking |
| `field-ops` | `FieldOperationsPage.jsx` | NGO / Official | Ground-level operations tracker |
| `leaderboard` | `LeaderboardPage.jsx` | All | Top contributors ranked by points |
| `achievements` | `AchievementsPage.jsx` | Authenticated | Badges and milestone tracker |
| `challenges` | `CivicChallengesPage.jsx` | Citizen | Citizen-centric challenge view |
| `polls` | `CivicPollsPage.jsx` | Citizen | Community polls on civic issues |
| `emerging` | `EmergingProblemsPage.jsx` | Official | Early-warning system for new issue clusters |
| `ngo-matching` | `NgoMatchingPage.jsx` | NGO | Match NGOs to open challenges |
| `expert-marketplace` | `ExpertMarketplacePage.jsx` | All | Find and hire domain experts |
| `research-hub` | `ResearchHubPage.jsx` | Researcher | Data exports, publications, datasets |
| `transparency` | `TransparencyDashboardPage.jsx` | All | Open data — resolution rates, timelines |
| `activity` | `ActivityCenterPage.jsx` | Authenticated | Personal activity feed and notifications |
| `enterprise` | `EnterpriseControlCenter.jsx` | Industry | Corporate engagement hub |
| `judge` | `JudgeModePage.jsx` | Expert / Admin | Score and rank submitted solutions |
| `admin-console` | `MobileAdminConsole.jsx` | Admin (mobile) | Mobile-optimised admin controls |
| `mobile-report` | `MobileReportWizard.jsx` | Citizen (mobile) | Swipe-step challenge report wizard |
| `auth` | `AuthLandingPage.jsx` | Guest | Login/Register entry |
| `auth-sector` | `AuthSectorPage.jsx` | New users | Sector & role selection onboarding |
| `super-admin` | `SuperAdminLogin.jsx` | Admin only | Super-admin login portal |

---

## 8. Components Library

All components live in `src/components/`.

### Navigation
| Component | Purpose |
|---|---|
| `DesktopPillNav.jsx` | Pill-shaped top navigation bar (desktop) |
| `MobilePillNav.jsx` | Floating bottom pill nav with saffron `+` CTA (mobile) |
| `DynamicSidebar.jsx` | Legacy sidebar (desktop only, preserved for compatibility) |
| `CommandMenu.jsx` | Ctrl+K command palette — search all routes and actions |
| `ProtectedRoute.jsx` | Role-gated route wrapper |

### AI Components
| Component | Purpose |
|---|---|
| `CivicAssistant.jsx` | Floating AI chatbot — "JanSetu AI Assistant" |
| `JanSetuVoiceAgent.jsx` | Full-screen voice recording + AI transcription + form auto-fill |
| `AiControlCenter.jsx` | Admin panel to configure AI model settings |
| `AiCopilotModal.jsx` | Per-challenge AI action plan modal |
| `AiTeamBuilder.jsx` | AI skill-matching for team formation |
| `AskJanSetuModal.jsx` | Quick-ask modal for citizens |
| `DuplicateDetector.jsx` | Semantic similarity checker on challenge submission |

### Data Visualisation
| Component | Purpose |
|---|---|
| `ChallengeMap.jsx` | Google-Maps-style district challenge heatmap |
| `GeographicHeatmap.jsx` | SVG India map with district choropleth |
| `CollaborationGraph.jsx` | Force-directed stakeholder collaboration graph |
| `EcosystemCanvas.jsx` | Platform ecosystem diagram |
| `ImpactGraph.jsx` | Timeline chart of challenge impact metrics |
| `ChallengeFunnel.jsx` | Status-wise funnel chart |
| `Aurora.jsx` / `Aurora.css` | Animated gradient background for hero sections |
| `Silk.jsx` | Animated silk-texture background |
| `ScrollExpand.jsx` | Scroll-triggered card expansion animation |

### Challenge Cards & Details
| Component | Purpose |
|---|---|
| `ProblemDnaCard.jsx` | Visual DNA breakdown of a challenge (root cause tree) |
| `SolutionDnaCard.jsx` | Solution DNA — tech stack, feasibility, ROI |
| `ChallengeHealthBadge.jsx` | Colour-coded status pill badge |
| `DeploymentReadinessCard.jsx` | Checklist for solution deployment readiness |
| `RootCauseAnalysis.jsx` | AI-generated root cause fishbone diagram |
| `CapabilityGapCard.jsx` | Skills gap analysis for challenge teams |
| `SlaTracker.jsx` | Days remaining vs SLA deadline indicator |

### UX / Layout
| Component | Purpose |
|---|---|
| `BottomSheet.jsx` | Mobile bottom-sheet slide-up panel |
| `TrustSafetyPanel.jsx` | Verification & safety status display |
| `ImpactCertificateModal.jsx` | Generate shareable impact certificate |
| `CollaborationAgreement.jsx` | Draft and preview collaboration MOU |
| `ProjectWorkspace.jsx` | Kanban-style project board for teams |
| `CapabilityMarketplace.jsx` | Skills marketplace grid |
| `JanSetuLoop.jsx` | Platform feedback loop explainer animation |

---

## 9. Services & Data Layer

All services are in `src/services/`.

### `supabaseClient.js`
Initialises the Supabase JS client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Exported as `supabase`.

### `supabaseService.js` *(12 KB)*
Every database call goes through here. Pattern: **Try Supabase → fallback to mockData**.

```js
export async function getChallenges() {
  const { data, error } = await supabase.from('challenges').select('*');
  if (error || !data?.length) return db.getChallenges(); // fallback
  return data;
}
```

Key exported functions:
- `getChallenges()` / `getChallengeById(id)` / `addChallenge(c)` / `updateChallenge(id, updates)`
- `getProfiles()` / `getProfileById(id)` / `upsertProfile(p)`
- `getTeams()` / `getAuditLogs()` / `getStats()`
- `getOrganizations()` / `getAiSettings()` / `saveAiSettings(s)`
- `addAuditLog(userId, action, targetType, targetId, details)`
- `checkPermission(roleSlug, permissionName)`

### `geminiClientService.js`
Wraps the server-side Google Gemini AI endpoints (`/api/ai/*`) using `@google/genai`. Used by:
- `JanSetuVoiceAgent` — parse spoken challenge into structured JSON
- `SubmitPage` — AI draft generator, automated categorisation, and priority scoring
- `CivicAssistant` — conversational civic assistant chat
- `aiService` — complaint classification and hazard analysis
- `AiCopilotModal` — generate action plans

### `mockData.js`
In-memory fallback database using LocalStorage. Provides identical API to `supabaseService.js`:
- `db.getChallenges()`, `db.saveChallenges(arr)`
- `db.getUsers()`, `db.saveUsers(arr)`
- `db.getTeams()`, `db.getAuditLogs()`, etc.

Pre-seeded with realistic Indian civic challenge data so the app always shows content.

### `authService.js`
Handles Supabase auth: `signIn()`, `signUp()`, `signOut()`, `getSession()`, and the `onAuthStateChange` listener that syncs `currentUser` state in `App.jsx`.

---

## 10. Database Schema

Run **`supabase_schema.sql`** in the Supabase SQL Editor to create all tables.

### Tables

```
auth.users            ← Managed by Supabase Auth (DO NOT create manually)
public.sectors        ← 12 civic sectors (health, education, water...)
public.roles          ← 18 user roles linked to sectors
public.permissions    ← 10 named permissions
public.role_permissions ← Many-to-many: role ↔ permission
public.profiles       ← User profiles (FK → auth.users.id)
public.user_roles     ← Multi-role support per user
public.organizations  ← Govt depts, NGOs, startups, universities
public.organization_members ← Who belongs to which org
public.challenges     ← Core: civic problem reports
public.teams          ← Cross-functional solution teams
public.team_members   ← Who is in which team (with role_title)
public.collaborations ← Team + org + challenge collaboration records
public.audit_logs     ← Full action log for compliance
public.ai_settings    ← Key-value AI model configuration
```

### Key Enums

```sql
challenge_status: reported | under_review | validated | published |
                  team_formation | active_development | prototype |
                  pilot | implemented | resolved

challenge_severity: critical | high | medium | low

verification_level: unverified | pending_verification | verified | suspended

org_type: university | industry | ngo | government |
          startup | incubator | research | funding
```

### Row Level Security (RLS)
All sensitive tables have RLS enabled. Key policies:
- **Profiles**: Anyone can read; only the owner can update their own row
- **Challenges**: Anyone can read; authenticated users can insert; creators/admins can update
- **Audit Logs**: Authenticated users can insert; users can only read their own logs
- **AI Settings**: Anyone can read; admin-only for writes (currently permissive for demo)

---

## 11. Seed & Cleanup SQL

### Run Order
```
1. supabase_schema.sql   ← Creates all tables, enums, indexes, RLS policies
2. seed_data.sql         ← Inserts 10 sample rows per table
```

### `seed_data.sql` — What's included

| Table | Rows | Notes |
|---|---|---|
| `sectors` | 10 | Health, Education, Water, Agriculture, Infra, Governance, Energy, Environment, Transport, Digital |
| `roles` | 10 | Linked to sectors via JOIN |
| `permissions` | 10 | submit_challenge → export_data |
| `role_permissions` | 10 | Key RBAC mappings |
| `organizations` | 10 | Real Indian govt depts, NGOs, startups |
| `auth.users` | 10 | **Must be inserted before profiles** — password: `JanSetu@2024` |
| `profiles` | 10 | Users across India with real districts |
| `challenges` | 10 | Real Indian civic problems |
| `teams` | 10 | One team per challenge |
| `team_members` | 10 | Lead + member per team |
| `audit_logs` | 10 | Action history records |
| `ai_settings` | 10 | Key-value AI config |

### Test Login Credentials
All seed users share the same password:

| Email | Role | State |
|---|---|---|
| `arjun.sharma@example.com` | Citizen | Maharashtra |
| `priya.nair@example.com` | Government Official | Kerala |
| `rohit.verma@example.com` | Developer | Karnataka |
| `sunita.patel@example.com` | NGO Worker | Uttar Pradesh |
| `deepak.iyer@example.com` | Researcher | Delhi |
| `admin@jansetu.gov.in` | **Super Admin** | Delhi |
| `meena.reddy@example.com` | District Coordinator | Telangana |
| `anil.joshi@example.com` | Data Analyst | Rajasthan |
| `kavitha.m@example.com` | Startup Founder | Tamil Nadu |
| `vijay.kumar@example.com` | Observer | Gujarat |

**Password for all:** `JanSetu@2024`

### `cleanup.sql` — Three options

```sql
-- Option A: Wipe all data, keep schema
TRUNCATE TABLE notifications, audit_logs, ... CASCADE;

-- Option B: Delete only seed rows (safe for production)
DELETE FROM public.challenges WHERE id LIKE 'cccccccc-%';
-- ... (all seed UUID patterns)

-- Option C: Drop everything (full reset)
DROP TABLE IF EXISTS challenges CASCADE;
-- ... DROP TYPE IF EXISTS challenge_status CASCADE;
```

---

## 12. Authentication & RBAC

### Auth Flow
```
User clicks Sign In
  → Supabase email/password auth
  → onAuthStateChange fires in App.jsx
  → getProfileById(user.id) fetches profile + role
  → effectiveRole set (e.g. 'citizen', 'official', 'admin')
  → UI re-renders based on role
```

### Role Slugs & Access
| Slug | Dashboard Tab | Key Permissions |
|---|---|---|
| `citizen` | Challenges | submit_challenge, view_analytics |
| `official` | Government Dashboard | review_challenge, approve_solution |
| `developer` / `student` | Teams | propose_solution, manage_teams |
| `ngo_field` / `ngo_admin` | Field Ops | submit_challenge, view_analytics |
| `researcher` | Research Hub | export_data, view_analytics |
| `admin` / `super_admin` | Full Dashboard | All 10 permissions |

### Protected Routes
Use `<ProtectedRoute allowedRoles={['admin','official']}>` to gate any page or section. Falls back to sign-in prompt if the user lacks the required role.

---

## 13. AI Integration

JanSetu uses the **Google Gemini API** (`@google/genai`) with primary free-tier model `gemini-3.1-flash-lite` and automatic fallback model `gemini-2.5-flash-lite`.

### How it's called
All Gemini API calls are securely executed server-side via Vite middleware in local dev and Vercel serverless functions in production:

```js
// server/geminiServerService.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  contents: [...],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    temperature: 0.3,
    maxOutputTokens: 800
  }
});
```

### AI Features Map
| Feature | Where | What It Does |
|---|---|---|
| Challenge Analysis | `AiAnalysisHubPage` | Impact score, feasibility, budget estimate, global precedents |
| Duplicate Detection | `SubmitPage` | Semantic similarity vs existing challenges |
| Priority Scoring | `SubmitPage` + `DashboardPage` | Auto-assign priority on submission |
| Auto-Categorisation | `SubmitPage` | Infer sector from description |
| Team Matching | `AiTeamBuilder` | Match skills to challenge requirements |
| Root Cause Analysis | `RootCauseAnalysis` | AI-generated fishbone diagram |
| Action Plan | `AiCopilotModal` | 5-step action plan per challenge |
| Chat | `CivicAssistant` | Government scheme Q&A, platform guidance |
| Voice Parsing | `JanSetuVoiceAgent` | Speech → structured challenge JSON via Gemini |

---

## 14. Voice AI Agent

**`src/components/JanSetuVoiceAgent.jsx`** provides a full-screen voice interface:

### How It Works
```
User taps 🎙️ mic button (header or bottom nav)
  → JanSetuVoiceAgent modal opens
  → Browser SpeechRecognition API starts listening
  → Waveform animation plays (CSS pulse keyframes)
  → Speech transcript shown in real-time
  → On stop: transcript sent to Google Gemini server endpoint
  → Gemini returns JSON: { title, category, district, description, severity }
  → preFillData state passed to SubmitPage
  → SubmitPage form fields auto-populated
  → User reviews and submits
```

### Browser Support
`window.SpeechRecognition` (Chrome) / `window.webkitSpeechRecognition` (Safari). Not available in Firefox without a polyfill.

### Language Support
Configured for `'hi-IN'` and `'en-IN'` via the `lang` property — works for Hinglish mixed speech.

---

## 15. Mobile Layout

### Breakpoint: `window.innerWidth <= 768`

Detected in `App.jsx`:
```js
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
useEffect(() => {
  const handler = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

### Mobile-Specific Rendering

| Element | Desktop | Mobile |
|---|---|---|
| Top nav | Full pill with all tabs | Compact pill: Logo + 🎙️ + Sign In only |
| Bottom nav | None | `MobilePillNav` (floating pill with 5 tabs + saffron `+`) |
| Landing page | `LandingPage.jsx` | `MobileLandingPage.jsx` |
| Page content | `padding: 32px 24px` | `padding: 16px 14px 110px` (extra bottom for pill nav) |
| AI chatbot | `bottom: 24px` | `bottom: 88px` (above pill nav) |
| Chat panel | `380px × 520px` | `calc(100vw - 28px) × 72vh` |
| Notifications | Visible | Hidden (accessible via nav) |
| Search | Ctrl+K visible | Hidden (accessible via Command Menu) |

### `MobilePillNav.jsx`
```
[🏠 Home] [🔍 Explore] [🟠 +] [💡 Solutions] [📊 Dashboard]
```
- Position: `fixed, bottom: 14px, left: 50%, translateX(-50%)`
- Background: white with navy border + shadow
- Center `+` button: saffron, elevated 10px above bar

---

## 16. Design System

### Color Tokens
```css
--primary:        #003087;  /* Navy blue — government authority */
--primary-light:  #e8eef8;  /* Light navy tint */
--accent:         #FF6200;  /* Saffron orange — India flag accent */
--accent-light:   #fff3eb;  /* Saffron tint */
--bg-primary:     #f8f9fa;  /* Off-white page background */
--bg-secondary:   #ffffff;  /* Card backgrounds */
--text-primary:   #212529;  /* Near-black for headings */
--text-secondary: #495057;  /* Body text */
--text-muted:     #6c757d;  /* Labels, captions */
--border-subtle:  #dee2e6;  /* Light card borders */
--border-medium:  #ced4da;  /* Input borders */
--danger:         #dc3545;  /* Error states */
--success:        #198754;  /* Success states */
--warning:        #fd7e14;  /* Warning states */
```

### Typography
```css
--font-body:    'Inter', system-ui, sans-serif;
--font-display: 'Inter', system-ui, sans-serif;  /* 800 weight for headings */
```
Loaded from Google Fonts in `index.css`.

### Spacing & Radius
```css
--radius-sm: 6px;   /* Tags, small buttons */
--radius-md: 10px;  /* Cards, modals */
--radius-lg: 16px;  /* Large panels */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.12);
--shadow-lg: 0 12px 36px rgba(0,48,135,0.15);
```

### Utility Classes
```css
.btn          /* Base button reset */
.btn-primary  /* Navy background */
.btn-outline  /* Navy border */
.card         /* White card with border */
.badge        /* Inline status pill */
.container    /* Max-width centred wrapper */
.gov-stat-card /* Stat card with top navy accent border */
```

---

## 17. Navigation Architecture

JanSetu uses **state-based routing** — no React Router, no URL changes. Navigation is a single `currentRoute` string in `App.jsx`.

```js
// App.jsx
const [currentRoute, setCurrentRoute] = useState('landing');
const [routeParams, setRouteParams] = useState({});

function handleNavigate(route, params = {}) {
  setCurrentRoute(route);
  setRouteParams(params);
  window.scrollTo(0, 0);
}

function renderPage() {
  switch (currentRoute) {
    case 'landing':  return isMobile ? <MobileLandingPage /> : <LandingPage />;
    case 'explore':  return <ExplorePage />;
    case 'submit':   return <SubmitPage preFillData={preFillData} />;
    case 'detail':   return <DetailPage challengeId={routeParams.id} />;
    // ... 30+ more cases
  }
}
```

### Command Palette (Ctrl+K)
`CommandMenu.jsx` — opens with `Ctrl+K`, lists all routes and actions. Type to search, Enter to navigate. Works on both desktop and mobile.

---

## 18. Deployment (Vercel)

### Steps
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard (same as `.env`)
4. Deploy

### `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This ensures all routes (even `/super-admin`) serve `index.html` (SPA behaviour).

### Build Command
```
npm run build
```
Output: `dist/` — static files ready to serve.

---

## 19. Troubleshooting

### App shows blank screen
- Check browser console for errors
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`
- The app should still load with mock data even without Supabase

### "Failed to run SQL query" errors in Supabase
| Error | Fix |
|---|---|
| `column "description" does not exist` | Check actual column names in `supabase_schema.sql` — roles table has no `description` column |
| `invalid input value for enum challenge_status: "active"` | Use `active_development` not `active` |
| `violates foreign key constraint profiles_id_fkey` | Insert into `auth.users` **before** `public.profiles` (step 6a in `seed_data.sql`) |
| `invalid input value for enum org_type` | Use one of: `university`, `industry`, `ngo`, `government`, `startup`, `incubator`, `research`, `funding` |

### AI features not working
- Check `GEMINI_API_KEY` is set in `.env`
- Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- The app shows a graceful error message and local mock engine if AI is unavailable — other features still work

### Voice agent not activating
- Requires HTTPS or localhost (browser security restriction)
- Only works in Chrome / Edge / Safari — not Firefox
- Check microphone permissions in browser settings

### Mobile layout issues
- The bottom pill nav is `position: fixed` — ensure page content has `padding-bottom: 110px` minimum
- AI chatbot is `bottom: 88px` on mobile to stay above the nav

### Sign In button disappears on mobile
- The `overflow: 'visible'` must be set on the nav `<nav>` element (not `hidden`)
- The spacer `<div style={{flex:1}}/>` between logo and right-section pushes the buttons to the edge

---

## 20. Changelog

### v2.0.0 — August 2026
- ✅ Renamed platform to **JanSetu AI** throughout
- ✅ Added **JanSetu Voice Agent** — speak to auto-fill challenge form
- ✅ New **mobile bottom pill navigation** (floating, aesthetic, saffron CTA)
- ✅ Complete **mobile responsive overhaul** — all 36 pages verified
- ✅ AI chatbot repositioned above pill nav on mobile (`bottom: 88px`)
- ✅ Full **SQL database suite** — schema + seed + cleanup files
- ✅ Government white + navy + saffron design system applied globally
- ✅ Header compacted for mobile — only essential elements shown
- ✅ `pgcrypto` used for bcrypt-hashed seed user passwords

### v1.5.0
- Initial platform launch as CivicSolve AI
- 36 pages, 37 components, Supabase + Google Gemini integration
- Mock data fallback system
- RBAC with 12 sectors and 18 roles

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Follow the existing coding style (vanilla CSS, inline styles for component-specific, index.css for globals)
4. Test on both desktop and mobile (use Chrome DevTools device emulation)
5. Submit a pull request

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ for Indian civic governance</p>
  <p><strong>JanSetu AI</strong> — Connecting citizens to solutions</p>
</div>
