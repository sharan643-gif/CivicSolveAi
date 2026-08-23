# 🏛️ CivicSolve AI — National Societal Innovation Platform

> **CivicSolve AI** is an enterprise-grade, multi-sector government innovation operating system designed to streamline civic challenge reporting, automated AI prioritization, cross-sector team formation, SLA tracking, and CSR funding deployment.

---

## 🌟 Key Highlights & Features

### 🚀 1. 12 Dedicated Sector Portals & 30+ Specialized Roles
CivicSolve AI provides tailormade UI views, workflows, and role-based access control (RBAC) across 12 distinct sectors:
- 👤 **Citizens & Community**: Report local infrastructure/water/environmental issues, vote, and support solutions.
- 🏛️ **Government Departments**: Validate reported challenges, assign SLA targets, coordinate pilots, and approve solutions.
- 🎓 **Universities & Colleges**: Manage student engineering cohorts, oversee university capabilities, and track IP.
- 💻 **Students & Developers**: Form developer cohorts, submit GitHub repositories, and build prototype solutions.
- 🏢 **Industry & Corporate**: Sponsor prototypes, supply IoT/GIS telemetry data APIs, and mentor technical teams.
- 🕵️ **Experts & Mentors**: Grade technical feasibility, perform expert evaluations, and review engineering proposals.
- 🤝 **NGOs & Field Partners**: Verify ground-level social impact, track beneficiaries, and report field telemetry.
- 🚀 **Startups & Innovators**: Pitch commercial products, apply for government pilot programs, and scale solutions.
- 🌱 **Incubators & Accelerators**: Mentor startup cohorts, manage pitch funnels, and recommend seed funding.
- 🔬 **Research Organizations**: Submit deep-tech research proposals and collaborate on scientific challenges.
- 💰 **CSR & Funding Partners**: Discover high-impact projects, release milestone funding, and audit SDG impact.
- 👑 **Super Admin Command Center**: Manage users, approve pending verification requests, control AI engine thresholds, and inspect real-time audit logs.

---

## 🚀 Groq AI Engine Integration Summary

Groq AI is fully integrated into CivicSolve AI as a secure, server-side production AI engine.

### 1. Architecture Overview

```text
Frontend (React Client)
       │
       │  POST /api/ai/* (Fetch)
       ▼
Vite Server Middleware (server/viteGroqApiPlugin.js)
       │
       │  Reads process.env.GROQ_API_KEY securely on Node server
       ▼
Groq Server Service (server/groqServerService.js)
       │
       │  Official groq-sdk Calls (groq/compound)
       ▼
Groq API Cloud (https://api.groq.com)
       │
       │  Sanitized JSON / Output Validation / Error Retries
       ▼
Response Returned to Frontend
```

- **Zero Client-Side Key Leakage**: `GROQ_API_KEY` is loaded exclusively in `server/groqServerService.js` on the Node.js server. The key is never compiled into client-side JS or sent to the browser.
- **Configurable Model**: Set via `GROQ_MODEL=groq/compound` in `.env`.

---

### 2. API Endpoints Created (`/api/ai/*`)

| Endpoint | Method | Purpose | Payload Example |
| :--- | :--- | :--- | :--- |
| `/api/ai/chat` | `POST` | Conversational civic chatbot response | `{ "messages": [{ "role": "user", "content": "How do I report a pothole?" }] }` |
| `/api/ai/classify` | `POST` | Structured JSON complaint classification | `{ "title": "Big Pothole", "description": "Large road damage near college" }` |
| `/api/ai/summarize` | `POST` | Single-sentence hazard summary | `{ "description": "There is a massive pothole..." }` |
| `/api/ai/generate-complaint` | `POST` | Auto-generate formal complaint draft | `{ "prompt": "Pothole near university" }` |
| `/api/ai/priority` | `POST` | Urgency score & risk rationale | `{ "title": "Water Leak", "description": "Broken main pipe", "location": "Ward 14" }` |
| `/api/ai/explain-status` | `POST` | Simple explanation of complaint status | `{ "status": "validated" }` |
| `/api/ai/analyze-image` | `POST` | Field photo visual analysis & fallback | `{ "imageBase64": "...", "imageType": "image/jpeg" }` |

---

### 3. Files Created & Modified

#### Created Files:
- `server/groqServerService.js` — Server-side Groq AI service (system prompt, anti-prompt injection, JSON sanitization, logging).
- `server/viteGroqApiPlugin.js` — Vite server middleware registering `/api/ai/*` POST endpoints.
- `src/services/groqClientService.js` — Client-side interface to `/api/ai/*` with retries & error handling.

