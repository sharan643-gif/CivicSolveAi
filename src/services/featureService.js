// CivicSolve AI — Feature Service Layer
// Provides access to all 30 features' data and operations

import {
  INITIAL_NOTIFICATIONS,
  ACHIEVEMENTS,
  CITIZEN_BADGES,
  LEADERBOARD_DATA,
  DEPARTMENTS,
  EXPERTS,
  NGOS,
  INDUSTRY_PARTNERS,
  CROWDFUNDING_PROJECTS,
  INNOVATION_CHALLENGES,
  CIVIC_INTELLIGENCE,
  ANALYTICS_DATA,
  TIMELINE_STATUSES,
  EVIDENCE_QUALITY,
  TRANSPARENCY_STATS,
} from './featureData';

// ─── Local Storage Helper ─────────────────────────────────────────────────────
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

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationService = {
  getAll: (userId) => {
    const all = getStored('notifications', INITIAL_NOTIFICATIONS);
    return userId ? all.filter(n => n.userId === userId || !n.userId) : all;
  },
  getUnreadCount: (userId) => {
    const all = getStored('notifications', INITIAL_NOTIFICATIONS);
    const filtered = userId ? all.filter(n => n.userId === userId || !n.userId) : all;
    return filtered.filter(n => !n.read).length;
  },
  markRead: (id) => {
    const all = getStored('notifications', INITIAL_NOTIFICATIONS);
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    setStored('notifications', updated);
    return updated;
  },
  markAllRead: (userId) => {
    const all = getStored('notifications', INITIAL_NOTIFICATIONS);
    const updated = all.map(n => (userId ? (n.userId === userId || !n.userId) : true) ? { ...n, read: true } : n);
    setStored('notifications', updated);
    return updated;
  },
  add: (notification) => {
    const all = getStored('notifications', INITIAL_NOTIFICATIONS);
    const newNotif = { ...notification, id: `n-${Date.now()}`, read: false, timestamp: new Date().toISOString() };
    setStored('notifications', [newNotif, ...all]);
    return newNotif;
  },
};

// ─── ACHIEVEMENTS / GAMIFICATION ──────────────────────────────────────────────
export const achievementService = {
  getAll: () => ACHIEVEMENTS,
  getUnlocked: () => ACHIEVEMENTS.filter(a => a.unlocked),
  getLocked: () => ACHIEVEMENTS.filter(a => !a.unlocked),
  getCitizenBadges: () => CITIZEN_BADGES,
  getBadgeForScore: (score) => {
    let badge = CITIZEN_BADGES[0];
    for (const b of CITIZEN_BADGES) {
      if (score >= b.minScore) badge = b;
    }
    return badge;
  },
  getCitizenImpactScore: (userId) => {
    // Simulated impact score based on activity
    const scores = { 'u-citizen': 420, 'u-student': 680, 'u-expert': 940 };
    return scores[userId] || Math.floor(Math.random() * 300) + 50;
  },
};

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export const leaderboardService = {
  get: (category = 'citizens', period = 'all') => {
    return LEADERBOARD_DATA[category] || LEADERBOARD_DATA.citizens;
  },
  getCategories: () => ['citizens', 'universities', 'experts', 'ngos', 'industry'],
};

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const departmentService = {
  getAll: () => DEPARTMENTS,
  getById: (id) => DEPARTMENTS.find(d => d.id === id),
  getPerformance: () => DEPARTMENTS.map(d => ({
    name: d.shortName,
    fullName: d.name,
    resolved: d.resolvedProblems,
    pending: d.assignedProblems - d.resolvedProblems,
    avgDays: d.avgResolutionDays,
    color: d.color,
  })),
};

// ─── EXPERT MARKETPLACE ───────────────────────────────────────────────────────
export const expertService = {
  getAll: () => EXPERTS,
  getAvailable: () => EXPERTS.filter(e => e.availability === 'Available'),
  getById: (id) => EXPERTS.find(e => e.id === id),
  getByExpertise: (expertise) => EXPERTS.filter(e => e.expertise.some(ex => ex.toLowerCase().includes(expertise.toLowerCase()))),
};

