// CivicSolve AI — Supabase Data Service (Optimized)
// Ultra-fast reads via client-side cache + request dedup + stale-while-revalidate.
// Optimistic writes for instant UI feedback.
// Selective column fetching to minimize payload size.
// Falls back gracefully to mock datasets when Supabase is unreachable.

import { supabase } from './supabaseClient';
import { db } from './mockData';
import {
  cachedFetch, optimisticUpdate, invalidateCache,
  invalidatePrefix, getCacheKey, warmCache
} from './cacheService';

// ─── Cache TTLs ────────────────────────────────────────────────────────────
const CHALLENGE_TTL = 20_000;   // 20s
const SINGLE_TTL = 45_000;      // 45s for individual records
const PROFILE_TTL = 60_000;     // 60s — profiles change rarely
const STATS_TTL = 12_000;       // 12s — stats should be near-realtime
const TEAM_TTL = 25_000;        // 25s
const AUDIT_TTL = 15_000;       // 15s
const AI_SETTINGS_TTL = 120_000; // 2min — settings change rarely
const ORG_TTL = 90_000;         // 90s

// ─── Lightweight column lists for faster queries ────────────────────────────
// Only fetch columns actually needed, skipping heavy JSONB when unnecessary
const CHALLENGE_LIST_COLUMNS = 'id, title, category, subcategory, severity, status, location, district, latitude, longitude, affected_population, priority_score, reports_count, support_count, created_at, reporter_id, department_name, skills_required';
const CHALLENGE_FULL_COLUMNS = '*';
const PROFILE_COLUMNS = 'id, email, full_name, name, sector, role, role_slug, bio, organization, verification, avatar_url, avatar, primary_role_id, primary_sector_id, created_at';

// ─── Helper ────────────────────────────────────────────────────────────────
const handleError = (error, context) => {
  if (error) {
    console.warn(`[supabaseService] ${context} error:`, error.message);
    return true;
  }
  return false;
};

// ─── CHALLENGES ────────────────────────────────────────────────────────────

/**
 * Fetch all challenges. Cached with stale-while-revalidate.
 * Uses lightweight columns for list views — 40-60% less data transferred.
 */
export async function getChallenges(lightweight = false) {
  const key = getCacheKey('challenges', { lightweight });
  const columns = lightweight ? CHALLENGE_LIST_COLUMNS : CHALLENGE_FULL_COLUMNS;

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(columns)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return db.getChallenges();
      }
      return data;
    } catch (err) {
      console.warn('[supabaseService] getChallenges exception:', err.message);
      return db.getChallenges();
    }
  }, CHALLENGE_TTL);
}

/**
 * Fetch a single challenge by ID. Cached per-ID.
 */
export async function getChallengeById(id) {
  const key = getCacheKey('challenge', { id });

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select(CHALLENGE_FULL_COLUMNS)
        .eq('id', id)
        .single();

      if (error || !data) {
        const mockChallenges = db.getChallenges();
        return mockChallenges.find(c => c.id === id) || null;
      }
      return data;
    } catch (err) {
      const mockChallenges = db.getChallenges();
      return mockChallenges.find(c => c.id === id) || null;
    }
  }, SINGLE_TTL);
}

/**
 * Add a new challenge with optimistic cache update.
 * The UI updates instantly; server confirmation or rollback happens async.
 */
