// CivicSolve AI - Public Accountability & Department Management Engine
// Handles: Department Registry, SLA Calculations, Department Credit Scoring (0-100),
// Lifecycle Timelines, Citizen Verification & Escalation Dispatches.

export const DEPARTMENTS = [
  {
    id: 'pwd_roads',
    name: 'Public Works Department (Roads & Bridges)',
    shortName: 'PWD Roads',
    category: 'Infrastructure',
    icon: '🛣️',
    color: '#003087',
    head: 'Er. Rajesh Kumar Sharma, Chief Engineer',
    contact: 'pwd-roads-support@jharkhand.gov.in | 0651-2400101',
    slaDays: 7,
    subcategories: ['Potholes', 'Road Cave-ins', 'Bridge Damage', 'Drainage Culverts', 'Footpaths'],
    baseScore: 84
  },
  {
    id: 'water_board',
    name: 'Urban Water Supply & Sewerage Board',
    shortName: 'Water & Sewerage',
    category: 'Water Management',
    icon: '🚰',
    color: '#0284c7',
    head: 'Smt. Ananya Sen, Director General',
    contact: 'waterboard-helpline@jharkhand.gov.in | 1800-345-6789',
    slaDays: 3,
    subcategories: ['Main Pipeline Burst', 'Contaminated Water', 'Low Pressure', 'Sewage Overflow', 'Pump Failure'],
    baseScore: 78
  },
  {
    id: 'electricity_board',
    name: 'State Electricity Distribution Corporation (JBVNL)',
    shortName: 'JBVNL Power',
    category: 'Energy & Power',
    icon: '⚡',
    color: '#d97706',
    head: 'Er. Vikramaditya Prasad, Superintending Engineer',
    contact: 'power-grievance@jbvnl.co.in | 1912',
    slaDays: 2,
    subcategories: ['Hanging High-Tension Wires', 'Streetlight Failure', 'Transformer Breakdown', 'Frequent Tripping'],
    baseScore: 88
  },
  {
    id: 'sanitation_swm',
    name: 'Municipal Solid Waste & Public Sanitation Authority',
    shortName: 'Sanitation & Waste',
    category: 'Healthcare & Sanitation',
    icon: '🧹',
    color: '#059669',
    head: 'Dr. Alok Murmu, Municipal Health Officer',
    contact: 'sanitation@ranchi-municipal.gov.in | 0651-2211223',
    slaDays: 2,
    subcategories: ['Garbage Dump Overflow', 'Dead Animal Removal', 'Drain Desilting', 'Public Toilet Maintenance'],
    baseScore: 91
  },
  {
    id: 'traffic_police',
    name: 'City Traffic Management & Urban Mobility Board',
    shortName: 'Traffic & Transport',
    category: 'Urban Transport & Traffic',
    icon: '🚦',
    color: '#7c3aed',
    head: 'Shri R. K. Soren, IPS, SP Traffic',
    contact: 'traffic-control@jharkhandpolice.gov.in | 1095',
    slaDays: 4,
    subcategories: ['Signal Malfunction', 'Encroachment', 'Hazardous Blind Spot', 'Bus Shelter Damage'],
    baseScore: 74
  },
  {
    id: 'pollution_control',
    name: 'State Pollution Control Board (JSPCB)',
    shortName: 'Pollution Control',
    category: 'Environment & Pollution',
    icon: '🌱',
    color: '#16a34a',
    head: 'Dr. Meenakshi Toppo, Environmental Engineer',
    contact: 'grievance@jspcb.nic.in | 0651-2480187',
    slaDays: 10,
    subcategories: ['Industrial Smoke', 'Chemical Waste in River', 'Excessive Noise', 'Illegal Tree Felling'],
    baseScore: 68
  },
  {
    id: 'health_dept',
    name: 'Department of Health & Family Welfare',
    shortName: 'Health Services',
    category: 'Healthcare & Sanitation',
    icon: '🏥',
    color: '#dc2626',
    head: 'Dr. B. P. Kashyap, Civil Surgeon',
    contact: 'healthdept@jharkhand.gov.in | 104',
    slaDays: 5,
    subcategories: ['Dengue/Malaria Outbreak', 'PHC Doctor Absence', 'Medicine Shortage', 'Ambulance Delay'],
    baseScore: 82
  },
  {
    id: 'rural_dev',
    name: 'Rural Development & Panchayati Raj Dept',
    shortName: 'Rural Development',
    category: 'Agriculture & Rural',
    icon: '🌾',
    color: '#b45309',
    head: 'Shri Sanjay Tigga, Joint Secretary',
    contact: 'ruraldev-jharkhand@gov.in | 0651-2446123',
    slaDays: 14,
    subcategories: ['Check Dam Leakage', 'Village Canal Block', 'Solar Pump Non-functional', 'Panchayat Bhavan Repair'],
    baseScore: 71
  },
  {
    id: 'education_dept',
    name: 'School Education & Literacy Department',
    shortName: 'Education Dept',
    category: 'Education & Literacy',
    icon: '📚',
    color: '#2563eb',
    head: 'Smt. Vandana Dadel, Secretary',
    contact: 'school-edu@jharkhand.gov.in | 0651-2490123',
    slaDays: 7,
    subcategories: ['Dangerous School Building', 'No Clean Drinking Water', 'MDM Irregularity', 'Boundary Wall Collapse'],
    baseScore: 85
  },
  {
    id: 'disaster_mgmt',
    name: 'Disaster Management & Emergency Relief Cell',
    shortName: 'Disaster Response',
    category: 'Public Safety & Disaster',
    icon: '🚨',
    color: '#b91c1c',
    head: 'Col. Amit Tirkey (Retd.), Project Director',
    contact: 'emergency-control@jharkhand.gov.in | 1070',
    slaDays: 1,
    subcategories: ['Flash Flood/Inundation', 'Landslide Hazard', 'Building Collapse Risk', 'Chemical Gas Leak'],
    baseScore: 94
  }
];