// ─── NGO MATCHING ─────────────────────────────────────────────────────────────
export const ngoService = {
  getAll: () => NGOS,
  getByCause: (cause) => NGOS.filter(n => n.causes.some(c => c.toLowerCase().includes(cause.toLowerCase()))),
  getRecommended: (challengeCategory) => {
    // Simple matching based on category overlap
    return NGOS.map(ngo => ({
      ...ngo,
      compatibility: Math.floor(Math.random() * 30) + 60,
    })).sort((a, b) => b.compatibility - a.compatibility);
  },
};

// ─── INDUSTRY PARTNERSHIPS ───────────────────────────────────────────────────
export const industryService = {
  getAll: () => INDUSTRY_PARTNERS,
  getById: (id) => INDUSTRY_PARTNERS.find(p => p.id === id),
};

// ─── CROWDFUNDING ─────────────────────────────────────────────────────────────
export const crowdfundingService = {
  getAll: () => CROWDFUNDING_PROJECTS,
  getActive: () => CROWDFUNDING_PROJECTS.filter(p => p.status === 'active'),
  getFunded: () => CROWDFUNDING_PROJECTS.filter(p => p.status === 'funded'),
  getById: (id) => CROWDFUNDING_PROJECTS.find(p => p.id === id),
  getProgress: (id) => {
    const p = CROWDFUNDING_PROJECTS.find(cf => cf.id === id);
    if (!p) return null;
    return { ...p, percentage: Math.round((p.raised / p.target) * 100) };
  },
};

// ─── INNOVATION CHALLENGES ───────────────────────────────────────────────────
export const innovationChallengeService = {
  getAll: () => INNOVATION_CHALLENGES,
  getOpen: () => INNOVATION_CHALLENGES.filter(c => c.status === 'open'),
  getJudging: () => INNOVATION_CHALLENGES.filter(c => c.status === 'judging'),
  getById: (id) => INNOVATION_CHALLENGES.find(c => c.id === id),
};

