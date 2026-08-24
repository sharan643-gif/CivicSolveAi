// ═══════════════════════════════════════════════════════════════════════════════
// CivicSolve AI — Role-Based Access Control (RBAC) System
// Complete authorization framework: roles, permissions, scopes, helpers
// ═══════════════════════════════════════════════════════════════════════════════

// ─── 1. ROLE DEFINITIONS ─────────────────────────────────────────────────────

export const ROLE_HIERARCHY_LEVELS = {
  // Level 5 — Platform
  super_admin: 500,
  platform_admin: 450,
  platform_moderator: 400,
  // Level 4 — Government
  state_admin: 350,
  district_admin: 300,
  city_admin: 280,
  department_head: 250,
  department_officer: 220,
  field_officer: 200,
  // Level 3 — Organizations
  university_admin: 150,
  ngo_admin: 140,
  industry_partner: 130,
  startup: 120,
  // Level 2 — Community
  expert: 100,
  volunteer: 80,
  student: 70,
  // Level 1 — Public
  citizen: 50,
  guest: 0,
};

export const ROLES = {
  guest: { id: 'guest', label: 'Guest', level: 1, color: '#6b7280', icon: '👤', hierarchy: 0 },
  citizen: { id: 'citizen', label: 'Citizen', level: 1, color: '#06b6d4', icon: '👤', hierarchy: 50 },
  student: { id: 'student', label: 'Student', level: 2, color: '#10b981', icon: '🎓', hierarchy: 70 },
  volunteer: { id: 'volunteer', label: 'Volunteer', level: 2, color: '#10b981', icon: '🤝', hierarchy: 80 },
  expert: { id: 'expert', label: 'Expert', level: 2, color: '#8b5cf6', icon: '🕵️', hierarchy: 100 },
  university_admin: { id: 'university_admin', label: 'University Admin', level: 3, color: '#f59e0b', icon: '🎓', hierarchy: 150 },
  ngo_admin: { id: 'ngo_admin', label: 'NGO Admin', level: 3, color: '#10b981', icon: '🤝', hierarchy: 140 },
  industry_partner: { id: 'industry_partner', label: 'Industry Partner', level: 3, color: '#ec4899', icon: '🏢', hierarchy: 130 },
  startup: { id: 'startup', label: 'Startup', level: 3, color: '#06b6d4', icon: '🚀', hierarchy: 120 },
  field_officer: { id: 'field_officer', label: 'Field Officer', level: 4, color: '#f59e0b', icon: '📋', hierarchy: 200 },
  department_officer: { id: 'department_officer', label: 'Department Officer', level: 4, color: '#3b82f6', icon: '🏛️', hierarchy: 220 },
  department_head: { id: 'department_head', label: 'Department Head', level: 4, color: '#3b82f6', icon: '🏛️', hierarchy: 250 },
  city_admin: { id: 'city_admin', label: 'City Admin', level: 4, color: '#8b5cf6', icon: '🏙️', hierarchy: 280 },
  district_admin: { id: 'district_admin', label: 'District Admin', level: 4, color: '#8b5cf6', icon: '🗺️', hierarchy: 300 },
  state_admin: { id: 'state_admin', label: 'State Admin', level: 4, color: '#ef4444', icon: '🏛️', hierarchy: 350 },
  platform_moderator: { id: 'platform_moderator', label: 'Platform Moderator', level: 5, color: '#f59e0b', icon: '🛡️', hierarchy: 400 },
  platform_admin: { id: 'platform_admin', label: 'Platform Admin', level: 5, color: '#3b82f6', icon: '⚙️', hierarchy: 450 },
  super_admin: { id: 'super_admin', label: 'Super Admin', level: 5, color: '#ef4444', icon: '👑', hierarchy: 500 },
};

// ─── 2. PERMISSION DEFINITIONS ───────────────────────────────────────────────
// Format: resource.action.scope

export const RESOURCES = [
  'problem', 'solution', 'project', 'user', 'organization', 'department',
  'evidence', 'report', 'analytics', 'challenge', 'notification', 'ai',
  'audit_log', 'system', 'poll', 'discussion', 'volunteer', 'milestone',
  'task', 'funding', 'approval', 'workflow', 'escalation', 'export',
  'file', 'comment', 'collection', 'leaderboard', 'achievement',
];

export const ACTIONS = [
  'create', 'read', 'update', 'delete', 'assign', 'approve', 'reject',
  'verify', 'escalate', 'export', 'manage', 'moderate', 'vote', 'follow',
  'comment', 'support', 'submit', 'review', 'delegate',
];

export const SCOPES = [
  'own', 'team', 'organization', 'department', 'ward', 'city',
  'district', 'state', 'public', 'all',
];

// Helper to build permission strings
export const perm = (resource, action, scope) => `${resource}.${action}.${scope}`;

// ─── 3. PERMISSION MATRICES PER ROLE ─────────────────────────────────────────

