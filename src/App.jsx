import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Search, Bell, AlertCircle, LogOut, User, ChevronDown, ArrowLeft, Home, Compass, Lightbulb, ShieldCheck, DollarSign, BookOpen, FileText, LayoutDashboard, Plus, Trophy, BarChart3, Brain, Heart, Eye, Zap, Award, Map, Mic, Camera } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { getChallenges, getStats, addChallenge, updateChallenge, addAuditLog, getProfileById, uploadEvidenceFiles, invalidatePrefix } from './services/supabaseService';
import LandingPage from './pages/LandingPage';
import ExplorePage from './pages/ExplorePage';
import SubmitPage from './pages/SubmitPage';
import DetailPage from './pages/DetailPage';
import DashboardPage from './pages/DashboardPage';
import SolutionMarketplacePage from './pages/SolutionMarketplacePage';
import CommandCenterPage from './pages/CommandCenterPage';
import FundingPage from './pages/FundingPage';
import ResearchHubPage from './pages/ResearchHubPage';
import AuthLandingPage from './pages/AuthLandingPage';
import AuthSectorPage from './pages/AuthSectorPage';
import SuperAdminLogin from './pages/SuperAdminLogin';
import CommandMenu from './components/CommandMenu';
import CivicAssistant from './components/CivicAssistant';
import JanSetuVoiceAgent from './components/JanSetuVoiceAgent';
import AiInspectionModal from './components/AiInspectionModal';

// Navigation Components
import MobilePillNav from './components/MobilePillNav';

// Mobile Pages
import MobileLandingPage from './pages/MobileLandingPage';
import MobileReportWizard from './pages/MobileReportWizard';
import MobileAdminConsole from './pages/MobileAdminConsole';

// 30 Advanced Feature Pages
import AchievementsPage from './pages/AchievementsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ExpertMarketplacePage from './pages/ExpertMarketplacePage';
import NgoMatchingPage from './pages/NgoMatchingPage';
import TransparencyDashboardPage from './pages/TransparencyDashboardPage';
import CivicChallengesPage from './pages/CivicChallengesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import IntelligenceDashboardPage from './pages/IntelligenceDashboardPage';

// 40 Advanced Feature Pages
import AiAnalysisHubPage from './pages/AiAnalysisHubPage';
import CivicPollsPage from './pages/CivicPollsPage';
import ProjectManagementPage from './pages/ProjectManagementPage';
import ActivityCenterPage from './pages/ActivityCenterPage';
import UserProfilePage from './pages/UserProfilePage';
import EmergingProblemsPage from './pages/EmergingProblemsPage';
import JudgeModePage from './pages/JudgeModePage';
import DistrictScorecardPage from './pages/DistrictScorecardPage';
import AskJanSetuModal from './components/AskJanSetuModal';
import EnterpriseControlCenter from './pages/EnterpriseControlCenter';
import DigitalTwinPage from './pages/DigitalTwinPage';
import FieldOperationsPage from './pages/FieldOperationsPage';
import DepartmentDashboardPage from './pages/DepartmentDashboardPage';
import DepartmentScorecardPage from './pages/DepartmentScorecardPage';

// RBAC System
import { hasPermission, isRouteAllowed, ROLE_NAVIGATION, ROLES, DASHBOARD_CONFIG } from './services/rbacSystem';
import { AccessDeniedPage, ProtectedRoute, PermissionGuard } from './components/ProtectedRoute';
import DynamicSidebar from './components/DynamicSidebar';

// ─── Scroll Reveal Hook ─────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-stagger');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
}

