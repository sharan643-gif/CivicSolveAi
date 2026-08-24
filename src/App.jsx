import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Search, Bell, AlertCircle, LogOut, User, ChevronDown, ArrowLeft, Home, Compass, Lightbulb, ShieldCheck, DollarSign, BookOpen, FileText, LayoutDashboard, Plus } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { getChallenges, getStats, addChallenge, addAuditLog, getProfileById } from './services/supabaseService';
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

// Navigation Components
import MobilePillNav from './components/MobilePillNav';
import Aurora from './components/Aurora';
import Silk from './components/Silk';

// Mobile Pages
import MobileLandingPage from './pages/MobileLandingPage';
import MobileReportWizard from './pages/MobileReportWizard';
import MobileAdminConsole from './pages/MobileAdminConsole';

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
    const [newChallenges, newStats] = await Promise.all([getChallenges(), getStats()]);
    setChallenges(newChallenges);
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
    // Strip client-only fields before inserting
    const { id: _id, evidence, timeline, comments, ...insertable } = newChallenge;
    const saved = await addChallenge(insertable);
    if (saved) {
      await refreshDatabaseState();
      addToast('Challenge Submitted', `"${newChallenge.title}" — AI Priority: ${newChallenge.priority_score}/100.`, 'success');
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
          />
        )}
      </div>
    );
  }

  if (authState === 'super-admin-login') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <SuperAdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  // ─── Shell Rendering ─────────────────────────────────────────────────────────
  const activeUnreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* ── Silk WebGL Background — fixed bottom layer ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <Silk
          speed={8}
          scale={1.4}
          color="#22094e"
          noiseIntensity={2.2}
          rotation={0.4}
        />
        {/* Dark veil — keeps text readable */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 7, 12, 0.5)',
        }} />
      </div>

      {/* Toast Notifications — Liquid Glass */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2000, maxWidth: '360px', width: '90%' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'rgba(12, 16, 28, 0.88)',
            backdropFilter: 'blur(48px) saturate(2)',
            WebkitBackdropFilter: 'blur(48px) saturate(2)',
            border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            boxShadow: '0 16px 48px -12px rgba(0,0,0,0.6), 0 4px 16px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
            animation: 'toastEnter 0.4s cubic-bezier(0.22, 1.2, 0.36, 1) forwards',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Inner highlight */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
              pointerEvents: 'none', borderRadius: 'inherit',
            }} />
            <div style={{ color: t.type === 'success' ? '#10b981' : '#ef4444', padding: '2px', flexShrink: 0, position: 'relative' }}>
              <AlertCircle size={18} />
            </div>
            <div style={{ position: 'relative' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{t.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>{t.message}</p>
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
      />
      </div>

      {/* Router Main Content */}
      <main className="container" style={{ flexGrow: 1, padding: isMobile ? '16px 16px 90px' : '32px 24px', width: '100%', position: 'relative', zIndex: 1 }}>

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
          currentUser?.sector === 'super_admin' && isMobile ? <MobileAdminConsole /> : <CommandCenterPage />
        )}
        {currentRoute === 'funding' && (
          <FundingPage />
        )}
        {currentRoute === 'research-hub' && (
          <ResearchHubPage />
        )}
        {currentRoute === 'report' && (
          isMobile ? <MobileReportWizard onSubmit={handleCreateChallenge} onBack={() => handleNavigate('landing')} /> : <SubmitPage onSubmit={handleCreateChallenge} challenges={challenges} onNavigate={handleNavigate} />
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

      {/* Footer (Liquid Glass) — Hidden on Mobile */}
      {!isMobile && (
        <footer style={{
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(10, 14, 24, 0.6)',
          backdropFilter: 'blur(32px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
          padding: '28px 0',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          position: 'relative',
          zIndex: 1,
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ color: 'var(--text-secondary)' }}>© 2026 CivicSolve AI · National Societal Innovation Operating System</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>Database: <strong style={{ color: 'var(--primary)' }}>Supabase PostgreSQL</strong></div>
              <div>AI Engine: <strong style={{ color: 'var(--ai-purple)' }}>Groq · groq/compound</strong></div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Pill Navigation */}
      {isMobile && (
        <MobilePillNav
          activeTab={currentRoute}
          onSelectTab={handleNavigate}
          currentUser={currentUser}
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
    </div>
  );
}

// ─── App Header — Liquid Glass ─────────────────────────────────────────────────
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
}) {
  const getSectorColor = (sector) => {
    const map = { citizen: '#06b6d4', government: '#3b82f6', university: '#f59e0b', student: '#10b981', industry: '#ec4899', expert: '#8b5cf6', ngo: '#f97316', startup: '#06b6d4', incubator: '#10b981', research: '#8b5cf6', funding: '#f59e0b', super_admin: '#ef4444' };
    return map[sector] || '#3b82f6';
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: isMobile ? 'max(8px, var(--safe-top))' : '16px',
      paddingBottom: isMobile ? '8px' : '16px',
      transition: 'all 0.4s var(--ease-out-expo)',
      pointerEvents: 'none',
    }}>
      <nav
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: isMobile ? 'calc(100% - 32px)' : '95%',
          maxWidth: isMobile ? '420px' : '1320px',
          height: isMobile ? '60px' : '72px',
          padding: isMobile ? '0 8px' : '0 12px 0 24px',
          background: 'rgba(16, 20, 34, 0.45)',
          backdropFilter: 'blur(48px) saturate(2)',
          WebkitBackdropFilter: 'blur(48px) saturate(2)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          boxShadow:
            '0 16px 56px -12px rgba(0, 0, 0, 0.7), ' +
            '0 4px 16px -4px rgba(0, 0, 0, 0.4), ' +
            'inset 0 1px 0 rgba(255, 255, 255, 0.1), ' +
            '0 0 0 1px rgba(59, 130, 246, 0.04)',
          pointerEvents: 'auto',
          overflow: 'visible',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isScrolled && !isMobile ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {/* Aurora Background — clipped to pill shape */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 0,
        }}>
          <Aurora colorStops={['#5227FF', '#7cff67', '#5227FF']} blend={0.5} amplitude={1.0} speed={0.4} />
        </div>

        {/* Inner top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 1,
        }} />

        {/* Logo */}
        <div onClick={() => onNavigate('landing')} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '10px', cursor: 'pointer', marginRight: isMobile ? 'auto' : '24px', flexShrink: 0, zIndex: 2 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--ai-purple))',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <Sparkles size={isMobile ? 16 : 18} color="white" />
          </div>
          <span style={{
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
            color: 'white',
          }}>
            CivicSolve <span style={{ color: 'var(--primary)' }}>AI</span>
          </span>
        </div>

        {/* Desktop Navigation Items */}
        {!isMobile && (
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: '4px', position: 'relative', zIndex: 1 }}>
            {NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.isPrimary) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      boxShadow: '0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      flexShrink: 0,
                      margin: '0 8px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2)';
                    }}
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '10px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    WebkitTapHighlightColor: 'transparent',
                    minHeight: '44px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    }
                  }}
                >
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      color: isActive ? 'rgba(255,255,255,1)' : 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
                    }}
                  />
                  <span style={{ letterSpacing: '0.01em' }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', marginLeft: isMobile ? '0' : '24px', zIndex: 2, flexShrink: 0 }}>
          {/* Search Button — Glass Pill */}
          <button
            onClick={() => setIsCommandOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              padding: isMobile ? '10px' : '7px 10px',
              width: isMobile ? '38px' : 'auto',
              height: isMobile ? '38px' : 'auto',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Search size={isMobile ? 16 : 14} />
            {!isMobile && (
              <kbd style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-body)',
              }}>Ctrl+K</kbd>
            )}
          </button>

          {/* Notifications — Glass Pill */}
          <div data-dropdown style={{ position: 'relative' }}>
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsUserMenuOpen(false); }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: isMobile ? '10px' : '8px',
                width: isMobile ? '38px' : 'auto',
                height: isMobile ? '38px' : 'auto',
                borderRadius: '9999px',
                cursor: 'pointer',
                color: activeUnreadCount > 0 ? 'white' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <Bell size={isMobile ? 17 : 16} />
              {activeUnreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: isMobile ? '2px' : '-3px', right: isMobile ? '2px' : '-3px',
                  background: 'var(--danger)', color: 'white',
                  fontSize: '0.58rem', fontWeight: 800,
                  width: '15px', height: '15px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg-primary)',
                }}>{activeUnreadCount}</span>
              )}
            </button>
            {isNotifOpen && (
              <div className="slide-down glass-l4" data-dropdown style={{
                position: 'absolute', top: '42px', right: 0, width: '300px',
                padding: '8px', zIndex: 1000,
              }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Notifications</div>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => { setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x)); setIsNotifOpen(false); }}
                    style={{ padding: '10px', borderRadius: '10px', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(59,130,246,0.06)', marginBottom: '4px', transition: 'background 0.15s ease' }}
                  >
                    <strong style={{ color: 'white', fontSize: '0.8rem', display: 'block' }}>{n.title}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem', lineHeight: 1.4 }}>{n.text}</span>
                  </div>
                ))}
                <button onClick={() => { setNotifications([]); setIsNotifOpen(false); }}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', padding: '8px', borderRadius: '6px', transition: 'color 0.15s ease' }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* User Auth state — Glass Pill */}
          {!currentUser ? (
            <button onClick={onLoginClick} className="btn btn-primary" style={{ padding: isMobile ? '8px 18px' : '10px 22px', fontSize: '0.82rem', borderRadius: '9999px', fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}>
              Sign In
            </button>
          ) : (
            <div data-dropdown style={{ position: 'relative' }}>
              <button
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotifOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: `${getSectorColor(currentUser.sector)}18`,
                  border: `1px solid ${getSectorColor(currentUser.sector)}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px',
                }}>
                  {currentUser.avatar || '👤'}
                </div>
                {!isMobile && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{(currentUser.name || currentUser.email).split(' ')[0]}</div>
                    <div style={{ fontSize: '0.62rem', color: getSectorColor(currentUser.sector), lineHeight: 1.2 }}>{currentUser.role}</div>
                  </div>
                )}
                <ChevronDown size={12} color="var(--text-muted)" />
              </button>

              {isUserMenuOpen && (
                <div className="slide-down glass-l4" data-dropdown style={{
                  position: 'absolute', top: '44px', right: 0, width: '230px',
                  padding: '8px', zIndex: 1000,
                }}>
                  <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{currentUser.name || 'User'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{currentUser.email}</div>
                  </div>
                  <button onClick={() => { onNavigate('dashboard'); setIsUserMenuOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.82rem', borderRadius: '8px', transition: 'all 0.15s ease', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <User size={14} /> My Dashboard
                  </button>
                  <button onClick={onLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '10px', cursor: 'pointer', color: '#f87171', fontSize: '0.82rem', borderRadius: '8px', transition: 'all 0.15s ease', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={14} /> Sign Out
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
    }}>
      {/* Back Button — Glass Pill */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px',
          padding: isMobile ? '8px 14px' : '9px 18px',
          color: 'var(--text-secondary)',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <ArrowLeft size={15} />
        {canGoBack ? 'Back' : 'Home'}
      </button>

      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: isMobile ? '0.75rem' : '0.8rem',
        color: 'var(--text-muted)',
        overflow: 'hidden',
        flexShrink: 1, minWidth: 0,
      }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 'inherit', padding: '0', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, transition: 'color 0.15s ease' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Home size={13} />
          {!isMobile && <span>Home</span>}
        </button>
        <span style={{ opacity: 0.4 }}>/</span>
        <span style={{
          color: '#fff', fontWeight: 700,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {current.icon} {current.label}
        </span>
      </div>
    </div>
  );
}
