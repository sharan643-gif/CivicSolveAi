// ═══════════════════════════════════════════════════════════════════════════════
// CivicSolve AI — 100 Enterprise Features Service Layer
// Complete data + service operations for all categories
// ═══════════════════════════════════════════════════════════════════════════════

const getStored = (key, fb) => { try { const v = localStorage.getItem(`cs100_${key}`); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const setStored = (key, v) => { try { localStorage.setItem(`cs100_${key}`, JSON.stringify(v)); } catch {} };

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 1 — ADVANCED CIVIC INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Digital Twin
export const DIGITAL_TWIN = {
  cityName: 'Ranchi Smart City',
  state: 'Jharkhand',
  population: 1200000,
  area: '175 km²',
  zones: [
    { id: 'z-1', name: 'Zone A — Upper Market', population: 180000, problems: 42, projects: 8, healthScore: 72 },
    { id: 'z-2', name: 'Zone B — Kokar', population: 95000, problems: 28, projects: 5, healthScore: 65 },
    { id: 'z-3', name: 'Zone C — Doranda', population: 120000, problems: 18, projects: 12, healthScore: 81 },
    { id: 'z-4', name: 'Zone D — Kanke', population: 85000, problems: 35, projects: 3, healthScore: 58 },
    { id: 'z-5', name: 'Zone E — Namkum', population: 110000, problems: 22, projects: 7, healthScore: 74 },
  ],
  infrastructure: { roads: 2840, bridges: 45, hospitals: 28, schools: 186, waterPlants: 12, wasteFacilities: 8 },
  departments: ['PWD', 'Health', 'Education', 'SWM', 'Transport', 'Water Resources', 'Environment'],
  services: { waterSupply: 92, electricity: 97, wasteCollection: 78, publicTransport: 62, internet: 85 },
};

// 2. Civic Health Index
export const CIVIC_HEALTH_INDEX = {
  overall: 71,
  categories: [
    { name: 'Infrastructure', score: 65, trend: 'stable', icon: '🏗️', issues: 42 },
    { name: 'Healthcare', score: 78, trend: 'improving', icon: '🏥', issues: 15 },
    { name: 'Education', score: 72, trend: 'improving', icon: '📚', issues: 12 },
    { name: 'Transportation', score: 58, trend: 'declining', icon: '🚌', issues: 28 },
    { name: 'Environment', score: 68, trend: 'stable', icon: '🌿', issues: 18 },
    { name: 'Sanitation', score: 74, trend: 'improving', icon: '🗑️', issues: 22 },
    { name: 'Public Safety', score: 82, trend: 'stable', icon: '🛡️', issues: 8 },
    { name: 'Citizen Satisfaction', score: 69, trend: 'stable', icon: '😊', issues: 0 },
  ],
  history: [
    { month: 'Mar 2026', score: 68 }, { month: 'Apr 2026', score: 69 },
    { month: 'May 2026', score: 70 }, { month: 'Jun 2026', score: 67 },
    { month: 'Jul 2026', score: 69 }, { month: 'Aug 2026', score: 71 },
  ],
};

// 3. Ward Intelligence Scores
export const WARD_SCORES = [
  { id: 'w-1', name: 'Ward 1 — Upper Market', score: 78, prevScore: 75, problems: 8, resolved: 5, participation: 145, risk: 'low' },
  { id: 'w-2', name: 'Ward 14 — Kokar', score: 55, prevScore: 62, problems: 14, resolved: 4, participation: 67, risk: 'high' },
  { id: 'w-3', name: 'Ward 22 — Doranda', score: 85, prevScore: 82, problems: 5, resolved: 4, participation: 198, risk: 'low' },
  { id: 'w-4', name: 'Ward 31 — Kanke', score: 48, prevScore: 55, problems: 18, resolved: 3, participation: 42, risk: 'critical' },
  { id: 'w-5', name: 'Ward 38 — Namkum', score: 72, prevScore: 70, problems: 9, resolved: 6, participation: 112, risk: 'medium' },
];

// 4. Problem Dependency Graph
export const PROBLEM_DEPENDENCIES = [
  { id: 'pd-1', problem: 'Water Shortage', causes: ['Pipeline Leakage', 'Poor Distribution'], effects: ['Poor Sanitation', 'Health Complaints', 'School Absenteeism'] },
  { id: 'pd-2', problem: 'Road Damage', causes: ['Heavy Vehicles', 'Poor Drainage'], effects: ['Traffic Congestion', 'Accidents', 'Economic Loss'] },
  { id: 'pd-3', problem: 'Waste Accumulation', causes: ['Inadequate Collection', 'Low Participation'], effects: ['Disease Spread', 'Water Contamination', 'Tourism Impact'] },
];

// 5. Problem Cascade Detection
export const CASCADE_DETECTIONS = [
  { primary: 'Monsoon Flooding in Dumka', secondary: ['Road Damage', 'Crop Loss', 'Displacement', 'Health Risks'], impact: 18000, probability: 85 },
  { primary: 'Pipeline Burst in Ward 14', secondary: ['Water Contamination', 'Road Sinkhole', 'Business Disruption'], impact: 3200, probability: 72 },
];

// 6. Civic Risk Radar
export const RISK_RADAR = [
  { category: 'Environmental', score: 65, color: '#10b981' },
  { category: 'Infrastructure', score: 45, color: '#ef4444' },
  { category: 'Public Service', score: 72, color: '#f59e0b' },
  { category: 'Operational', score: 78, color: '#3b82f6' },
  { category: 'Community', score: 68, color: '#8b5cf6' },
  { category: 'Project', score: 82, color: '#06b6d4' },
];

// 7. Early Warning Center
export const EARLY_WARNINGS = [
  { id: 'ew-1', alert: 'Drainage complaints increased 40% in Zone A', severity: 'high', zone: 'Zone A', date: '2026-08-22', category: 'Infrastructure' },
  { id: 'ew-2', alert: 'Water quality reports rising in Ward 14', severity: 'critical', zone: 'Ward 14', date: '2026-08-21', category: 'Health' },
  { id: 'ew-3', alert: 'Traffic signal failures in Upper Market', severity: 'medium', zone: 'Zone A', date: '2026-08-20', category: 'Transport' },
  { id: 'ew-4', alert: 'Illegal dumping reports in Kanke rising', severity: 'medium', zone: 'Zone D', date: '2026-08-19', category: 'Environment' },
];

// 8. Problem Recurrence Analyzer
export const RECURRENCE_DATA = [
  { problem: 'Pothole — Station Road', recurrences: 4, avgInterval: '45 days', lastSolution: 'Temporary patch', recommended: 'Complete road resurfacing with drainage improvement' },
  { problem: 'Waterlogging — Kokar Main Road', recurrences: 6, avgInterval: '90 days', lastSolution: 'Pump out water', recommended: 'Install permanent storm water drainage system' },
  { problem: 'Street Light Failure — Ward 22', recurrences: 3, avgInterval: '60 days', lastSolution: 'Replace bulb', recommended: 'Install LED smart lighting with remote monitoring' },
];

// 9. Root Problem Network
export const ROOT_PROBLEM_NETWORK = [
  { root: 'Aging Infrastructure', connected: ['Potholes', 'Pipe Leaks', 'Building Damage', 'Bridge Cracks'], count: 45 },
  { root: 'Poor Drainage', connected: ['Road Flooding', 'Waterlogging', 'Mosquito Breeding', 'Foundation Damage'], count: 32 },
  { root: 'Inadequate Maintenance', connected: ['Street Light Failures', 'Broken Sidewalks', 'Overgrown Vegetation'], count: 28 },
];

// 10. Intervention Simulator
export const INTERVENTION_SIMULATIONS = [
  { id: 'is-1', name: 'Complete Road Resurfacing — Station Road', cost: 1500000, time: 3, impact: 5000, risk: 'Medium', citizensAffected: 12000 },
  { id: 'is-2', name: 'Storm Drainage System — Kokar', cost: 2200000, time: 6, impact: 8000, risk: 'Low', citizensAffected: 18000 },
  { id: 'is-3', name: 'LED Street Light Retrofit — City Wide', cost: 800000, time: 2, impact: 3000, risk: 'Low', citizensAffected: 50000 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 2 — ADVANCED CITIZEN PARTICIPATION
// ═══════════════════════════════════════════════════════════════════════════════

export const CIVIC_MISSIONS = [
  { id: 'cm-1', title: 'Infrastructure Scout', description: 'Report 5 infrastructure issues', reward: 150, progress: 3, total: 5, icon: '🔍', color: '#3b82f6' },
  { id: 'cm-2', title: 'Community Verifier', description: 'Help verify 3 community reports', reward: 200, progress: 1, total: 3, icon: '✅', color: '#10b981' },
  { id: 'cm-3', title: 'Solution Champion', description: 'Propose 2 solutions that get approved', reward: 500, progress: 0, total: 2, icon: '💡', color: '#f59e0b' },
  { id: 'cm-4', title: 'Neighborhood Guardian', description: 'Follow and support 10 local problems', reward: 300, progress: 7, total: 10, icon: '🛡️', color: '#8b5cf6' },
];

export const COMMUNITY_GOALS = [
  { id: 'cg-1', title: 'Reduce illegal dumping in Ward 14', target: 50, current: 32, unit: 'reports resolved', createdBy: 'Ward 14 Committee', supporters: 89 },
  { id: 'cg-2', title: 'Fix all potholes on Station Road', target: 12, current: 8, unit: 'potholes fixed', createdBy: 'PWD Admin', supporters: 156 },
];

export const NEIGHBORHOOD_HUBS = [
  { id: 'nh-1', name: 'Upper Market Hub', problems: 18, projects: 4, events: 3, discussions: 12, members: 234 },
  { id: 'nh-2', name: 'Kokar Community Hub', problems: 12, projects: 2, events: 1, discussions: 8, members: 156 },
  { id: 'nh-3', name: 'Doranda Civic Hub', problems: 8, projects: 6, events: 5, discussions: 15, members: 312 },
];

export const CIVIC_PETITIONS = [
  { id: 'cp-1', title: 'Install solar lighting near Rock Garden', description: 'Safety concern for evening walkers', supporters: 234, status: 'active', scope: 'Ward 22', created: '2026-08-15' },
  { id: 'cp-2', title: 'Expand bus Route 4 to Namkum', description: 'Students need reliable transport', supporters: 189, status: 'active', scope: 'Zone E', created: '2026-08-10' },
];

export const COMMUNITY_PROPOSALS = [
  { id: 'cpo-1', title: 'Install solar lighting near the public park', description: 'Low-cost solar panels for 2km stretch', estimatedCost: 350000, supporters: 167, status: 'under_review' },
];

export const PARTICIPATORY_BUDGET = [
  { id: 'pb-1', title: 'Street Light Upgrade — Ward 22', budget: 500000, votes: 234, impact: 'Improved safety for 5,000 residents', status: 'approved' },
  { id: 'pb-2', title: 'Park Renovation — Doranda', budget: 800000, votes: 189, impact: 'Recreational space for 3,000 families', status: 'voting' },
  { id: 'pb-3', title: 'Rainwater Harvesting — 3 Schools', budget: 450000, votes: 312, impact: 'Water security for 2,500 students', status: 'voting' },
];

export const COMMUNITY_PRIORITIES = [
  { rank: 1, problem: 'Road Flooding — Kokar', urgency: 95, supporters: 189 },
  { rank: 2, problem: 'Water Pipeline Leak — Ward 14', urgency: 88, supporters: 156 },
  { rank: 3, problem: 'Street Light Outage — Kanke', urgency: 72, supporters: 98 },
];

export const CIVIC_EVENTS = [
  { id: 'ce-1', title: 'Public Consultation — Budget 2027', type: 'consultation', date: '2026-09-15', time: '10:00', location: 'Ranchi Municipal Hall', capacity: 200, registered: 145 },
  { id: 'ce-2', title: 'Civic Hackathon — Smart Ranchi', type: 'hackathon', date: '2026-10-01', time: '09:00', location: 'BIT Mesra', capacity: 150, registered: 98 },
  { id: 'ce-3', title: 'Kokar Cleanup Drive', type: 'volunteer', date: '2026-09-05', time: '07:00', location: 'Kokar Main Road', capacity: 50, registered: 34 },
  { id: 'ce-4', title: 'IoT Workshop for Students', type: 'workshop', date: '2026-09-20', time: '14:00', location: 'NIT Jamshedpur', capacity: 60, registered: 52 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 3 — FIELD OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const FIELD_INSPECTIONS = [
  { id: 'fi-1', caseId: 'c-1', officer: 'Rajesh Kumar', location: 'Station Road, Ranchi', date: '2026-08-25', time: '10:00', priority: 'high', status: 'scheduled', checklist: ['Surface Condition', 'Drainage', 'Signage', 'Lighting'] },
  { id: 'fi-2', caseId: 'c-2', officer: 'Sunita Devi', location: 'Ward 14, Kokar', date: '2026-08-24', time: '14:00', priority: 'critical', status: 'completed', checklist: ['Pipeline Integrity', 'Water Quality', 'Road Surface'] },
  { id: 'fi-3', caseId: 'c-3', officer: 'Amit Singh', location: 'Kanke Road', date: '2026-08-26', time: '09:00', priority: 'medium', status: 'scheduled', checklist: ['Street Lights', 'Sidewalk Condition', 'Traffic Signs'] },
];

export const INSPECTION_CHECKLISTS = [
  { id: 'ic-1', name: 'Road Inspection', items: ['Surface condition', 'Drainage adequacy', 'Signage visibility', 'Lighting functionality', 'Safety barriers', 'Lane markings'] },
  { id: 'ic-2', name: 'Water Infrastructure', items: ['Pipeline integrity', 'Water pressure', 'Leak detection', 'Valve condition', 'Meter accuracy'] },
  { id: 'ic-3', name: 'Building Safety', items: ['Structural integrity', 'Fire safety', 'Electrical safety', 'Access compliance', 'Drainage'] },
];

export const FIELD_TEAM_DISPATCH = [
  { id: 'ftd-1', team: 'Team Alpha', members: ['Rajesh K.', 'Amit S.', 'Priya M.'], currentCase: 'Station Road', nextCase: 'Kanke Road', status: 'en_route', priority: 'high' },
  { id: 'ftd-2', team: 'Team Beta', members: ['Sunita D.', 'Vikram O.'], currentCase: 'Ward 14', nextCase: null, status: 'on_site', priority: 'critical' },
];

export const FIELD_ACTIVITY_TIMELINE = [
  { id: 'fat-1', case: 'Station Road Potholes', activity: 'Inspection scheduled', officer: 'Rajesh Kumar', time: '2026-08-23T10:00:00Z', type: 'inspection' },
  { id: 'fat-2', case: 'Ward 14 Water Leak', activity: 'Evidence uploaded', officer: 'Sunita Devi', time: '2026-08-22T14:30:00Z', type: 'evidence' },
  { id: 'fat-3', case: 'Kanke Street Lights', activity: 'Field report submitted', officer: 'Amit Singh', time: '2026-08-21T16:00:00Z', type: 'report' },
];

export const FIELD_PRODUCTIVITY = {
  inspectionsCompleted: 45,
  casesVisited: 38,
  avgResponseTime: 2.1,
  pendingTasks: 12,
  slaCompliance: 87,
  weeklyTrend: [
    { week: 'W1', inspections: 8 }, { week: 'W2', inspections: 12 },
    { week: 'W3', inspections: 10 }, { week: 'W4', inspections: 15 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 4 — CIVIC ASSET MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CIVIC_ASSETS = [
  { id: 'ca-1', name: 'Station Road Bridge', type: 'bridge', department: 'PWD', condition: 'fair', installed: '2010', lastInspection: '2026-07-15', problems: 5, riskLevel: 'medium', lat: 23.3500, lng: 85.3300 },
  { id: 'ca-2', name: 'Kokar Water Main — Section A', type: 'pipeline', department: 'Water Resources', condition: 'poor', installed: '2005', lastInspection: '2026-08-10', problems: 12, riskLevel: 'high', lat: 23.3600, lng: 85.3500 },
  { id: 'ca-3', name: 'Doranda STP', type: 'water_treatment', department: 'Water Resources', condition: 'good', installed: '2020', lastInspection: '2026-08-01', problems: 2, riskLevel: 'low', lat: 23.3400, lng: 85.3200 },
  { id: 'ca-4', name: 'Upper Market Flyover', type: 'bridge', department: 'PWD', condition: 'good', installed: '2018', lastInspection: '2026-06-20', problems: 1, riskLevel: 'low', lat: 23.3550, lng: 85.3400 },
  { id: 'ca-5', name: 'Kanke Road Street Lights (2km)', type: 'street_light', department: 'PWD', condition: 'poor', installed: '2015', lastInspection: '2026-08-18', problems: 8, riskLevel: 'high', lat: 23.3700, lng: 85.3600 },
  { id: 'ca-6', name: 'Namkum Waste Collection Point', type: 'waste_facility', department: 'SWM', condition: 'fair', installed: '2019', lastInspection: '2026-08-05', problems: 4, riskLevel: 'medium', lat: 23.3300, lng: 85.3100 },
];

export const ASSET_MAINTENANCE_HISTORY = [
  { assetId: 'ca-1', date: '2026-07-15', type: 'inspection', action: 'Routine inspection — surface cracking noted', cost: 5000 },
  { assetId: 'ca-1', date: '2025-12-10', type: 'repair', action: 'Deck surface patching', cost: 45000 },
  { assetId: 'ca-2', date: '2026-08-10', type: 'inspection', action: 'Leak detected at joint 14', cost: 2000 },
  { assetId: 'ca-2', date: '2026-03-15', type: 'repair', action: 'Pipe section replacement', cost: 120000 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 5 — PROCUREMENT & RESOURCES
// ═══════════════════════════════════════════════════════════════════════════════

export const RESOURCE_INVENTORY = [
  { id: 'ri-1', name: 'Excavator — JCB 3DX', type: 'equipment', department: 'PWD', status: 'available', location: 'PWD Yard', assignedTo: null },
  { id: 'ri-2', name: 'Water Tanker — 5000L', type: 'vehicle', department: 'Water Resources', status: 'deployed', location: 'Ward 14', assignedTo: 'Leak Repair Team' },
  { id: 'ri-3', name: 'Road Roller', type: 'equipment', department: 'PWD', status: 'maintenance', location: 'PWD Workshop', assignedTo: null },
  { id: 'ri-4', name: 'Survey Team Alpha', type: 'personnel', department: 'PWD', status: 'available', location: 'Office', assignedTo: null },
  { id: 'ri-5', name: 'Asphalt — 20 tons', type: 'material', department: 'PWD', status: 'available', location: 'PWD Yard', assignedTo: null },
];

export const RESOURCE_REQUESTS = [
  { id: 'rr-1', requestedBy: 'Dept Officer — PWD', resource: 'Excavator', project: 'Station Road Repair', date: '2026-08-20', status: 'approved', priority: 'high' },
  { id: 'rr-2', requestedBy: 'Field Officer — WRD', resource: 'Water Tanker', project: 'Ward 14 Leak', date: '2026-08-22', status: 'pending', priority: 'critical' },
];

export const PROCUREMENT_REQUESTS = [
  { id: 'pr-1', title: 'IoT Sensors — 50 units', department: 'PWD', estimatedCost: 450000, status: 'approved', requestedBy: 'Dept Head — PWD', date: '2026-08-15' },
  { id: 'pr-2', title: 'LED Street Lights — 200 units', department: 'PWD', estimatedCost: 800000, status: 'pending', requestedBy: 'City Admin', date: '2026-08-20' },
];

export const VENDOR_DIRECTORY = [
  { id: 'vd-1', name: 'Jharkhand Electronics Corp', type: 'Technology', products: ['IoT Sensors', 'LED Lights', 'Solar Panels'], rating: 4.5, contracts: 8 },
  { id: 'vd-2', name: 'Tata Steel Materials', type: 'Construction', products: ['Steel', 'Cement', 'Pipes'], rating: 4.8, contracts: 15 },
  { id: 'vd-3', name: 'GeoTech Solutions', type: 'Technology', products: ['GIS Systems', 'Remote Sensing', 'Data APIs'], rating: 4.3, contracts: 5 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 6 — FUNDING & PROJECT FINANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const PROJECT_BUDGETS = [
  { id: 'pb-1', projectId: 'pw-1', name: 'Rural Road IoT Monitoring', planned: 530000, allocated: 530000, committed: 380000, spent: 185000, remaining: 345000 },
  { id: 'pb-2', projectId: 'pw-2', name: 'Acoustic Leak Detection', planned: 330000, allocated: 330000, committed: 200000, spent: 95000, remaining: 235000 },
];

export const FUNDING_SOURCES = [
  { id: 'fs-1', name: 'Government — PWD Budget', type: 'Government', amount: 5000000, utilized: 1850000, projects: 8 },
  { id: 'fs-2', name: 'Tata Steel CSR Fund', type: 'CSR', amount: 2500000, utilized: 950000, projects: 4 },
  { id: 'fs-3', name: 'World Bank Urban Grant', type: 'Grant', amount: 12000000, utilized: 4200000, projects: 6 },
  { id: 'fs-4', name: 'Jharkhand State Innovation Fund', type: 'Government', amount: 3000000, utilized: 1200000, projects: 5 },
];

export const GRANTS = [
  { id: 'g-1', title: 'Smart City Mission — Phase 3', amount: 15000000, deadline: '2026-12-31', status: 'active', deliverables: ['IoT deployment', 'Dashboard', 'Training'] },
  { id: 'g-2', title: 'AMRUT 2.0 — Water Infrastructure', amount: 8000000, deadline: '2027-03-31', status: 'active', deliverables: ['Pipeline repair', 'Meter installation', 'Leak detection'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 7 — KNOWLEDGE & RESEARCH
// ═══════════════════════════════════════════════════════════════════════════════

export const RESEARCH_LIBRARY = [
  { id: 'rl-1', title: 'IoT-Based Road Condition Monitoring in Rural India', type: 'paper', author: 'BIT Mesra', year: 2025, tags: ['IoT', 'Roads', 'Rural'], access: 'public' },
  { id: 'rl-2', title: 'Acoustic Leak Detection — Field Performance Report', type: 'report', author: 'WaterAid India', year: 2026, tags: ['Water', 'Leak Detection', 'Sensors'], access: 'organization' },
  { id: 'rl-3', title: 'Smart Waste Management — Jharkhand Pilot Study', type: 'case_study', author: 'NIT Jamshedpur', year: 2025, tags: ['Waste', 'Smart City', 'Pilot'], access: 'public' },
  { id: 'rl-4', title: 'Participatory Budgeting in Indian Municipalities', type: 'paper', author: 'Xavier University', year: 2024, tags: ['Governance', 'Budget', 'Participation'], access: 'public' },
];

export const RESEARCH_DATASETS = [
  { id: 'rds-1', name: 'Ranchi Civic Problems 2024-2026', source: 'CivicSolve AI', frequency: 'Monthly', access: 'public', records: 1390, license: 'CC-BY-4.0' },
  { id: 'rds-2', name: 'Water Quality Test Results — Ward 14', source: 'WRD', frequency: 'Weekly', access: 'department', records: 520, license: 'Internal' },
  { id: 'rds-3', name: 'Road Surface Assessment Data', source: 'PWD', frequency: 'Quarterly', access: 'department', records: 284, license: 'Internal' },
];

export const KNOWLEDGE_GRAPH = [
  { from: 'Water Shortage', to: 'Pipeline Leakage', relationship: 'causes' },
  { from: 'Pipeline Leakage', to: 'Acoustic Leak Detection', relationship: 'solved_by' },
  { from: 'Acoustic Leak Detection', to: 'WaterAid India', relationship: 'implemented_by' },
  { from: 'Road Damage', to: 'Poor Drainage', relationship: 'causes' },
  { from: 'Poor Drainage', to: 'Storm Drainage System', relationship: 'solved_by' },
];

export const BEST_PRACTICES = [
  { id: 'bp-1', title: 'IoT Road Monitoring — Jharkhand Pilot', location: 'Dumka', impact: '35% reduction in road failures', cost: '₹5.3L', replicable: true },
  { id: 'bp-2', title: 'Community Waste Segregation — Kokar', location: 'Ranchi', impact: '28% increase in recycling', cost: '₹0.8L', replicable: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 8 — COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════════════

export const ANNOUNCEMENTS = [
  { id: 'an-1', title: 'Road Repair Schedule — Station Road', author: 'PWD', date: '2026-08-20', scope: 'Ward 1', priority: 'normal', read: 145 },
  { id: 'an-2', title: 'Water Supply Disruption — Ward 14', author: 'WRD', date: '2026-08-22', scope: 'Ward 14', priority: 'high', read: 89 },
  { id: 'an-3', title: 'Emergency Flood Advisory — Dumka', author: 'District Admin', date: '2026-08-23', scope: 'District', priority: 'critical', read: 456 },
];

export const NOTIFICATION_TEMPLATES = [
  { id: 'nt-1', name: 'Case Assignment', subject: 'New case assigned: {{caseTitle}}', body: 'You have been assigned case #{{caseId}}. Priority: {{priority}}.' },
  { id: 'nt-2', name: 'SLA Warning', subject: 'SLA Warning: {{caseTitle}}', body: 'Case #{{caseId}} is approaching SLA deadline. {{remaining}} hours remaining.' },
  { id: 'nt-3', name: 'Approval Request', subject: 'Approval Needed: {{title}}', body: 'Your approval is required for {{title}}. Please review and respond.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 9 — PLATFORM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ORG_VERIFICATIONS = [
  { id: 'ov-1', org: 'BIT Mesra Innovation Cell', type: 'university', status: 'approved', verifiedBy: 'Platform Admin', date: '2026-07-01' },
  { id: 'ov-2', org: 'Jharkhand Green Energy NGO', type: 'ngo', status: 'pending', submittedBy: 'Ngo Admin', date: '2026-08-20' },
  { id: 'ov-3', org: 'Ranchi Smart Solutions Pvt Ltd', type: 'startup', status: 'pending', submittedBy: 'Startup Founder', date: '2026-08-22' },
];

export const PLATFORM_HEALTH = {
  api: { status: 'healthy', latency: 45, uptime: 99.9 },
  database: { status: 'healthy', connections: 12, uptime: 99.95 },
  auth: { status: 'healthy', providers: ['Supabase Auth'], uptime: 99.99 },
  ai: { status: 'healthy', provider: 'Google Gemini', model: 'gemini-3.1-flash-lite', avgLatency: 290 },
  storage: { status: 'healthy', usage: '2.4 GB', limit: '10 GB' },
  notifications: { status: 'healthy', provider: 'In-App', queue: 0 },
};

export const AI_USAGE = {
  totalRequests: 12450,
  totalTokens: 8900000,
  avgLatency: 290,
  errorRate: 0.1,
  dailyUsage: [
    { date: 'Aug 18', requests: 890 }, { date: 'Aug 19', requests: 920 },
    { date: 'Aug 20', requests: 1050 }, { date: 'Aug 21', requests: 1180 },
    { date: 'Aug 22', requests: 1340 }, { date: 'Aug 23', requests: 1120 },
  ],
  providers: [
    { name: 'Google Gemini', model: 'gemini-3.1-flash-lite', requests: 9400, avgLatency: 280, errorRate: 0.1 },
    { name: 'Google Gemini', model: 'gemini-2.5-flash-lite', requests: 3050, avgLatency: 310, errorRate: 0.2 },
  ],
};

export const SYSTEM_INCIDENTS = [
  { id: 'si-1', title: 'API Rate Limit Exceeded', severity: 'medium', startTime: '2026-08-20T14:00:00Z', endTime: '2026-08-20T14:30:00Z', status: 'resolved', impact: 'Temporary API slowdown', rootCause: 'Spike in AI requests' },
  { id: 'si-2', title: 'Database Connection Pool Exhaustion', severity: 'high', startTime: '2026-08-18T09:00:00Z', endTime: '2026-08-18T09:15:00Z', status: 'resolved', impact: '15-minute service disruption', rootCause: 'Concurrent batch queries' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY 10 — SECURITY & GOVERNANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const SECURITY_EVENTS = [
  { id: 'se-1', type: 'failed_login', user: 'unknown@test.com', time: '2026-08-23T03:15:00Z', ip: '192.168.1.xxx', severity: 'medium', details: '3 failed attempts' },
  { id: 'se-2', type: 'permission_change', user: 'admin@civicsolve.gov', time: '2026-08-22T14:00:00Z', severity: 'low', details: 'Role changed: citizen → government' },
  { id: 'se-3', type: 'mass_export', user: 'analyst@dept.gov', time: '2026-08-21T10:30:00Z', severity: 'medium', details: 'Exported 500 records' },
  { id: 'se-4', type: 'api_abuse', user: 'unknown', time: '2026-08-20T22:00:00Z', ip: '10.0.0.xxx', severity: 'high', details: '1000 requests in 1 minute' },
];

export const COMPLIANCE_ITEMS = [
  { id: 'ci-1', policy: 'Data Protection — Citizen Records', owner: 'Platform Admin', status: 'compliant', reviewDate: '2026-09-01', evidence: 'Encryption enabled, RLS active' },
  { id: 'ci-2', policy: 'Government Data Classification', owner: 'State Admin', status: 'compliant', reviewDate: '2026-08-15', evidence: 'Classification tags applied' },
  { id: 'ci-3', policy: 'Audit Log Retention (1 year)', owner: 'Platform Admin', status: 'under_review', reviewDate: '2026-10-01', evidence: '90 days retained' },
  { id: 'ci-4', policy: 'File Upload Security', owner: 'Platform Admin', status: 'compliant', reviewDate: '2026-09-15', evidence: 'Type validation, size limits active' },
];

export const BACKUP_STATUS = {
  lastBackup: '2026-08-23T04:00:00Z',
  status: 'healthy',
  method: 'Supabase automatic backups',
  retention: '7 days',
  size: '2.4 GB',
  note: 'Managed by Supabase infrastructure',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const digitalTwinService = { getData: () => DIGITAL_TWIN };
export const civicHealthService = { getData: () => CIVIC_HEALTH_INDEX };
export const wardScoreService = { getAll: () => WARD_SCORES };
export const problemDependencyService = { getData: () => PROBLEM_DEPENDENCIES };
export const cascadeService = { getData: () => CASCADE_DETECTIONS };
export const riskRadarService = { getData: () => RISK_RADAR };
export const earlyWarningService = { getData: () => EARLY_WARNINGS };
export const recurrenceService = { getData: () => RECURRENCE_DATA };
export const rootProblemService = { getData: () => ROOT_PROBLEM_NETWORK };
export const interventionSimService = { getData: () => INTERVENTION_SIMULATIONS };

export const civicMissionService = { getAll: () => CIVIC_MISSIONS };
export const communityGoalService = { getAll: () => COMMUNITY_GOALS };
export const neighborhoodHubService = { getAll: () => NEIGHBORHOOD_HUBS };
export const petitionService = { getAll: () => CIVIC_PETITIONS };
export const proposalService = { getAll: () => COMMUNITY_PROPOSALS };
export const participatoryBudgetService = { getAll: () => PARTICIPATORY_BUDGET };
export const communityPriorityService = { getAll: () => COMMUNITY_PRIORITIES };
export const civicEventService = { getAll: () => CIVIC_EVENTS };

export const fieldInspectionService = { getAll: () => FIELD_INSPECTIONS };
export const inspectionChecklistService = { getAll: () => INSPECTION_CHECKLISTS };
export const fieldDispatchService = { getAll: () => FIELD_TEAM_DISPATCH };
export const fieldTimelineService = { getAll: () => FIELD_ACTIVITY_TIMELINE };
export const fieldProductivityService = { getData: () => FIELD_PRODUCTIVITY };

export const assetService = { getAll: () => CIVIC_ASSETS, getHistory: (id) => ASSET_MAINTENANCE_HISTORY.filter(h => h.assetId === id) };
export const resourceService = { getAll: () => RESOURCE_INVENTORY };
export const resourceRequestService = { getAll: () => RESOURCE_REQUESTS };
export const procurementService = { getAll: () => PROCUREMENT_REQUESTS };
export const vendorService = { getAll: () => VENDOR_DIRECTORY };

export const budgetService = { getAll: () => PROJECT_BUDGETS };
export const fundingSourceService = { getAll: () => FUNDING_SOURCES };
export const grantService = { getAll: () => GRANTS };

export const researchLibraryService = { getAll: () => RESEARCH_LIBRARY };
export const datasetService = { getAll: () => RESEARCH_DATASETS };
export const knowledgeGraphService = { getData: () => KNOWLEDGE_GRAPH };
export const bestPracticeService = { getAll: () => BEST_PRACTICES };

export const announcementService = { getAll: () => ANNOUNCEMENTS };
export const notificationTemplateService = { getAll: () => NOTIFICATION_TEMPLATES };

export const orgVerificationService = { getAll: () => ORG_VERIFICATIONS };
export const platformHealthService = { getData: () => PLATFORM_HEALTH };
export const aiUsageService = { getData: () => AI_USAGE };
export const incidentService = { getAll: () => SYSTEM_INCIDENTS };
export const securityEventService = { getAll: () => SECURITY_EVENTS };
export const complianceService = { getAll: () => COMPLIANCE_ITEMS };
export const backupStatusService = { getData: () => BACKUP_STATUS };

export default {
  digitalTwinService, civicHealthService, wardScoreService,
  problemDependencyService, cascadeService, riskRadarService,
  earlyWarningService, recurrenceService, rootProblemService, interventionSimService,
  civicMissionService, communityGoalService, neighborhoodHubService,
  petitionService, proposalService, participatoryBudgetService,
  communityPriorityService, civicEventService,
  fieldInspectionService, inspectionChecklistService, fieldDispatchService,
  fieldTimelineService, fieldProductivityService,
  assetService, resourceService, resourceRequestService, procurementService, vendorService,
  budgetService, fundingSourceService, grantService,
  researchLibraryService, datasetService, knowledgeGraphService, bestPracticeService,
  announcementService, notificationTemplateService,
  orgVerificationService, platformHealthService, aiUsageService,
  incidentService, securityEventService, complianceService, backupStatusService,
};