#### Modified Files:
- `.env` — Added `GROQ_API_KEY` & `GROQ_MODEL`.
- `.env.example` — Documented Groq configuration without secrets.
- `.gitignore` — Added `.env` protection.
- `vite.config.js` — Registered `viteGroqApiPlugin()`.
- `src/services/aiService.js` — Connected `aiService` to `groqService`.
- `src/pages/SubmitPage.jsx` — Added **"✨ Auto-Generate Draft with AI"** button.
- `src/components/CivicAssistant.jsx` — Added Groq AI assistant branding, clear chat, retry, and suggested prompts.
- `README.md` — Updated documentation.

---

### 4. Dependencies Installed

```bash
npm install groq-sdk dotenv
```

---

### 5. Required Environment Variables (`.env`)

```env
# Groq AI Configuration (Server-Side ONLY)
GROQ_API_KEY="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"
GROQ_MODEL="groq/compound"
```

---

### 6. Commands to Run & Test

```bash
# Start dev server
npm run dev

# Build for production
npm run build
```

---

### 7. Example API Request & Response

#### Request (`POST /api/ai/classify`):
```json
{
  "title": "Severe road pothole near BIT Mesra entrance",
  "description": "A deep 2-foot pothole has developed on the main access road causing daily traffic congestion and motorcycle accidents during rain."
}
```

#### Response:
```json
{
  "success": true,
  "classification": {
    "category": "Infrastructure",
    "subcategory": "Transport & Road Maintenance",
    "severity": "high",
    "department": "Municipal Roads & Public Works Department",
    "summary": "Severe 2-foot pothole near BIT Mesra entrance causing traffic congestion and accident risk.",
    "skills_required": ["Civil Engineering", "GIS Mapping", "Asphalt Telemetry"],
    "priority_score": 88
  }
}
```

---

### ⚡ 3. District Command Center & Emergency Mode
- **Geographic Heatmap**: Visualizes issue severity across districts.
- **Emergency Disaster Mode**: One-click system-wide escalation that fast-tracks validation and alerts emergency response teams.
- **SLA Tracker**: Monitors government department resolution SLAs (e.g. 24h validation / 30d implementation target).

---

### 🔐 4. Super Admin Credentials & Access
- **Master Admin Email**: `admin@admin.com`
- **Master Admin Password**: `admin@2008`
- **Portal URL**: Click **Sign In** → **Super Admin Center**.
- Authenticates directly against Supabase Auth, verifies the `super_admin` role from the `profiles` table, and logs audit events.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Lucide React (Icons), Recharts (Analytics), OGL (WebGL 3D Effects).
- **Styling**: Modern Vanilla CSS, Glassmorphism, HSL color tokens, Aurora animated Canvas background, responsive Mobile/Desktop pill navigation.
- **Backend & Database**: Supabase PostgreSQL (Auth, Row-Level Security, Profiles, Challenges, Teams, Audit Logs).
- **AI Integration**: Groq API (`groq-sdk` with `groq/compound`) + Google Gemini 2.5 Flash / OpenRouter API.

---

## 📁 Project Directory Structure