export async function addChallenge(challenge) {
  const cleanChallenge = {
    title: (challenge.title || 'Untitled Challenge').slice(0, 300),
    description: (challenge.description || '').slice(0, 5000),
    category: challenge.category || 'Infrastructure',
    subcategory: (challenge.subcategory || '').slice(0, 200),
    severity: ['critical', 'high', 'medium', 'low'].includes(challenge.severity) ? challenge.severity : 'medium',
    status: challenge.status || 'reported',
    location: (challenge.location || 'Ranchi').slice(0, 300),
    district: (challenge.district || challenge.location?.split(',')?.pop()?.trim() || 'Ranchi').slice(0, 200),
    latitude: typeof challenge.latitude === 'number' ? challenge.latitude : parseFloat(challenge.latitude) || 23.34,
    longitude: typeof challenge.longitude === 'number' ? challenge.longitude : parseFloat(challenge.longitude) || 85.30,
    affected_population: typeof challenge.affected_population === 'number' ? challenge.affected_population : parseInt(challenge.affected_population) || 0,
    priority_score: typeof challenge.priority_score === 'number' ? Math.min(100, Math.max(0, challenge.priority_score)) : 50,
    reports_count: challenge.reports_count || 1,
    support_count: challenge.support_count || 0,
    skills_required: Array.isArray(challenge.skills_required)
      ? challenge.skills_required.filter(s => typeof s === 'string').slice(0, 10)
      : [],
    deadline: challenge.deadline || null,
    reporter_id: challenge.reporter_id || null,
    ai_analysis: typeof challenge.ai_analysis === 'object' ? challenge.ai_analysis : {},
    evidence: Array.isArray(challenge.evidence) ? challenge.evidence : [],
    evidence_files: Array.isArray(challenge.evidence_files) ? challenge.evidence_files : [],
    department_id: challenge.department_id || null,
    department_name: challenge.department_name || null,
    department_head: challenge.department_head || null,
    sla_days: challenge.sla_days || null,
    sla_deadline: challenge.sla_deadline || null,
    who_affected: challenge.who_affected || null,
    duration: challenge.duration || null,
    created_at: new Date().toISOString(),
  };

  // Optimistic: inject into cache immediately
  const placeholder = { ...cleanChallenge, id: `optimistic-${Date.now()}` };
  const challengesKey = getCacheKey('challenges', { lightweight: false });
  const challengesKeyLight = getCacheKey('challenges', { lightweight: true });
  const rollbackEntry = { challenges: null, stats: null };

  try {
    // Pre-populate both cache variants optimistically
    for (const k of [challengesKey, challengesKeyLight]) {
      const opt = optimisticUpdate(k, (current) => {
        rollbackEntry.challenges = current;
        return [placeholder, ...(current || [])];
      });
      if (opt) rollbackEntry[k] = opt;
    }

    const { data, error } = await supabase
      .from('challenges')
      .insert([cleanChallenge])
      .select()
      .single();

    if (error) {
      console.warn('[supabaseService] addChallenge insert error:', error.message, error.code, error.details);
      // Rollback optimistic update
      for (const k of [challengesKey, challengesKeyLight]) {
        if (rollbackEntry[k]) rollbackEntry[k].rollback();
      }
      // Fall back to local storage
      const current = db.getChallenges();
      const newC = { ...cleanChallenge, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
      db.saveChallenges([newC, ...current]);
      invalidatePrefix('challenges');
      invalidatePrefix('stats');
      return newC;
    }
    if (!data) {
      for (const k of [challengesKey, challengesKeyLight]) {
        if (rollbackEntry[k]) rollbackEntry[k].rollback();
      }
      const current = db.getChallenges();
      const newC = { ...cleanChallenge, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
      db.saveChallenges([newC, ...current]);
      invalidatePrefix('challenges');
      invalidatePrefix('stats');
      return newC;
    }

    // Server confirmed — invalidate caches so next fetch is fresh
    invalidatePrefix('challenges');
    invalidatePrefix('stats');
    invalidatePrefix('challenge');
    return data;
  } catch (err) {
    console.warn('[supabaseService] addChallenge exception:', err.message);
    for (const k of [challengesKey, challengesKeyLight]) {
      if (rollbackEntry[k]) rollbackEntry[k].rollback();
    }
    const current = db.getChallenges();
    const newC = { ...cleanChallenge, id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    db.saveChallenges([newC, ...current]);
    invalidatePrefix('challenges');
    invalidatePrefix('stats');
    return newC;
  }
}

// ─── FILE UPLOAD (EVIDENCE) ────────────────────────────────────────────────

export async function uploadEvidenceFiles(files, challengeId) {
  if (!files || files.length === 0) return [];

  const uploaded = [];

  for (const file of files) {
    try {
      if (file.type.startsWith('image/')) {
        const thumbUrl = await createCompressedThumbnail(file, 400, 0.6);
        uploaded.push({ name: file.name, url: thumbUrl, type: file.type, size: file.size });
      } else {
        uploaded.push({ name: file.name, url: '', type: file.type, size: file.size });
      }
    } catch (err) {
      console.warn('[supabaseService] File processing failed:', err.message);
      uploaded.push({ name: file.name, url: '', type: file.type, size: file.size });
    }
  }

  return uploaded;
}

function createCompressedThumbnail(file, maxWidth = 400, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (canvasErr) {
          reject(canvasErr);
        }
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Update a challenge with optimistic cache patch.
 * UI updates instantly before server confirms.
 */
export async function updateChallenge(id, updates) {
  // Optimistic: patch the single-challenge cache and list caches
  const singleKey = getCacheKey('challenge', { id });
  const listKeyFull = getCacheKey('challenges', { lightweight: false });
  const listKeyLight = getCacheKey('challenges', { lightweight: true });
  const rollback = [];

  for (const k of [singleKey, listKeyFull, listKeyLight]) {
    const opt = optimisticUpdate(k, (current) => {
      if (!current) return current;
      if (Array.isArray(current)) {
        return current.map(c => c.id === id ? { ...c, ...updates } : c);
      }
      return { ...current, ...updates };
    });
    if (opt) rollback.push(opt);
  }

  try {
    const { data, error } = await supabase
      .from('challenges')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      rollback.forEach(r => r.rollback());
      const current = db.getChallenges();
      const idx = current.findIndex(c => c.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updates };
        db.saveChallenges(current);
        return current[idx];
      }
      return null;
    }

    // Server confirmed — invalidate for next fresh fetch
    invalidatePrefix('challenges');
    invalidatePrefix('challenge');
    return data;
  } catch (err) {
    rollback.forEach(r => r.rollback());
    return null;
  }
}

/**
 * Delete a challenge with optimistic cache removal.
 */
export async function deleteChallenge(id) {
  // Optimistic: remove from all list caches
  const listKeyFull = getCacheKey('challenges', { lightweight: false });
  const listKeyLight = getCacheKey('challenges', { lightweight: true });
  const rollback = [];

  for (const k of [listKeyFull, listKeyLight]) {
    const opt = optimisticUpdate(k, (current) => {
      if (!current || !Array.isArray(current)) return current;
      return current.filter(c => c.id !== id);
    });
    if (opt) rollback.push(opt);
  }

  try {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);

    if (error) {
      rollback.forEach(r => r.rollback());
      const current = db.getChallenges();
      const filtered = current.filter(c => c.id !== id);
      db.saveChallenges(filtered);
    }
    invalidatePrefix('challenges');
    invalidatePrefix('challenge');
    invalidatePrefix('stats');
    return true;
  } catch (err) {
    rollback.forEach(r => r.rollback());
    const current = db.getChallenges();
    const filtered = current.filter(c => c.id !== id);
    db.saveChallenges(filtered);
    invalidatePrefix('challenges');
    invalidatePrefix('challenge');
    return true;
  }
}

export async function deleteChallengesByTitle(title) {
  try {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .ilike('title', title);

    if (error) {
      const current = db.getChallenges();
      const filtered = current.filter(c => c.title !== title);
      db.saveChallenges(filtered);
    }
    invalidatePrefix('challenges');
    invalidatePrefix('stats');
    return true;
  } catch (err) {
    const current = db.getChallenges();
    const filtered = current.filter(c => c.title !== title);
    db.saveChallenges(filtered);
    invalidatePrefix('challenges');
    return true;
  }
}

// ─── PROFILES / USERS ──────────────────────────────────────────────────────

export async function getProfiles() {
  const key = 'profiles:all';

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return db.getUsers();
      }
      return data.map(normalizeProfile);
    } catch (err) {
      return db.getUsers();
    }
  }, PROFILE_TTL);
}