export const ROLE_PERMISSIONS = {
  // ── GUEST ──
  guest: [
    'problem.read.public',
    'solution.read.public',
    'project.read.public',
    'challenge.read.public',
    'analytics.read.public',
    'leaderboard.read.public',
  ],

  // ── CITIZEN ──
  citizen: [
    // Problems
    'problem.create.own',
    'problem.read.public',
    'problem.read.own',
    'problem.update.own',
    'problem.follow.own',
    'problem.support.public',
    // Solutions
    'solution.read.public',
    'solution.submit.own',
    'solution.vote.public',
    // Projects
    'project.read.public',
    // Comments
    'comment.create.public',
    'comment.read.public',
    // Evidence
    'evidence.create.own',
    'evidence.read.own',
    // Profile
    'user.update.own',
    'user.read.own',
    // Notifications
    'notification.read.own',
    'notification.manage.own',
    // Polls
    'poll.read.public',
    'poll.vote.public',
    // Collections
    'collection.create.own',
    'collection.read.public',
    // Achievements
    'achievement.read.own',
    // Volunteer
    'volunteer.read.public',
    // Discussions
    'discussion.read.public',
    'discussion.create.public',
    // Reports
    'report.read.own',
    // Export
    'export.data.own',
  ],

  // ── STUDENT ──
  student: [
    // Inherits citizen minus some, adds:
    'problem.create.own',
    'problem.read.public',
    'problem.read.own',
    'problem.update.own',
    'solution.read.public',
    'solution.submit.own',
    'solution.vote.public',
    'project.read.public',
    'project.read.organization',
    'project.submit.own',
    'task.read.own',
    'task.update.own',
    'milestone.read.organization',
    'challenge.read.public',
    'challenge.submit.own',
    'achievement.read.own',
    'comment.create.public',
    'comment.read.public',
    'evidence.create.own',
    'evidence.read.own',
    'user.update.own',
    'user.read.own',
    'notification.read.own',
    'notification.manage.own',
    'discussion.read.public',
    'discussion.create.public',
    'export.data.own',
    'volunteer.read.public',
    'volunteer.join.public',
  ],

  // ── VOLUNTEER ──
  volunteer: [
    'problem.read.public',
    'problem.read.own',
    'problem.create.own',
    'problem.update.own',
    'solution.read.public',
    'solution.submit.own',
    'project.read.public',
    'project.read.organization',
    'task.read.own',
    'task.update.own',
    'evidence.create.own',
    'evidence.read.own',
    'volunteer.read.public',
    'volunteer.join.public',
    'volunteer.update.own',
    'comment.create.public',
    'comment.read.public',
    'user.update.own',
    'user.read.own',
    'notification.read.own',
    'notification.manage.own',
    'achievement.read.own',
    'export.data.own',
  ],

  // ── EXPERT ──
  expert: [
    'problem.read.public',
    'problem.read.own',
    'problem.create.own',
    'solution.read.public',
    'solution.submit.own',
    'solution.review.organization',
    'project.read.public',
    'project.read.organization',
    'task.read.organization',
    'comment.create.public',
    'comment.read.public',
    'evidence.create.own',
    'evidence.read.organization',
    'report.create.own',
    'report.read.own',
    'discussion.read.public',
    'discussion.create.public',
    'user.update.own',
    'user.read.own',
    'notification.read.own',
    'notification.manage.own',
    'achievement.read.own',
    'export.data.own',
  ],

  // ── UNIVERSITY ADMIN ──
  university_admin: [
    // Inherits student + org management
    'problem.read.public',
    'problem.read.own',
    'solution.read.public',
    'solution.submit.organization',
    'project.read.public',
    'project.read.organization',
    'project.create.organization',
    'project.update.organization',
    'project.manage.organization',
    'task.read.organization',
    'task.assign.organization',
    'milestone.read.organization',
    'milestone.manage.organization',
    'user.read.organization',
    'user.manage.organization',
    'organization.read.own',
    'organization.update.own',
    'analytics.read.organization',
    'challenge.read.public',
    'challenge.submit.organization',
    'comment.create.public',
    'comment.read.public',
    'evidence.create.organization',
    'evidence.read.organization',
    'notification.read.own',
    'notification.manage.own',
    'export.data.organization',
    'volunteer.read.public',
    'discussion.read.public',
    'discussion.create.public',
  ],

  // ── NGO ADMIN ──
  ngo_admin: [
    'problem.read.public',
    'problem.read.organization',
    'solution.read.public',
    'solution.submit.organization',
    'project.read.public',
    'project.read.organization',
    'project.submit.organization',
    'task.read.organization',
    'user.read.organization',
    'user.manage.organization',
    'organization.read.own',
    'organization.update.own',
    'analytics.read.organization',
    'evidence.create.organization',
    'evidence.read.organization',
    'report.create.organization',
    'report.read.organization',
    'comment.create.public',
    'comment.read.public',
    'notification.read.own',
    'notification.manage.own',
    'export.data.organization',
    'discussion.read.public',
    'discussion.create.public',
  ],

  // ── INDUSTRY PARTNER ──
  industry_partner: [
    'problem.read.public',
    'solution.read.public',
    'project.read.public',
    'project.read.organization',
    'project.submit.organization',
    'task.read.organization',
    'user.read.organization',
    'user.manage.organization',
    'organization.read.own',
    'organization.update.own',
    'analytics.read.organization',
    'funding.read.organization',
    'funding.submit.organization',
    'comment.create.public',
    'comment.read.public',
    'notification.read.own',
    'notification.manage.own',
    'export.data.organization',
    'discussion.read.public',
  ],

  // ── STARTUP ──
  startup: [
    'problem.read.public',
    'solution.read.public',
    'solution.submit.own',
    'project.read.public',
    'project.submit.own',
    'challenge.read.public',
    'challenge.submit.own',
    'user.update.own',
    'user.read.own',
    'organization.read.own',
    'organization.update.own',
    'analytics.read.own',
    'comment.create.public',
    'comment.read.public',
    'notification.read.own',
    'export.data.own',
  ],

  // ── FIELD OFFICER ──
  field_officer: [
    'problem.read.department',
    'problem.read.own',
    'problem.update.department',
    'evidence.create.department',
    'evidence.read.department',
    'task.read.own',
    'task.update.own',
    'report.create.own',
    'report.read.department',
    'escalation.create.department',
    'comment.create.department',
    'comment.read.department',
    'user.read.own',
    'user.update.own',
    'notification.read.own',
    'notification.manage.own',
    'export.data.own',
  ],

  // ── DEPARTMENT OFFICER ──
  department_officer: [
    'problem.read.department',
    'problem.update.department',
    'problem.assign.department',
    'problem.escalate.department',
    'solution.read.department',
    'solution.review.department',
    'solution.approve.department',
    'project.read.department',
    'task.read.department',
    'task.assign.department',
    'evidence.read.department',
    'evidence.create.department',
    'report.read.department',
    'report.create.department',
    'escalation.read.department',
    'escalation.create.department',
    'approval.read.department',
    'comment.create.department',
    'comment.read.department',
    'analytics.read.department',
    'user.read.own',
    'user.update.own',
    'notification.read.own',
    'notification.manage.own',
    'export.data.department',
  ],

  // ── DEPARTMENT HEAD ──
  department_head: [
    'problem.read.department',
    'problem.update.department',
    'problem.assign.department',
    'problem.escalate.department',
    'problem.verify.department',
    'solution.read.department',
    'solution.review.department',
    'solution.approve.department',
    'solution.reject.department',
    'project.read.department',
    'project.manage.department',
    'task.read.department',
    'task.assign.department',
    'task.manage.department',
    'evidence.read.department',
    'evidence.create.department',
    'report.read.department',
    'report.create.department',
    'report.export.department',
    'escalation.read.department',
    'escalation.create.department',
    'escalation.approve.department',
    'approval.read.department',
    'approval.manage.department',
    'workflow.read.department',
    'workflow.manage.department',
    'user.read.department',
    'user.manage.department',
    'analytics.read.department',
    'comment.create.department',
    'comment.read.department',
    'comment.moderate.department',
    'export.data.department',
    'notification.read.own',
    'notification.manage.own',
    'volunteer.read.department',
  ],

  // ── CITY / MUNICIPALITY ADMIN ──
  city_admin: [
    'problem.read.city',
    'problem.update.city',
    'problem.assign.city',
    'problem.escalate.city',
    'problem.verify.city',
    'solution.read.city',
    'solution.approve.city',
    'project.read.city',
    'project.manage.city',
    'task.read.city',
    'department.read.city',
    'department.manage.city',
    'analytics.read.city',
    'report.read.city',
    'report.export.city',
    'escalation.read.city',
    'escalation.manage.city',
    'approval.read.city',
    'approval.manage.city',
    'workflow.read.city',
    'workflow.manage.city',
    'user.read.city',
    'challenge.read.city',
    'challenge.manage.city',
    'comment.moderate.city',
    'export.data.city',
    'notification.read.own',
    'notification.manage.own',
  ],

  // ── DISTRICT ADMIN ──
  district_admin: [
    'problem.read.district',
    'problem.update.district',
    'problem.assign.district',
    'problem.escalate.district',
    'problem.verify.district',
    'solution.read.district',
    'solution.approve.district',
    'project.read.district',
    'project.manage.district',
    'department.read.district',
    'department.manage.district',
    'analytics.read.district',
    'report.read.district',
    'report.export.district',
    'escalation.read.district',
    'escalation.manage.district',
    'approval.read.district',
    'approval.manage.district',
    'workflow.read.district',
    'workflow.manage.district',
    'user.read.district',
    'challenge.read.district',
    'challenge.manage.district',
    'comment.moderate.district',
    'export.data.district',
    'notification.read.own',
    'notification.manage.own',
  ],

  // ── STATE ADMIN ──
  state_admin: [
    'problem.read.state',
    'problem.update.state',
    'problem.assign.state',
    'problem.escalate.state',
    'problem.verify.state',
    'solution.read.state',
    'solution.approve.state',
    'project.read.state',
    'project.manage.state',
    'department.read.state',
    'department.manage.state',
    'analytics.read.state',
    'report.read.state',
    'report.export.state',
    'escalation.read.state',
    'escalation.manage.state',
    'approval.read.state',
    'approval.manage.state',
    'workflow.read.state',
    'workflow.manage.state',
    'user.read.state',
    'challenge.read.state',
    'challenge.manage.state',
    'comment.moderate.state',
    'export.data.state',
    'notification.read.own',
    'notification.manage.own',
  ],

  // ── PLATFORM MODERATOR ──
  platform_moderator: [
    'problem.read.all',
    'solution.read.all',
    'project.read.all',
    'comment.read.all',
    'comment.moderate.all',
    'comment.delete.all',
    'user.read.all',
    'user.moderate.all',
    'discussion.read.all',
    'discussion.moderate.all',
    'evidence.read.all',
    'report.read.all',
    'notification.read.own',
    'notification.manage.own',
    'audit_log.read.all',
  ],

  // ── PLATFORM ADMIN ──
  platform_admin: [
    'problem.read.all',
    'problem.manage.all',
    'solution.read.all',
    'solution.manage.all',
    'project.read.all',
    'project.manage.all',
    'user.read.all',
    'user.manage.all',
    'user.assign.all',
    'organization.read.all',
    'organization.manage.all',
    'department.read.all',
    'department.manage.all',
    'analytics.read.all',
    'report.read.all',
    'report.export.all',
    'challenge.read.all',
    'challenge.manage.all',
    'notification.read.all',
    'notification.manage.all',
    'system.read.all',
    'system.manage.all',
    'ai.manage.all',
    'moderation.manage.all',
    'audit_log.read.all',
    'workflow.manage.all',
    'approval.manage.all',
    'export.data.all',
    'poll.manage.all',
    'discussion.manage.all',
    'comment.moderate.all',
    'milestone.manage.all',
    'task.manage.all',
  ],

  // ── SUPER ADMIN ──
  super_admin: [
    // Full access to everything
    ...RESOURCES.flatMap(resource =>
      ACTIONS.map(action => `${resource}.${action}.all`)
    ),
    // Specific elevated permissions
    'system.manage.all',
    'system.configure.all',
    'audit_log.manage.all',
    'user.impersonate.all',
    'role.manage.all',
    'permission.manage.all',
    'feature_flag.manage.all',
    'data_retention.manage.all',
    'session.manage.all',
    'security.manage.all',
  ],
};

