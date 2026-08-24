// CivicSolve AI — 40 Advanced Features Service Layer
// All new data structures and service operations

// ═══════════════════════════════════════════════════════════════════════════════
// A. ADVANCED AI FEATURES DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 1. AI Root Cause Analysis Trees
export const ROOT_CAUSE_TREES = {
  'monsoon-road-accessibility': {
    rootProblem: 'Monsoon Rural Road Accessibility',
    tree: [
      { id: 'rc-1', label: 'Road Becomes Impassable', depth: 0, expanded: true, children: ['rc-2', 'rc-3', 'rc-4'] },
      { id: 'rc-2', label: 'Poor Drainage Infrastructure', depth: 1, expanded: false, children: ['rc-5', 'rc-6'] },
      { id: 'rc-5', label: 'No Storm Water Drains Installed', depth: 2, expanded: false, children: [] },
      { id: 'rc-6', label: 'Existing Drains Blocked by Debris', depth: 2, expanded: false, children: [] },
      { id: 'rc-3', label: 'Low-Quality Road Surface Materials', depth: 1, expanded: false, children: ['rc-7', 'rc-8'] },
      { id: 'rc-7', label: 'Substandard Bitumen Used', depth: 2, expanded: false, children: [] },
      { id: 'rc-8', label: 'Insufficient Compaction During Construction', depth: 2, expanded: false, children: [] },
      { id: 'rc-4', label: 'Waterlogging Due to Terrain', depth: 1, expanded: false, children: ['rc-9'] },
      { id: 'rc-9', label: 'Flat Gradient Prevents Natural Runoff', depth: 2, expanded: false, children: [] },
    ]
  },
  'water-pipeline-leakage': {
    rootProblem: 'Water Pipeline Leakage Detection',
    tree: [
      { id: 'rc-10', label: 'Major Pipeline Leakages', depth: 0, expanded: true, children: ['rc-11', 'rc-12'] },
      { id: 'rc-11', label: 'Aging Infrastructure', depth: 1, expanded: false, children: ['rc-13', 'rc-14'] },
      { id: 'rc-13', label: 'Pipes Over 30 Years Old', depth: 2, expanded: false, children: [] },
      { id: 'rc-14', label: 'Corrosion from Soil Chemistry', depth: 2, expanded: false, children: [] },
      { id: 'rc-12', label: 'Pressure Fluctuations', depth: 1, expanded: false, children: ['rc-15'] },
      { id: 'rc-15', label: 'Inadequate Pressure Regulation', depth: 2, expanded: false, children: [] },
    ]
  }
};

// 2. AI Problem Summaries
export const PROBLEM_SUMMARIES = {
  'monsoon-road-accessibility': {
    problem: 'Rural roads in Sikaripara Block, Dumka become completely impassable during monsoon season due to deep potholes and water accumulation.',
    mainConcerns: ['Emergency vehicle access blocked', 'School bus routes disrupted', 'Economic isolation of villages', 'Safety risk for two-wheelers and pedestrians'],
    communityOpinion: '87% of residents rate this as urgent. Local panchayat has raised multiple requests over 3 years without resolution.',
    proposedSolutions: ['IoT road condition monitoring', 'Improved drainage channels', 'Permeable road surface materials', 'Community reporting app'],
    currentStatus: 'Prototype phase — Team AquaTech developing IoT sensor network for predictive maintenance.',
  },
  'water-pipeline-leakage': {
    problem: 'Water distribution pipelines in Ward 14, Kokar, Ranchi suffer from chronic leakages causing 35% water loss.',
    mainConcerns: ['Water scarcity despite supply', 'Road damage from underground leaks', 'Wastage of treated water', 'Health risks from contaminated supply'],
    communityOpinion: '72% affected households report intermittent supply. Average 4 hours/day without water.',
    proposedSolutions: ['Acoustic leak detection sensors', 'Pressure management system', 'Pipe replacement program', 'Community monitoring dashboard'],
    currentStatus: 'Team Formed — Backend architecture phase.',
  }
};

// 3. AI Debate Analysis
export const DEBATE_ANALYSIS = {
  'monsoon-road-accessibility': {
    supporting: [
      { user: 'Aman Kumar', argument: 'This road is the only access route for 3 villages. During emergencies, ambulances cannot reach.', strength: 92 },
      { user: 'Priya Singh', argument: 'School attendance drops 40% during monsoon because buses cannot safely navigate.', strength: 88 },
      { user: 'Dr. Pathak', argument: 'IoT monitoring could provide early warning and prevent complete road failure.', strength: 85 },
    ],
    opposing: [
      { user: 'Rajesh Mahto', argument: 'Budget allocation should prioritize healthcare over road monitoring technology.', strength: 65 },
      { user: 'Municipal Officer', argument: 'Existing maintenance schedule is sufficient; this is seasonal issue.', strength: 45 },
    ],
    commonGround: ['Road quality needs improvement', 'Budget constraints must be acknowledged', 'Technology alone cannot solve the problem'],
    frequentlyMentioned: ['Drainage', 'Emergency access', 'Budget', 'IoT monitoring', 'Community participation'],
    topSuggestions: ['Install storm water drains alongside roads', 'Deploy low-cost road sensors', 'Create community maintenance committees'],
  }
};

// 4. AI Sentiment Analysis
export const SENTIMENT_DATA = {
  'monsoon-road-accessibility': { positive: 15, neutral: 23, negative: 45, concerned: 62, supportive: 38, totalResponses: 183 },
  'water-pipeline-leakage': { positive: 22, neutral: 18, negative: 35, concerned: 48, supportive: 42, totalResponses: 125 },
  'rural-drone-delivery': { positive: 55, neutral: 20, negative: 10, concerned: 15, supportive: 65, totalResponses: 98 },
};

// 5. AI Feasibility Scores
export const FEASIBILITY_SCORES = {
  'monsoon-road-accessibility': {
    technical: 82, financial: 65, operational: 78, social: 90, environmental: 75,
    overall: 78,
    technicalNote: 'IoT sensors and LoRaWAN are proven technologies for this use case.',
    financialNote: 'Requires ₹5L initial investment. Maintenance costs are manageable.',
    operationalNote: 'Community volunteers can handle sensor maintenance with minimal training.',
    socialNote: 'Strong community support (87% favor). Addresses critical accessibility need.',
    environmentalNote: 'IoT monitoring reduces waste and enables predictive maintenance.',
  },
  'water-pipeline-leakage': {
    technical: 88, financial: 72, operational: 70, social: 85, environmental: 80,
    overall: 79,
    technicalNote: 'Acoustic detection is mature technology used in major cities worldwide.',
    financialNote: 'Higher upfront cost but significant water loss savings within 18 months.',
    operationalNote: 'Requires trained technicians for sensor installation and calibration.',
    socialNote: 'Directly addresses water scarcity affecting 3,200 households.',
    environmentalNote: 'Reduces water waste and prevents road damage from underground leaks.',
  }
};

// 6. AI Cost Estimator
export const COST_ESTIMATES = {
  'monsoon-road-accessibility': {
    infrastructure: 280000, labor: 120000, technology: 85000, maintenance: 45000,
    total: 530000, currency: 'INR',
    breakdown: [
      { item: 'IoT Sensors (20 units)', cost: 180000 },
      { item: 'LoRaWAN Gateway', cost: 45000 },
      { item: 'Solar Power Units', cost: 55000 },
      { item: 'Installation Labor', cost: 120000 },
      { item: 'Dashboard Development', cost: 85000 },
      { item: 'Annual Maintenance', cost: 45000 },
    ]
  },
  'water-pipeline-leakage': {
    infrastructure: 150000, labor: 80000, technology: 65000, maintenance: 35000,
    total: 330000, currency: 'INR',
    breakdown: [
      { item: 'Acoustic Sensors (15 units)', cost: 120000 },
      { item: 'Pressure Monitors (8 units)', cost: 30000 },
      { item: 'Data Logger System', cost: 45000 },
      { item: 'Installation & Calibration', cost: 80000 },
      { item: 'Analytics Dashboard', cost: 65000 },
      { item: 'Annual Maintenance', cost: 35000 },
    ]
  }
};