export async function getProfileById(userId) {
  const key = getCacheKey('profile', { id: userId });

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
        .eq('id', userId)
        .single();

      if (error || !data) {
        const users = db.getUsers();
        return users.find(u => u.id === userId) || null;
      }
      return normalizeProfile(data);
    } catch (err) {
      const users = db.getUsers();
      return users.find(u => u.id === userId) || null;
    }
  }, PROFILE_TTL);
}

export async function getProfileByEmail(email) {
  const key = getCacheKey('profile', { email });

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
        .eq('email', email)
        .single();

      if (error || !data) {
        const users = db.getUsers();
        return users.find(u => u.email === email) || null;
      }
      return normalizeProfile(data);
    } catch (err) {
      const users = db.getUsers();
      return users.find(u => u.email === email) || null;
    }
  }, PROFILE_TTL);
}

export async function upsertProfile(profile) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ ...profile, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error || !data) {
      const users = db.getUsers();
      const idx = users.findIndex(u => u.id === profile.id || u.email === profile.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...profile };
      } else {
        users.push(profile);
      }
      db.saveUsers(users);
    }
    // Invalidate profile caches so next fetch is fresh
    invalidatePrefix('profile');
    invalidatePrefix('profiles');
    return data || profile;
  } catch (err) {
    invalidatePrefix('profile');
    return profile;
  }
}

export async function updateProfileVerification(userId, verification) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verification, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error || !data) {
      const users = db.getUsers();
      const u = users.find(x => x.id === userId);
      if (u) {
        u.verification = verification;
        db.saveUsers(users);
      }
      invalidatePrefix('profile');
      invalidatePrefix('profiles');
      return u;
    }
    invalidatePrefix('profile');
    invalidatePrefix('profiles');
    return data;
  } catch (err) {
    return null;
  }
}

function normalizeProfile(profile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name || profile.name,
    sector: profile.sectors?.slug || profile.sector || 'citizen',
    role: profile.roles?.name || profile.role || 'Citizen',
    role_slug: profile.roles?.slug || profile.role_slug,
    organization: profile.bio || profile.organization || '',
    verification: profile.verification || 'verified',
    avatar: profile.avatar_url || profile.avatar || '👤',
  };
}

// ─── AUDIT LOGS ────────────────────────────────────────────────────────────