// ─── 4. PERMISSION CHECKER ───────────────────────────────────────────────────

/**
 * Check if a role has a specific permission
 * @param {string} role - User's role ID
 * @param {string} permission - Permission string (e.g., 'problem.read.own')
 * @param {object} context - Optional context { userId, resourceId, scope, organizationId, departmentId, city, district, state }
 * @returns {boolean}
 */
export function hasPermission(role, permission, context = {}) {
  if (!role || !permission) return false;

  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms) return false;

  const [resource, action, scope] = permission.split('.');

  // Check exact match
  if (rolePerms.includes(permission)) {
    // If scope is 'own', verify ownership
    if (scope === 'own' && context.userId && context.resourceOwnerId) {
      return context.userId === context.resourceOwnerId;
    }
    return true;
  }

  // Check wildcard permissions (super_admin has *.action.all)
  if (rolePerms.includes(`${resource}.${action}.all`)) return true;
  if (rolePerms.includes(`${resource}.*.all`)) return true;
  if (rolePerms.includes(`*.all.all`)) return true;

  // Check scope inheritance: city includes ward, district includes city, state includes district
  const scopeInheritance = {
    ward: ['own', 'team'],
    city: ['ward', 'own', 'team'],
    district: ['city', 'ward', 'own', 'team'],
    state: ['district', 'city', 'ward', 'own', 'team'],
    all: ['state', 'district', 'city', 'ward', 'own', 'team'],
    organization: ['own', 'team'],
    department: ['own', 'team'],
  };

  // Check if user has broader scope permission
  const broaderScopes = scopeInheritance[scope] || [];
  for (const broaderScope of broaderScopes) {
    if (rolePerms.includes(`${resource}.${action}.${broaderScope}`)) {
      return true;
    }
  }

  // Check if user's role hierarchy level permits this
  const roleInfo = ROLES[role];
  if (!roleInfo) return false;

  // Super admin bypass for non-specific permissions
  if (roleInfo.hierarchy >= 500) return true;

  return false;
}

