// CivicSolve AI — Supabase Data Service
// Drop-in replacement for the localStorage `db` object in mockData.js
// All reads/writes go to Supabase PostgreSQL.

import { supabase } from './supabaseClient';

// ─── Helper ────────────────────────────────────────────────────────────────────
const handleError = (error, context) => {
  if (error) {
    console.error(`[supabaseService] ${context}:`, error.message);
    return true;
  }
  return false;
};

// ─── CHALLENGES ───────────────────────────────────────────────────────────────

export async function getChallenges() {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });
  if (handleError(error, 'getChallenges')) return [];
  return data || [];
}

export async function getChallengeById(id) {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();
  if (handleError(error, 'getChallengeById')) return null;
  return data;
}

export async function addChallenge(challenge) {
  const { data, error } = await supabase
    .from('challenges')
    .insert([challenge])
    .select()
    .single();
  if (handleError(error, 'addChallenge')) return null;
  return data;
}

export async function updateChallenge(id, updates) {
  const { data, error } = await supabase
    .from('challenges')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (handleError(error, 'updateChallenge')) return null;
  return data;
}

// ─── PROFILES / USERS ─────────────────────────────────────────────────────────

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
    .order('created_at', { ascending: false });
  if (handleError(error, 'getProfiles')) return [];
  return (data || []).map(normalizeProfile);
}

export async function getProfileById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
    .eq('id', userId)
    .single();
  if (handleError(error, 'getProfileById')) return null;
  return data ? normalizeProfile(data) : null;
}

export async function getProfileByEmail(email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles:primary_role_id(name, slug), sectors:primary_sector_id(name, slug)')
    .eq('email', email)
    .single();
  if (handleError(error, 'getProfileByEmail')) return null;
  return data ? normalizeProfile(data) : null;
}

export async function upsertProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ ...profile, updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (handleError(error, 'upsertProfile')) return null;
  return data;
}

export async function updateProfileVerification(userId, verification) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ verification, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (handleError(error, 'updateProfileVerification')) return null;
  return data;
}

// ─── NORMALIZE profile row to match the app's user shape ─────────────────────
function normalizeProfile(profile) {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    sector: profile.sectors?.slug || 'citizen',
    role: profile.roles?.name || 'Citizen',
    role_slug: profile.roles?.slug,
    organization: profile.bio || '',
    verification: profile.verification,
    avatar: getSectorIcon(profile.sectors?.slug),
    avatar_url: profile.avatar_url,
    skills: profile.skills || [],
    created_at: profile.created_at,
  };
}

function getSectorIcon(slug) {
  const icons = {
    citizen: '👤', government: '🏛', university: '🎓', student: '💻',
    industry: '🏢', expert: '🕵️', ngo: '🤝', startup: '🚀',
    incubator: '🌱', research: '🔬', funding: '💰', super_admin: '👑',
  };
  return icons[slug] || '👤';
}

// ─── SECTORS & ROLES ──────────────────────────────────────────────────────────

export async function getSectors() {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .eq('active', true)
    .order('name');
  if (handleError(error, 'getSectors')) return [];
  return data || [];
}

export async function getRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*, sectors:sector_id(name, slug)')
    .order('name');
  if (handleError(error, 'getRoles')) return [];
  return data || [];
}

export async function getRoleById(roleId) {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single();
  if (handleError(error, 'getRoleById')) return null;
  return data;
}