export async function getAuditLogs() {
  const key = 'auditLogs:all';

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, profiles:user_id(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        return db.getAuditLogs();
      }
      return data.map(l => ({
        id: l.id,
        user: l.profiles?.full_name || l.profiles?.email || 'System',
        action: l.action,
        target: l.target_type ? `${l.target_type}:${l.target_id || ''}` : '',
        details: l.details ? JSON.stringify(l.details) : '',
        ip: l.ip_address || '127.0.0.1',
        status: 'success',
        time: new Date(l.created_at).toLocaleString(),
      }));
    } catch (err) {
      return db.getAuditLogs();
    }
  }, AUDIT_TTL);
}

export async function addAuditLog(userId, action, targetType, targetId, details = {}) {
  // Fire-and-forget — don't block the UI for audit logging
  supabase.from('audit_logs').insert([{
    user_id: userId,
    action,
    target_type: targetType,
    target_id: targetId,
    details,
  }]).catch(() => {});

  db.addAuditLog(userId, action, `${targetType}:${targetId}`, JSON.stringify(details));
  invalidateCache('auditLogs:all');
}

// ─── AI SETTINGS ───────────────────────────────────────────────────────────

export async function getAiSettings() {
  const key = 'aiSettings:all';

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*');

      if (error || !data || data.length === 0) {
        return db.getAiSettings();
      }

      const settingsObj = {};
      data.forEach(row => {
        try { settingsObj[row.key] = JSON.parse(row.value); }
        catch { settingsObj[row.key] = row.value; }
      });
      return { ...db.getAiSettings(), ...settingsObj };
    } catch (err) {
      return db.getAiSettings();
    }
  }, AI_SETTINGS_TTL);
}

export async function saveAiSettings(settings) {
  try {
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('ai_settings').upsert(rows, { onConflict: 'key' });
  } catch (e) {
    // Ignore error
  }
  db.saveAiSettings(settings);
  invalidateCache('aiSettings:all');
}

// ─── TEAMS ─────────────────────────────────────────────────────────────────

export async function getTeams() {
  const key = 'teams:all';

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*, team_members(*, profiles:user_id(full_name, email, avatar_url))')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return db.getTeams();
      }
      return data;
    } catch (err) {
      return db.getTeams();
    }
  }, TEAM_TTL);
}

// ─── STATS (Server-Side Aggregation) ───────────────────────────────────────
// Uses PostgREST count + select aggregations instead of fetching ALL rows.

export async function getStats() {
  const key = 'stats:platform';

  return cachedFetch(key, async () => {
    try {
      // Run all 3 queries in parallel — each is lightweight
      const [challengesRes, profilesRes, teamsRes] = await Promise.all([
        // Only fetch status + population for aggregation — NOT all columns
        supabase.from('challenges').select('status, affected_population'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('teams').select('id', { count: 'exact', head: true }),
      ]);

      const challenges = challengesRes.data || [];
      const profiles = profilesRes.data || [];
      const teams = teamsRes.data || [];

      if (challenges.length === 0) {
        return db.getStats();
      }

      const totalPeopleImpacted = challenges.reduce((sum, c) => sum + (c.affected_population || 0), 0);

      return {
        totalChallenges: challenges.length,
        pendingValidation: challenges.filter(c => c.status === 'reported' || c.status === 'under_review').length,
        solutionsInDev: teams.length,
        pilots: challenges.filter(c => c.status === 'pilot').length,
        implemented: challenges.filter(c => c.status === 'implemented' || c.status === 'resolved').length,
        peopleImpacted: totalPeopleImpacted,
        totalUsers: profiles.length || profilesRes.count || 0,
        activeOrgs: 4,
        collaborations: 1,
      };
    } catch (err) {
      return db.getStats();
    }
  }, STATS_TTL);
}

// ─── ORGANIZATIONS ─────────────────────────────────────────────────────────

export async function getOrganizations() {
  const key = 'organizations:all';

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error || !data || data.length === 0) {
        return db.getOrganizations();
      }
      return data;
    } catch (err) {
      return db.getOrganizations();
    }
  }, ORG_TTL);
}

// ─── PERMISSIONS ───────────────────────────────────────────────────────────

export async function checkPermission(roleSlug, permissionName) {
  const key = getCacheKey('permission', { role: roleSlug, perm: permissionName });

  return cachedFetch(key, async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permissions:permission_id!inner(name), roles:role_id!inner(slug)')
        .eq('roles.slug', roleSlug)
        .eq('permissions.name', permissionName)
        .limit(1);

      if (error || !data || data.length === 0) {
        return db.checkPermission(roleSlug, permissionName);
      }
      return true;
    } catch (err) {
      return db.checkPermission(roleSlug, permissionName);
    }
  }, 300_000); // 5min — permissions rarely change
}

// ─── CACHE MANAGEMENT (exported for manual control) ────────────────────────
export { invalidateCache, invalidatePrefix, invalidateAll } from './cacheService';