/**
 * Check if a user can access a resource
 */
export function canAccess(role, resource, action, context = {}) {
  // Check basic permission
  if (!hasPermission(role, `${resource}.${action}.own`, context) &&
      !hasPermission(role, `${resource}.${action}.public`, context) &&
      !hasPermission(role, `${resource}.${action}.all`, context)) {

    // Check organization scope
    if (context.organizationId && hasPermission(role, `${resource}.${action}.organization`, context)) {
      return true;
    }

    // Check department scope
    if (context.departmentId && hasPermission(role, `${resource}.${action}.department`, context)) {
      return true;
    }

    // Check geographic scopes
    if (context.city && hasPermission(role, `${resource}.${action}.city`, context)) return true;
    if (context.district && hasPermission(role, `${resource}.${action}.district`, context)) return true;
    if (context.state && hasPermission(role, `${resource}.${action}.state`, context)) return true;

    return false;
  }

  return true;
}

/**
 * Check if a user can modify a specific resource
 */
export function canModify(role, resource, context = {}) {
  return canAccess(role, resource, 'update', context) ||
         canAccess(role, resource, 'manage', context);
}

/**
 * Check if a user can approve something
 */
export function canApprove(role, resource, context = {}) {
  return canAccess(role, resource, 'approve', context);
}

