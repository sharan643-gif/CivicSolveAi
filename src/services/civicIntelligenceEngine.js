// CivicSolve AI - Civic Intelligence & Predictive Governance Engine
// Powers: Multi-Factor Priority Scoring, Master Issue Clustering, Civic Hotspots,
// Predictive Maintenance, Workload Balancing, AI SLA Breach Risk Prediction,
// Before/After Photo Verification, Ward Digital Health, and Monthly Reports.

import { accountabilityService, DEPARTMENTS } from './accountabilityService';

const STORAGE_KEYS = {
  CLUSTERS: 'cs_civic_clusters',
  PREDICTIVE_ALERTS: 'cs_predictive_alerts',
  OFFICER_WORKLOADS: 'cs_officer_workloads',
  COMMUNITY_VOTES: 'cs_community_votes',
  CITIZEN_TRUST: 'cs_citizen_trust',
  RECOVERY_PLANS: 'cs_recovery_plans',
  AUDIT_TRAIL: 'cs_audit_trail',
  EMERGENCY_EVENTS: 'cs_emergency_events'
};

function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

// ─── 1. MOCK FIELD OFFICERS WITH SPECIALIZATIONS ─────────────────────────────
export const FIELD_OFFICERS = [
  {
    id: 'off-101',
    name: 'Er. Sandeep Verma',
    deptId: 'pwd_roads',
    specialization: 'Civil Engineering & Road Resurfacing',
    zone: 'Zone 1 (Upper Market / Main Rd)',
    avatar: '👨‍💼',
    rating: 4.8,
    activeTasks: 4,
    completedTasks: 42,
    overdueTasks: 0,
    slaRate: 95,
    distanceKm: 1.2,
    status: 'available'
  },
  {
    id: 'off-102',
    name: 'Er. Preeti Hansda',
    deptId: 'pwd_roads',
    specialization: 'Bridge & Culvert Drainage Safety',
    zone: 'Zone 2 (Kokar / Industrial)',
    avatar: '👩‍💼',
    rating: 4.6,
    activeTasks: 9,
    completedTasks: 38,
    overdueTasks: 2,
    slaRate: 84,
    distanceKm: 4.5,
    status: 'busy'
  },
  {
    id: 'off-103',
    name: 'Er. Manoj Tirkey',
    deptId: 'electricity_board',
    specialization: 'High-Tension Power & Substations',
    zone: 'Zone 1 (Main Road / Doranda)',
    avatar: '⚡',
    rating: 4.9,
    activeTasks: 3,
    completedTasks: 56,
    overdueTasks: 0,
    slaRate: 98,
    distanceKm: 0.8,
    status: 'available'
  },
  {
    id: 'off-104',
    name: 'Er. Alok Beck',
    deptId: 'water_board',
    specialization: 'Underground Pipeline & Hydro Valves',
    zone: 'Zone 3 (Harmu / Kadru)',
    avatar: '🚰',
    rating: 4.5,
    activeTasks: 7,
    completedTasks: 29,
    overdueTasks: 1,
    slaRate: 88,
    distanceKm: 2.1,
    status: 'available'
  },
  {
    id: 'off-105',
    name: 'Dr. Anita Soren',
    deptId: 'sanitation_swm',
    specialization: 'Municipal Vector Control & Bio-Sanitation',
    zone: 'Zone 1 (Ranchi Municipal Central)',
    avatar: '🧹',
    rating: 4.7,
    activeTasks: 5,
    completedTasks: 61,
    overdueTasks: 0,
    slaRate: 94,
    distanceKm: 1.5,
    status: 'available'
  }
];