// ─── CIVIC INTELLIGENCE ──────────────────────────────────────────────────────
export const intelligenceService = {
  getData: () => CIVIC_INTELLIGENCE,
  getEmergingProblems: () => CIVIC_INTELLIGENCE.emergingProblems,
  getHotspots: () => CIVIC_INTELLIGENCE.hotspots,
  getRiskPredictions: () => CIVIC_INTELLIGENCE.riskPredictions,
  getRecommendedActions: () => CIVIC_INTELLIGENCE.recommendedActions,
  getImpactOpportunities: () => CIVIC_INTELLIGENCE.impactOpportunities,
  getWeeklyBrief: () => CIVIC_INTELLIGENCE.weeklyBrief,
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
export const analyticsService = {
  getData: () => ANALYTICS_DATA,
  getProblemsByCategory: () => ANALYTICS_DATA.problemsByCategory,
  getProblemsByLocation: () => ANALYTICS_DATA.problemsByLocation,
  getMonthlyTrend: () => ANALYTICS_DATA.monthlyTrend,
  getDepartmentPerformance: () => ANALYTICS_DATA.departmentPerformance,
};

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const timelineService = {
  getStatuses: () => TIMELINE_STATUSES,
  getForChallenge: (challenge) => {
    return challenge?.timeline || [];
  },
  getStatusInfo: (status) => {
    return TIMELINE_STATUSES.find(s => s.status === status) || TIMELINE_STATUSES[0];
  },
};

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────
export const evidenceService = {
  getQualityIndicator: (score) => {
    if (score >= 90) return EVIDENCE_QUALITY.excellent;
    if (score >= 75) return EVIDENCE_QUALITY.good;
    if (score >= 50) return EVIDENCE_QUALITY.fair;
    return EVIDENCE_QUALITY.poor;
  },
  analyzeImage: async (imageUrl) => {
    // Simulated AI evidence analysis
    await new Promise(r => setTimeout(r, 500));
    return {
      relevance: Math.floor(Math.random() * 20) + 80,
      isDuplicate: Math.random() > 0.9,
      quality: Math.floor(Math.random() * 30) + 70,
      description: 'Image shows visible civic infrastructure concern. GPS metadata verified.',
    };
  },
};

// ─── TRANSPARENCY ─────────────────────────────────────────────────────────────
export const transparencyService = {
  getStats: () => TRANSPARENCY_STATS,
};

// ─── AI SOLUTION GENERATOR ────────────────────────────────────────────────────
export const solutionGeneratorService = {
  generate: async (challenge) => {
    await new Promise(r => setTimeout(r, 1200));
    return [
      {
        id: 'sol-gen-1',
        title: `${challenge.category} IoT Sensor Network`,
        description: `Deploy IoT sensors across the affected area for real-time monitoring and early warning. This solution leverages LoRaWAN connectivity for low-power, wide-area coverage.`,
        estimatedCost: '₹3,50,000',
        difficulty: 'Medium',
        implementationTime: '3 months',
        expectedImpact: `${challenge.affected_population || 1500} citizens benefited`,
        advantages: ['Real-time monitoring', 'Low maintenance cost', 'Scalable architecture'],
        risks: ['Connectivity challenges in remote areas', 'Initial calibration required'],
        feasibilityScore: 85,
        sustainabilityScore: 90,
      },
      {
        id: 'sol-gen-2',
        title: `Community-Driven ${challenge.category} Solution`,
        description: `Train local community members to identify, report, and perform initial remediation. Establish a community monitoring committee with mobile reporting tools.`,
        estimatedCost: '₹80,000',
        difficulty: 'Low',
        implementationTime: '6 weeks',
        expectedImpact: `${(challenge.affected_population || 1500) * 2} citizens through community network`,
        advantages: ['Low cost', 'Community ownership', 'Immediate impact'],
        risks: ['Requires sustained community engagement', 'Limited technical capability'],
        feasibilityScore: 92,
        sustainabilityScore: 75,
      },
      {
        id: 'sol-gen-3',
        title: `AI-Powered Predictive ${challenge.category} Management`,
        description: `Use machine learning to predict infrastructure failures before they occur. Combine satellite imagery, historical data, and sensor inputs for predictive maintenance scheduling.`,
        estimatedCost: '₹5,20,000',
        difficulty: 'High',
        implementationTime: '6 months',
        expectedImpact: `${challenge.affected_population || 1500} citizens with proactive prevention`,
        advantages: ['Prevents issues before they occur', 'Data-driven decisions', 'Long-term savings'],
        risks: ['High initial cost', 'Requires data science expertise', 'Training data needed'],
        feasibilityScore: 70,
        sustainabilityScore: 95,
      },
    ];
  },
};

// ─── AI SOLUTION RANKING ─────────────────────────────────────────────────────
export const solutionRankingService = {
  rank: (solutions) => {
    return solutions.map(s => ({
      ...s,
      overallScore: Math.round((s.feasibilityScore + s.sustainabilityScore) / 2),
    })).sort((a, b) => b.overallScore - a.overallScore);
  },
  getRankings: (solutions) => {
    const ranked = solutionRankingService.rank(solutions);
    return [
      { label: 'Best Overall', solution: ranked[0], icon: '🏆' },
      { label: 'Most Affordable', solution: solutions.reduce((min, s) => parseInt(s.estimatedCost.replace(/[^\d]/g, '')) < parseInt(min.estimatedCost.replace(/[^\d]/g, '')) ? s : min), icon: '💰' },
      { label: 'Fastest Implementation', solution: solutions.reduce((min, s) => parseInt(s.implementationTime) < parseInt(min.implementationTime) ? s : min), icon: '⚡' },
      { label: 'Highest Social Impact', solution: solutions.reduce((max, s) => s.sustainabilityScore > max.sustainabilityScore ? s : max), icon: '🌍' },
      { label: 'Most Sustainable', solution: ranked.reduce((max, s) => s.sustainabilityScore > max.sustainabilityScore ? s : max), icon: '🌱' },
    ];
  },
};

// ─── REPORT GENERATOR ────────────────────────────────────────────────────────
export const reportGeneratorService = {
  generate: async (challenge) => {
    await new Promise(r => setTimeout(r, 1500));
    return {
      title: `Civic Impact Report: ${challenge.title}`,
      generatedAt: new Date().toISOString(),
      summary: `This report analyzes the civic issue "${challenge.title}" reported in ${challenge.district || 'Jharkhand'}. The problem affects approximately ${challenge.affected_population?.toLocaleString() || '1,500'} citizens and has been classified as ${challenge.severity || 'high'} severity.`,
      evidence: `${challenge.evidence?.length || 0} pieces of evidence have been submitted.`,
      affectedPopulation: challenge.affected_population || 1500,
      rootCauses: challenge.ai_analysis?.possible_causes || ['Infrastructure degradation', 'Environmental factors'],
      proposedSolutions: ['IoT sensor monitoring', 'Community-based approach', 'AI predictive management'],
      communitySupport: challenge.support_count || 314,
      estimatedImpact: 'Significant improvement in quality of life for affected communities',
      recommendedAction: 'Immediate department assignment and emergency response team deployment',
      priorityScore: challenge.priority_score || 75,
    };
  },
};

// ─── STUDENT MATCHING ────────────────────────────────────────────────────────
export const studentMatchingService = {
  match: (challenge, students) => {
    const skills = challenge.skills_required || [];
    return [
      { id: 'u-student', name: 'Aarav Mehta', branch: 'Computer Science', year: '4th Year', skills: ['AI/ML', 'Python', 'IoT', 'GIS'], compatibility: 97, matchReason: 'Strong AI/ML and IoT skills match challenge requirements' },
      { id: 'st-priya', name: 'Priya Sharma', branch: 'Information Technology', year: '3rd Year', skills: ['React', 'Node.js', 'Backend Dev', 'Database'], compatibility: 89, matchReason: 'Backend development and database skills are relevant' },
      { id: 'st-rohan', name: 'Rohan Das', branch: 'Electronics', year: '4th Year', skills: ['Embedded Systems', 'LoRa', 'PCB Design', 'IoT'], compatibility: 92, matchReason: 'IoT hardware and embedded systems directly applicable' },
    ];
  },
};

// ─── DEPARTMENT MANAGEMENT ───────────────────────────────────────────────────
export const departmentManagementService = {
  assignProblem: (deptId, challengeId) => {
    const dept = DEPARTMENTS.find(d => d.id === deptId);
    if (dept) {
      dept.assignedProblems++;
      return { success: true, department: dept.name };
    }
    return { success: false };
  },
  escalateProblem: (challengeId) => {
    return { success: true, message: `Problem ${challengeId} escalated to higher authority.` };
  },
};

// ─── IMPACT MEASUREMENT ──────────────────────────────────────────────────────
export const impactMeasurementService = {
  calculateScore: (before, after) => {
    const improvementPercent = ((before.severity - after.severity) / before.severity) * 100;
    const citizensBenefited = after.citizensBenefited || before.affectedPopulation;
    const costSaved = after.costSaved || 0;
    const timeSaved = after.timeSaved || 0;

    const score = Math.min(100, Math.round(
      (improvementPercent * 0.3) +
      (Math.min(citizensBenefited / 1000, 30) * 0.3) +
      (Math.min(costSaved / 10000, 20) * 0.2) +
      (Math.min(timeSaved / 100, 20) * 0.2)
    ));

    return {
      improvementPercent: Math.round(improvementPercent),
      citizensBenefited,
      costSaved,
      timeSaved,
      civicImpactScore: score,
    };
  },
};

// ─── NEARBY PROBLEMS ──────────────────────────────────────────────────────────
export const nearbyProblemsService = {
  find: (challenges, userLat, userLng, radiusKm = 50) => {
    return challenges.map(c => {
      const lat = c.latitude || 23.35;
      const lng = c.longitude || 85.33;
      const distance = Math.round(Math.sqrt(Math.pow((lat - userLat) * 111, 2) + Math.pow((lng - userLng) * 111 * Math.cos(lat * Math.PI / 180), 2)));
      return { ...c, distance };
    }).filter(c => c.distance <= radiusKm).sort((a, b) => a.distance - b.distance);
  },
};

export default {
  notificationService,
  achievementService,
  leaderboardService,
  departmentService,
  expertService,
  ngoService,
  industryService,
  crowdfundingService,
  innovationChallengeService,
  intelligenceService,
  analyticsService,
  timelineService,
  evidenceService,
  transparencyService,
  solutionGeneratorService,
  solutionRankingService,
  reportGeneratorService,
  studentMatchingService,
  departmentManagementService,
  impactMeasurementService,
  nearbyProblemsService,
};