/**
 * Check if a user can assign something
 */
export function canAssign(role, resource, context = {}) {
  return canAccess(role, resource, 'assign', context);
}

/**
 * Check if a user can export data
 */
export function canExport(role, scope = 'own') {
  return hasPermission(role, `export.data.${scope}`) ||
         hasPermission(role, `report.export.${scope}`);
}

/**
 * Check if a user can manage a resource
 */
export function canManage(role, resource, context = {}) {
  return canAccess(role, resource, 'manage', context);
}

// ─── 5. GEOGRAPHIC SCOPE CHECKER ────────────────────────────────────────────

export function isWithinGeographicScope(userRole, userScope, targetScope) {
  if (!userScope || !targetScope) return true;
  const scopeOrder = ['ward', 'city', 'district', 'state', 'all'];
  const userIdx = scopeOrder.indexOf(userScope.type);
  const targetIdx = scopeOrder.indexOf(targetScope.type);
  return userIdx >= targetIdx;
}

export function getGeographicScope(role, context = {}) {
  if (['super_admin', 'platform_admin', 'platform_moderator'].includes(role)) return { type: 'all' };
  if (['state_admin'].includes(role)) return { type: 'state', value: context.state };
  if (['district_admin'].includes(role)) return { type: 'district', value: context.district };
  if (['city_admin'].includes(role)) return { type: 'city', value: context.city };
  if (['department_head', 'department_officer', 'field_officer'].includes(role)) return { type: 'department', value: context.departmentId };
  return { type: 'own' };
}

// ─── 6. ORGANIZATION SCOPE CHECKER ──────────────────────────────────────────

export function isWithinOrganizationScope(userOrgId, targetOrgId) {
  if (!userOrgId || !targetOrgId) return false;
  return userOrgId === targetOrgId;
}

export function canAccessOrganization(role, userOrgId, targetOrgId) {
  if (['super_admin', 'platform_admin', 'platform_moderator'].includes(role)) return true;
  return userOrgId === targetOrgId;
}

// ─── 7. DATA CLASSIFICATION ─────────────────────────────────────────────────

export const DATA_CLASSIFICATION = {
  PUBLIC: { level: 0, label: 'Public', color: '#10b981', description: 'Anyone can view' },
  COMMUNITY: { level: 1, label: 'Community', color: '#3b82f6', description: 'Authenticated users' },
  ORGANIZATION: { level: 2, label: 'Organization', color: '#f59e0b', description: 'Organization members only' },
  DEPARTMENT: { level: 3, label: 'Department', color: '#8b5cf6', description: 'Department members only' },
  RESTRICTED: { level: 4, label: 'Restricted', color: '#ef4444', description: 'Explicitly authorized roles' },
  CONFIDENTIAL: { level: 5, label: 'Confidential', color: '#dc2626', description: 'Highly restricted admin data' },
};

export function canAccessClassification(role, classification) {
  const roleInfo = ROLES[role];
  if (!roleInfo) return false;

  const level = DATA_CLASSIFICATION[classification]?.level ?? 5;

  // Super admin can access all
  if (roleInfo.hierarchy >= 500) return true;
  // Platform admin/moderator can access up to RESTRICTED
  if (roleInfo.hierarchy >= 400 && level <= 4) return true;
  // Government roles can access up to DEPARTMENT
  if (roleInfo.hierarchy >= 200 && level <= 3) return true;
  // Organizations can access up to ORGANIZATION
  if (roleInfo.hierarchy >= 120 && level <= 2) return true;
  // Community roles can access COMMUNITY
  if (roleInfo.hierarchy >= 70 && level <= 1) return true;
  // Everyone can access PUBLIC
  if (level <= 0) return true;

  return false;
}

// ─── 8. FIELD-LEVEL SECURITY ────────────────────────────────────────────────

export const FIELD_VISIBILITY = {
  problem: {
    citizen: ['title', 'description', 'location', 'status', 'severity', 'category', 'public_updates', 'evidence_public', 'support_count', 'created_at'],
    student: ['title', 'description', 'location', 'status', 'severity', 'category', 'public_updates', 'evidence_public', 'support_count', 'created_at', 'skills_required'],
    field_officer: ['*', 'internal_notes', 'officer_assignment', 'investigation_data', 'gps_metadata'],
    department_officer: ['*', 'internal_notes', 'officer_assignment', 'investigation_data', 'department_notes', 'escalation_history'],
    department_head: ['*', 'internal_notes', 'officer_assignment', 'investigation_data', 'department_notes', 'escalation_history', 'budget_data', 'approval_history'],
    platform_admin: ['*', 'audit_info', 'system_metadata', 'internal_notes'],
    super_admin: ['*'],
  },
};