// ─── Scroll-Aware Header Hook ───────────────────────────────────────
function useScrollAware() {
  const [scrollState, setScrollState] = useState({ isScrolled: false, scrollY: 0 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollState({
            isScrolled: window.scrollY > 20,
            scrollY: window.scrollY,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollState;
}

const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb },
  { id: 'command-center', label: 'Command', icon: ShieldCheck },
  { id: 'funding', label: 'Funding', icon: DollarSign },
  { id: 'research-hub', label: 'Research', icon: BookOpen },
  { id: 'report', label: 'Report', icon: FileText, isPrimary: true },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function App() {
  // ─── Authentication State ───────────────────────────────────────────────────
  const [authState, setAuthState] = useState('unauthenticated');
  const [selectedSector, setSelectedSector] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ─── Navigation State ────────────────────────────────────────────────────────
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [activeChallengeId, setActiveChallengeId] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);

  // ─── Mobile Viewport Detection ──────────────────────────────────────────────
  const checkMobile = () =>
    window.innerWidth <= 768 || (window.innerHeight / window.innerWidth) > 1.15;

  const [isMobile, setIsMobile] = useState(checkMobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({ totalChallenges: 0, pendingValidation: 0, solutionsInDev: 0, pilots: 0, implemented: 0, peopleImpacted: 0, totalUsers: 0 });
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isAskJanSetuOpen, setIsAskJanSetuOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voicePreFillData, setVoicePreFillData] = useState(null);
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [inspectPreFillData, setInspectPreFillData] = useState(null);

  // ─── RBAC State ─────────────────────────────────────────────────────────────
  const [impersonateRole, setImpersonateRole] = useState(null);
  const effectiveRole = impersonateRole || currentUser?.role || 'guest';

  // Role switching for demo (Super Admin only)
  const handleRoleSwitch = (newRole) => {
    if (currentUser?.role === 'super_admin' || currentUser?.role === 'platform_admin') {
      setImpersonateRole(newRole);
      addToast('Role Switched', `Now viewing as ${ROLES[newRole]?.label || newRole}`, 'success');
    }
  };

  const handleExitImpersonation = () => {
    setImpersonateRole(null);
    addToast('Impersonation Ended', 'Returned to original role.', 'success');
  };

  // RBAC Navigation items based on effective role
  const rbacNavItems = ROLE_NAVIGATION[effectiveRole] || ROLE_NAVIGATION.citizen;

  // ─── Supabase session restoration + data loading ────────────────────────────
  useEffect(() => {
    // Restore existing session on page load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getProfileById(session.user.id);
        if (profile) {
          setCurrentUser({
            id: session.user.id,
            email: profile.email,
            name: profile.name,
            sector: profile.sector,
            role: profile.role,
            role_slug: profile.role_slug,
            organization: profile.organization,
            verification: profile.verification,
            avatar: profile.avatar,
          });
          setAuthState('authenticated');
          setCurrentRoute('dashboard');
        }
      }
    });

    // Listen for auth changes (login/logout from other tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setAuthState('unauthenticated');
        setCurrentRoute('landing');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─── Load challenges & stats from Supabase ───────────────────────────────────
  useEffect(() => {
    refreshDatabaseState();
  }, []);

  // ─── Real-Time Global Challenge Update Listener ─────────────────────────────
  useEffect(() => {
    const handleGlobalUpdate = (event) => {
      const updatedItem = event.detail;
      if (!updatedItem || !updatedItem.id) return;
      setChallenges(prev => {
        const exists = prev.some(c => c.id === updatedItem.id);
        if (exists) {
          return prev.map(c => c.id === updatedItem.id ? { ...c, ...updatedItem } : c);
        }
        return [updatedItem, ...prev];
      });
      addToast('📢 Public Update Broadcast', `Progress updated to "${updatedItem.status_label || updatedItem.status}" for all citizens.`, 'success');
    };
    window.addEventListener('civicsolve_challenge_updated', handleGlobalUpdate);
    return () => window.removeEventListener('civicsolve_challenge_updated', handleGlobalUpdate);
  }, []);


  // ─── Scroll Reveal + Awareness ──────────────────────────────────────────────
  useScrollReveal();
  const { isScrolled } = useScrollAware();

  // ─── Keyboard Shortcut: Ctrl+K ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Click outside to close dropdowns ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (isNotifOpen || isUserMenuOpen) {
        const target = e.target;
        if (!target.closest('[data-dropdown]')) {
          setIsNotifOpen(false);
          setIsUserMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isNotifOpen, isUserMenuOpen]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const addToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  };

  const refreshDatabaseState = async () => {
    // Use lightweight column set for list views — 40-60% less data transferred
    const [newChallenges, newStats] = await Promise.all([getChallenges(true), getStats()]);

    // Merge localStorage evidence data (reliable fallback for uploaded images)
    try {
      const localEvidence = JSON.parse(localStorage.getItem('civicsolve_evidence') || '{}');
      newChallenges.forEach(c => {
        if (localEvidence[c.id] && (!c.evidence || c.evidence.length === 0)) {
          c.evidence = localEvidence[c.id];
        }
      });
    } catch (lsErr) {
      // ignore
    }

    // Deduplicate: keep unique challenges by (title + description + location)
    const seen = new Set();
    const cleaned = newChallenges.filter(c => {
      const key = `${(c.title || '').trim()}|${(c.description || '').trim().slice(0, 100)}|${(c.location || '').trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setChallenges(cleaned);
    setStats(newStats);
  };

  const handleNavigate = (route) => {
    setRouteHistory(prev => [...prev, currentRoute]);
    if (route === 'sector-select') {
      setAuthState('sector-select');
    } else if (route.startsWith('challenge/')) {
      const id = route.split('/')[1];
      setActiveChallengeId(id);
      setCurrentRoute('challenge-detail');
    } else {
      setCurrentRoute(route);
    }
    setIsNotifOpen(false);
    setIsUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (routeHistory.length > 0) {
      const prev = routeHistory[routeHistory.length - 1];
      setRouteHistory(h => h.slice(0, -1));
      setCurrentRoute(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentRoute('landing');
    }
  };

  const handleCreateChallenge = async (newChallenge) => {
    const evidenceItems = newChallenge.evidence || newChallenge.evidence_files || [];
    
    // Strip only client-only runtime fields before inserting to DB
    const { id: _id, timeline, comments, _rawFiles, ...insertable } = newChallenge;
    // Ensure required fields have defaults
    insertable.title = insertable.title || 'Untitled Challenge';
    insertable.description = insertable.description || '';
    insertable.status = insertable.status || 'reported';
    insertable.created_at = insertable.created_at || new Date().toISOString();
    insertable.priority_score = insertable.priority_score || 50;
    insertable.skills_required = insertable.skills_required || [];
    insertable.support_count = insertable.support_count || 0;
    insertable.reports_count = insertable.reports_count || 1;
    insertable.evidence = evidenceItems;
    insertable.evidence_files = evidenceItems;
    insertable.ai_analysis = {
      ...(insertable.ai_analysis || {}),
      evidence: evidenceItems
    };

    const saved = await addChallenge(insertable);

    if (saved) {
      const challengeKey = saved.id || newChallenge.id;

      // Always save evidence to localStorage as fast, reliable fallback
      if (evidenceItems.length > 0) {
        try {
          const localEvidence = JSON.parse(localStorage.getItem('civicsolve_evidence') || '{}');
          localEvidence[challengeKey] = evidenceItems;
          if (newChallenge.id) localEvidence[newChallenge.id] = evidenceItems;
          if (saved.id) localEvidence[saved.id] = evidenceItems;
          localStorage.setItem('civicsolve_evidence', JSON.stringify(localEvidence));
        } catch (lsErr) {
          console.warn('[App] localStorage save failed:', lsErr.message);
        }
      }

      await refreshDatabaseState();
      addToast('Challenge Submitted', `"${newChallenge.title}" — AI Priority: ${newChallenge.priority_score}/100.${evidenceItems.length > 0 ? ` ${evidenceItems.length} photo(s) attached.` : ''}`, 'success');
    } else {
      addToast('Error', 'Failed to submit challenge. Please try again.', 'error');
    }
    setCurrentRoute('dashboard');
  };

  // ─── Auth Handlers ────────────────────────────────────────────────────────────
  const handleSectorSelect = (sectorId) => {
    if (sectorId === 'super_admin') {
      setAuthState('super-admin-login');
    } else {
      setSelectedSector(sectorId);
      setAuthState('sector-login');
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setAuthState('authenticated');
    setCurrentRoute('dashboard');
    if (user.justRegistered) {
      addToast('Registration Submitted', 'Your account is pending admin verification. You have limited access until verified.', 'success');
    } else {
      addToast('Welcome Back!', `Signed in as ${user.name || user.email} · ${user.role}`, 'success');
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      await addAuditLog(currentUser.id, 'USER_LOGOUT', currentUser.email, `Role: ${currentUser.role}`);
    }
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAuthState('unauthenticated');
    setCurrentRoute('landing');
    setIsUserMenuOpen(false);
    addToast('Signed Out', 'You have been signed out securely.', 'success');
  };

  // ─── Auth overlay pages ───────────────────────────────────────────────────────
  if (authState === 'sector-select') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <AppHeader
          currentRoute={currentRoute}
          currentUser={null}
          isNotifOpen={isNotifOpen}
          setIsNotifOpen={setIsNotifOpen}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          isCommandOpen={isCommandOpen}
          setIsCommandOpen={setIsCommandOpen}
          onNavigate={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
          onLoginClick={() => setAuthState('sector-select')}
          onLogout={handleLogout}
          isMobile={isMobile}
          isScrolled={false}
          activeTab="landing"
          onSelectTab={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
        />
        <main className="container" style={{ flexGrow: 1, padding: isMobile ? '20px 16px 90px' : '20px 24px' }}>
          <BackButton
            onBack={() => setAuthState('unauthenticated')}
            canGoBack={true}
            currentRoute="sector-select"
            onNavigate={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
            isMobile={isMobile}
          />
          <AuthLandingPage onSelect={handleSectorSelect} onBack={() => setAuthState('unauthenticated')} />
        </main>
        {isMobile && (
          <MobilePillNav
            activeTab="landing"
            onSelectTab={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
            currentUser={currentUser}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}
      </div>
    );
}

  if (authState === 'sector-login' && selectedSector) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <AppHeader
          currentRoute={currentRoute}
          currentUser={null}
          isNotifOpen={isNotifOpen}
          setIsNotifOpen={setIsNotifOpen}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          isCommandOpen={isCommandOpen}
          setIsCommandOpen={setIsCommandOpen}
          onNavigate={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
          onLoginClick={() => setAuthState('sector-select')}
          onLogout={handleLogout}
          isMobile={isMobile}
          isScrolled={false}
          activeTab="landing"
          onSelectTab={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
        />
        <main className="container" style={{ flexGrow: 1, padding: isMobile ? '20px 16px 90px' : '20px 24px' }}>
          <BackButton
            onBack={() => setAuthState('sector-select')}
            canGoBack={true}
            currentRoute="sector-login"
            onNavigate={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
            isMobile={isMobile}
          />
          <AuthSectorPage
            sectorId={selectedSector}
            onBack={() => setAuthState('sector-select')}
            onLogin={handleLogin}
          />
        </main>
        {isMobile && (
          <MobilePillNav
            activeTab="landing"
            onSelectTab={(r) => { handleNavigate(r); setAuthState('unauthenticated'); }}
            currentUser={currentUser}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}
      </div>
    );
  }

  if (authState === 'super-admin-login') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <SuperAdminLogin onLogin={handleLogin} onBack={() => setAuthState('sector-select')} />
      </div>
    );
  }

  // ─── Shell Rendering ─────────────────────────────────────────────────────────
  const activeUnreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-primary)' }}>

      {/* Toast Notifications — Government Style */}
      <div style={{ position: 'fixed', top: '16px', right: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2000, maxWidth: '360px', width: '90%' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: '#ffffff',
            border: `1px solid ${t.type === 'success' ? '#b8dfbb' : '#f5c6c6'}`,
            borderLeft: `4px solid ${t.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            animation: 'toastEnter 0.25s ease forwards',
          }}>
            <div style={{ color: t.type === 'success' ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
              <AlertCircle size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 700 }}>{t.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* App Header (Liquid Glass) */}
      <div style={{ position: 'relative', zIndex: 100 }}>
      <AppHeader
        currentRoute={currentRoute}
        currentUser={currentUser}
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        notifications={notifications}
        setNotifications={setNotifications}
        isCommandOpen={isCommandOpen}
        setIsCommandOpen={setIsCommandOpen}
        onNavigate={handleNavigate}
        onLoginClick={() => setAuthState('sector-select')}
        onLogout={handleLogout}
        activeUnreadCount={activeUnreadCount}
        isMobile={isMobile}
        isScrolled={isScrolled}
        activeTab={currentRoute}
        onSelectTab={handleNavigate}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenInspect={() => setIsInspectOpen(true)}
      />
      </div>

      {/* Router Main Content */}
      <main className="container" style={{ flexGrow: 1, padding: isMobile ? '16px 14px 110px' : '32px 24px', width: '100%', position: 'relative', zIndex: 1 }}>

        {/* Universal Back Button */}
        {currentRoute !== 'landing' && (
          <BackButton
            onBack={handleBack}
            canGoBack={routeHistory.length > 0}
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            isMobile={isMobile}
          />
        )}

        {currentRoute === 'landing' && (
          isMobile ? <MobileLandingPage onNavigate={handleNavigate} stats={stats} /> : <LandingPage onNavigate={handleNavigate} stats={stats} featuredChallenges={challenges} />
        )}
        {currentRoute === 'explore' && (
          <ExplorePage challenges={challenges} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'solutions' && (
          <SolutionMarketplacePage onNavigate={handleNavigate} />
        )}
        {currentRoute === 'command-center' && (
          <ProtectedRoute route="command-center" role={effectiveRole} onNavigate={handleNavigate}>
            {currentUser?.sector === 'super_admin' && isMobile ? <MobileAdminConsole /> : <CommandCenterPage />}
          </ProtectedRoute>
        )}
        {currentRoute === 'funding' && (
          <FundingPage />
        )}
        {currentRoute === 'research-hub' && (
          <ResearchHubPage />
        )}
        {currentRoute === 'achievements' && (
          <AchievementsPage currentUser={currentUser} />
        )}
        {currentRoute === 'leaderboard' && (
          <LeaderboardPage onNavigate={handleNavigate} />
        )}
        {currentRoute === 'dept-dashboard' && (
          <DepartmentDashboardPage currentUser={currentUser} challenges={challenges} onNavigate={handleNavigate} />
        )}
        {currentRoute === 'expert-marketplace' && (
          <ExpertMarketplacePage />
        )}
        {currentRoute === 'ngo-matching' && (
          <NgoMatchingPage />
        )}
        {currentRoute === 'transparency' && (
          <TransparencyDashboardPage />
        )}
        {currentRoute === 'civic-challenges' && (
          <CivicChallengesPage />
        )}
        {currentRoute === 'analytics' && (
          <AnalyticsPage challenges={challenges} />
        )}
        {currentRoute === 'intelligence' && (
          <ProtectedRoute route="intelligence" role={effectiveRole} onNavigate={handleNavigate}>
            <IntelligenceDashboardPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'ai-hub' && (
          <ProtectedRoute route="ai-hub" role={effectiveRole} onNavigate={handleNavigate}>
            <AiAnalysisHubPage challengeId={activeChallengeId || 'monsoon-road-accessibility'} onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}
        {currentRoute === 'polls' && (
          <ProtectedRoute route="polls" role={effectiveRole} onNavigate={handleNavigate}>
            <CivicPollsPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'projects' && (
          <ProtectedRoute route="projects" role={effectiveRole} onNavigate={handleNavigate}>
            <ProjectManagementPage onNavigate={handleNavigate} />
          </ProtectedRoute>
        )}
        {currentRoute === 'activity' && (
          <ProtectedRoute route="activity" role={effectiveRole} onNavigate={handleNavigate}>
            <ActivityCenterPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'departments' && (
          <ProtectedRoute route="departments" role={effectiveRole} onNavigate={handleNavigate}>
            <DepartmentScorecardPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'geospatial' && (
          <ProtectedRoute route="geospatial" role={effectiveRole} onNavigate={handleNavigate}>
            <GeospatialAnalyticsPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'profile' && (
          <UserProfilePage currentUser={currentUser} />
        )}
        {currentRoute === 'enterprise' && (
          <ProtectedRoute route="enterprise" role={effectiveRole} onNavigate={handleNavigate}>
            <EnterpriseControlCenter />
          </ProtectedRoute>
        )}
        {currentRoute === 'digital-twin' && (
          <ProtectedRoute route="digital-twin" role={effectiveRole} onNavigate={handleNavigate}>
            <DigitalTwinPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'emerging-problems' && (
          <EmergingProblemsPage onNavigate={handleNavigate} />
        )}
        {currentRoute === 'demo' && (
          <JudgeModePage onNavigate={handleNavigate} />
        )}
        {currentRoute === 'district-scorecard' && (
          <DistrictScorecardPage onNavigate={handleNavigate} />
        )}
        {currentRoute === 'field-ops' && (
          <ProtectedRoute route="field-ops" role={effectiveRole} onNavigate={handleNavigate}>
            <FieldOperationsPage />
          </ProtectedRoute>
        )}
        {currentRoute === 'dept-dashboard' && (
          <DepartmentDashboardPage
            currentUser={currentUser}
            challenges={challenges}
            onNavigate={handleNavigate}
          />
        )}
        {currentRoute === 'report' && (
          isMobile ? <MobileReportWizard onSubmit={handleCreateChallenge} onBack={() => handleNavigate('landing')} preFillData={voicePreFillData} onOpenVoice={() => setIsVoiceOpen(true)} onOpenInspect={() => setIsInspectOpen(true)} /> : <SubmitPage onSubmit={handleCreateChallenge} challenges={challenges} onNavigate={handleNavigate} preFillData={voicePreFillData || inspectPreFillData} onOpenVoice={() => setIsVoiceOpen(true)} onOpenInspect={() => setIsInspectOpen(true)} />
        )}
        {currentRoute === 'challenge-detail' && (
          <DetailPage
            challengeId={activeChallengeId}
            onNavigate={handleNavigate}
            currentUserRole={currentUser?.role || 'citizen'}
          />
        )}
        {currentRoute === 'dashboard' && (
          <DashboardPage
            activeRole={currentUser?.role || 'citizen'}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            challenges={challenges}
          />
        )}
      </main>

      {/* Footer — Government Style */}
      {!isMobile && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'linear-gradient(180deg, #f4f2ef 0%, #ebe8e3 100%)',
          padding: '32px 0 24px',
          color: 'var(--text-secondary)',
          fontSize: '0.82rem',
          position: 'relative',
          zIndex: 1,
          marginTop: 'auto',
        }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '20px' }}>
              <div>
                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>CivicSolve AI</div>
                <div style={{ color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.6 }}>National Societal Innovation Operating System · Powered by AI for better governance.</div>
              </div>
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {['Accessibility', 'Privacy Policy', 'Terms of Use', 'Contact Us'].map(l => <span key={l} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.15s ease' }}>{l}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '8px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Technology</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Supabase PostgreSQL</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Google Gemini AI Engine</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Open Source</span>
                  </div>
                </div>
              </div>
            </div>              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>© 2026 CivicSolve AI. All rights reserved. Government of India Initiative.</div>
              <div style={{ color: 'var(--text-muted)' }}>Last updated: August 2026</div>
            </div>
          </div>
        </footer>
      )}

      {/* Impersonation Banner */}
      {impersonateRole && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))',
          backdropFilter: 'blur(12px)', padding: '8px 16px',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
            👁️ Impersonating: <strong>{ROLES[impersonateRole]?.label || impersonateRole}</strong>
          </span>
          <button onClick={handleExitImpersonation} style={{
            padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
            fontSize: '0.75rem', fontWeight: 600,
          }}>Exit Impersonation</button>
        </div>
      )}

      {/* Dynamic Sidebar */}
      {!isMobile && currentUser && (
        <DynamicSidebar
          role={effectiveRole}
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          isMobile={false}
        />
      )}

      {/* Mobile Pill Navigation */}
      {isMobile && (
        <MobilePillNav
          activeTab={currentRoute}
          onSelectTab={handleNavigate}
          currentUser={currentUser}
          onOpenVoice={() => setIsVoiceOpen(true)}
        />
      )}

      {/* Command Palette */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSwitchRole={(role) => { addToast('Role Switched', `Now viewing as ${role}`, 'success'); setCurrentRoute('dashboard'); }}
        onNavigate={handleNavigate}
        challenges={challenges}
      />
      <CivicAssistant challenges={challenges} />
      <AskJanSetuModal isOpen={isAskJanSetuOpen} onClose={() => setIsAskJanSetuOpen(false)} userRole={effectiveRole} />
      <JanSetuVoiceAgent
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigate={handleNavigate}
        onAutoFillReport={(data) => {
          setVoicePreFillData(data);
          handleNavigate('report');
        }}
      />
      <AiInspectionModal
        isOpen={isInspectOpen}
        onClose={() => setIsInspectOpen(false)}
        onSubmitInspection={(data) => {
          setInspectPreFillData(data);
          setIsInspectOpen(false);
          handleNavigate('report');
        }}
      />
    </div>
  );
}

// ─── App Header — iOS 27 Floating Pill ──────────────────────────────────────────
function AppHeader({
  currentRoute, currentUser,
  isNotifOpen, setIsNotifOpen,
  isUserMenuOpen, setIsUserMenuOpen,
  notifications, setNotifications,
  isCommandOpen, setIsCommandOpen,
  onNavigate, onLoginClick, onLogout,
  activeUnreadCount = 0,
  isMobile = false,
  isScrolled = false,
  activeTab = 'landing',
  onSelectTab = () => {},
  onOpenVoice = () => {},
  onOpenInspect = () => {},
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: isMobile ? 'max(8px, var(--safe-top))' : '10px',
      paddingBottom: isMobile ? '8px' : '10px',
      background: 'linear-gradient(180deg, #f4f2ef 0%, #faf9f7 100%)',
      borderBottom: '1px solid var(--border-subtle)',
      pointerEvents: 'none',
    }}>
      <nav
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: isMobile ? 'calc(100% - 16px)' : '98%',
          maxWidth: isMobile ? '400px' : '1500px',
          height: isMobile ? '44px' : '48px',
          padding: isMobile ? '0 6px' : '0 10px 0 6px',
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(27,42,74,0.03)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          overflow: 'visible',
          boxSizing: 'border-box',
        }}
      >

        {/* Logo */}
        <div
          onClick={() => onNavigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '5px' : '7px',
            cursor: 'pointer',
            flexShrink: 0,
            zIndex: 2,
            minWidth: 0,
            paddingRight: isMobile ? '2px' : '8px',
          }}
        >
          <div style={{
            background: 'var(--primary)',
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Sparkles size={isMobile ? 15 : 16} color="white" />
          </div>
          <span style={{
            fontSize: isMobile ? '0.82rem' : '0.88rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
            color: 'var(--primary)',
            whiteSpace: 'nowrap',
          }}>
            JanSetu <span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </div>

        {/* Divider: Logo ↔ Nav */}
        {!isMobile && (
          <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, marginRight: '4px' }} />
        )}

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
            {NAV_ITEMS.filter(i => !i.isPrimary).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 9px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    cursor: 'pointer',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    height: '32px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--primary-light)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={12} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Report CTA — visually distinct from nav links */}
        {!isMobile && (
          <button
            onClick={() => onSelectTab('report')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent), #cc4e00)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
              height: '32px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(255,98,0,0.3)',
              transition: 'box-shadow 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,98,0,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,98,0,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Plus size={13} strokeWidth={2.5} />
            Report
          </button>
        )}

        {/* Spacer — pushes right section to edge on mobile */}
        {isMobile && <div style={{ flex: 1 }} />}

        {/* Mobile Icon-Only Buttons */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <button
              onClick={onOpenVoice}
              title="Voice AI"
              style={{
                width: '34px', height: '34px', borderRadius: '50%', border: 'none',
                background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255,98,0,0.35)', flexShrink: 0,
              }}
            >
              <Mic size={16} />
            </button>
            <button
              onClick={onOpenInspect}
              title="AI Inspect"
              style={{
                width: '34px', height: '34px', borderRadius: '50%', border: 'none',
                background: 'var(--primary)', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,48,135,0.35)', flexShrink: 0,
              }}
            >
              <Camera size={16} />
            </button>
          </div>
        )}

        {/* Spacer — pushes right section to the right */}
        <div style={{ flex: 1 }} />

        {/* Right Section — Utility Icons + Auth */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '2px' : '3px',
          zIndex: 2,
          flexShrink: 0,
        }}>
          {/* Voice AI — icon only on desktop */}
          {!isMobile && (
            <button
              onClick={onOpenVoice}
              title="Open JanSetu Voice AI"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: '9999px',
                color: '#fff',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(255,98,0,0.3)',
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,98,0,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(255,98,0,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Mic size={14} />
            </button>
          )}

          {/* AI Inspect — icon only on desktop */}
          {!isMobile && (
            <button
              onClick={onOpenInspect}
              title="Open AI Camera Inspection"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px',
                background: 'var(--primary)',
                border: 'none',
                borderRadius: '9999px',
                color: '#fff',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,48,135,0.3)',
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,48,135,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,48,135,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Camera size={14} />
            </button>
          )}

          {/* Search — desktop only */}
          {!isMobile && (
            <button
              onClick={() => setIsCommandOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '9999px',
                padding: '4px 8px',
                height: '32px',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Search size={12} />
              <kbd style={{
                background: '#f0f0f0',
                border: '1px solid var(--border-medium)',
                padding: '1px 4px',
                borderRadius: '3px',
                fontSize: '0.56rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
              }}>Ctrl+K</kbd>
            </button>
          )}

          {/* Notifications — desktop only */}
          {!isMobile && (
          <div data-dropdown style={{ position: 'relative' }}>
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); }}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-medium)',
                padding: '7px',
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                cursor: 'pointer',
                color: activeUnreadCount > 0 ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
            >
              <Bell size={14} />
              {activeUnreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  background: 'var(--danger)', color: 'white',
                  fontSize: '0.58rem', fontWeight: 800,
                  width: '15px', height: '15px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{activeUnreadCount}</span>
              )}
            </button>
            {isNotifOpen && (
              <div className="slide-down" data-dropdown style={{
                position: 'absolute', top: '46px', right: 0, width: '300px',
                padding: '8px', zIndex: 1000,
                background: '#ffffff', border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Notifications</div>
                {notifications.length === 0 && (
                  <div style={{ padding: '16px 10px', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>No new notifications</div>
                )}
                {notifications.map(n => (
                  <div key={n.id} onClick={() => { setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x)); setIsNotifOpen(false); }}
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: n.read ? 'transparent' : 'var(--primary-light)', marginBottom: '4px', transition: 'background 0.15s ease', borderLeft: n.read ? 'none' : '3px solid var(--primary)' }}
                  >
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.82rem', display: 'block' }}>{n.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.4 }}>{n.text}</span>
                  </div>
                ))}
                <button onClick={() => { setNotifications([]); setIsNotifOpen(false); }}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.76rem', cursor: 'pointer', padding: '8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontFamily: 'inherit' }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          )} {/* end !isMobile notifications */}

          {/* Divider: Utilities ↔ Auth */}
          {!isMobile && (
            <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, margin: '0 2px' }} />
          )}

          {/* User Auth state */}
          {!currentUser ? (
            <button onClick={onLoginClick} className="btn btn-primary" style={{ padding: isMobile ? '7px 12px' : '6px 14px', fontSize: isMobile ? '0.78rem' : '0.75rem', borderRadius: '9999px', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
              Sign In
            </button>
          ) : (
            <div data-dropdown style={{ position: 'relative' }}>
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'var(--primary-light)',
                  border: '1px solid rgba(0,48,135,0.2)',
                  borderRadius: '9999px',
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,48,135,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-light)'}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: '#fff', fontWeight: 700,
                }}>
                  {(currentUser.name || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                {!isMobile && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>{(currentUser.name || currentUser.email).split(' ')[0]}</div>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{currentUser.role}</div>
                  </div>
                )}
                <ChevronDown size={12} color="var(--text-muted)" />
              </button>

              {isUserMenuOpen && (
                <div className="slide-down" data-dropdown style={{
                  position: 'absolute', top: '46px', right: 0, width: '240px',
                  padding: '8px', zIndex: 1000,
                  background: '#fff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
                }}>
                  <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px', borderLeft: '3px solid var(--primary)', paddingLeft: '12px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name || 'User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  </div>
                  <button onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px 12px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s ease', textAlign: 'left', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <User size={15} color="var(--primary)" /> My Dashboard
                  </button>
                  <button onClick={onLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px 12px', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.15s ease', textAlign: 'left', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

// ─── Back Button — Liquid Glass ──────────────────────────────────────────────────
const ROUTE_LABELS = {
  'landing':         { label: 'Home',                 icon: '🏠' },
  'explore':         { label: 'Explore Issues',        icon: '🔍' },
  'solutions':       { label: 'Solutions Marketplace', icon: '💡' },
  'command-center':  { label: 'Command Center',        icon: '🛡️' },
  'funding':         { label: 'Funding & CSR',         icon: '💰' },
  'research-hub':    { label: 'Research Hub',          icon: '📚' },
  'report':          { label: 'Report Issue',          icon: '📋' },
  'dashboard':       { label: 'Dashboard',             icon: '📊' },
  'challenge-detail':{ label: 'Challenge',             icon: '📌' },
  'sector-select':   { label: 'Choose Sector',         icon: '🏛️' },
  'sector-login':    { label: 'Sign In',               icon: '🔐' },
  'achievements':    { label: 'Achievements',          icon: '🏆' },
  'leaderboard':     { label: 'Leaderboard',           icon: '📈' },
  'expert-marketplace': { label: 'Expert Marketplace', icon: '🕵️' },
  'ngo-matching':    { label: 'NGO Matching',          icon: '🤝' },
  'transparency':    { label: 'Transparency',          icon: '👁️' },
  'civic-challenges':{ label: 'Innovation Challenges', icon: '⚡' },
  'analytics':       { label: 'Analytics',             icon: '📊' },
  'intelligence':    { label: 'AI Intelligence',       icon: '🧠' },
  'ai-hub':         { label: 'AI Analysis Hub',        icon: '🔬' },
  'polls':           { label: 'Civic Polls',            icon: '🗳️' },
  'projects':        { label: 'Project Management',     icon: '📋' },
  'activity':        { label: 'Activity Center',        icon: '🔔' },
  'departments':     { label: 'Dept Scorecard',         icon: '🏛️' },
  'geospatial':      { label: 'Geospatial Analytics',   icon: '🗺️' },
  'profile':         { label: 'My Profile',             icon: '👤' },
  'enterprise':      { label: 'Enterprise Control',      icon: '🛡️' },
  'digital-twin':    { label: 'Digital Twin',           icon: '🏙️' },
  'field-ops':       { label: 'Field Operations',       icon: '📋' },
  'emerging-problems': { label: 'Emerging Problems Radar', icon: '📡' },
  'demo':            { label: 'SIH Judge & Guided Journey Mode', icon: '🏆' },
  'district-scorecard': { label: 'District Scorecard & Impact Ledger', icon: '📊' },
};

function BackButton({ onBack, canGoBack, currentRoute, onNavigate, isMobile }) {
  const current = ROUTE_LABELS[currentRoute] || { label: currentRoute, icon: '📄' };

  return (
    <div className="fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: isMobile ? '16px' : '20px',
      flexWrap: 'wrap',
      padding: '8px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Back Button — Gov Style */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: '#ffffff',
          border: '1px solid var(--border-medium)',
          borderRadius: '4px',
          padding: isMobile ? '6px 12px' : '7px 14px',
          color: 'var(--primary)',
          fontSize: isMobile ? '0.8rem' : '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; }}
      >
        <ArrowLeft size={14} />
        {canGoBack ? 'Back' : 'Home'}
      </button>

      {/* Breadcrumb — Gov Style */}
      <nav className="gov-breadcrumb">
        <button
          onClick={() => onNavigate('landing')}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.82rem', padding: '0', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
        >
          <Home size={12} />
          {!isMobile && <span>Home</span>}
        </button>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{
          color: 'var(--text-primary)', fontWeight: 600,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontSize: '0.82rem',
        }}>
          {current.label}
        </span>
      </nav>
    </div>
  );
}