// ─── 2. CIVIC HOTSPOTS DATA ──────────────────────────────────────────────────
export const CIVIC_HOTSPOTS = [
  {
    id: 'hs-1',
    name: 'Main Road - Overbridge Corridor',
    ward: 'Ward 14 (Upper Market)',
    lat: 23.356,
    lng: 85.324,
    repeatCount: 46,
    dominantCategory: 'Infrastructure',
    riskLevel: 'critical',
    systemicIssue: 'Repeated monsoon waterlogging & surface stripping due to missing storm drain culvert.',
    status: 'Inspection Dispatched'
  },
  {
    id: 'hs-2',
    name: 'Kokar Industrial Drainage Junction',
    ward: 'Ward 22 (Kokar)',
    lat: 23.378,
    lng: 85.352,
    repeatCount: 32,
    dominantCategory: 'Water Management',
    riskLevel: 'high',
    systemicIssue: 'Old cast-iron sewage main cracking under high seasonal ground pressure.',
    status: 'Preventive Replacement Scheduled'
  },
  {
    id: 'hs-3',
    name: 'Kanke Road PHC Intersection',
    ward: 'Ward 31 (Kanke)',
    lat: 23.398,
    lng: 85.312,
    repeatCount: 28,
    dominantCategory: 'Energy & Power',
    riskLevel: 'high',
    systemicIssue: 'Overloaded 250kVA transformer causing chronic voltage drops and streetlight failure.',
    status: 'Substation Upgrade Queued'
  },
  {
    id: 'hs-4',
    name: 'Doranda Daily Market Waste Area',
    ward: 'Ward 08 (Doranda)',
    lat: 23.332,
    lng: 85.319,
    repeatCount: 39,
    dominantCategory: 'Healthcare & Sanitation',
    riskLevel: 'critical',
    systemicIssue: 'Insufficient commercial dumpster capacity for 400+ vegetable vendors.',
    status: 'Route Frequency Doubled'
  }
];

// ─── 3. PREDICTIVE CIVIC MAINTENANCE ALERTS ──────────────────────────────────
export const INITIAL_PREDICTIVE_ALERTS = [
  {
    id: 'pred-1',
    asset: 'Harmu River Bridge Culvert #4',
    location: 'Harmu Bypass, Ward 12',
    deptId: 'pwd_roads',
    probabilityOfFailure: 89,
    predictedFailureWindow: 'Within 14 Days (Monsoon Surge)',
    aiRationale: 'Telemetry shows water flow resistance increased by 64% from silt accumulation. 8 minor citizen reports of water pooling.',
    recommendedAction: 'Immediate hydraulic desilting & structural load test before heavy rainfall.',
    status: 'alert_active',
    estimatedSavings: '₹4.2 Lakhs (prevents roadway collapse)'
  },
  {
    id: 'pred-2',
    asset: 'JBVNL Feeder Line 11kV - Sector 4',
    location: 'Ratu Road Chowk',
    deptId: 'electricity_board',
    probabilityOfFailure: 93,
    predictedFailureWindow: 'Within 72 Hours',
    aiRationale: '3 minor citizen complaints of intermittent sparking on pole #42 during peak evening load. Thermal stress pattern detected.',
    recommendedAction: 'Replace ceramic insulator and balance phase load with feeder 4B.',
    status: 'crew_assigned',
    estimatedSavings: 'Prevents blackout for 3,500 households'
  },
  {
    id: 'pred-3',
    asset: 'Main Drinking Water Trunk Line (300mm)',
    location: 'Bariatu Road near RIMS Hospital',
    deptId: 'water_board',
    probabilityOfFailure: 76,
    predictedFailureWindow: 'Within 21 Days',
    aiRationale: 'Acoustic pressure drop detected at 4am sensor readings. Micro-fracture likely developing near valve chamber.',
    recommendedAction: 'Schedule trenchless ultrasound pipe scan and sleeve reinforcement.',
    status: 'alert_active',
    estimatedSavings: 'Protects hospital critical water supply'
  }
];