export function getVisibleFields(resource, role) {
  const visibility = FIELD_VISIBILITY[resource];
  if (!visibility) return ['*'];
  return visibility[role] || visibility.citizen || ['title', 'description', 'status'];
}

export function isFieldVisible(resource, role, fieldName) {
  const fields = getVisibleFields(resource, role);
  if (fields.includes('*')) return true;
  return fields.includes(fieldName);
}

// ─── 9. FEATURE FLAGS ────────────────────────────────────────────────────────

const DEFAULT_FEATURE_FLAGS = {
  voice_reporting: true,
  crowdfunding: true,
  ai_policy_simulator: true,
  hackathons: true,
  innovation_challenges: true,
  volunteer_system: true,
  civic_polls: true,
  discussion_rooms: true,
  expert_marketplace: true,
  ngo_matching: true,
  university_matching: true,
  analytics_advanced: true,
  geospatial_heatmap: true,
  project_management: true,
  approval_workflows: true,
  escalation_matrix: true,
  multilingual: true,
  ai_analysis_hub: true,
};

export const featureFlags = {
  _flags: { ...DEFAULT_FEATURE_FLAGS },

  isEnabled(flag) {
    return this._flags[flag] ?? false;
  },

  toggle(flag) {
    this._flags[flag] = !this._flags[flag];
    return this._flags[flag];
  },

  set(flag, value) {
    this._flags[flag] = value;
  },

  getAll() {
    return { ...this._flags };
  },

  isAccessibleToRole(flag, role) {
    if (!this.isEnabled(flag)) return false;
    const roleInfo = ROLES[role];
    if (!roleInfo) return false;
    // Feature flags don't override role permissions
    return true;
  },
};

// ─── 10. ACCOUNT STATUS ─────────────────────────────────────────────────────

export const ACCOUNT_STATUS = {
  ACTIVE: { id: 'active', label: 'Active', color: '#10b981', canLogin: true, canPerformActions: true },
  SUSPENDED: { id: 'suspended', label: 'Suspended', color: '#ef4444', canLogin: false, canPerformActions: false },
  PENDING_VERIFICATION: { id: 'pending_verification', label: 'Pending Verification', color: '#f59e0b', canLogin: true, canPerformActions: false },
  DEACTIVATED: { id: 'deactivated', label: 'Deactivated', color: '#6b7280', canLogin: false, canPerformActions: false },
  BANNED: { id: 'banned', label: 'Banned', color: '#dc2626', canLogin: false, canPerformActions: false },
};

export function canPerformAction(accountStatus) {
  const status = ACCOUNT_STATUS[accountStatus?.toUpperCase()];
  return status?.canPerformActions ?? false;
}

export function canUserLogin(accountStatus) {
  const status = ACCOUNT_STATUS[accountStatus?.toUpperCase()];
  return status?.canLogin ?? false;
}

// ─── 11. ROLE-BASED NAVIGATION ──────────────────────────────────────────────