// 7. AI Implementation Roadmap
export const IMPLEMENTATION_ROADMAPS = {
  'monsoon-road-accessibility': [
    { phase: 'Phase 1', title: 'Research & Assessment', duration: '3 weeks', status: 'completed', tasks: ['Site survey', 'Community consultation', 'Technology evaluation'], startDate: '2026-07-01', endDate: '2026-07-21' },
    { phase: 'Phase 2', title: 'Planning & Design', duration: '2 weeks', status: 'completed', tasks: ['System architecture', 'Sensor placement plan', 'Budget finalization'], startDate: '2026-07-22', endDate: '2026-08-04' },
    { phase: 'Phase 3', title: 'Pilot Deployment', duration: '4 weeks', status: 'in_progress', tasks: ['Deploy 5 sensors', 'Test connectivity', 'Calibrate alerts'], startDate: '2026-08-05', endDate: '2026-09-01' },
    { phase: 'Phase 4', title: 'Full Deployment', duration: '6 weeks', status: 'upcoming', tasks: ['Scale to 20 sensors', 'Train community volunteers', 'Launch dashboard'], startDate: '2026-09-02', endDate: '2026-10-13' },
    { phase: 'Phase 5', title: 'Monitoring & Optimization', duration: 'Ongoing', status: 'upcoming', tasks: ['Performance monitoring', 'Predictive analytics tuning', 'Community feedback'], startDate: '2026-10-14', endDate: null },
  ],
  'water-pipeline-leakage': [
    { phase: 'Phase 1', title: 'Site Assessment', duration: '2 weeks', status: 'completed', tasks: ['Pipeline mapping', 'Leak history review', 'Community survey'], startDate: '2026-07-15', endDate: '2026-07-28' },
    { phase: 'Phase 2', title: 'Technology Setup', duration: '3 weeks', status: 'in_progress', tasks: ['Acoustic sensor procurement', 'Network configuration', 'Dashboard development'], startDate: '2026-07-29', endDate: '2026-08-18' },
    { phase: 'Phase 3', title: 'Pilot Installation', duration: '4 weeks', status: 'upcoming', tasks: ['Install 5 sensors', 'Baseline calibration', 'Alert threshold setting'], startDate: '2026-08-19', endDate: '2026-09-15' },
    { phase: 'Phase 4', title: 'Scale & Monitor', duration: '6 weeks', status: 'upcoming', tasks: ['Full sensor grid', 'Real-time monitoring', 'Repair scheduling'], startDate: '2026-09-16', endDate: '2026-10-27' },
    { phase: 'Phase 5', title: 'Impact Assessment', duration: '4 weeks', status: 'upcoming', tasks: ['Water loss measurement', 'Cost savings analysis', 'Community satisfaction survey'], startDate: '2026-10-28', endDate: '2026-11-24' },
  ]
};

// 8. AI Risk Predictions
export const RISK_PREDICTIONS = {
  'monsoon-road-accessibility': [
    { risk: 'Budget Overrun', probability: 35, impact: 'Medium', mitigation: 'Phase procurement to spread costs. Seek CSR funding.', category: 'financial' },
    { risk: 'Sensor Connectivity Issues', probability: 45, impact: 'High', mitigation: 'Deploy redundant LoRaWAN gateways. Use mesh networking.', category: 'technical' },
    { risk: 'Low Community Participation', probability: 20, impact: 'Medium', mitigation: 'Engage local panchayat. Offer volunteer incentives.', category: 'social' },
    { risk: 'Monsoon Damage to Equipment', probability: 30, impact: 'High', mitigation: 'IP67-rated enclosures. Elevated sensor mounting.', category: 'technical' },
    { risk: 'Timeline Delay', probability: 40, impact: 'Medium', mitigation: 'Build buffer weeks into schedule. Parallel task execution.', category: 'operational' },
  ],
  'water-pipeline-leakage': [
    { risk: 'Sensor Accuracy', probability: 25, impact: 'High', mitigation: 'Multiple detection methods. Regular calibration schedule.', category: 'technical' },
    { risk: 'Underground Interference', probability: 35, impact: 'Medium', mitigation: 'Professional survey before installation. Adaptive algorithms.', category: 'technical' },
    { risk: 'Maintenance Backlog', probability: 30, impact: 'Medium', mitigation: 'Train municipal staff. Establish SLA with vendor.', category: 'operational' },
  ]
};

// 9. AI Policy Simulator Scenarios
export const POLICY_SIMULATIONS = [
  { id: 'ps-1', name: 'Increase Public Bus Fleet by 20%', category: 'Transport', effects: { trafficReduction: 15, costIncrease: 8, emissionReduction: 12, accessibilityImprovement: 25 }, description: 'Adding 50 more buses to the fleet with optimized routes covering underserved areas.' },
  { id: 'ps-2', name: 'Implement Rainwater Harvesting Mandate', category: 'Water', effects: { waterStressReduction: 20, complianceCost: 12, groundwaterRecharge: 30, floodingReduction: 15 }, description: 'Mandatory rainwater harvesting for all buildings above 200 sq meters.' },
  { id: 'ps-3', name: 'Deploy Smart Traffic Signals', category: 'Transport', effects: { trafficReduction: 25, costIncrease: 15, emissionReduction: 18, commuteTimeReduction: 20 }, description: 'AI-powered adaptive traffic signals at 200 major intersections.' },
  { id: 'ps-4', name: 'Expand Waste Segregation Program', category: 'Environment', effects: { recyclingIncrease: 35, landfillReduction: 22, complianceCost: 8, publicHealthImprovement: 15 }, description: 'Mandatory 3-bin waste segregation with door-to-door collection.' },
];