export const civicIntelligenceEngine = {
  // ─── PILLAR 2: MULTI-FACTOR CIVIC PRIORITY CALCULATOR ──────────────────────
  calculatePriorityScore: ({
    severity = 'medium',
    affectedPopulation = 1000,
    isNearVulnerableLocation = false,
    durationDays = 7,
    repeatCount = 1,
    isEmergency = false
  }) => {
    // Equation:
    // Base Severity (30%) + Population Impact (25%) + Vulnerability (20%) + Duration/Repetition (15%) + Emergency Boost (10%)
    let base = severity === 'critical' ? 30 : severity === 'high' ? 22 : severity === 'medium' ? 14 : 8;
    let popScore = Math.min(25, Math.round(Math.log10(Math.max(10, affectedPopulation)) * 6.5));
    let vulnScore = isNearVulnerableLocation ? 20 : 5;
    let durationScore = Math.min(15, Math.round((durationDays / 30) * 10 + (repeatCount * 1.5)));
    let emergencyBoost = isEmergency ? 10 : 0;

    const total = Math.min(99, Math.max(20, base + popScore + vulnScore + durationScore + emergencyBoost));
    let tier = total >= 85 ? 'CRITICAL' : total >= 70 ? 'HIGH' : total >= 50 ? 'MEDIUM' : 'NORMAL';
    let color = total >= 85 ? '#dc2626' : total >= 70 ? '#d97706' : total >= 50 ? '#0284c7' : '#059669';

    return { score: total, tier, color };
  },

  // ─── PILLAR 3: DUPLICATE & COMPLAINT CLUSTERING (MASTER CIVIC ISSUE) ───────
  clusterComplaints: (newComplaint, allComplaints = []) => {
    const text = `${newComplaint.title} ${newComplaint.description} ${newComplaint.location}`.toLowerCase();
    const clusters = getStorage(STORAGE_KEYS.CLUSTERS, []);

    // Find if there is an existing cluster within 2km or matching semantic keywords
    let matchedCluster = clusters.find(c => {
      const clusterText = `${c.title} ${c.location} ${c.category}`.toLowerCase();
      const sharedWords = text.split(/\s+/).filter(w => w.length > 3 && clusterText.includes(w));
      return sharedWords.length >= 2 || (c.category === newComplaint.category && c.district === newComplaint.district && c.location === newComplaint.location);
    });

    if (matchedCluster) {
      matchedCluster.reportsCount += 1;
      matchedCluster.affectedPopulation += (newComplaint.affected_population || 500);
      matchedCluster.subTicketIds.push(newComplaint.id);
      matchedCluster.lastReportedAt = new Date().toISOString();
      matchedCluster.priorityScore = Math.min(99, matchedCluster.priorityScore + 4); // Aggregate priority boost
      setStorage(STORAGE_KEYS.CLUSTERS, clusters);
      return { isMaster: false, masterId: matchedCluster.id, cluster: matchedCluster };
    } else {
      // Create new Master Civic Issue Cluster
      const newMaster = {
        id: `master-${Date.now()}`,
        title: newComplaint.title,
        category: newComplaint.category,
        district: newComplaint.district || 'Ranchi',
        location: newComplaint.location,
        reportsCount: 1,
        affectedPopulation: newComplaint.affected_population || 1200,
        subTicketIds: [newComplaint.id],
        firstReportedAt: new Date().toISOString(),
        lastReportedAt: new Date().toISOString(),
        priorityScore: newComplaint.priority_score || 72,
        status: 'master_verified'
      };
      clusters.unshift(newMaster);
      setStorage(STORAGE_KEYS.CLUSTERS, clusters);
      return { isMaster: true, masterId: newMaster.id, cluster: newMaster };
    }
  },

  getAllClusters: () => getStorage(STORAGE_KEYS.CLUSTERS, []),

  // ─── PILLAR 4: CIVIC HOTSPOT DETECTION ─────────────────────────────────────
  getCivicHotspots: () => CIVIC_HOTSPOTS,

  // ─── PILLAR 5: PREDICTIVE CIVIC MAINTENANCE ────────────────────────────────
  getPredictiveAlerts: () => getStorage(STORAGE_KEYS.PREDICTIVE_ALERTS, INITIAL_PREDICTIVE_ALERTS),

  // ─── PILLAR 6 & 7: INTELLIGENT OFFICER ROUTING & WORKLOAD BALANCING ─────────
  getOfficerWorkloads: () => getStorage(STORAGE_KEYS.OFFICER_WORKLOADS, FIELD_OFFICERS),

  recommendOfficerAssignment: (deptId, location = '', category = '') => {
    const officers = civicIntelligenceEngine.getOfficerWorkloads().filter(o => o.deptId === deptId || o.deptId === 'pwd_roads');
    
    // Sort officers by: (activeTasks * 0.4) + (distanceKm * 0.3) - (rating * 2)
    const sorted = [...officers].sort((a, b) => {
      const scoreA = (a.activeTasks * 0.4) + (a.distanceKm * 0.3) - (a.rating * 2);
      const scoreB = (b.activeTasks * 0.4) + (b.distanceKm * 0.3) - (b.rating * 2);
      return scoreA - scoreB;
    });

    const bestOfficer = sorted[0] || FIELD_OFFICERS[0];
    return {
      assignedOfficer: bestOfficer,
      rationale: `Assigned based on low queue workload (${bestOfficer.activeTasks} active tasks), proximity (${bestOfficer.distanceKm} km), and specialization in "${bestOfficer.specialization}".`,
      allCandidates: sorted
    };
  },

  rebalanceWorkloads: () => {
    const officers = civicIntelligenceEngine.getOfficerWorkloads();
    // Simulate smart redistribution of 2 tasks from overloaded officers to available ones
    const updated = officers.map(o => {
      if (o.activeTasks > 6) return { ...o, activeTasks: o.activeTasks - 2, status: 'available' };
      if (o.activeTasks < 4) return { ...o, activeTasks: o.activeTasks + 1 };
      return o;
    });
    setStorage(STORAGE_KEYS.OFFICER_WORKLOADS, updated);
    return updated;
  },

  // ─── PILLAR 9: AI SLA BREACH RISK PREDICTION ────────────────────────────────
  predictSlaRisk: (challenge) => {
    const dept = accountabilityService.getDepartmentById(challenge?.department_id || 'pwd_roads');
    const score = accountabilityService.getDepartmentScore(dept.id);
    
    let riskProb = 25;
    const reasons = [];

    if (challenge.severity === 'critical') {
      riskProb += 25;
      reasons.push('Critical emergency requires multi-disciplinary field mobilization.');
    }
    if (score.slaCompliance < 85) {
      riskProb += 20;
      reasons.push(`Department historical SLA compliance is currently at ${score.slaCompliance}%.`);
    }
    if (challenge.affected_population > 2000) {
      riskProb += 15;
      reasons.push('Large population impact demands extensive physical verification.');
    }

    const clampedRisk = Math.min(94, Math.max(12, riskProb));
    return {
      riskPercentage: clampedRisk,
      isHighRisk: clampedRisk >= 60,
      riskLevel: clampedRisk >= 75 ? 'Severe Breach Risk' : clampedRisk >= 50 ? 'Moderate Risk' : 'Low Risk',
      color: clampedRisk >= 75 ? '#dc2626' : clampedRisk >= 50 ? '#d97706' : '#059669',
      reasons: reasons.length > 0 ? reasons : ['Standard execution within normal queue latency.']
    };
  },

  // ─── PILLAR 14: CITIZEN EVIDENCE RELIABILITY SCORE ─────────────────────────
  getCitizenTrustScore: (userId = 'current_user') => {
    const trustMap = getStorage(STORAGE_KEYS.CITIZEN_TRUST, {});
    const record = trustMap[userId] || {
      score: 88,
      verifiedSubmissions: 7,
      totalReports: 8,
      badges: ['Trusted Reporter', 'Community Watcher'],
      accuracyRate: 94
    };
    return record;
  },

  // ─── PILLAR 18: ORGANISATION PERFORMANCE RECOVERY PLAN ──────────────────────
  generateRecoveryPlan: (deptId) => {
    const dept = accountabilityService.getDepartmentById(deptId);
    const score = accountabilityService.getDepartmentScore(deptId);

    return {
      deptId,
      deptName: dept.name,
      currentScore: score.score,
      targetScore: 85,
      recoveryPeriodDays: 14,
      bottlenecksIdentified: [
        'High backlog of 18 uninspected road pavement complaints in Zone 2',
        'Average response time increased by 28% due to asphalt spreader maintenance',
        '3 citizen escalations flagged for incomplete culvert patch repairs'
      ],
      aiActionPlan: [
        { phase: 'Phase 1 (Day 1 - 3)', action: 'Deploy mobile quick-reaction patching crew to clear top 12 overdue tickets.' },
        { phase: 'Phase 2 (Day 4 - 7)', action: 'Perform mandatory on-site re-inspection of 3 disputed citizen escalation locations.' },
        { phase: 'Phase 3 (Day 8 - 14)', action: 'Rebalance officer workloads across Zone 1 and Zone 2 to maintain <48h SLA response.' }
      ],
      expectedImpact: '+18 Credit Points upon verification of 15 resolutions.'
    };
  },

  // ─── PILLAR 20: "VOICE OF THE AREA" WARD DIGITAL HEALTH ────────────────────
  getWardHealthReport: (wardName = 'Ward 14 (Upper Market)') => {
    return {
      wardName,
      healthScore: 78,
      grade: 'B+ (Good Governance Standing)',
      activeIssues: 14,
      resolvedThisMonth: 38,
      avgResolutionDays: 3.4,
      topComplaints: [
        { category: 'Infrastructure', count: 18, pct: 45 },
        { category: 'Water Supply', count: 11, pct: 28 },
        { category: 'Street Lighting', count: 7, pct: 18 },
        { category: 'Sanitation', count: 4, pct: 9 }
      ],
      citizenSatisfaction: 4.3,
      verifiedResolutionsPct: 91,
      recommendation: 'Target preventive drainage desilting before monsoon surge.'
    };
  },

  // ─── PILLAR 21: COMMUNITY VERIFICATION VOTING ──────────────────────────────
  getCommunityVotes: (challengeId) => {
    const votes = getStorage(STORAGE_KEYS.COMMUNITY_VOTES, {});
    return votes[challengeId] || { fixed: 12, partiallyFixed: 3, stillDamaged: 2, userVoted: null };
  },

  submitCommunityVote: (challengeId, voteType) => {
    const votes = getStorage(STORAGE_KEYS.COMMUNITY_VOTES, {});
    const current = votes[challengeId] || { fixed: 12, partiallyFixed: 3, stillDamaged: 2, userVoted: null };
    
    if (voteType === 'fixed') current.fixed += 1;
    if (voteType === 'partial') current.partiallyFixed += 1;
    if (voteType === 'still_damaged') current.stillDamaged += 1;
    current.userVoted = voteType;

    votes[challengeId] = current;
    setStorage(STORAGE_KEYS.COMMUNITY_VOTES, votes);
    return current;
  },

  // ─── PILLAR 23: "WHY IS THIS PENDING?" AI EXPLANATION ──────────────────────
  getPendingExplanation: (challenge) => {
    const status = challenge?.status || 'under_review';
    const dept = accountabilityService.getDepartmentById(challenge?.department_id || 'pwd_roads');

    if (status === 'under_review') {
      return `Ticket has been cataloged by Gemini AI and routed to ${dept.name}. Awaiting technical supervisor acknowledgment and officer dispatch.`;
    }
    if (status === 'in_progress' || status === 'pilot') {
      return `Field crew is actively deployed on-site at ${challenge.location}. Civil materials and safety signage have been mobilized. Expected completion within SLA deadline.`;
    }
    if (status === 'resolved') {
      return `Department completed 100% of ground rectification with photo proof. Currently in 7-day Citizen Reality Check audit window.`;
    }
    return `Task is proceeding under standard municipal SLA monitoring for ${dept.shortName}.`;
  },

  // ─── PILLAR 30: MONTHLY "STATE OF CIVIC SERVICE" REPORT ────────────────────
  generateMonthlyReport: () => {
    return {
      month: 'August 2026',
      totalReported: 1482,
      totalResolved: 1324,
      overallResolutionRate: '89.3%',
      avgResolutionTimeDays: 4.1,
      totalCitizensEngaged: 34800,
      topPerformingDept: 'State Electricity Distribution Corporation (JBVNL) - 94/100',
      fastestTeam: 'Municipal Solid Waste Quick-Response Squad (1.8 Days Avg)',
      highestSlaCompliance: 'Disaster Management Emergency Cell (98% SLA Compliance)',
      mostImprovedDept: 'Urban Water Supply & Sewerage Board (+12 Points Recovery)',
      hotspotsIdentified: 8,
      preventiveInspectionsCompleted: 34,
      disputeAuditsResolved: 28
    };
  }
};