export const ROLE_NAVIGATION = {
  guest: [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'explore', label: 'Discover', icon: '🔍' },
  ],
  citizen: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Discover', icon: '🔍' },
    { id: 'report', label: 'Report', icon: '📋', isPrimary: true },
    { id: 'solutions', label: 'Solutions', icon: '💡' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Problems', icon: '🔍' },
    { id: 'projects', label: 'My Projects', icon: '📋' },
    { id: 'report', label: 'Report', icon: '📋', isPrimary: true },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  volunteer: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Discover', icon: '🔍' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'report', label: 'Report', icon: '📋', isPrimary: true },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  expert: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Problems', icon: '🔍' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'ai-hub', label: 'AI Analysis', icon: '🧠' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  university_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'University Projects', icon: '📋' },
    { id: 'expert-marketplace', label: 'Experts', icon: '🕵️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  ngo_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Problems', icon: '🔍' },
    { id: 'projects', label: 'NGO Projects', icon: '📋' },
    { id: 'ngo-matching', label: 'NGO Network', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  industry_partner: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'Opportunities', icon: '🔍' },
    { id: 'projects', label: 'Sponsored', icon: '📋' },
    { id: 'funding', label: 'Funding', icon: '💰' },
    { id: 'analytics', label: 'Impact', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  startup: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'solutions', label: 'Solutions', icon: '💡' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  field_officer: [
    { id: 'dashboard', label: 'Field Dashboard', icon: '📊' },
    { id: 'explore', label: 'My Cases', icon: '🔍' },
    { id: 'projects', label: 'Field Tasks', icon: '📋' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  department_officer: [
    { id: 'dashboard', label: 'Dept Dashboard', icon: '📊' },
    { id: 'explore', label: 'Cases', icon: '🔍' },
    { id: 'projects', label: 'Solutions', icon: '💡' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
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
  city_admin: [
    { id: 'dashboard', label: 'City Dashboard', icon: '📊' },
    { id: 'explore', label: 'Cases', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  district_admin: [
    { id: 'dashboard', label: 'District Dashboard', icon: '📊' },
    { id: 'explore', label: 'Cases', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  state_admin: [
    { id: 'dashboard', label: 'State Dashboard', icon: '📊' },
    { id: 'explore', label: 'All Cases', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
    { id: 'civic-challenges', label: 'Challenges', icon: '⚡' },
    { id: 'intelligence', label: 'AI Intel', icon: '🧠' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  platform_moderator: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explore', label: 'All Content', icon: '🔍' },
    { id: 'activity', label: 'Moderation', icon: '🛡️' },
    { id: 'geospatial', label: 'Analytics', icon: '🗺️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  platform_admin: [
    { id: 'dashboard', label: 'Admin Dashboard', icon: '📊' },
    { id: 'command-center', label: 'Command Center', icon: '🛡️' },
    { id: 'explore', label: 'All Content', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'geospatial', label: 'Geo Intel', icon: '🗺️' },
    { id: 'polls', label: 'Polls', icon: '🗳️' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'intelligence', label: 'AI Intel', icon: '🧠' },
    { id: 'activity', label: 'Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
  super_admin: [
    { id: 'dashboard', label: 'Super Admin', icon: '👑' },
    { id: 'command-center', label: 'Command Center', icon: '🛡️' },
    { id: 'explore', label: 'All Content', icon: '🔍' },
    { id: 'departments', label: 'Departments', icon: '🏛️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'geospatial', label: 'Geo Intel', icon: '🗺️' },
    { id: 'polls', label: 'Polls', icon: '🗳️' },
    { id: 'projects', label: 'Projects', icon: '📋' },
    { id: 'intelligence', label: 'AI Intel', icon: '🧠' },
    { id: 'ai-hub', label: 'AI Hub', icon: '🔬' },
    { id: 'activity', label: 'Audit & Activity', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ],
};

// ─── 12. PROTECTED ROUTES ────────────────────────────────────────────────────

export const ROUTE_PROTECTION = {
  'command-center': ['platform_admin', 'super_admin', 'state_admin', 'district_admin', 'city_admin'],
  'departments': ['department_head', 'department_officer', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin'],
  'geospatial': ['department_officer', 'department_head', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin', 'platform_moderator'],
  'polls': ['department_head', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin'],
  'intelligence': ['state_admin', 'platform_admin', 'super_admin'],
  'ai-hub': ['expert', 'department_officer', 'department_head', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin'],
  'projects': ['student', 'volunteer', 'expert', 'university_admin', 'ngo_admin', 'industry_partner', 'field_officer', 'department_officer', 'department_head', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin'],
  'activity': ['citizen', 'student', 'volunteer', 'expert', 'university_admin', 'ngo_admin', 'industry_partner', 'field_officer', 'department_officer', 'department_head', 'city_admin', 'district_admin', 'state_admin', 'platform_admin', 'super_admin', 'platform_moderator'],
};

export function isRouteAllowed(role, route) {
  const allowedRoles = ROUTE_PROTECTION[route];
  if (!allowedRoles) return true; // No protection = public route
  return allowedRoles.includes(role);
}

// ─── 13. ROLE-BASED DASHBOARD CONFIG ────────────────────────────────────────

export const DASHBOARD_CONFIG = {
  citizen: {
    title: 'My Civic Dashboard',
    widgets: ['my_reports', 'nearby_problems', 'followed_problems', 'community_activity'],
  },
  student: {
    title: 'Student Workspace',
    widgets: ['assigned_projects', 'challenges', 'team_activity', 'achievements'],
  },
  volunteer: {
    title: 'Volunteer Hub',
    widgets: ['volunteer_opportunities', 'my_hours', 'assigned_tasks', 'community_impact'],
  },
  expert: {
    title: 'Expert Dashboard',
    widgets: ['consultation_requests', 'review_queue', 'my_impact', 'recent_activity'],
  },
  field_officer: {
    title: 'Field Operations',
    widgets: ['assigned_cases', 'field_checklist', 'evidence_uploads', 'escalation_requests'],
  },
  department_officer: {
    title: 'Department Dashboard',
    widgets: ['department_cases', 'pending_assignments', 'sla_status', 'department_analytics'],
  },
  department_head: {
    title: 'Department Management',
    widgets: ['department_overview', 'team_performance', 'sla_compliance', 'escalation_queue', 'budget_status'],
  },
  city_admin: {
    title: 'City Operations Center',
    widgets: ['city_overview', 'department_status', 'critical_cases', 'city_analytics', 'citizen_satisfaction'],
  },
  district_admin: {
    title: 'District Command',
    widgets: ['district_overview', 'municipality_status', 'department_performance', 'district_analytics'],
  },
  state_admin: {
    title: 'State Intelligence',
    widgets: ['state_overview', 'district_comparison', 'department_health', 'critical_alerts', 'state_analytics'],
  },
  platform_moderator: {
    title: 'Moderation Center',
    widgets: ['content_queue', 'reported_items', 'user_flags', 'moderation_stats'],
  },
  platform_admin: {
    title: 'Platform Administration',
    widgets: ['platform_health', 'user_stats', 'system_status', 'organization_overview', 'feature_flags'],
  },
  super_admin: {
    title: 'Super Admin Command',
    widgets: ['platform_health', 'security_status', 'user_stats', 'system_config', 'audit_summary', 'feature_flags', 'organization_overview'],
  },
};

// ─── 14. PERMISSION REQUEST SYSTEM ──────────────────────────────────────────

export const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(`civicsolve_rbac_${key}`);
    if (v) return JSON.parse(v);
    return fallback;
  } catch { return fallback; }
};

export const setStored = (key, val) => {
  try { localStorage.setItem(`civicsolve_rbac_${key}`, JSON.stringify(val)); }
  catch { /* ignore */ }
};

export const permissionRequestService = {
  getAll: () => getStored('permissionRequests', []),
  create: (request) => {
    const all = getStored('permissionRequests', []);
    const newReq = {
      ...request,
      id: `pr-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setStored('permissionRequests', [...all, newReq]);
    return newReq;
  },
  approve: (requestId, approverId, temporary = false, duration = null) => {
    const all = getStored('permissionRequests', []);
    const updated = all.map(r => r.id === requestId ? {
      ...r, status: 'approved', approvedBy: approverId,
      temporary, duration,
      approvedAt: new Date().toISOString(),
    } : r);
    setStored('permissionRequests', updated);
    return updated.find(r => r.id === requestId);
  },
  reject: (requestId, reviewerId, reason) => {
    const all = getStored('permissionRequests', []);
    const updated = all.map(r => r.id === requestId ? {
      ...r, status: 'rejected', rejectedBy: reviewerId, rejectReason: reason,
      rejectedAt: new Date().toISOString(),
    } : r);
    setStored('permissionRequests', updated);
    return updated.find(r => r.id === requestId);
  },
};

// ─── 15. DELEGATION SYSTEM ──────────────────────────────────────────────────

export const delegationService = {
  getAll: () => getStored('delegations', []),
  create: (delegation) => {
    const all = getStored('delegations', []);
    const newDel = {
      ...delegation,
      id: `del-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setStored('delegations', [...all, newDel]);
    return newDel;
  },
  revoke: (delegationId) => {
    const all = getStored('delegations', []);
    const updated = all.map(d => d.id === delegationId ? { ...d, status: 'revoked' } : d);
    setStored('delegations', updated);
  },
  getActiveForUser: (userId) => {
    const all = getStored('delegations', []);
    return all.filter(d => d.delegateeId === userId && d.status === 'active' && new Date(d.expiresAt) > new Date());
  },
  cleanup: () => {
    const all = getStored('delegations', []);
    const now = new Date();
    const updated = all.map(d => {
      if (d.status === 'active' && new Date(d.expiresAt) < now) {
        return { ...d, status: 'expired' };
      }
      return d;
    });
    setStored('delegations', updated);
  },
};

// ─── 16. AUDIT LOG SERVICE ──────────────────────────────────────────────────

export const rbacAuditLog = {
  log: (entry) => {
    const all = getStored('rbacAuditLog', []);
    const newEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    all.unshift(newEntry);
    // Keep last 500 entries
    setStored('rbacAuditLog', all.slice(0, 500));
    return newEntry;
  },
  getAll: () => getStored('rbacAuditLog', []),
  getByUser: (userId) => getStored('rbacAuditLog', []).filter(e => e.userId === userId),
  getByAction: (action) => getStored('rbacAuditLog', []).filter(e => e.action === action),
  getRecent: (count = 50) => getStored('rbacAuditLog', []).slice(0, count),
};

// ─── 17. SESSION MANAGEMENT ─────────────────────────────────────────────────

export const sessionService = {
  create: (userId, deviceInfo) => {
    const sessions = getStored('sessions', []);
    const newSession = {
      id: `sess-${Date.now()}`,
      userId,
      device: deviceInfo,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: 'active',
    };
    sessions.push(newSession);
    setStored('sessions', sessions);
    return newSession;
  },
  getActive: (userId) => {
    return getStored('sessions', []).filter(s => s.userId === userId && s.status === 'active');
  },
  revoke: (sessionId) => {
    const sessions = getStored('sessions', []);
    const updated = sessions.map(s => s.id === sessionId ? { ...s, status: 'revoked' } : s);
    setStored('sessions', updated);
  },
  revokeAllExcept: (userId, currentSessionId) => {
    const sessions = getStored('sessions', []);
    const updated = sessions.map(s =>
      s.userId === userId && s.id !== currentSessionId ? { ...s, status: 'revoked' } : s
    );
    setStored('sessions', updated);
  },
};

// ─── DEFAULT EXPORT ─────────────────────────────────────────────────────────

export default {
  ROLES, ROLE_HIERARCHY_LEVELS, ROLE_PERMISSIONS,
  hasPermission, canAccess, canModify, canApprove, canAssign, canExport, canManage,
  isWithinGeographicScope, getGeographicScope,
  isWithinOrganizationScope, canAccessOrganization,
  DATA_CLASSIFICATION, canAccessClassification,
  FIELD_VISIBILITY, getVisibleFields, isFieldVisible,
  featureFlags, ACCOUNT_STATUS, canPerformAction, canUserLogin,
  ROLE_NAVIGATION, ROUTE_PROTECTION, isRouteAllowed,
  DASHBOARD_CONFIG, permissionRequestService, delegationService,
  rbacAuditLog, sessionService, getStored, setStored,
};