// 10. AI Knowledge Search Index
export const CIVIC_KNOWLEDGE = [
  { id: 'kn-1', title: 'Best Practices for Rural Road Construction', category: 'Infrastructure', tags: ['road', 'construction', 'rural', 'monsoon'], relevance: 95 },
  { id: 'kn-2', title: 'IoT Sensor Deployment Guide for Water Systems', category: 'Water Management', tags: ['iot', 'sensors', 'water', 'leak detection'], relevance: 92 },
  { id: 'kn-3', title: 'Community Participation Models for Civic Projects', category: 'Community', tags: ['community', 'participation', 'governance'], relevance: 88 },
  { id: 'kn-4', title: 'Drainage Design Standards for Jharkhand', category: 'Infrastructure', tags: ['drainage', 'design', 'standards', 'monsoon'], relevance: 85 },
  { id: 'kn-5', title: 'LoRaWAN Connectivity in Rural India', category: 'Technology', tags: ['lora', 'iot', 'connectivity', 'rural'], relevance: 90 },
  { id: 'kn-6', title: 'Waste Management Best Practices for Municipalities', category: 'Environment', tags: ['waste', 'municipal', 'management', 'segregation'], relevance: 87 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// B. COMMUNITY FEATURES DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 11. Civic Polls
export const CIVIC_POLLS = [
  { id: 'poll-1', question: 'Which transport issue is most urgent in your area?', category: 'Transport', createdBy: 'PWD Admin', totalVotes: 284, deadline: '2026-09-15', active: true, options: [
    { id: 'po-1', text: 'Pothole repair', votes: 112, percentage: 39 },
    { id: 'po-2', text: 'Bus frequency', votes: 89, percentage: 31 },
    { id: 'po-3', text: 'Traffic signal timing', votes: 52, percentage: 18 },
    { id: 'po-4', text: 'Pedestrian safety', votes: 31, percentage: 11 },
  ]},
  { id: 'poll-2', question: 'Which solution approach do you prefer for water pipeline issues?', category: 'Water', createdBy: 'Smart City Cell', totalVotes: 156, deadline: '2026-09-20', active: true, options: [
    { id: 'po-5', text: 'IoT leak detection sensors', votes: 72, percentage: 46 },
    { id: 'po-6', text: 'Complete pipe replacement', votes: 48, percentage: 31 },
    { id: 'po-7', text: 'Pressure management system', votes: 24, percentage: 15 },
    { id: 'po-8', text: 'Community monitoring app', votes: 12, percentage: 8 },
  ]},
  { id: 'poll-3', question: 'What should be the priority for school infrastructure improvement?', category: 'Education', createdBy: 'EDU Dept', totalVotes: 198, deadline: '2026-09-10', active: false, options: [
    { id: 'po-9', text: 'Building repair & safety', votes: 95, percentage: 48 },
    { id: 'po-10', text: 'Digital infrastructure', votes: 55, percentage: 28 },
    { id: 'po-11', text: 'Water & sanitation', votes: 30, percentage: 15 },
    { id: 'po-12', text: 'Playground & sports', votes: 18, percentage: 9 },
  ]},
];

// 12. Community Voting on Solutions
export const SOLUTION_VOTES = {
  'monsoon-road-accessibility': [
    { solutionId: 'sol-gen-1', totalVotes: 187, supportPercentage: 82, participation: 67 },
    { solutionId: 'sol-gen-2', totalVotes: 143, supportPercentage: 75, participation: 51 },
    { solutionId: 'sol-gen-3', totalVotes: 98, supportPercentage: 68, participation: 35 },
  ]
};

// 13. Problem Following
export const PROBLEM_FOLLOWERS = {
  'monsoon-road-accessibility': { count: 234, recentFollowers: ['Aman K.', 'Priya S.', 'Rajesh M.'] },
  'water-pipeline-leakage': { count: 156, recentFollowers: ['Sunita D.', 'Vikram O.'] },
  'rural-drone-delivery': { count: 89, recentFollowers: ['Dr. Pathak', 'Anil K.'] },
};

// 14. Community Collections
export const COMMUNITY_COLLECTIONS = [
  { id: 'col-1', name: 'Problems Around My College', createdBy: 'Aarav Mehta', problemCount: 8, followers: 23, icon: '🎓' },
  { id: 'col-2', name: 'Ranchi Urban Issues', createdBy: 'Priya Singh', problemCount: 15, followers: 45, icon: '🏙️' },
  { id: 'col-3', name: 'Environmental Concerns', createdBy: 'Dr. Jha', problemCount: 12, followers: 38, icon: '🌿' },
  { id: 'col-4', name: 'Water Crisis Hotspots', createdBy: 'WaterAid Team', problemCount: 6, followers: 67, icon: '💧' },
];

// 15. Discussion Rooms
export const DISCUSSION_ROOMS = [
  { id: 'dr-1', challengeId: 'monsoon-road-accessibility', title: 'Road Monitoring Tech Discussion', participants: 24, messages: 156, lastActive: '2026-08-23T14:30:00Z', pinned: ['IoT sensor placement strategy documented', 'Budget allocation approved by PWD'] },
  { id: 'dr-2', challengeId: 'water-pipeline-leakage', title: 'Leak Detection Methodology', participants: 18, messages: 98, lastActive: '2026-08-22T16:00:00Z', pinned: ['Acoustic vs pressure sensor comparison complete'] },
];

// 16. Moderation Center Data
export const MODERATION_REPORTS = [
  { id: 'mod-1', type: 'spam', content: 'Buy cheap IoT sensors at...', reportedBy: 'System (AI)', timestamp: '2026-08-23T10:00:00Z', status: 'pending', severity: 'low' },
  { id: 'mod-2', type: 'abuse', content: 'Personal attack in discussion', reportedBy: 'Priya Singh', timestamp: '2026-08-22T15:30:00Z', status: 'reviewed', severity: 'medium' },
  { id: 'mod-3', type: 'misinformation', content: 'False cost claim about pipeline project', reportedBy: 'Dr. Pathak', timestamp: '2026-08-21T09:15:00Z', status: 'resolved', severity: 'high' },
];

// 17. Verified Badges
export const VERIFIED_BADGES = {
  government: { label: 'Verified Government Official', icon: '🏛️', color: '#3b82f6' },
  university: { label: 'Verified University', icon: '🎓', color: '#f59e0b' },
  expert: { label: 'Verified Expert', icon: '🕵️', color: '#8b5cf6' },
  ngo: { label: 'Verified NGO', icon: '🤝', color: '#10b981' },
  industry: { label: 'Verified Organization', icon: '🏢', color: '#ec4899' },
};

// 18. Volunteer System
export const VOLUNTEER_DATA = {
  totalVolunteers: 156,
  activeProjects: 12,
  totalHours: 2340,
  recentVolunteers: [
    { id: 'vol-1', name: 'Aarav Mehta', hours: 48, projects: 3, skills: ['IoT', 'Python', 'Community Outreach'] },
    { id: 'vol-2', name: 'Priya Sharma', hours: 36, projects: 2, skills: ['Data Analysis', 'Survey Design'] },
    { id: 'vol-3', name: 'Rohan Das', hours: 24, projects: 2, skills: ['Embedded Systems', 'Hardware'] },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// C. PROJECT MANAGEMENT DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 19-26. Project Workspaces, Kanban, Gantt, Dependencies, Health, Milestones
export const PROJECT_WORKSPACES = [
  {
    id: 'pw-1', challengeId: 'monsoon-road-accessibility', name: 'Rural Road IoT Monitoring System',
    status: 'active', healthScore: 78, healthStatus: 'At Risk',
    budget: { total: 530000, spent: 185000, remaining: 345000 },
    team: [
      { id: 'tm-1', name: 'Aarav Mehta', role: 'Project Lead', avatar: '👨‍💻', assignedTasks: 5 },
      { id: 'tm-2', name: 'Priya Sharma', role: 'Backend Dev', avatar: '👩‍💻', assignedTasks: 4 },
      { id: 'tm-3', name: 'Rohan Das', role: 'Hardware Lead', avatar: '👨‍🔬', assignedTasks: 3 },
      { id: 'tm-4', name: 'Dr. Pathak', role: 'Mentor', avatar: '🕵️', assignedTasks: 1 },
    ],
    tasks: [
      { id: 't-1', title: 'Site survey completed', status: 'completed', assignee: 'Aarav Mehta', dueDate: '2026-07-15', priority: 'high', dependencies: [] },
      { id: 't-2', title: 'Sensor procurement', status: 'completed', assignee: 'Rohan Das', dueDate: '2026-08-01', priority: 'high', dependencies: ['t-1'] },
      { id: 't-3', title: 'LoRaWAN gateway setup', status: 'completed', assignee: 'Priya Sharma', dueDate: '2026-08-10', priority: 'medium', dependencies: ['t-2'] },
      { id: 't-4', title: 'Deploy 5 pilot sensors', status: 'in_progress', assignee: 'Rohan Das', dueDate: '2026-08-25', priority: 'high', dependencies: ['t-2', 't-3'] },
      { id: 't-5', title: 'Dashboard development', status: 'in_progress', assignee: 'Priya Sharma', dueDate: '2026-09-01', priority: 'medium', dependencies: ['t-3'] },
      { id: 't-6', title: 'Community volunteer training', status: 'todo', assignee: 'Aarav Mehta', dueDate: '2026-09-10', priority: 'medium', dependencies: ['t-4'] },
      { id: 't-7', title: 'Scale to 20 sensors', status: 'todo', assignee: 'Rohan Das', dueDate: '2026-09-20', priority: 'high', dependencies: ['t-4', 't-5'] },
      { id: 't-8', title: 'Performance testing', status: 'todo', assignee: 'Priya Sharma', dueDate: '2026-10-01', priority: 'medium', dependencies: ['t-5', 't-7'] },
      { id: 't-9', title: 'Full deployment', status: 'todo', assignee: 'Aarav Mehta', dueDate: '2026-10-15', priority: 'high', dependencies: ['t-6', 't-7', 't-8'] },
    ],
    milestones: [
      { id: 'ms-1', title: 'Pilot Sensors Deployed', dueDate: '2026-08-25', status: 'in_progress', deliverables: ['5 sensors installed', 'Gateway online', 'Dashboard functional'] },
      { id: 'ms-2', title: 'Full Grid Operational', dueDate: '2026-10-15', status: 'upcoming', deliverables: ['20 sensors active', 'Community trained', 'SLA established'] },
    ],
    documents: [
      { id: 'doc-1', name: 'Project Charter', type: 'pdf', uploadedBy: 'Aarav Mehta', date: '2026-07-01' },
      { id: 'doc-2', name: 'Technical Architecture', type: 'pdf', uploadedBy: 'Priya Sharma', date: '2026-07-22' },
    ],
    gallery: [
      { id: 'g-1', type: 'before', caption: 'Road condition before intervention', date: '2026-07-05' },
      { id: 'g-2', type: 'progress', caption: 'Pilot sensor installation', date: '2026-08-15' },
    ]
  },
  {
    id: 'pw-2', challengeId: 'water-pipeline-leakage', name: 'Acoustic Leak Detection Grid',
    status: 'active', healthScore: 85, healthStatus: 'Healthy',
    budget: { total: 330000, spent: 95000, remaining: 235000 },
    team: [
      { id: 'tm-5', name: 'Dr. Pathak', role: 'Technical Lead', avatar: '🕵️', assignedTasks: 2 },
      { id: 'tm-6', name: 'Sunita Devi', role: 'Community Liaison', avatar: '👩', assignedTasks: 3 },
    ],
    tasks: [
      { id: 't-10', title: 'Pipeline mapping complete', status: 'completed', assignee: 'Dr. Pathak', dueDate: '2026-07-28', priority: 'high', dependencies: [] },
      { id: 't-11', title: 'Acoustic sensor procurement', status: 'completed', assignee: 'Dr. Pathak', dueDate: '2026-08-10', priority: 'high', dependencies: ['t-10'] },
      { id: 't-12', title: 'Community awareness campaign', status: 'in_progress', assignee: 'Sunita Devi', dueDate: '2026-08-20', priority: 'medium', dependencies: [] },
      { id: 't-13', title: 'Install 5 pilot sensors', status: 'todo', assignee: 'Dr. Pathak', dueDate: '2026-09-05', priority: 'high', dependencies: ['t-11'] },
      { id: 't-14', title: 'Analytics dashboard', status: 'todo', assignee: 'Dr. Pathak', dueDate: '2026-09-15', priority: 'medium', dependencies: ['t-11'] },
    ],
    milestones: [
      { id: 'ms-3', title: 'Pilot Sensors Operational', dueDate: '2026-09-15', status: 'upcoming', deliverables: ['5 sensors active', 'Baseline data collected', 'Alert system tested'] },
    ],
    documents: [],
    gallery: []
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// D. GOVERNMENT & ADMINISTRATION DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 27. Government Hierarchy
export const GOV_HIERARCHY = {
  country: 'India',
  state: 'Jharkhand',
  districts: [
    { name: 'Ranchi', municipalities: ['Ranchi Municipal Corporation', 'Khunti'], wards: 55 },
    { name: 'Dumka', municipalities: ['Dumka Municipality'], wards: 25 },
    { name: 'Dhanbad', municipalities: ['Dhanbad Municipal Corporation'], wards: 48 },
    { name: 'Hazaribagh', municipalities: ['Hazaribagh Municipality'], wards: 30 },
  ]
};

// 29. Department Performance Scorecards
export const DEPT_SCORECARDS = [
  { deptId: 'dept-1', name: 'Public Works Dept', shortName: 'PWD', responseTime: 4.2, resolutionTime: 22, pendingCases: 13, slaCompliance: 78, citizenSatisfaction: 3.8, completedProjects: 15, trend: 'improving', color: '#3b82f6' },
  { deptId: 'dept-2', name: 'Health & Family Welfare', shortName: 'H&FW', responseTime: 2.1, resolutionTime: 18, pendingCases: 6, slaCompliance: 85, citizenSatisfaction: 4.1, completedProjects: 9, trend: 'stable', color: '#ef4444' },
  { deptId: 'dept-3', name: 'Education Dept', shortName: 'EDU', responseTime: 5.5, resolutionTime: 25, pendingCases: 5, slaCompliance: 72, citizenSatisfaction: 3.5, completedProjects: 7, trend: 'declining', color: '#f59e0b' },
  { deptId: 'dept-4', name: 'Sanitation & Cleanliness', shortName: 'SWM', responseTime: 1.8, resolutionTime: 15, pendingCases: 15, slaCompliance: 90, citizenSatisfaction: 4.3, completedProjects: 20, trend: 'improving', color: '#10b981' },
  { deptId: 'dept-5', name: 'Transport Dept', shortName: 'TD', responseTime: 3.5, resolutionTime: 20, pendingCases: 8, slaCompliance: 80, citizenSatisfaction: 3.9, completedProjects: 10, trend: 'stable', color: '#8b5cf6' },
  { deptId: 'dept-6', name: 'Water Resources Dept', shortName: 'WRD', responseTime: 4.8, resolutionTime: 28, pendingCases: 11, slaCompliance: 68, citizenSatisfaction: 3.2, completedProjects: 11, trend: 'declining', color: '#06b6d4' },
];

// 30. Escalation Matrix
export const ESCALATION_MATRIX = [
  { hours: 24, level: 'Field Officer', action: 'Initial assessment & response' },
  { hours: 48, level: 'Department Head', action: 'Review & resource allocation' },
  { hours: 72, level: 'District Administrator', action: 'Escalation & emergency measures' },
  { hours: 120, level: 'State Authority', action: 'Critical intervention & policy review' },
];

// 31. Workflow Builder
export const WORKFLOW_STEPS = [
  { id: 'wf-1', label: 'Report', icon: '📋', color: '#3b82f6', description: 'Citizen submits problem report' },
  { id: 'wf-2', label: 'Verify', icon: '✅', color: '#10b981', description: 'AI + human verification' },
  { id: 'wf-3', label: 'Assign', icon: '👤', color: '#f59e0b', description: 'Route to appropriate department' },
  { id: 'wf-4', label: 'Investigate', icon: '🔍', color: '#8b5cf6', description: 'On-ground assessment' },
  { id: 'wf-5', label: 'Approve', icon: '📝', color: '#06b6d4', description: 'Solution approval & budget' },
  { id: 'wf-6', label: 'Implement', icon: '🔧', color: '#ec4899', description: 'Execute solution' },
  { id: 'wf-7', label: 'Resolve', icon: '🎉', color: '#10b981', description: 'Verification & closure' },
];

// 32. Approval Workflows
export const APPROVAL_WORKFLOWS = [
  { id: 'aw-1', type: 'Solution Approval', pending: 5, approved: 23, rejected: 3 },
  { id: 'aw-2', type: 'Project Funding', pending: 2, approved: 8, rejected: 1 },
  { id: 'aw-3', type: 'Partnership Request', pending: 3, approved: 12, rejected: 2 },
  { id: 'aw-4', type: 'Public Report', pending: 8, approved: 45, rejected: 5 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// E. DATA & ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 33. Civic Heatmap Data
export const HEATMAP_DATA = [
  { lat: 23.3768, lng: 85.3486, intensity: 0.9, category: 'water', district: 'Ranchi', count: 28 },
  { lat: 24.2548, lng: 87.4265, intensity: 0.95, category: 'infrastructure', district: 'Dumka', count: 45 },
  { lat: 23.7957, lng: 86.4304, intensity: 0.6, category: 'waste', district: 'Dhanbad', count: 18 },
  { lat: 23.9984, lng: 85.3604, intensity: 0.5, category: 'agriculture', district: 'Hazaribagh', count: 12 },
  { lat: 23.7448, lng: 84.4984, intensity: 0.7, category: 'health', district: 'Latehar', count: 22 },
  { lat: 23.6693, lng: 85.9812, intensity: 0.4, category: 'education', district: 'Bokaro', count: 8 },
  { lat: 24.1829, lng: 85.8560, intensity: 0.8, category: 'infrastructure', district: 'Giridih', count: 32 },
];

// 34. Civic Trend Forecasting
export const TREND_DATA = {
  monthly: [
    { month: 'Mar 2026', reports: 42, resolved: 28, efficiency: 67 },
    { month: 'Apr 2026', reports: 48, resolved: 32, efficiency: 67 },
    { month: 'May 2026', reports: 55, resolved: 38, efficiency: 69 },
    { month: 'Jun 2026', reports: 72, resolved: 42, efficiency: 58 },
    { month: 'Jul 2026', reports: 85, resolved: 48, efficiency: 56 },
    { month: 'Aug 2026', reports: 78, resolved: 55, efficiency: 71 },
  ],
  forecast: [
    { month: 'Sep 2026', predicted: 82, confidence: 75, note: 'Monsoon tail-end expected increase in road reports' },
    { month: 'Oct 2026', predicted: 58, confidence: 80, note: 'Post-monsoon recovery period' },
    { month: 'Nov 2026', predicted: 45, confidence: 85, note: 'Stable period, focus on resolution backlog' },
  ],
  insights: [
    'Waste-related problems increased 18% over the previous quarter',
    'Infrastructure reports peak during monsoon (Jun-Sep)',
    'Resolution efficiency improved 5% after IoT deployment pilot',
    'Water management issues show consistent growth (+12% monthly)',
  ]
};

// 35. Resolution Efficiency
export const RESOLUTION_EFFICIENCY = {
  avgResponseTime: 3.2,
  avgResolutionTime: 21.5,
  firstResponseRate: 87,
  reopenedCases: 8,
  escalationRate: 15,
  departmentComparison: [
    { name: 'SWM', responseTime: 1.8, resolutionTime: 15, firstResponse: 95 },
    { name: 'H&FW', responseTime: 2.1, resolutionTime: 18, firstResponse: 92 },
    { name: 'TD', responseTime: 3.5, resolutionTime: 20, firstResponse: 85 },
    { name: 'PWD', responseTime: 4.2, resolutionTime: 22, firstResponse: 78 },
    { name: 'EDU', responseTime: 5.5, resolutionTime: 25, firstResponse: 72 },
    { name: 'WRD', responseTime: 4.8, resolutionTime: 28, firstResponse: 68 },
  ]
};

// 36. Citizen Satisfaction
export const CITIZEN_SATISFACTION = {
  overall: 3.8,
  categories: [
    { label: 'Resolution Quality', score: 4.1, responses: 342 },
    { label: 'Response Speed', score: 3.5, responses: 342 },
    { label: 'Communication', score: 3.7, responses: 342 },
    { label: 'Overall Satisfaction', score: 3.8, responses: 342 },
  ],
  departmentScores: [
    { dept: 'SWM', score: 4.3, responses: 120 },
    { dept: 'H&FW', score: 4.1, responses: 85 },
    { dept: 'TD', score: 3.9, responses: 95 },
    { dept: 'PWD', score: 3.8, responses: 110 },
    { dept: 'EDU', score: 3.5, responses: 65 },
    { dept: 'WRD', score: 3.2, responses: 78 },
  ]
};

// 37. Geographic Comparison
export const GEO_COMPARISON = [
  { district: 'Ranchi', reported: 85, resolved: 52, avgDays: 19, satisfaction: 4.0, participation: 1250 },
  { district: 'Dumka', reported: 62, resolved: 28, avgDays: 25, satisfaction: 3.5, participation: 420 },
  { district: 'Dhanbad', reported: 48, resolved: 32, avgDays: 17, satisfaction: 4.2, participation: 680 },
  { district: 'Hazaribagh', reported: 35, resolved: 20, avgDays: 22, satisfaction: 3.7, participation: 320 },
  { district: 'Bokaro', reported: 28, resolved: 18, avgDays: 20, satisfaction: 3.9, participation: 280 },
];

// 38. Impact ROI
export const IMPACT_ROI = [
  { projectId: 'pw-1', title: 'Rural Road IoT Monitoring', investment: 530000, citizensBenefited: 1800, estimatedTimeSaved: 450, resourcesSaved: 120000, environmentalImpact: 'Reduced road failure by 35%', costPerCitizen: 294 },
  { projectId: 'pw-2', title: 'Acoustic Leak Detection', investment: 330000, citizensBenefited: 3200, estimatedTimeSaved: 280, resourcesSaved: 85000, environmentalImpact: 'Water waste reduced by 25%', costPerCitizen: 103 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// F. COMMUNICATION & ACCESSIBILITY DATA
// ═══════════════════════════════════════════════════════════════════════════════

// 39. Multilingual Translations
export const TRANSLATIONS = {
  en: {
    nav: { home: 'Home', explore: 'Explore', solutions: 'Solutions', report: 'Report Issue', dashboard: 'Dashboard', funding: 'Funding', research: 'Research' },
    common: { search: 'Search', filter: 'Filter', submit: 'Submit', cancel: 'Cancel', save: 'Save', loading: 'Loading...', noResults: 'No results found' },
    challenges: { title: 'Civic Challenges', status: 'Status', priority: 'Priority', support: 'Support', share: 'Share' },
    project: { tasks: 'Tasks', team: 'Team', budget: 'Budget', milestones: 'Milestones', health: 'Health Score' },
    ai: { analyzing: 'AI is analyzing...', feasibility: 'Feasibility Score', costEstimate: 'Cost Estimate', risks: 'Risk Assessment', roadmap: 'Implementation Roadmap' },
  },
  hi: {
    nav: { home: 'होम', explore: 'खोजें', solutions: 'समाधान', report: 'समस्या रिपोर्ट', dashboard: 'डैशबोर्ड', funding: 'फंडिंग', research: 'अनुसंधान' },
    common: { search: 'खोजें', filter: 'फ़िल्टर', submit: 'जमा करें', cancel: 'रद्द करें', save: 'सहेजें', loading: 'लोड हो रहा है...', noResults: 'कोई परिणाम नहीं मिला' },
    challenges: { title: 'नागरिक चुनौतियाँ', status: 'स्थिति', priority: 'प्राथमिकता', support: 'समर्थन', share: 'साझा करें' },
    project: { tasks: 'कार्य', team: 'टीम', budget: 'बजट', milestones: 'माइलस्टोन', health: 'स्वास्थ्य स्कोर' },
    ai: { analyzing: 'AI विश्लेषण कर रहा है...', feasibility: 'व्यवहार्यता स्कोर', costEstimate: 'लागत अनुमान', risks: 'जोखिम मूल्यांकन', roadmap: 'कार्यान्वयन रोडमैप' },
  },
  ta: {
    nav: { home: 'முகப்பு', explore: 'ஆராய்ச்சி', solutions: 'தீர்வுகள்', report: 'பிரச்சனை புகார்', dashboard: 'டாஷ்போர்டு', funding: 'நிதி', research: 'ஆராய்ச்சி' },
    common: { search: 'தேடு', filter: 'வடிகட்டு', submit: 'சமர்ப்பி', cancel: 'ரத்து', save: 'சேமி', loading: 'ஏற்றுகிறது...', noResults: 'முடிவுகள் இல்லை' },
    challenges: { title: 'சிவிக் சவால்கள்', status: 'நிலை', priority: 'முன்னுரிமை', support: 'ஆதரவு', share: 'பகிர்' },
    project: { tasks: 'பணிகள்', team: 'குழு', budget: 'வரவுசெலவு', milestones: 'மைல்கற்கள்', health: 'ஆரோக்கிய மதிப்பெண்' },
    ai: { analyzing: 'AI பகுப்பாய்வு செய்கிறது...', feasibility: 'செயல்திறன் மதிப்பெண்', costEstimate: 'செலவு மதிப்பீடு', risks: 'ஆபத்து மதிப்பீடு', roadmap: 'செயல்படுத்தல் வழிகாட்டி' },
  },
  bn: {
    nav: { home: 'হোম', explore: 'অনুসন্ধান', solutions: 'সমাধান', report: 'সমস্যা রিপোর্ট', dashboard: 'ড্যাশবোর্ড', funding: 'তহবিল', research: 'গবেষণা' },
    common: { search: 'অনুসন্ধান', filter: 'ফিল্টার', submit: 'জমা দিন', cancel: 'বাতিল', save: 'সংরক্ষণ', loading: 'লোড হচ্ছে...', noResults: 'কোনো ফলাফল পাওয়া যায়নি' },
    challenges: { title: 'সিভিক চ্যালেঞ্জ', status: 'অবস্থা', priority: 'অগ্রাধিকার', support: 'সমর্থন', share: 'শেয়ার' },
    project: { tasks: 'কাজ', team: 'দল', budget: 'বাজেট', milestones: 'মাইলস্টোন', health: 'স্বাস্থ্য স্কোর' },
    ai: { analyzing: 'AI বিশ্লেষণ করছে...', feasibility: 'সম্ভাব্যতা স্কোর', costEstimate: 'খরচ অনুমান', risks: 'ঝুঁকি মূল্যায়ন', roadmap: 'বাস্তবায়ন রোডম্যাপ' },
  },
  te: {
    nav: { home: 'హోమ్', explore: 'అన్వేషించండి', solutions: 'పరిష్కారాలు', report: 'సమస్య నివేదిక', dashboard: 'డాష్‌బోర్డ్', funding: 'నిధులు', research: 'పరిశోధన' },
    common: { search: 'శోధించండి', filter: 'ఫిల్టర్', submit: 'సమర్పించండి', cancel: 'రద్దు', save: 'సేవ్', loading: 'లోడ్ అవుతోంది...', noResults: 'ఫలితాలు కనుగొనబడలేదు' },
    challenges: { title: 'సివిక్ సవాళ్లు', status: 'స్థితి', priority: 'ప్రాధాన్యత', support: 'మద్దతు', share: 'భాగస్వామ్యం' },
    project: { tasks: 'పనులు', team: 'బృందం', budget: 'బడ్జెట్', milestones: 'మైలురాళ్లు', health: 'ఆరోగ్య స్కోర్' },
    ai: { analyzing: 'AI విశ్లేషిస్తోంది...', feasibility: 'సాధ్యత స్కోర్', costEstimate: 'ఖర్చు అంచనా', risks: 'ప్రమాద అంచనా', roadmap: 'అమలు రోడ్‌మ్యాప్' },
  },
  ml: {
    nav: { home: 'ഹോം', explore: 'എക്സ്പ്ലോർ', solutions: 'പരിഹാരങ്ങൾ', report: 'പ്രശ്ന റിപ്പോർട്ട്', dashboard: 'ഡാഷ്‌ബോർഡ്', funding: 'ഫണ്ടിംഗ്', research: 'ഗവേഷണം' },
    common: { search: 'തിരയുക', filter: 'ഫിൽട്ടർ', submit: 'സമർപ്പിക്കുക', cancel: 'റദ്ദാക്കുക', save: 'സേവ്', loading: 'ലോഡ് ചെയ്യുന്നു...', noResults: 'ഫലങ്ങൾ കണ്ടെത്തിയില്ല' },
    challenges: { title: 'സിവിക് ചലഞ്ചുകൾ', status: 'സ്ഥിതി', priority: 'മുൻ‌ഗണന', support: 'പിന്തുണ', share: 'പങ്കിടുക' },
    project: { tasks: 'ടാസ്കുകൾ', team: 'ടീം', budget: 'ബജറ്റ്', milestones: 'മൈൽസ്റ്റോണുകൾ', health: 'ആരോഗ്യ സ്കോർ' },
    ai: { analyzing: 'AI വിശകലനം ചെയ്യുന്നു...', feasibility: 'സാധ്യത സ്കോർ', costEstimate: 'ചെലവ് കണക്കാക്കൽ', risks: 'റിസ്ക് വിലയിരുത്തൽ', roadmap: 'നടപ്പാക്കൽ റോഡ്‌മാപ്പ്' },
  },
  kn: {
    nav: { home: 'ಹೋಮ್', explore: 'ಅನ್ವೇಷಿಸಿ', solutions: 'ಪರಿಹಾರಗಳು', report: 'ಸಮಸ್ಯೆ ವರದಿ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', funding: 'ಹಣಕಾಸು', research: 'ಸಂಶೋಧನೆ' },
    common: { search: 'ಹುಡುಕಿ', filter: 'ಫಿಲ್ಟರ್', submit: 'ಸಲ್ಲಿಸಿ', cancel: 'ರದ್ದುಮಾಡಿ', save: 'ಉಳಿಸಿ', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', noResults: 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ' },
    challenges: { title: 'ಸಿವಿಕ್ ಸವಾಲುಗಳು', status: 'ಸ್ಥಿತಿ', priority: 'ಆದ್ಯತೆ', support: 'ಬೆಂಬಲ', share: 'ಹಂಚಿಕೊಳ್ಳಿ' },
    project: { tasks: 'ಕಾರ್ಯಗಳು', team: 'ತಂಡ', budget: 'ಬಜೆಟ್', milestones: 'ಮೈಲುಗುರುಿಗಳು', health: 'ಆರೋಗ್ಯ ಸ್ಕೋರ್' },
    ai: { analyzing: 'AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...', feasibility: 'ಸಾಧ್ಯತೆ ಸ್ಕೋರ್', costEstimate: 'ವೆಚ್ಚ ಅಂದಾಜು', risks: 'ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ', roadmap: 'ಜಾರಿ ರೋಡ್‌ಮ್ಯಾಪ್' },
  },
  mr: {
    nav: { home: 'मुख्यपृष्ठ', explore: 'शोधा', solutions: 'उपाय', report: 'समस्या नोंदवा', dashboard: 'डॅशबोर्ड', funding: 'भांडवल', research: 'संशोधन' },
    common: { search: 'शोधा', filter: 'फिल्टर', submit: 'सबमिट करा', cancel: 'रद्द करा', save: 'जतन करा', loading: 'लोड होत आहे...', noResults: 'कोणतेही परिणाम आढळले नाहीत' },
    challenges: { title: 'नागरिक आव्हाने', status: 'स्थिती', priority: 'प्राधान्य', support: 'समर्थन', share: 'शेअर करा' },
    project: { tasks: 'कार्ये', team: 'संघ', budget: 'अर्थसंकल्प', milestones: 'मैलाचे दगड', health: 'आरोग्य स्कोअर' },
    ai: { analyzing: 'AI विश्लेषण करत आहे...', feasibility: 'शक्यता स्कोअर', costEstimate: 'खर्च अंदाज', risks: 'धोका मूल्यांकन', roadmap: 'अंमलबजावणी मार्गदर्शक' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL SEARCH, ACTIVITY CENTER, AUDIT LOG
// ═══════════════════════════════════════════════════════════════════════════════

export const GLOBAL_SEARCH_INDEX = [
  { id: 's-1', type: 'challenge', title: 'Monsoon Rural Road Accessibility', category: 'Infrastructure', district: 'Dumka', relevance: 95 },
  { id: 's-2', type: 'challenge', title: 'Water Pipeline Leakage Detection', category: 'Water Management', district: 'Ranchi', relevance: 92 },
  { id: 's-3', type: 'challenge', title: 'Medical Supply Drone Routing', category: 'Healthcare', district: 'Latehar', relevance: 88 },
  { id: 's-4', type: 'solution', title: 'IoT Sensor Network for Roads', category: 'Technology', relevance: 85 },
  { id: 's-5', type: 'project', title: 'Rural Road IoT Monitoring System', category: 'Infrastructure', relevance: 90 },
  { id: 's-6', type: 'expert', title: 'Dr. Ramesh Pathak', category: 'Expert', expertise: 'Hydrology', relevance: 82 },
  { id: 's-7', type: 'ngo', title: 'WaterAid India', category: 'NGO', cause: 'Water & Sanitation', relevance: 80 },
  { id: 's-8', type: 'university', title: 'BIT Mesra', category: 'University', relevance: 78 },
  { id: 's-9', type: 'challenge', title: 'Municipal Solid Waste Smart Bin Router', category: 'Environment', district: 'Dhanbad', relevance: 75 },
  { id: 's-10', type: 'department', title: 'Public Works Department', category: 'Government', relevance: 72 },
];

export const ACTIVITY_FEED = [
  { id: 'af-1', type: 'assignment', title: 'Problem Assigned', text: 'Your road accessibility report was assigned to PWD.', timestamp: '2026-08-23T10:30:00Z', icon: '📋' },
  { id: 'af-2', type: 'team', title: 'Team Joined', text: 'University XYZ joined your IoT monitoring project.', timestamp: '2026-08-22T16:00:00Z', icon: '👥' },
  { id: 'af-3', type: 'vote', title: 'Solution Voted', text: 'Your proposed drainage solution received 125 votes.', timestamp: '2026-08-21T14:00:00Z', icon: '🗳️' },
  { id: 'af-4', type: 'milestone', title: 'Milestone Completed', text: 'Pilot sensor deployment milestone achieved.', timestamp: '2026-08-20T11:30:00Z', icon: '🎯' },
  { id: 'af-5', type: 'comment', title: 'New Discussion', text: 'Dr. Pathak started a discussion on sensor calibration.', timestamp: '2026-08-19T09:00:00Z', icon: '💬' },
  { id: 'af-6', type: 'achievement', title: 'Achievement Unlocked', text: 'You earned the "Civic Champion" badge!', timestamp: '2026-08-18T10:00:00Z', icon: '🏆' },
  { id: 'af-7', type: 'approval', title: 'Solution Approved', text: 'PWD approved the drainage improvement proposal.', timestamp: '2026-08-17T15:00:00Z', icon: '✅' },
  { id: 'af-8', type: 'funding', title: 'Funding Received', text: '₹1,50,000 CSR funding approved for leak detection.', timestamp: '2026-08-16T12:00:00Z', icon: '💰' },
];

export const AUDIT_LOG = [
  { id: 'al-1', user: 'admin@civicsolve.gov', action: 'ROLE_CHANGE', resource: 'user-u-citizen', prevState: 'citizen', newState: 'government', timestamp: '2026-08-23T09:00:00Z' },
  { id: 'al-2', user: 'system@ai', action: 'STATUS_CHANGE', resource: 'challenge-monsoon-road', prevState: 'under_review', newState: 'validated', timestamp: '2026-08-22T14:30:00Z' },
  { id: 'al-3', user: 'dept-pwd@.gov', action: 'ASSIGNMENT', resource: 'challenge-monsoon-road', prevState: 'unassigned', newState: 'PWD', timestamp: '2026-08-21T10:00:00Z' },
  { id: 'al-4', user: 'admin@civicsolve.gov', action: 'APPROVAL', resource: 'project-iot-monitoring', prevState: 'pending', newState: 'approved', timestamp: '2026-08-20T16:00:00Z' },
  { id: 'al-5', user: 'dr-pathak@expert', action: 'COMMENT', resource: 'challenge-water-pipeline', prevState: null, newState: 'Technical review posted', timestamp: '2026-08-19T11:00:00Z' },
  { id: 'al-6', user: 'system@ai', action: 'DUPLICATE_DETECTED', resource: 'challenge-waste-dhanbad', prevState: 'duplicate', newState: 'merged', timestamp: '2026-08-18T08:00:00Z' },
  { id: 'al-7', user: 'admin@civicsolve.gov', action: 'USER_LOGIN', resource: 'user-admin', prevState: null, newState: 'authenticated', timestamp: '2026-08-17T07:30:00Z' },
  { id: 'al-8', user: 'system@ai', action: 'DELETION', resource: 'comment-spam-123', prevState: 'visible', newState: 'deleted (spam)', timestamp: '2026-08-16T09:00:00Z' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Local storage helpers
const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(`civicsolve_adv40_${key}`);
    if (v) return JSON.parse(v);
    localStorage.setItem(`civicsolve_adv40_${key}`, JSON.stringify(fallback));
    return fallback;
  } catch { return fallback; }
};

const setStored = (key, val) => {
  try { localStorage.setItem(`civicsolve_adv40_${key}`, JSON.stringify(val)); }
  catch { /* ignore */ }
};

// ─── AI Root Cause Service ────────────────────────────────────────────────────
export const rootCauseService = {
  getTree: (challengeId) => ROOT_CAUSE_TREES[challengeId] || null,
};

// ─── AI Summary Service ───────────────────────────────────────────────────────
export const summaryService = {
  get: (challengeId) => PROBLEM_SUMMARIES[challengeId] || null,
};

// ─── AI Debate Service ────────────────────────────────────────────────────────
export const debateService = {
  getAnalysis: (challengeId) => DEBATE_ANALYSIS[challengeId] || null,
};

// ─── AI Sentiment Service ─────────────────────────────────────────────────────
export const sentimentService = {
  getData: (challengeId) => SENTIMENT_DATA[challengeId] || null,
};

// ─── AI Feasibility Service ───────────────────────────────────────────────────
export const feasibilityService = {
  getScores: (challengeId) => FEASIBILITY_SCORES[challengeId] || null,
};

// ─── AI Cost Estimator Service ────────────────────────────────────────────────
export const costEstimatorService = {
  getEstimate: (challengeId) => COST_ESTIMATES[challengeId] || null,
};

// ─── AI Roadmap Service ──────────────────────────────────────────────────────
export const roadmapService = {
  getRoadmap: (challengeId) => IMPLEMENTATION_ROADMAPS[challengeId] || null,
};

// ─── AI Risk Prediction Service ──────────────────────────────────────────────
export const riskPredictionService = {
  getRisks: (challengeId) => RISK_PREDICTIONS[challengeId] || [],
};

// ─── AI Policy Simulator Service ─────────────────────────────────────────────
export const policySimulatorService = {
  getScenarios: () => POLICY_SIMULATIONS,
  simulate: (scenarioId, param) => {
    const scenario = POLICY_SIMULATIONS.find(s => s.id === scenarioId);
    if (!scenario) return null;
    return { ...scenario, simulatedAt: new Date().toISOString() };
  },
};

// ─── AI Knowledge Search Service ─────────────────────────────────────────────
export const knowledgeSearchService = {
  search: (query) => {
    const q = query.toLowerCase();
    return CIVIC_KNOWLEDGE.filter(k =>
      k.title.toLowerCase().includes(q) ||
      k.category.toLowerCase().includes(q) ||
      k.tags.some(t => t.includes(q))
    ).sort((a, b) => b.relevance - a.relevance);
  },
  getAll: () => CIVIC_KNOWLEDGE,
};

// ─── Civic Polls Service ─────────────────────────────────────────────────────
export const civicPollService = {
  getAll: () => getStored('polls', CIVIC_POLLS),
  getActive: () => getStored('polls', CIVIC_POLLS).filter(p => p.active),
  vote: (pollId, optionId) => {
    const polls = getStored('polls', CIVIC_POLLS);
    const updated = polls.map(p => {
      if (p.id === pollId) {
        const options = p.options.map(o =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
        return { ...p, options: options.map(o => ({ ...o, percentage: Math.round((o.votes / totalVotes) * 100) })), totalVotes };
      }
      return p;
    });
    setStored('polls', updated);
    return updated.find(p => p.id === pollId);
  },
};

// ─── Community Voting Service ────────────────────────────────────────────────
export const communityVoteService = {
  getVotes: (challengeId) => SOLUTION_VOTES[challengeId] || [],
};

// ─── Problem Following Service ────────────────────────────────────────────────
export const problemFollowService = {
  getFollowers: (challengeId) => PROBLEM_FOLLOWERS[challengeId] || { count: 0, recentFollowers: [] },
  toggleFollow: (challengeId) => {
    const following = getStored('following', {});
    following[challengeId] = !following[challengeId];
    setStored('following', following);
    return following[challengeId];
  },
  isFollowing: (challengeId) => getStored('following', {})[challengeId] || false,
  getAllFollowing: () => Object.entries(getStored('following', {})).filter(([, v]) => v).map(([k]) => k),
};

// ─── Community Collections Service ───────────────────────────────────────────
export const collectionService = {
  getAll: () => getStored('collections', COMMUNITY_COLLECTIONS),
  create: (collection) => {
    const all = getStored('collections', COMMUNITY_COLLECTIONS);
    const newCol = { ...collection, id: `col-${Date.now()}`, problemCount: 0, followers: 0 };
    setStored('collections', [...all, newCol]);
    return newCol;
  },
};

// ─── Discussion Rooms Service ────────────────────────────────────────────────
export const discussionRoomService = {
  getAll: () => DISCUSSION_ROOMS,
  getByChallenge: (challengeId) => DISCUSSION_ROOMS.filter(r => r.challengeId === challengeId),
};

// ─── Moderation Service ──────────────────────────────────────────────────────
export const moderationService = {
  getReports: () => getStored('modReports', MODERATION_REPORTS),
  resolveReport: (reportId) => {
    const reports = getStored('modReports', MODERATION_REPORTS);
    const updated = reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r);
    setStored('modReports', updated);
    return updated;
  },
};

// ─── Volunteer Service ───────────────────────────────────────────────────────
export const volunteerService = {
  getData: () => VOLUNTEER_DATA,
  joinProject: (projectId) => ({ success: true, message: 'You have been added as a volunteer.' }),
};

// ─── Project Management Service ──────────────────────────────────────────────
export const projectService = {
  getAll: () => getStored('projects', PROJECT_WORKSPACES),
  getById: (id) => getStored('projects', PROJECT_WORKSPACES).find(p => p.id === id),
  updateTaskStatus: (projectId, taskId, newStatus) => {
    const projects = getStored('projects', PROJECT_WORKSPACES);
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) };
      }
      return p;
    });
    setStored('projects', updated);
    return updated.find(p => p.id === projectId);
  },
  moveTask: (projectId, taskId, newStatus) => {
    return projectService.updateTaskStatus(projectId, taskId, newStatus);
  },
};

// ─── Department Scorecard Service ────────────────────────────────────────────
export const deptScorecardService = {
  getAll: () => DEPT_SCORECARDS,
};

// ─── Escalation Service ──────────────────────────────────────────────────────
export const escalationService = {
  getMatrix: () => ESCALATION_MATRIX,
};

// ─── Workflow Service ────────────────────────────────────────────────────────
export const workflowService = {
  getSteps: () => WORKFLOW_STEPS,
};

// ─── Approval Service ────────────────────────────────────────────────────────
export const approvalService = {
  getWorkflows: () => APPROVAL_WORKFLOWS,
};

// ─── Heatmap Service ────────────────────────────────────────────────────────
export const heatmapService = {
  getData: () => HEATMAP_DATA,
};

// ─── Trend Service ──────────────────────────────────────────────────────────
export const trendService = {
  getData: () => TREND_DATA,
};

// ─── Resolution Efficiency Service ──────────────────────────────────────────
export const resolutionEfficiencyService = {
  getData: () => RESOLUTION_EFFICIENCY,
};

// ─── Citizen Satisfaction Service ────────────────────────────────────────────
export const satisfactionService = {
  getData: () => CITIZEN_SATISFACTION,
};

// ─── Geographic Comparison Service ──────────────────────────────────────────
export const geoComparisonService = {
  getData: () => GEO_COMPARISON,
};

// ─── Impact ROI Service ─────────────────────────────────────────────────────
export const impactROIService = {
  getData: () => IMPACT_ROI,
};

// ─── Multilingual Service ───────────────────────────────────────────────────
export const multilingualService = {
  getTranslation: (lang) => TRANSLATIONS[lang] || TRANSLATIONS.en,
  getAvailableLanguages: () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  ],
};

// ─── Global Search Service ──────────────────────────────────────────────────
export const globalSearchService = {
  search: (query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return GLOBAL_SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.district && item.district.toLowerCase().includes(q))
    ).sort((a, b) => b.relevance - a.relevance);
  },
  getRecentSearches: () => getStored('recentSearches', []),
  addRecentSearch: (query) => {
    const recent = getStored('recentSearches', []);
    const updated = [query, ...recent.filter(r => r !== query)].slice(0, 10);
    setStored('recentSearches', updated);
    return updated;
  },
};

// ─── Activity Feed Service ──────────────────────────────────────────────────
export const activityFeedService = {
  getAll: () => getStored('activityFeed', ACTIVITY_FEED),
  getRecent: (count = 10) => getStored('activityFeed', ACTIVITY_FEED).slice(0, count),
};

// ─── Audit Log Service ──────────────────────────────────────────────────────
export const auditLogService = {
  getAll: () => getStored('auditLog', AUDIT_LOG),
  getRecent: (count = 20) => getStored('auditLog', AUDIT_LOG).slice(0, count),
};

// ─── Voice Reporting Service ────────────────────────────────────────────────
export const voiceReportService = {
  parseTranscript: (transcript) => {
    // Simple keyword-based parsing
    const categories = ['infrastructure', 'water', 'health', 'education', 'environment', 'transport', 'waste'];
    const severities = ['critical', 'high', 'medium', 'low'];
    const t = transcript.toLowerCase();

    let category = 'infrastructure';
    if (t.includes('water') || t.includes('pipeline')) category = 'water';
    else if (t.includes('health') || t.includes('hospital')) category = 'health';
    else if (t.includes('school') || t.includes('education')) category = 'education';
    else if (t.includes('tree') || t.includes('forest') || t.includes('pollution')) category = 'environment';
    else if (t.includes('bus') || t.includes('traffic') || t.includes('road')) category = 'transport';
    else if (t.includes('waste') || t.includes('garbage') || t.includes('trash')) category = 'waste';

    let severity = 'medium';
    if (t.includes('dangerous') || t.includes('emergency') || t.includes('collapse')) severity = 'critical';
    else if (t.includes('broken') || t.includes('damaged') || t.includes('flood')) severity = 'high';
    else if (t.includes('minor') || t.includes('small')) severity = 'low';

    return {
      title: transcript.length > 60 ? transcript.substring(0, 60) + '...' : transcript,
      description: transcript,
      category,
      severity,
      location: 'Location to be confirmed',
      confidence: 0.75,
    };
  },
};

export default {
  rootCauseService, summaryService, debateService, sentimentService,
  feasibilityService, costEstimatorService, roadmapService, riskPredictionService,
  policySimulatorService, knowledgeSearchService, civicPollService, communityVoteService,
  problemFollowService, collectionService, discussionRoomService, moderationService,
  volunteerService, projectService, deptScorecardService, escalationService,
  workflowService, approvalService, heatmapService, trendService,
  resolutionEfficiencyService, satisfactionService, geoComparisonService, impactROIService,
  multilingualService, globalSearchService, activityFeedService, auditLogService,
  voiceReportService,
};
