// CivicSolve AI — Supabase Data Service
// Seamlessly queries Supabase PostgreSQL tables.
// If Supabase tables are unseeded (0 records) or unreachable on deployment,
// falls back gracefully to `db` mock datasets so the app NEVER displays empty screens.

import { supabase } from './supabaseClient';
import { db } from './mockData';

// ─── Helper ────────────────────────────────────────────────────────────────────
const handleError = (error, context) => {
  if (error) {
    console.warn(`[supabaseService] ${context} error:`, error.message);
    return true;
  }
  return false;
};

// ─── CHALLENGES ───────────────────────────────────────────────────────────────

export async function getChallenges() {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return db.getChallenges();
    }
    return data;
  } catch (err) {
    console.warn('[supabaseService] getChallenges exception:', err.message);
    return db.getChallenges();
  }
}

export async function getChallengeById(id) {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
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
}

export async function addChallenge(challenge) {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select()
      .single();

    if (error || !data) {
      const current = db.getChallenges();
      const newC = { ...challenge, id: challenge.id || `c-${Date.now()}` };
      db.saveChallenges([newC, ...current]);
      return newC;
    }
    return data;
  } catch (err) {
    const current = db.getChallenges();
    const newC = { ...challenge, id: challenge.id || `c-${Date.now()}` };
    db.saveChallenges([newC, ...current]);
    return newC;
  }
}

export async function updateChallenge(id, updates) {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      const current = db.getChallenges();
      const idx = current.findIndex(c => c.id === id);
      if (idx !== -1) {
        current[idx] = { ...current[idx], ...updates };
        db.saveChallenges(current);
        return current[idx];
      }
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}

// ─── PROFILES / USERS ─────────────────────────────────────────────────────────

export async function getProfiles() {
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
}

export async function getProfileById(userId) {
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
}

export async function getProfileByEmail(email) {
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
      return profile;
    }
    return data;
  } catch (err) {
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
      return u;
    }
    return data;
  } catch (err) {
    return null;
  }
}

// ─── NORMALIZE profile row to match the app's user shape ─────────────────────
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

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

export async function getAuditLogs() {
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
}

export async function addAuditLog(userId, action, targetType, targetId, details = {}) {
  try {
    if (userId) {
      await supabase.from('audit_logs').insert([{
        user_id: userId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      }]);
    }
  } catch (e) {
    // Ignore audit log error
  }
  db.addAuditLog(userId, action, `${targetType}:${targetId}`, JSON.stringify(details));
}

// ─── AI SETTINGS ──────────────────────────────────────────────────────────────

export async function getAiSettings() {
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
}

// ─── TEAMS ────────────────────────────────────────────────────────────────────

export async function getTeams() {
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
}

// ─── STATS (AGGREGATED) ───────────────────────────────────────────────────────

export async function getStats() {
  try {
    const [challengesRes, profilesRes, teamsRes] = await Promise.all([
      supabase.from('challenges').select('status, affected_population'),
      supabase.from('profiles').select('id'),
      supabase.from('teams').select('id'),
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
      totalUsers: profiles.length,
      activeOrgs: 4,
      collaborations: 1,
    };
  } catch (err) {
    return db.getStats();
  }
}

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────

export async function getOrganizations() {
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
}

// ─── PERMISSIONS ──────────────────────────────────────────────────────────────

export async function checkPermission(roleSlug, permissionName) {
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
}