const LS_KEYS = {
  UPDATES: 'civicsolve_complaint_updates',
  SCORES: 'civicsolve_dept_scores',
  ESCALATIONS: 'civicsolve_escalations',
  VERIFICATIONS: 'civicsolve_verifications',
  FIELD_TASKS: 'civicsolve_field_tasks'
};

function getStorage(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`[accountabilityService] getStorage error:`, e);
    return fallback;
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[accountabilityService] setStorage error:`, e);
  }
}

export const accountabilityService = {
  getAllDepartments: () => DEPARTMENTS,

  getDepartmentById: (id) => {
    return DEPARTMENTS.find(d => d.id === id) || DEPARTMENTS[0];
  },

  // Match category or text to a responsible department
  matchDepartment: (category, title = '', description = '') => {
    const text = `${title} ${description} ${category}`.toLowerCase();

    if (text.includes('wire') || text.includes('shock') || text.includes('electric') || text.includes('transformer') || text.includes('streetlight') || category === 'Energy & Power') {
      return accountabilityService.getDepartmentById('electricity_board');
    }
    if (text.includes('pipe') || text.includes('leak') || text.includes('sewage') || text.includes('drainage') || text.includes('water supply') || category === 'Water Management') {
      return accountabilityService.getDepartmentById('water_board');
    }
    if (text.includes('garbage') || text.includes('waste') || text.includes('dump') || text.includes('sanitation') || text.includes('dustbin') || text.includes('toilet') || text.includes('cleanliness')) {
      return accountabilityService.getDepartmentById('sanitation_swm');
    }
    if (text.includes('flood') || text.includes('landslide') || text.includes('collapse') || text.includes('emergency') || text.includes('disaster') || category === 'Public Safety & Disaster') {
      return accountabilityService.getDepartmentById('disaster_mgmt');
    }
    if (text.includes('traffic') || text.includes('signal') || text.includes('congestion') || text.includes('bus') || category === 'Urban Transport & Traffic') {
      return accountabilityService.getDepartmentById('traffic_police');
    }
    if (text.includes('smoke') || text.includes('pollution') || text.includes('factory') || text.includes('chemical') || text.includes('air quality') || category === 'Environment & Pollution') {
      return accountabilityService.getDepartmentById('pollution_control');
    }
    if (text.includes('hospital') || text.includes('doctor') || text.includes('dengue') || text.includes('malaria') || text.includes('clinic') || category === 'Healthcare & Sanitation') {
      return accountabilityService.getDepartmentById('health_dept');
    }
    if (text.includes('farm') || text.includes('canal') || text.includes('panchayat') || text.includes('village') || category === 'Agriculture & Rural') {
      return accountabilityService.getDepartmentById('rural_dev');
    }
    if (text.includes('school') || text.includes('teacher') || text.includes('classroom') || text.includes('college') || category === 'Education & Literacy') {
      return accountabilityService.getDepartmentById('education_dept');
    }

    // Default to PWD Roads
    return accountabilityService.getDepartmentById('pwd_roads');
  },

  // Compute SLA target date
  calculateSlaDeadline: (createdAt, slaDays) => {
    const start = createdAt ? new Date(createdAt) : new Date();
    const deadline = new Date(start.getTime() + slaDays * 24 * 60 * 60 * 1000);
    return deadline.toISOString();
  },

  // Calculate remaining time and SLA status
  getSlaStatus: (slaDeadline, isResolved = false) => {
    if (!slaDeadline) return { isOverdue: false, remainingHours: 0, text: 'No SLA' };
    const now = Date.now();
    const target = new Date(slaDeadline).getTime();
    const diffMs = target - now;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = (diffHours / 24).toFixed(1);

    if (diffMs <= 0) {
      const overdueDays = Math.abs(Number(diffDays));
      return {
        isOverdue: true,
        urgency: 'overdue',
        color: '#dc2626',
        remainingHours: diffHours,
        text: `Overdue by ${overdueDays >= 1 ? `${Math.floor(overdueDays)}d` : `${Math.abs(diffHours)}h`}`
      };
    }

    if (diffHours < 24) {
      return {
        isOverdue: false,
        urgency: 'critical',
        color: '#e11d48',
        remainingHours: diffHours,
        text: `${diffHours}h remaining`
      };
    }

    if (diffHours < 72) {
      return {
        isOverdue: false,
        urgency: 'warning',
        color: '#d97706',
        remainingHours: diffHours,
        text: `${Math.ceil(diffHours / 24)}d remaining`
      };
    }

    return {
      isOverdue: false,
      urgency: 'normal',
      color: '#059669',
      remainingHours: diffHours,
      text: `${Math.ceil(diffHours / 24)}d remaining`
    };
  },

  // Get status timeline for a complaint (merges stored timeline with base events)
  getComplaintTimeline: (challenge) => {
    if (!challenge) return [];
    const updatesMap = getStorage(LS_KEYS.UPDATES, {});
    const customUpdates = updatesMap[challenge.id] || [];

    const baseTimeline = [
      {
        id: 'step-1',
        title: 'Report Submitted',
        stage: 'submitted',
        actor: challenge.creator?.name || 'Citizen',
        role: 'Citizen Reporter',
        timestamp: challenge.created_at || new Date(Date.now() - 3 * 86400000).toISOString(),
        note: `Citizen registered ticket in ${challenge.district || 'Ranchi'}.`,
        completed: true
      },
      {
        id: 'step-2',
        title: 'AI Classification & Routing',
        stage: 'ai_classified',
        actor: 'Google Gemini 3.1 Cognitive Engine',
        role: 'Automated AI Auditor',
        timestamp: challenge.created_at || new Date(Date.now() - 2.9 * 86400000).toISOString(),
        note: `Confidence 94%. Severity assessed as "${challenge.severity || 'high'}". Routed to ${challenge.department_id ? accountabilityService.getDepartmentById(challenge.department_id).shortName : 'PWD Roads'}.`,
        completed: true
      }
    ];

    // Determine current status progression
    const currentStatus = challenge.status || 'submitted';
    const isAccepted = ['under_review', 'in_progress', 'pilot', 'implemented', 'resolved'].includes(currentStatus) || customUpdates.some(u => u.stage === 'accepted');
    const isWorkStarted = ['in_progress', 'pilot', 'implemented', 'resolved'].includes(currentStatus) || customUpdates.some(u => u.stage === 'work_started');
    const isResolved = ['resolved', 'implemented'].includes(currentStatus) || customUpdates.some(u => u.stage === 'resolved');


    const defaultMiddleSteps = [
      {
        id: 'step-3',
        title: 'Department Acknowledged',
        stage: 'accepted',
        actor: challenge.department_head || 'Executive Engineer',
        role: 'Government Dept Authority',
        timestamp: challenge.created_at ? new Date(new Date(challenge.created_at).getTime() + 4 * 3600000).toISOString() : null,
        note: isAccepted ? 'Ticket accepted and assigned to Ward Inspection Officer.' : 'Pending acknowledgment by department desk.',
        completed: isAccepted
      },
      {
        id: 'step-4',
        title: 'Work In Progress',
        stage: 'work_started',
        actor: 'Field Operations Crew',
        role: 'Technical Contractor / Field Team',
        timestamp: challenge.created_at ? new Date(new Date(challenge.created_at).getTime() + 24 * 3600000).toISOString() : null,
        note: isWorkStarted ? 'Field materials deployed. Physical rectification under execution.' : 'Awaiting physical crew deployment.',
        completed: isWorkStarted
      },
      {
        id: 'step-5',
        title: 'Resolved by Department',
        stage: 'resolved',
        actor: 'Department Inspection Officer',
        role: 'Quality Assurance Dept',
        timestamp: isResolved ? new Date().toISOString() : null,
        note: isResolved ? 'Department marked task as 100% resolved with geo-tagged completion proof.' : 'Rectification work underway.',
        completed: isResolved
      },
      {
        id: 'step-6',
        title: 'Citizen Verification',
        stage: 'citizen_verified',
        actor: challenge.creator?.name || 'Citizen Reporter',
        role: 'Public Citizen Audit',
        timestamp: null,
        note: 'Citizen has 7 days to verify if the problem is genuinely resolved on ground.',
        completed: false
      }
    ];

    // Check if citizen verified or escalated
    const verifications = getStorage(LS_KEYS.VERIFICATIONS, {});
    const verification = verifications[challenge.id];
    if (verification) {
      defaultMiddleSteps[3].completed = true;
      if (verification.verdict === 'resolved') {
        defaultMiddleSteps[3].note = `Citizen verified on ${new Date(verification.timestamp).toLocaleDateString()}: "${verification.comment || 'Verified completely fixed.'}"`;
      } else {
        defaultMiddleSteps[3].title = 'Citizen Dispute / Escalation Raised';
        defaultMiddleSteps[3].note = `Citizen flagged as UNRESOLVED: "${verification.comment || 'Issue still exists.'}". Field verification triggered.`;
      }
    }

    return [...baseTimeline, ...defaultMiddleSteps];
  },

  // Push an update to a complaint
  addComplaintUpdate: (challengeId, update) => {
    const updatesMap = getStorage(LS_KEYS.UPDATES, {});
    const list = updatesMap[challengeId] || [];
    const newEntry = {
      id: `up-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...update
    };
    updatesMap[challengeId] = [...list, newEntry];
    setStorage(LS_KEYS.UPDATES, updatesMap);
    return newEntry;
  },

  // Citizen verification submission
  submitCitizenVerification: (challengeId, verdict, comment = '', photo = null) => {
    const verifications = getStorage(LS_KEYS.VERIFICATIONS, {});
    const record = {
      challengeId,
      verdict, // 'resolved' | 'not_resolved'
      comment,
      photo,
      timestamp: new Date().toISOString()
    };
    verifications[challengeId] = record;
    setStorage(LS_KEYS.VERIFICATIONS, verifications);

    if (verdict === 'not_resolved') {
      // Auto-create escalation and field task
      accountabilityService.triggerEscalation(challengeId, {
        reason: 'Citizen Dispute — Ground work incomplete or unsatisfactory',
        comment,
        photo
      });
    }

    return record;
  },

  // Trigger field escalation
  triggerEscalation: (challengeId, details) => {
    const escalations = getStorage(LS_KEYS.ESCALATIONS, []);
    const existingIndex = escalations.findIndex(e => e.challengeId === challengeId);
    
    const escalationRecord = {
      id: `esc-${Date.now()}`,
      challengeId,
      timestamp: new Date().toISOString(),
      status: 'pending_field_inspection',
      priority: 'high',
      ...details
    };

    if (existingIndex >= 0) {
      escalations[existingIndex] = escalationRecord;
    } else {
      escalations.unshift(escalationRecord);
    }
    setStorage(LS_KEYS.ESCALATIONS, escalations);

    // Also add to field dispatch tasks
    const fieldTasks = getStorage(LS_KEYS.FIELD_TASKS, []);
    fieldTasks.unshift({
      id: `ft-${Date.now()}`,
      challengeId,
      escalationId: escalationRecord.id,
      title: `Field Verification: Complaint #${challengeId.slice(0, 8)}`,
      status: 'dispatched',
      created_at: new Date().toISOString(),
      assignedOfficer: 'Field Vigilance Squad 04',
      deadline: new Date(Date.now() + 48 * 3600000).toISOString(),
      reason: details.reason || 'Citizen reported unresolved'
    });
    setStorage(LS_KEYS.FIELD_TASKS, fieldTasks);

    return escalationRecord;
  },

  getEscalations: () => getStorage(LS_KEYS.ESCALATIONS, []),

  getFieldTasks: () => getStorage(LS_KEYS.FIELD_TASKS, []),

  resolveFieldTask: (taskId, verdict, inspectorNotes = '', inspectionPhoto = null) => {
    const fieldTasks = getStorage(LS_KEYS.FIELD_TASKS, []);
    const task = fieldTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.verdict = verdict; // 'confirmed_fixed' | 'confirmed_unfixed_penalize'
      task.inspectorNotes = inspectorNotes;
      task.inspectionPhoto = inspectionPhoto;
      task.completedAt = new Date().toISOString();
      setStorage(LS_KEYS.FIELD_TASKS, fieldTasks);
    }
    return task;
  },

  // Department Credit Scoring Calculation (0 - 100)
  getDepartmentScore: (deptId) => {
    const dept = accountabilityService.getDepartmentById(deptId);
    const storedScores = getStorage(LS_KEYS.SCORES, {});
    const custom = storedScores[deptId] || {};

    const base = dept.baseScore;
    const resolvedRate = custom.resolvedRate !== undefined ? custom.resolvedRate : 85;
    const slaCompliance = custom.slaCompliance !== undefined ? custom.slaCompliance : 88;
    const citizenSatisfaction = custom.citizenSatisfaction !== undefined ? custom.citizenSatisfaction : 4.2;
    const escalationsCount = custom.escalationsCount !== undefined ? custom.escalationsCount : 3;

    // Formula: 40% SLA + 30% Resolved Rate + 20% Satisfaction + 10% Low Escalation Penalty
    const satScore = (citizenSatisfaction / 5.0) * 100;
    const escPenalty = Math.min(25, escalationsCount * 2.5);
    const score = Math.round(
      (slaCompliance * 0.4) + (resolvedRate * 0.3) + (satScore * 0.2) + (10 - escPenalty * 0.4)
    );

    const clampedScore = Math.max(15, Math.min(99, score || base));

    let tier = 'Excellent';
    let badgeColor = '#059669';
    if (clampedScore < 50) {
      tier = 'Critical Review';
      badgeColor = '#dc2626';
    } else if (clampedScore < 70) {
      tier = 'Needs Improvement';
      badgeColor = '#d97706';
    } else if (clampedScore < 85) {
      tier = 'Good Standing';
      badgeColor = '#0284c7';
    }

    return {
      score: clampedScore,
      tier,
      badgeColor,
      slaCompliance,
      resolvedRate,
      citizenSatisfaction,
      escalationsCount,
      totalAssigned: custom.totalAssigned || 142,
      totalResolved: custom.totalResolved || 121,
      avgResolutionDays: custom.avgResolutionDays || dept.slaDays - 1.2
    };
  },

  // Leaderboard ranking of all departments
  getDepartmentLeaderboard: () => {
    return DEPARTMENTS.map(dept => {
      const metrics = accountabilityService.getDepartmentScore(dept.id);
      return {
        ...dept,
        ...metrics
      };
    }).sort((a, b) => b.score - a.score);
  }
};
