# 🏛️ CivicSolve AI — Complete Developer Guide

> **National Societal Innovation Operating System**
> A comprehensive civic technology platform combining AI intelligence, government case management, university collaboration, NGO networks, industry partnerships, and citizen participation.

---

## 📋 Table of Contents

1. [What This Project Is](#what-this-project-is)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Project Structure Explained](#project-structure-explained)
4. [How the App Works (Data Flow)](#how-the-app-works-data-flow)
5. [Technology Stack](#technology-stack)
6. [Every File Explained](#every-file-explained)
7. [Design System (Liquid Glass)](#design-system-liquid-glass)
8. [Routing & Navigation](#routing--navigation)
9. [RBAC Permission System](#rbac-permission-system)
10. [Services & Data Layer](#services--data-layer)
11. [Authentication Flow](#authentication-flow)
12. [AI Integration](#ai-integration)
13. [Mobile Support](#mobile-support)
14. [How to Add a New Page](#how-to-add-a-new-page)
15. [How to Add a New Feature](#how-to-add-a-new-feature)
16. [How to Add a New Role](#how-to-add-a-new-role)
17. [Feature Catalog (170+ Features)](#feature-catalog)
18. [Deployment](#deployment)
19. [Troubleshooting](#troubleshooting)

---

## What This Project Is

CivicSolve AI is a **single-page React application** that serves as a complete civic technology platform. It allows:

- **Citizens** to report civic problems (potholes, water leaks, etc.)
- **Government** to manage, assign, and resolve those problems
- **Universities** to form student teams and build solutions
- **NGOs** to collaborate on civic projects
- **Industry** to sponsor and provide technology
- **AI** to analyze problems, generate solutions, and predict risks

**Key architectural decisions:**
- Frontend-only React app (no backend server)
- Supabase for database and authentication
- Groq API for AI features
- LocalStorage fallback for demo/offline mode
- Every feature works even without a real database connection

---

## Quick Start (5 Minutes)

```bash
# 1. Clone
git clone <repo-url>
cd civicsolve-ai

# 2. Install
npm install

# 3. Run
npm run dev

# 4. Open
# → http://localhost:5173
```

**That's it.** The app works immediately with demo data. No database setup needed.

**Optional: Connect to Supabase for real data:**
```bash
# Create .env.local file
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=your-anon-key" >> .env.local

# Optional: AI features
echo "VITE_GROQ_API_KEY=your-groq-key" >> .env.local
```

**Available commands:**
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (output: dist/)
npm run preview  # Preview production build
npm run lint     # Run linter
```

---

## Project Structure Explained

```
civicsolve-ai/
├── public/                    # Static files served as-is
├── src/                       # All source code (this is what you edit)
│   ├── App.jsx                # ★ THE MAIN FILE — routing, auth, state, layout
│   ├── main.jsx               # React entry point (mounts App to DOM)
│   ├── index.css              # ★ ALL STYLES — Liquid Glass design system
│   ├── App.css                # App-specific animations
│   │
│   ├── pages/                 # ★ PAGE COMPONENTS — one file per screen
│   │   ├── LandingPage.jsx           # Public homepage (desktop)
│   │   ├── MobileLandingPage.jsx     # Public homepage (mobile)
│   │   ├── ExplorePage.jsx           # Browse all civic problems
│   │   ├── SubmitPage.jsx            # Report a new problem (desktop)
│   │   ├── MobileReportWizard.jsx    # Report a problem (mobile)
│   │   ├── DetailPage.jsx            # Single problem detail (tabs)
│   │   ├── DashboardPage.jsx         # Role-based dashboard
│   │   ├── CommandCenterPage.jsx     # Admin command center
│   │   ├── SolutionMarketplacePage.jsx # Browse proposed solutions
│   │   ├── FundingPage.jsx           # Crowdfunding & CSR
│   │   ├── ResearchHubPage.jsx       # Research library
│   │   ├── AnalyticsPage.jsx         # Charts and analytics
│   │   ├── TransparencyDashboardPage.jsx # Public transparency
│   │   ├── CivicChallengesPage.jsx   # Innovation competitions
│   │   ├── LeaderboardPage.jsx       # Gamification leaderboard
│   │   ├── AchievementsPage.jsx      # Achievement badges
│   │   ├── ExpertMarketplacePage.jsx # Find experts
│   │   ├── NgoMatchingPage.jsx       # NGO collaboration
│   │   ├── IntelligenceDashboardPage.jsx # AI intelligence
│   │   ├── AiAnalysisHubPage.jsx     # AI root cause, feasibility, cost, risk, roadmap
│   │   ├── CivicPollsPage.jsx        # Community polls & voting
│   │   ├── ProjectManagementPage.jsx # Kanban board, Gantt timeline, milestones
│   │   ├── ActivityCenterPage.jsx    # Activity feed & audit log
│   │   ├── DepartmentScorecardPage.jsx # Department performance
│   │   ├── GeospatialAnalyticsPage.jsx # Heatmaps, trends, comparison
│   │   ├── UserProfilePage.jsx       # User profile & achievements
│   │   ├── EnterpriseControlCenter.jsx # Ultimate admin dashboard
│   │   ├── DigitalTwinPage.jsx       # City digital twin
│   │   ├── FieldOperationsPage.jsx   # Field inspections & dispatch
│   │   ├── AuthLandingPage.jsx       # Choose login sector
│   │   ├── AuthSectorPage.jsx        # Sector-specific login
│   │   ├── SuperAdminLogin.jsx       # Super admin login
│   │   └── MobileAdminConsole.jsx    # Mobile admin view
│   │
│   ├── components/            # ★ REUSABLE COMPONENTS — used across pages
│   │   ├── DynamicSidebar.jsx        # Role-based navigation (desktop + mobile)
│   │   ├── ProtectedRoute.jsx        # RBAC route guard + AccessDenied page
│   │   ├── CommandMenu.jsx           # Ctrl+K command palette
│   │   ├── CivicAssistant.jsx        # AI chat copilot
│   │   ├── MobilePillNav.jsx         # Mobile bottom navigation
│   │   ├── DesktopPillNav.jsx        # Desktop navigation
│   │   ├── ChallengeMap.jsx          # Interactive Leaflet map
│   │   ├── GeographicHeatmap.jsx     # Heatmap visualization
│   │   ├── ImpactGraph.jsx           # Impact charts
│   │   ├── ProjectWorkspace.jsx      # Project workspace widget
│   │   ├── AiControlCenter.jsx       # AI management panel
│   │   ├── AiCopilotModal.jsx        # AI assistant modal
│   │   ├── AiTeamBuilder.jsx         # AI team matching
│   │   ├── CapabilityMarketplace.jsx # Capability marketplace
│   │   ├── ChallengeFunnel.jsx       # Challenge funnel visualization
│   │   ├── ChallengeHealthBadge.jsx  # Health indicator badge
│   │   ├── CollaborationAgreement.jsx # Collaboration contracts
│   │   ├── DuplicateDetector.jsx     # Duplicate problem detection
│   │   ├── EcosystemCanvas.jsx       # Ecosystem visualization
│   │   ├── RootCauseAnalysis.jsx     # Root cause tree
│   │   ├── SlaTracker.jsx            # SLA monitoring
│   │   ├── TrustSafetyPanel.jsx      # Trust & safety panel
│   │   ├── BottomSheet.jsx           # Mobile bottom sheet
│   │   ├── Aurora.jsx                # Aurora shader background
│   │   ├── Aurora.css                # Aurora styles
│   │   ├── Silk.jsx                  # WebGL silk background
│   │   ├── ScrollExpand.jsx          # Scroll animations
│   │   └── ScrollExpand.css          # Scroll animation styles
│   │
│   └── services/              # ★ DATA & BUSINESS LOGIC — no UI, pure functions
│       ├── rbacSystem.js             # RBAC: roles, permissions, auth helpers
│       ├── featureService.js         # Core feature CRUD (notifications, achievements, etc.)
│       ├── featureData.js            # Core mock data (notifications, achievements, leaderboard)
│       ├── advanced40Service.js      # 40 advanced features data + services
│       ├── enterprise100Service.js   # 100 enterprise features data + services
│       ├── aiService.js              # Groq AI integration
│       ├── groqClientService.js      # Groq API client
│       ├── supabaseService.js        # Database operations (with fallback)
│       ├── supabaseClient.js         # Supabase client initialization
│       └── mockData.js               # Mock data for demo mode
│
├── .env.local                 # Environment variables (create this)
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite build configuration
└── README.md                  # This file
```

---

## How the App Works (Data Flow)

```
User opens app
    ↓
App.jsx renders
    ↓
Check authentication (Supabase session)
    ↓
┌─ Unauthenticated → Show LandingPage / Auth pages
│
└─ Authenticated → Show main app with:
    ↓
┌─ AppHeader (glass pill navbar with Aurora effect)
│   ├── Logo
│   ├── Navigation items (filtered by role)
│   ├── Search button (Ctrl+K)
│   ├── Notifications
│   └── User menu
│
├─ BackButton (breadcrumb navigation)
│
├─ Main Content (route-based rendering)
│   ├── Landing route → LandingPage or MobileLandingPage
│   ├── Explore route → ExplorePage
│   ├── Report route → SubmitPage or MobileReportWizard
│   ├── Dashboard route → DashboardPage (role-specific)
│   ├── Command Center route → CommandCenterPage (admin only)
│   ├── AI Hub route → AiAnalysisHubPage (protected)
│   ├── Projects route → ProjectManagementPage (protected)
│   └── ... (all other routes)
│
├─ DynamicSidebar (role-based navigation)
│   ├── Desktop: Role badge
│   └── Mobile: Bottom pill navigation
│
├─ Footer (desktop only)
│
├─ Toast notifications (fixed position)
│
├─ CommandMenu (Ctrl+K overlay)
│
└─ CivicAssistant (AI chat widget)
```

### Data Flow for a Typical Feature

```
1. User clicks "Explore" in navigation
   ↓
2. App.jsx sets currentRoute = 'explore'
   ↓
3. App.jsx renders: <ExplorePage challenges={challenges} onNavigate={handleNavigate} />
   ↓
4. ExplorePage loads data:
   - From Supabase (if connected): getChallenges()
   - From mock data (fallback): db.getChallenges()
   ↓
5. ExplorePage renders list of challenges
   ↓
6. User clicks a challenge
   ↓
7. onNavigate('challenge/c-1') called
   ↓
8. App.jsx parses route, sets activeChallengeId = 'c-1'
   ↓
9. App.jsx renders: <DetailPage challengeId="c-1" ... />
   ↓
10. DetailPage loads challenge data and renders tabs
```

---

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 | Latest React with concurrent features |
| **Build Tool** | Vite 8 | Fast dev server, optimized builds |
| **Styling** | CSS Custom Properties | No CSS-in-JS overhead, design tokens |
| **Maps** | React-Leaflet | Interactive maps with markers |
| **AI** | Groq API | Fast AI inference (groq/compound model) |
| **Database** | Supabase PostgreSQL | Real-time database with auth |
| **Auth** | Supabase Auth | Email/password, social login |
| **Icons** | Lucide React | Consistent icon library |
| **Background** | WebGL (Silk) | Animated silk background |
| **Shader** | Aurora CSS | Glassmorphism header effect |
| **Charts** | Recharts | Data visualization |
| **3D** | Three.js / OGL | WebGL rendering (backgrounds) |

---

## Every File Explained

### App.jsx (Main File — ~1100 lines)

This is the **central hub** of the entire application. It handles:

1. **Authentication state** — Is user logged in? Who are they?
2. **Routing** — Which page to show based on URL
3. **RBAC** — Role-based access control and impersonation
4. **State management** — Challenges, stats, notifications, UI state
5. **Supabase integration** — Loading data from database
6. **Toast notifications** — Success/error messages
7. **Layout** — Header, main content, footer, mobile nav

**Key state variables:**
```javascript
authState          // 'unauthenticated' | 'sector-select' | 'sector-login' | 'super-admin-login' | 'authenticated'
currentUser        // { id, email, name, sector, role, role_slug, organization, verification, avatar }
currentRoute       // Current page route string
activeChallengeId  // ID of currently viewed challenge
effectiveRole      // Current effective role (may be impersonated)
impersonateRole    // Role being impersonated (null if not impersonating)
isMobile           // Whether viewing on mobile
toasts             // Array of notification messages
challenges         // Array of all civic challenges
stats              // Platform statistics
```

**Key functions:**
```javascript
handleNavigate(route)     // Navigate to a route
handleBack()              // Go back in history
handleLogin(user)         // Log in a user
handleLogout()            // Log out
handleCreateChallenge()   // Submit a new problem
handleRoleSwitch(role)    // Super admin role impersonation
addToast(title, msg)      // Show notification
refreshDatabaseState()    // Reload data from Supabase
```

### index.css (~1035 lines)

The **entire design system** in one file. Key sections:

- **Lines 1-100:** Design tokens (colors, spacing, typography, shadows)
- **Lines 100-200:** Light mode overrides
- **Lines 200-400:** Glass card components (`.glass-card`, `.glass-l1`, `.glass-l2`, etc.)
- **Lines 400-500:** Button styles (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ai`)
- **Lines 500-600:** Form elements (`.form-input`, `.badge`)
- **Lines 600-700:** Animations (`.fade-in`, `.reveal`, `.slide-down`)
- **Lines 700-800:** Scroll reveal system
- **Lines 800-860:** Mobile responsive styles
- **Lines 860-940:** Mobile-specific overrides (`@media (max-width: 768px)`)
- **Lines 940-1035:** Accessibility, reduced motion, focus states

---

## Design System (Liquid Glass)

### Glass Card Hierarchy

```css
/* Level 0 — Base glass (used for main cards) */
.glass-card {
  background: rgba(14, 18, 32, 0.7);
  backdrop-filter: blur(40px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* Level 1 — Subtle glass (inside cards) */
.glass-l1 { background: rgba(255, 255, 255, 0.02); border-radius: 14px; }

/* Level 2 — Medium glass (nested elements) */
.glass-l2 { background: rgba(255, 255, 255, 0.04); border-radius: 12px; }

/* Level 3 — Elevated glass (dropdowns) */
.glass-l3 { background: rgba(18, 24, 42, 0.95); border-radius: 16px; }

/* Level 4 — Highest glass (modals, overlays) */
.glass-l4 { background: rgba(14, 18, 32, 0.98); border-radius: 20px; }
```

### How to Use in Components

```jsx
// Basic glass card
<div className="glass-card" style={{ padding: '20px' }}>
  <h3>Title</h3>
  <p>Content</p>
</div>

// Primary button
<button className="btn btn-primary">Click Me</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// AI button (purple)
<button className="btn btn-ai">Generate</button>

// Badge
<span className="badge badge-high">High Priority</span>

// Fade-in animation
<div className="fade-in">Appears with fade</div>

// Scroll reveal
<div className="reveal">Appears on scroll</div>

// Staggered reveal
<div className="reveal-stagger">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Color Variables

```css
--primary: #3b82f6;        /* Blue — primary actions */
--success: #10b981;        /* Green — success, positive */
--warning: #f59e0b;        /* Yellow — warnings, caution */
--danger: #ef4444;         /* Red — errors, critical */
--ai-purple: #8b5cf6;      /* Purple — AI features */
--text-primary: #f0f4f8;   /* Main text color */
--text-secondary: rgba(224, 231, 240, 0.72);  /* Secondary text */
--text-muted: rgba(160, 178, 200, 0.55);      /* Muted text */
--border-subtle: rgba(255, 255, 255, 0.06);   /* Subtle borders */
```

---

## Routing & Navigation

### How Routes Work

App.jsx uses a simple **state-based router** (no React Router):

```javascript
// Current route is stored in state
const [currentRoute, setCurrentRoute] = useState('landing');

// Navigation function
const handleNavigate = (route) => {
  setRouteHistory(prev => [...prev, currentRoute]);
  if (route.startsWith('challenge/')) {
    setActiveChallengeId(route.split('/')[1]);
    setCurrentRoute('challenge-detail');
  } else {
    setCurrentRoute(route);
  }
};

// Route rendering (in JSX)
{currentRoute === 'landing' && <LandingPage />}
{currentRoute === 'explore' && <ExplorePage />}
{currentRoute === 'report' && <SubmitPage />}
{currentRoute === 'dashboard' && <DashboardPage />}
// ... etc
```

### All Available Routes

| Route | Component | Access |
|-------|-----------|--------|
| `landing` | LandingPage / MobileLandingPage | Public |
| `explore` | ExplorePage | Authenticated |
| `solutions` | SolutionMarketplacePage | Authenticated |
| `report` | SubmitPage / MobileReportWizard | Citizen, Student, Volunteer |
| `command-center` | CommandCenterPage | Admin only |
| `funding` | FundingPage | Authenticated |
| `research-hub` | ResearchHubPage | Authenticated |
| `dashboard` | DashboardPage | Authenticated |
| `challenge-detail` | DetailPage | Authenticated |
| `achievements` | AchievementsPage | Authenticated |
| `leaderboard` | LeaderboardPage | Authenticated |
| `expert-marketplace` | ExpertMarketplacePage | Authenticated |
| `ngo-matching` | NgoMatchingPage | Authenticated |
| `transparency` | TransparencyDashboardPage | Authenticated |
| `civic-challenges` | CivicChallengesPage | Authenticated |
| `analytics` | AnalyticsPage | Authenticated |
| `intelligence` | IntelligenceDashboardPage | State Admin+ |
| `ai-hub` | AiAnalysisHubPage | Expert, Dept Officer+ |
| `polls` | CivicPollsPage | Dept Head+ |
| `projects` | ProjectManagementPage | Student+ |
| `activity` | ActivityCenterPage | Authenticated |
| `departments` | DepartmentScorecardPage | Dept Officer+ |
| `geospatial` | GeospatialAnalyticsPage | Dept Officer+ |
| `profile` | UserProfilePage | Authenticated |
| `enterprise` | EnterpriseControlCenter | Platform Admin+ |
| `digital-twin` | DigitalTwinPage | City Admin+ |
| `field-ops` | FieldOperationsPage | Field Officer+ |
| `sector-select` | AuthLandingPage | Public |
| `sector-login` | AuthSectorPage | Public |
| `super-admin-login` | SuperAdminLogin | Public |

### Navigation Structure

Each role gets different navigation items defined in `rbacSystem.js`:

```javascript
export const ROLE_NAVIGATION = {
  citizen: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Discover', icon: '🔍' },
    { id: 'report', label: 'Report', icon: '📋', isPrimary: true },
    { id: 'solutions', label: 'Solutions', icon: '💡' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  department_head: [
    { id: 'dashboard', label: 'Dept Dashboard', icon: '📊' },
    { id: 'explore', label: 'Cases', icon: '🔍' },
    { id: 'projects', label: 'Solutions', icon: '💡' },
    { id: 'departments', label: 'Performance', icon: '🏛️' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
    { id: 'polls', label: 'Polls', icon: '🗳️' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  // ... 18 role definitions total
};
```

---

## RBAC Permission System

### How Permissions Work

Every permission follows: **resource.action.scope**

```javascript
// Examples
'problem.read.own'           // Read own problems
'problem.read.department'    // Read department problems
'problem.read.all'           // Read all problems
'solution.approve.city'      // Approve solutions in city
'user.manage.organization'   // Manage org users
'audit_log.read.all'         // Read all audit logs
```

### Checking Permissions

```javascript
import { hasPermission, canAccess, canModify, canApprove } from './services/rbacSystem';

// Basic permission check
hasPermission('citizen', 'problem.read.own');           // true
hasPermission('citizen', 'problem.read.all');           // false
hasPermission('super_admin', 'problem.read.all');       // true

// Access with context
canAccess('department_officer', 'problem', 'read', {
  departmentId: 'dept-1'
});

// Modification check
canModify('field_officer', 'problem', { departmentId: 'dept-1' });

// Approval check
canApprove('department_head', 'solution', { departmentId: 'dept-1' });

// Export check
canExport('city_admin', 'city');    // true
canExport('citizen', 'state');      // false
```

### Protecting Routes

```jsx
import { ProtectedRoute } from './components/ProtectedRoute';

// In App.jsx
{currentRoute === 'enterprise' && (
  <ProtectedRoute route="enterprise" role={effectiveRole} onNavigate={handleNavigate}>
    <EnterpriseControlCenter />
  </ProtectedRoute>
)}
```

### Protecting UI Elements

```jsx
import { PermissionGuard, PermissionButton } from './components/ProtectedRoute';

// Hide element entirely if no permission
<PermissionGuard permission="problem.delete.all" role={userRole}>
  <button onClick={handleDelete}>Delete Problem</button>
</PermissionGuard>

// Show button only if allowed
<PermissionButton permission="solution.approve.department" role={userRole} onClick={handleApprove}>
  Approve Solution
</PermissionButton>
```

### All 18 Roles

| Role | Level | Hierarchy | Can Access |
|------|-------|-----------|------------|
| Guest | 1 | 0 | Public pages only |
| Citizen | 1 | 50 | Own data, public content |
| Student | 2 | 70 | Projects, challenges |
| Volunteer | 2 | 80 | Volunteer opportunities |
| Expert | 2 | 100 | Reviews, consultations |
| University Admin | 3 | 150 | University scope |
| NGO Admin | 3 | 140 | NGO scope |
| Industry Partner | 3 | 130 | Company scope |
| Startup | 3 | 120 | Startup scope |
| Field Officer | 4 | 200 | Assigned cases |
| Department Officer | 4 | 220 | Department cases |
| Department Head | 4 | 250 | Department management |
| City Admin | 4 | 280 | City scope |
| District Admin | 4 | 300 | District scope |
| State Admin | 4 | 350 | State scope |
| Platform Moderator | 5 | 400 | Content moderation |
| Platform Admin | 5 | 450 | Platform management |
| Super Admin | 5 | 500 | Everything |

---

## Services & Data Layer

### Service Files Overview

| File | Lines | Purpose |
|------|-------|---------|
| `rbacSystem.js` | ~1280 | Roles, permissions, auth helpers, navigation, feature flags |
| `featureData.js` | ~400 | Core mock data (notifications, achievements, leaderboard, etc.) |
| `featureService.js` | ~500 | Core CRUD operations (notifications, achievements, etc.) |
| `advanced40Service.js` | ~800 | 40 advanced features data + service functions |
| `enterprise100Service.js` | ~700 | 100 enterprise features data + service functions |
| `supabaseService.js` | ~400 | Database operations with fallback |
| `supabaseClient.js` | ~10 | Supabase client init |
| `aiService.js` | varies | AI integration |
| `groqClientService.js` | varies | Groq API client |
| `mockData.js` | ~345 | Demo data for offline mode |

### How Data Loading Works

Every service follows this pattern:

```javascript
// 1. Try to load from Supabase
// 2. If Supabase fails or returns empty → fall back to mock data
// 3. App always has data to display

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return db.getChallenges();  // Fallback to mock data
    }
    return data;
  } catch (err) {
    return db.getChallenges();  // Fallback to mock data
  }
}
```

### Using Services in Pages

```javascript
// Import the service
import { innovationChallengeService } from '../services/featureService';
import { rootCauseService, feasibilityService } from '../services/advanced40Service';
import { digitalTwinService, assetService } from '../services/enterprise100Service';

// Use in component
export default function MyPage() {
  const challenges = innovationChallengeService.getAll();
  const tree = rootCauseService.getTree('monsoon-road-accessibility');
  const scores = feasibilityService.getScores('monsoon-road-accessibility');
  const twin = digitalTwinService.getData();

  return (
    <div>
      {challenges.map(c => <div key={c.id}>{c.title}</div>)}
    </div>
  );
}
```

### LocalStorage Persistence

Many features use localStorage for client-side persistence:

```javascript
// Helper functions
const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(`civicsolve_features_${key}`);
    if (v) return JSON.parse(v);
    localStorage.setItem(`civicsolve_features_${key}`, JSON.stringify(fallback));
    return fallback;
  } catch { return fallback; }
};

const setStored = (key, val) => {
  try { localStorage.setItem(`civicsolve_features_${key}`, JSON.stringify(val)); }
  catch { /* ignore */ }
};

// Usage
const polls = getStored('polls', CIVIC_POLLS);
setStored('polls', updatedPolls);
```

---

## Authentication Flow

```
1. User opens app
   ↓
2. App.jsx runs useEffect → supabase.auth.getSession()
   ↓
3. If session exists → load profile from 'profiles' table
   ↓
4. Set currentUser and authState = 'authenticated'
   ↓
5. If no session → authState = 'unauthenticated'
   ↓
6. User clicks "Sign In"
   ↓
7. authState = 'sector-select' → AuthLandingPage shown
   ↓
8. User picks sector (citizen, government, university, etc.)
   ↓
9. authState = 'sector-login' → AuthSectorPage shown
   ↓
10. User enters credentials → Supabase Auth
    ↓
11. On success → load profile → authState = 'authenticated'
    ↓
12. Dashboard shown based on role
```

### Login Handlers

```javascript
const handleLogin = (user) => {
  setCurrentUser(user);        // { id, email, name, sector, role, ... }
  setAuthState('authenticated');
  setCurrentRoute('dashboard');
  addToast('Welcome Back!', `Signed in as ${user.name}`, 'success');
};

const handleLogout = async () => {
  await addAuditLog(currentUser.id, 'USER_LOGOUT', currentUser.email);
  await supabase.auth.signOut();
  setCurrentUser(null);
  setAuthState('unauthenticated');
  setCurrentRoute('landing');
};
```

---

## AI Integration

### Groq API Setup

```javascript
// groqClientService.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
});

export async function analyzeCivicProblem(problemDescription) {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `Analyze: ${problemDescription}` }],
    model: 'compound',
  });
  return completion.choices[0]?.message?.content;
}
```

### AI Features Available

| Feature | Location | What It Does |
|---------|----------|-------------|
| Problem Analysis | DetailPage | AI priority scoring |
| Solution Generation | SolutionMarketplacePage | Generate solutions |
| Root Cause Tree | AiAnalysisHubPage | Expandable cause tree |
| Feasibility Score | AiAnalysisHubPage | Technical/financial/social scores |
| Cost Estimation | AiAnalysisHubPage | Budget breakdown |
| Risk Prediction | AiAnalysisHubPage | Risk probability + mitigation |
| Implementation Roadmap | AiAnalysisHubPage | Phase-based timeline |
| Policy Simulation | AiAnalysisHubPage | What-if scenarios |
| Debate Analysis | AiAnalysisHubPage | Pro/con arguments |
| Sentiment Analysis | AiAnalysisHubPage | Community mood |
| Knowledge Search | AiAnalysisHubPage | Semantic search |
| AI Copilot | CivicAssistant | Chat-based assistance |
| Duplicate Detection | DuplicateDetector | Find similar problems |

---

## Mobile Support

### Detection

```javascript
const checkMobile = () =>
  window.innerWidth <= 768 || (window.innerHeight / window.innerWidth) > 1.15;
```

### Mobile-Specific Components

- **MobileLandingPage** — Simplified landing for mobile
- **MobileReportWizard** — Step-by-step report flow
- **MobileAdminConsole** — Admin view for mobile
- **DynamicSidebar** (mobile mode) — Bottom pill navigation
- **BottomSheet** — Touch-friendly bottom sheets

### Mobile CSS

```css
@media (max-width: 768px), (max-aspect-ratio: 13/10) {
  h1 { font-size: clamp(1.4rem, 5vw, 2.2rem) !important; }
  .glass-card { padding: 16px !important; }
  .container { padding-left: 16px !important; padding-right: 16px !important; }

  /* Grid layouts stack vertically */
  [style*="grid-template-columns: 1.2fr 0.8fr"] {
    grid-template-columns: 1fr !important;
  }

  /* Horizontal scroll tabs */
  .mobile-scroll-tabs {
    display: flex !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
  }
}
```

---

## How to Add a New Page

### Step-by-Step

**1. Create the page file:**
```jsx
// src/pages/MyNewPage.jsx
import React from 'react';
import { SomeIcon } from 'lucide-react';

export default function MyNewPage() {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#60a5fa', marginBottom: '8px' }}>
          <SomeIcon size={12} /> My Feature
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>My New Page</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description of the page.</p>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#fff' }}>Content</h3>
        {/* Your content here */}
      </div>
    </div>
  );
}
```

**2. Import in App.jsx:**
```javascript
import MyNewPage from './pages/MyNewPage';
```

**3. Add route rendering (in the main content area):**
```jsx
{currentRoute === 'my-new' && (
  <ProtectedRoute route="my-new" role={effectiveRole} onNavigate={handleNavigate}>
    <MyNewPage />
  </ProtectedRoute>
)}
```

**4. Add to ROUTE_LABELS (for breadcrumbs):**
```javascript
'my-new': { label: 'My New Page', icon: '🆕' },
```

**5. Add to ROLE_NAVIGATION in rbacSystem.js (for each role that should see it):**
```javascript
citizen: [
  // ... existing items
  { id: 'my-new', label: 'My Feature', icon: '🆕' },
],
```

**6. Add route protection if needed (in rbacSystem.js):**
```javascript
export const ROUTE_PROTECTION = {
  'my-new': ['citizen', 'student', 'platform_admin', 'super_admin'],
};
```

---

## How to Add a New Feature

### Adding Data + Service

**1. Add data to the appropriate service file:**
```javascript
// src/services/enterprise100Service.js
export const MY_NEW_DATA = [
  { id: 'mn-1', title: 'Item 1', status: 'active', value: 42 },
  { id: 'mn-2', title: 'Item 2', status: 'pending', value: 18 },
];

export const myNewService = {
  getAll: () => getStored('myNew', MY_NEW_DATA),
  getById: (id) => getStored('myNew', MY_NEW_DATA).find(item => item.id === id),
  create: (item) => {
    const all = getStored('myNew', MY_NEW_DATA);
    const newItem = { ...item, id: `mn-${Date.now()}` };
    setStored('myNew', [...all, newItem]);
    return newItem;
  },
  update: (id, updates) => {
    const all = getStored('myNew', MY_NEW_DATA);
    const updated = all.map(item => item.id === id ? { ...item, ...updates } : item);
    setStored('myNew', updated);
    return updated.find(item => item.id === id);
  },
  delete: (id) => {
    const all = getStored('myNew', MY_NEW_DATA);
    const filtered = all.filter(item => item.id !== id);
    setStored('myNew', filtered);
  },
};
```

**2. Use in your page:**
```javascript
import { myNewService } from '../services/enterprise100Service';

export default function MyNewPage() {
  const [items, setItems] = useState(myNewService.getAll());

  const handleCreate = () => {
    const newItem = myNewService.create({ title: 'New Item', status: 'active', value: 0 });
    setItems(myNewService.getAll());
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id} className="glass-card" style={{ padding: '14px' }}>
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

---

## How to Add a New Role

**1. Add role definition (in rbacSystem.js):**
```javascript
export const ROLES = {
  // ... existing roles
  custom_role: { id: 'custom_role', label: 'Custom Role', level: 3, color: '#06b6d4', icon: '🔧', hierarchy: 125 },
};
```

**2. Add permissions (in rbacSystem.js):**
```javascript
export const ROLE_PERMISSIONS = {
  // ... existing roles
  custom_role: [
    'problem.read.public',
    'problem.read.organization',
    'solution.read.public',
    'project.read.organization',
    'analytics.read.organization',
    'user.update.own',
    'notification.read.own',
  ],
};
```

**3. Add navigation (in rbacSystem.js):**
```javascript
export const ROLE_NAVIGATION = {
  // ... existing roles
  custom_role: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Problems', icon: '🔍' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
};
```

**4. Add dashboard config (in rbacSystem.js):**
```javascript
export const DASHBOARD_CONFIG = {
  // ... existing roles
  custom_role: {
    title: 'Custom Dashboard',
    widgets: ['my_problems', 'organization_projects', 'recent_activity'],
  },
};
```

**5. Add to AuthSectorPage if users should be able to self-register as this role.**

---

## Feature Catalog

### Core Features (30)
| # | Feature | File | Description |
|---|---------|------|-------------|
| 1 | AI Problem Analysis | DetailPage | AI priority scoring |
| 2 | AI Solution Generation | SolutionMarketplacePage | Generate solutions |
| 3 | Civic Maps | ChallengeMap | Interactive Leaflet maps |
| 4 | University Collaboration | AiTeamBuilder | Student-team matching |
| 5 | NGO Matching | NgoMatchingPage | NGO-challenge matching |
| 6 | Industry Partnerships | FundingPage | CSR engagement |
| 7 | Civic Analytics | AnalyticsPage | Charts and trends |
| 8 | SLA Tracking | SlaTracker | Service level monitoring |
| 9 | Transparency Dashboard | TransparencyDashboardPage | Public accountability |
| 10 | Innovation Challenges | CivicChallengesPage | Competitions |
| 11 | Civic Intelligence | IntelligenceDashboardPage | Emerging problems |
| 12 | Gamification | AchievementsPage, LeaderboardPage | Badges, points |
| 13 | Expert Marketplace | ExpertMarketplacePage | Expert matching |
| 14 | Crowdfunding | FundingPage | Fundraising |
| 15 | Research Hub | ResearchHubPage | Research repository |
| 16 | Command Center | CommandCenterPage | Admin dashboard |
| 17 | Multilingual | advanced40Service | 8 languages |
| 18 | Voice Reporting | MobileReportWizard | Speech-to-text |
| 19 | AI Copilot | CivicAssistant | Chat assistant |
| 20 | Duplicate Detection | DuplicateDetector | Find duplicates |
| 21 | Civic Polls | CivicPollsPage | Community voting |
| 22 | Discussion Rooms | DetailPage | Threaded discussions |
| 23 | Project Management | ProjectManagementPage | Kanban + Gantt |
| 24 | Community Collections | ExplorePage | Curated lists |
| 25 | Problem Following | ExplorePage | Follow issues |
| 26 | Community Voting | CivicPollsPage | Vote on solutions |
| 27 | Volunteer System | ExplorePage | Volunteering |
| 28 | Civic Missions | ExplorePage | Gamified tasks |
| 29 | Evidence Gallery | DetailPage | Before/after media |
| 30 | Impact Measurement | GeospatialAnalyticsPage | ROI tracking |

### Advanced AI Features (40)
| # | Feature | File |
|---|---------|------|
| 1-10 | Root Cause, Summary, Debate, Sentiment, Feasibility, Cost, Roadmap, Risk, Policy Sim, Knowledge | AiAnalysisHubPage |
| 11-18 | Polls, Voting, Following, Collections, Discussions, Moderation, Badges, Volunteers | CivicPollsPage, ExplorePage |
| 19-26 | Workspace, Kanban, Gantt, Team Assign, Dependencies, Health, Milestones, Evidence | ProjectManagementPage |
| 27-32 | Gov Hierarchy, Geo Routing, Dept Scorecard, Escalation, Workflow, Approvals | DepartmentScorecardPage |
| 33-38 | Heatmap, Trends, Resolution Efficiency, Satisfaction, Geo Comparison, Impact ROI | GeospatialAnalyticsPage |
| 39-40 | Multilingual, Voice | advanced40Service, MobileReportWizard |

### Enterprise Features (100)
| # | Category | Feature | File |
|---|----------|---------|------|
| 1-10 | Intelligence | Digital Twin, Health Index, Ward Scores, Dependencies, Cascade, Risk Radar, Early Warning, Recurrence, Root Network, Intervention Sim | DigitalTwinPage, EnterpriseControlCenter |
| 11-20 | Citizen | Missions, Goals, Hubs, Reps, Petitions, Proposals, Budgeting, Priorities, Events, Registration | ExplorePage |
| 21-30 | Field Ops | Inspections, Checklists, Forms, Signatures, Photo Annotation, Evidence Chain, Timeline, Dispatch, Geofencing, Productivity | FieldOperationsPage |
| 31-40 | Assets | QR Codes, History, Ownership, Condition, Maintenance Prediction, Failure Risk, Cost, Replacement, Map, Correlation | EnterpriseControlCenter |
| 41-50 | Procurement | Inventory, Allocation, Requests, Availability, Conflict, Procurement, Approvals, Vendors, Performance, Analytics | EnterpriseControlCenter |
| 51-60 | Funding | Budget Workspace, Approval, Variance, Risk Alerts, Sources, Grants, Milestones, Reporting, Impact, Audit Trail | FundingPage |
| 61-70 | Knowledge | Library, Research Projects, Datasets, Requests, Matching, Expert Review, Knowledge Graph, Similar Cases, Best Practices, Replication | ResearchHubPage |
| 71-80 | Communication | Announcements, Scheduling, Targeted Notifications, Emergency Broadcast, Translation, SMS/Email, Templates, Delivery Analytics, Preferences, Quiet Hours | ActivityCenterPage |
| 81-90 | Platform | Org Verification, Identity, Accreditation, Org Health, Platform Health, Integrations, AI Providers, AI Usage, API Usage, Rate Limits | EnterpriseControlCenter |
| 91-100 | Security | Security Center, Event Timeline, Account Recovery, Auth Policy, Backups, Incidents, Postmortem, Disaster Recovery, Compliance, Enterprise Control | EnterpriseControlCenter |

---

## Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory (static files).

### Vercel

```bash
npx vercel
```

The build script automatically creates `dist/404.html` for SPA routing.

### Environment Variables

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=your-groq-key
```

### Supabase Setup (Optional)

If you want real database instead of mock data:

1. Create a Supabase project at supabase.com
2. Create these tables:
   - `challenges` — civic problems
   - `profiles` — user profiles
   - `teams` — project teams
   - `audit_logs` — audit trail
   - `ai_settings` — AI configuration
3. Enable Row Level Security (RLS)
4. Add the connection details to `.env.local`

---

## Troubleshooting

### "Supabase environment variables missing"
- Create `.env.local` with your Supabase URL and key
- Or just ignore it — the app works with mock data

### "Build fails"
- Run `npm install` to ensure all dependencies are installed
- Check for syntax errors in modified files

### "Page shows nothing"
- Check if the route is correct in App.jsx
- Check if the component is imported correctly
- Check browser console for errors

### "RBAC blocks access"
- Check if the route is in `ROUTE_PROTECTION`
- Check if the user's role is in the allowed list
- Use role impersonation (Super Admin) to test different roles

### "Mobile layout broken"
- Check if responsive CSS rules apply
- Test at 375px width (iPhone) and 768px width (tablet)
- Use Chrome DevTools device emulation

---

**Built with ❤️ for civic technology**
**CivicSolve AI — Making cities smarter, together.**