export async function getRoleBySectorAndName(sectorSlug, roleName) {
  const { data, error } = await supabase
    .from('roles')
    .select('*, sectors:sector_id!inner(slug)')
    .eq('sectors.slug', sectorSlug)
    .eq('name', roleName)
    .single();
  if (handleError(error, 'getRoleBySectorAndName')) return null;
  return data;
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

export async function getAuditLogs(limit = 100) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, profiles:user_id(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (handleError(error, 'getAuditLogs')) return [];
  return (data || []).map(log => ({
    id: log.id,
    user: log.profiles?.email || 'System',
    action: log.action,
    target: log.target,
    details: typeof log.details === 'object' ? JSON.stringify(log.details) : (log.details || ''),
    ip: log.ip_address || 'N/A',
    status: log.status,
    time: new Date(log.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    timestamp: log.created_at,
  }));
}

export async function addAuditLog(userId, action, target, details) {
  const { error } = await supabase
    .from('audit_logs')
    .insert([{
      user_id: userId || null,
      action,
      target: target || '',
      details: { message: details },
      status: 'success',
    }]);
  if (error) console.error('[supabaseService] addAuditLog:', error.message);
}

// ─── AI SETTINGS ──────────────────────────────────────────────────────────────

export async function getAiSettings() {
  const { data, error } = await supabase
    .from('ai_settings')
    .select('*');
  if (handleError(error, 'getAiSettings')) return getDefaultAiSettings();
  if (!data || data.length === 0) return getDefaultAiSettings();

  // Convert rows into key-value object
  const settings = {};
  data.forEach(row => {
    settings[row.key] = { value: row.value, enabled: row.enabled, model_name: row.model_name, confidence_threshold: row.confidence_threshold };
  });
  return {
    duplicate_detection: settings.duplicate_detection?.enabled ?? true,
    priority_scoring: settings.priority_scoring?.enabled ?? true,
    team_matching: settings.team_matching?.enabled ?? true,
    model: settings.duplicate_detection?.model_name || 'google/gemini-2.5-flash',
    threshold: settings.duplicate_detection?.confidence_threshold || 0.75,
  };
}

function getDefaultAiSettings() {
  return { duplicate_detection: true, priority_scoring: true, team_matching: true, model: 'google/gemini-2.5-flash', threshold: 0.75 };
}

export async function saveAiSettings(settings) {
  const rows = [
    { key: 'duplicate_detection', enabled: settings.duplicate_detection, model_name: settings.model, confidence_threshold: settings.threshold, updated_at: new Date().toISOString() },
    { key: 'priority_scoring', enabled: settings.priority_scoring, model_name: settings.model, confidence_threshold: settings.threshold, updated_at: new Date().toISOString() },
    { key: 'team_matching', enabled: settings.team_matching, model_name: settings.model, confidence_threshold: settings.threshold, updated_at: new Date().toISOString() },
  ];
  const { error } = await supabase.from('ai_settings').upsert(rows, { onConflict: 'key' });
  if (error) console.error('[supabaseService] saveAiSettings:', error.message);
}

// ─── TEAMS ────────────────────────────────────────────────────────────────────

export async function getTeams() {
  const { data, error } = await supabase
    .from('teams')
    .select('*, team_members(*, profiles:user_id(full_name, email, avatar_url))')
    .order('created_at', { ascending: false });
  if (handleError(error, 'getTeams')) return [];
  return data || [];
}

// ─── STATS (AGGREGATED) ───────────────────────────────────────────────────────

export async function getStats() {
  const [challengesRes, profilesRes, teamsRes] = await Promise.all([
    supabase.from('challenges').select('status, affected_population'),
    supabase.from('profiles').select('id'),
    supabase.from('teams').select('id'),
  ]);

  const challenges = challengesRes.data || [];
  const profiles = profilesRes.data || [];
  const teams = teamsRes.data || [];

  const totalPeopleImpacted = challenges.reduce((sum, c) => sum + (c.affected_population || 0), 0);

  return {
    totalChallenges: challenges.length,
    pendingValidation: challenges.filter(c => c.status === 'reported' || c.status === 'under_review').length,
    solutionsInDev: teams.length,
    pilots: challenges.filter(c => c.status === 'pilot').length,
    implemented: challenges.filter(c => c.status === 'implemented' || c.status === 'resolved').length,
    peopleImpacted: totalPeopleImpacted,
    totalUsers: profiles.length,
    activeOrgs: 0,
    collaborations: 0,
  };
}

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────

export async function getOrganizations() {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name');
  if (handleError(error, 'getOrganizations')) return [];
  return data || [];
}

// ─── PERMISSIONS ──────────────────────────────────────────────────────────────

export async function checkPermission(roleSlug, permissionName) {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permissions:permission_id!inner(name), roles:role_id!inner(slug)')
    .eq('roles.slug', roleSlug)
    .eq('permissions.name', permissionName)
    .limit(1);
  if (error) return false;
  return (data || []).length > 0;
}