```text
├── .env                       # Environment variables (Supabase & Groq API secrets)
├── .env.example               # Template environment configuration (no secrets)
├── index.html                 # HTML Entrypoint
├── package.json               # Dependencies & build scripts
├── vite.config.js             # Vite configuration with Groq API middleware plugin
├── supabase_schema.sql        # Complete PostgreSQL database schema with RLS & ENUMs
├── wipe_and_seed.sql          # Clean SQL script to truncate demo data & seed production sectors/roles
├── server/
│   ├── groqServerService.js   # Server-side Groq AI service (system prompt, anti-prompt injection, JSON validation, logging)
│   └── viteGroqApiPlugin.js   # Vite dev/preview server plugin registering POST /api/ai/* endpoints
└── src/
    ├── App.jsx                # Main Application routing, session restoration & toast management
    ├── index.css              # Glassmorphism design system, CSS variables & typography
    ├── components/
    │   ├── AiControlCenter.jsx        # Admin AI threshold & model controls
    │   ├── AiCopilotModal.jsx         # Interactive AI assistant modal
    │   ├── Aurora.jsx                 # WebGL Aurora canvas background
    │   ├── CivicAssistant.jsx         # Floating AI helper button & drawer (Groq AI powered)
    │   ├── CommandMenu.jsx            # Ctrl+K command palette
    │   ├── DesktopPillNav.jsx         # Desktop top navigation pill bar
    │   ├── DuplicateDetector.jsx      # AI duplicate issue detection component
    │   ├── GeographicHeatmap.jsx      # District map visualization
    │   ├── MobilePillNav.jsx          # Mobile bottom navigation bar (WebGL Aurora enabled)
    │   └── SlaTracker.jsx             # Department SLA tracking component
    ├── pages/
    │   ├── AuthLandingPage.jsx        # Sector selection portal grid
    │   ├── AuthSectorPage.jsx         # Sector-specific login & registration
    │   ├── CommandCenterPage.jsx      # District Command Center & Emergency toggle
    │   ├── DashboardPage.jsx          # Dynamic multi-sector dashboard
    │   ├── DetailPage.jsx             # Challenge details, team tracker & support
    │   ├── ExplorePage.jsx            # Filterable challenge directory & map view
    │   ├── FundingPage.jsx            # CSR grants & funding marketplace
    │   ├── LandingPage.jsx            # Homepage hero, stats & high-impact challenges
    │   ├── MobileAdminConsole.jsx     # Mobile view for admin console
    │   ├── ResearchHubPage.jsx        # Academic research collaboration hub
    │   ├── SolutionMarketplacePage.jsx # Technical prototype marketplace
    │   ├── SubmitPage.jsx             # Challenge reporting form with Groq AI Draft Generator
    │   └── SuperAdminLogin.jsx        # Restricted admin login portal
    └── services/
        ├── aiService.js               # Central AI Service wrapper for components
        ├── groqClientService.js       # Client-side interface calling POST /api/ai/* endpoints
        ├── mockData.js                # Static constants (Districts, Categories, Sectors, Roles)
        ├── supabaseClient.js          # Supabase JS client initializer
        └── supabaseService.js         # Complete Supabase CRUD data access layer
```

---

## 🗄️ Database Setup & Production Deployment (Supabase)

### 1️⃣ Run Schema Setup
In your **Supabase Dashboard** → **SQL Editor**, execute [`supabase_schema.sql`](file:///c:/Users/SHARAN/Desktop/project/SIH/nn%20-%20Copy%20-%20Copy/supabase_schema.sql) to create all required tables, ENUM types, and Row Level Security (RLS) policies.

### 2️⃣ Create Super Admin Account
In your **Supabase Dashboard** → **Authentication** → **Users**:
1. Click **Add User** → **Create User**.
2. **Email**: `admin@admin.com`
3. **Password**: `admin@2008`
4. Enable **Auto-Confirm Email**.

### 3️⃣ Wipe Demo Data & Seed Production Roles
Execute [`wipe_and_seed.sql`](file:///c:/Users/SHARAN/Desktop/project/SIH/nn%20-%20Copy%20-%20Copy/wipe_and_seed.sql) in the Supabase SQL Editor. This script:
- Clears all demo challenges, teams, audit logs, and temporary test records.
- Seeds all 12 Sectors and 30+ Roles into Supabase.
- Links `admin@admin.com` to the `super_admin` role in the `profiles` table.

```sql
-- Truncate demo tables
TRUNCATE TABLE public.collaborations CASCADE;
TRUNCATE TABLE public.team_members CASCADE;
TRUNCATE TABLE public.teams CASCADE;
TRUNCATE TABLE public.challenges CASCADE;
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.login_sessions CASCADE;
TRUNCATE TABLE public.organization_verifications CASCADE;
TRUNCATE TABLE public.organization_members CASCADE;
TRUNCATE TABLE public.organizations CASCADE;

-- Link Super Admin Profile
INSERT INTO public.profiles (id, full_name, email, verification, primary_role_id, primary_sector_id)
SELECT 
  u.id,
  'Super Administrator',
  'admin@admin.com',
  'verified',
  r.id,
  s.id
FROM auth.users u
JOIN public.roles r ON r.slug = 'super_admin'
JOIN public.sectors s ON s.slug = 'super_admin'
WHERE u.email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET verification = 'verified', primary_role_id = EXCLUDED.primary_role_id, primary_sector_id = EXCLUDED.primary_sector_id;
```

---

## 🔒 Security & Compliance

- **Server-Side API Key Isolation**: `GROQ_API_KEY` is restricted to server middleware.
- **Row Level Security (RLS)**: Enforced on `profiles`, `challenges`, `teams`, `audit_logs`, and `ai_settings`.
- **Audit Logging**: Every authentication event, verification approval, role modification, and AI server request is recorded in audit logs.
- **Verification Levels**: New accounts are flagged as `unverified` or `pending_verification` until approved by an administrator.

---

## 📄 License
Privately developed for National & State Societal Innovation Infrastructure. All rights reserved.
