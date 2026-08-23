// CivicSolve AI - Multi-Sector Mock Data, User management, and Audit Logging Database Engine
// Supports 12 Sectors, 30+ Roles, RBAC permissions, and AI settings control

export const JHARKHAND_DISTRICTS = [
  "Ranchi", "Dhanbad", "East Singhbhum (Jamshedpur)", "Bokaro", "Hazaribagh",
  "Dumka", "Deoghar", "Giridih", "Palamu", "West Singhbhum", "Latehar",
  "Khunti", "Gumla", "Simdega", "Lohardaga", "Ramgarh", "Chatra", "Koderma",
  "Godda", "Sahibganj", "Pakur", "Jamtara", "Garhwa", "Saraikela Kharsawan"
];

export const CATEGORIES = [
  "Infrastructure",
  "Water Management",
  "Agriculture & Rural",
  "Healthcare & Sanitation",
  "Education & Literacy",
  "Energy & Power",
  "Environment & Pollution",
  "Public Safety & Disaster",
  "Digital Services & Governance",
  "Urban Transport & Traffic"
];

// Define 12 Sectors and their metadata
export const SECTORS = [
  { id: 'citizen', name: 'Citizens & Community', icon: '👤', desc: 'Report issues and support solutions in your locality.' },
  { id: 'government', name: 'Government Departments', icon: '🏛', desc: 'Validate problems, coordinate pilots, and deliver programs.' },
  { id: 'university', name: 'Universities & Colleges', icon: '🎓', desc: 'Oversee student engineering teams, capabilities, and faculty.' },
  { id: 'student', name: 'Students & Developers', icon: '💻', desc: 'Form project cohorts, compile codebases, and build prototypes.' },
  { id: 'industry', name: 'Industry & Corporate', icon: '🏢', desc: 'Sponsor solutions, supply telemetry data, and guide teams.' },
  { id: 'expert', name: 'Experts & Mentors', icon: '🕵️', desc: 'Validate engineering feasibility and score solutions.' },
  { id: 'ngo', name: 'NGOs & Field Partners', icon: '🤝', desc: 'Connect local societies and verify implementation impact.' },
  { id: 'startup', name: 'Startups & Innovators', icon: '🚀', desc: 'Pitch existing products, run pilot test projects, and scale.' },
  { id: 'incubator', name: 'Incubators & Hubs', icon: '🌱', desc: 'Mentor teams, manage cohorts, and recommend funding.' },
  { id: 'research', name: 'Research Organizations', icon: '🔬', desc: 'Propose scholarly research and collaborate on deep sciences.' },
  { id: 'funding', name: 'Funding & CSR Partners', icon: '💰', desc: 'Fund high-impact projects, sponsor pilots, and audit metrics.' },
  { id: 'super_admin', name: 'Super Admin Center', icon: '👑', desc: 'Manage users, permissions, AI controls, and audit system logs.' }
];

// Sector-specific roles list
export const SECTOR_ROLES = {
  citizen: ['Citizen', 'Community Leader', 'Volunteer'],
  government: ['Government Officer', 'Department Officer', 'District Coordinator', 'Government Administrator'],
  university: ['University Administrator', 'Faculty', 'Researcher', 'Student Coordinator'],
  student: ['Student', 'Team Leader', 'Student Researcher'],
  industry: ['Company Administrator', 'Industry Expert', 'Mentor', 'Hiring Partner'],
  expert: ['Domain Expert', 'Technical Expert', 'Reviewer', 'Consultant'],
  ngo: ['NGO Administrator', 'Field Coordinator', 'Social Worker', 'Community Representative'],
  startup: ['Startup Founder', 'Startup Administrator', 'Product Lead', 'Technical Lead'],
  incubator: ['Incubator Administrator', 'Program Manager', 'Mentor', 'Evaluator'],
  research: ['Research Administrator', 'Principal Investigator', 'Researcher', 'Research Assistant'],
  funding: ['CSR Administrator', 'Funding Manager', 'Program Officer', 'Evaluator'],
  super_admin: ['Super Admin']
};

// Initial Permissions listing
const INITIAL_PERMISSIONS = {
  report_challenge: 'Report challenges & upload field evidence',
  support_vote: 'Support/vote on challenges & post comments',
  validate_challenge: 'Verify & validate reported issues',
  assign_department: 'Assign department & priority level to issues',
  form_team: 'Form developer teams & assign project leaders',
  submit_solution: 'Submit technical solution proposals',
  sponsor_project: 'Sponsor solutions, offer tech/CSR funding',
  score_proposal: 'Grade technical feasibility and evaluations',
  manage_users: 'Supervise users, suspend accounts, edit roles',
  verify_organizations: 'Verify universities and company registrants',
  configure_ai: 'Configure AI thresholds and classification settings'
};

// Default mapping of role -> permissions list
const DEFAULT_ROLE_PERMISSIONS = {
  'Citizen': ['report_challenge', 'support_vote'],
  'Community Leader': ['report_challenge', 'support_vote'],
  'Volunteer': ['support_vote'],
  'Government Officer': ['validate_challenge', 'assign_department'],
  'Government Administrator': ['validate_challenge', 'assign_department', 'verify_organizations'],
  'University Administrator': ['form_team', 'verify_organizations'],
  'Student Coordinator': ['form_team'],
  'Student': ['form_team', 'submit_solution'],
  'Team Leader': ['form_team', 'submit_solution'],
  'Company Administrator': ['sponsor_project'],
  'Mentor': ['sponsor_project'],
  'Domain Expert': ['score_proposal'],
  'Technical Expert': ['score_proposal'],
  'NGO Administrator': ['report_challenge', 'support_vote'],
  'Startup Founder': ['submit_solution'],
  'Incubator Administrator': ['form_team', 'score_proposal'],
  'Research Administrator': ['submit_solution'],
  'CSR Administrator': ['sponsor_project'],
  'Super Admin': ['report_challenge', 'support_vote', 'validate_challenge', 'assign_department', 'form_team', 'submit_solution', 'sponsor_project', 'score_proposal', 'manage_users', 'verify_organizations', 'configure_ai']
};

// Initial 12 Demo Accounts with different sectors, roles and verification status
const INITIAL_USERS = [
  { id: 'u-citizen', email: 'demo.citizen@civicsolve.ai', name: 'Aman Kumar', sector: 'citizen', role: 'Citizen', organization: 'Ranchi Community', verification: 'verified', avatar: '👤' },
  { id: 'u-gov', email: 'demo.government@civicsolve.ai', name: 'Shri R. K. Verma', sector: 'government', role: 'Government Administrator', organization: 'Dept of Rural Development, JH', verification: 'verified', avatar: '🏛' },
  { id: 'u-uni', email: 'demo.university@civicsolve.ai', name: 'Dr. S. K. Bose', sector: 'university', role: 'University Administrator', organization: 'BIT Mesra, Ranchi', verification: 'verified', avatar: '🎓' },
  { id: 'u-student', email: 'demo.student@civicsolve.ai', name: 'Aarav Mehta', sector: 'student', role: 'Student', organization: 'BIT Mesra', verification: 'verified', avatar: '💻' },
  { id: 'u-industry', email: 'demo.industry@civicsolve.ai', name: 'Vivek Anand', sector: 'industry', role: 'Company Administrator', organization: 'GeoTech Solutions', verification: 'verified', avatar: '🏢' },
  { id: 'u-expert', email: 'demo.expert@civicsolve.ai', name: 'Dr. Ramesh Pathak', sector: 'expert', role: 'Domain Expert', organization: 'NIT Jamshedpur', verification: 'verified', avatar: '🕵️' },
  { id: 'u-ngo', email: 'demo.ngo@civicsolve.ai', name: 'Pooja Sen', sector: 'ngo', role: 'NGO Administrator', organization: 'Jharkhand Vikas NGO', verification: 'verified', avatar: '🤝' },
  { id: 'u-startup', email: 'demo.startup@civicsolve.ai', name: 'Rahul Prasad', sector: 'startup', role: 'Startup Founder', organization: 'EcoFilter Labs', verification: 'pending_verification', avatar: '🚀' },
  { id: 'u-incubator', email: 'demo.incubator@civicsolve.ai', name: 'Vikram Sahay', sector: 'incubator', role: 'Incubator Administrator', organization: 'Atal Incubation Center, Ranchi', verification: 'verified', avatar: '🌱' },
  { id: 'u-research', email: 'demo.research@civicsolve.ai', name: 'Dr. Ananya Roy', sector: 'research', role: 'Research Administrator', organization: 'CSIR-CIMFR Dhanbad', verification: 'verified', avatar: '🔬' },
  { id: 'u-funding', email: 'demo.funding@civicsolve.ai', name: 'Megha Sharma', sector: 'funding', role: 'CSR Administrator', organization: 'Tata Steel Foundation', verification: 'verified', avatar: '💰' },
  { id: 'u-admin', email: 'admin@civicsolve.gov', name: 'Super Administrator', sector: 'super_admin', role: 'Super Admin', organization: 'Central Command Center', verification: 'verified', avatar: '👑' }
];

const INITIAL_ORGANIZATIONS = [
  { id: 'org-bit', name: 'Birla Institute of Technology (BIT) Mesra', type: 'university', domain: 'bitmesra.ac.in', website: 'https://bitmesra.ac.in', verified: true },
  { id: 'org-geotech', name: 'GeoTech Solutions', type: 'industry', domain: 'geotech.co.in', website: 'https://geotech.co.in', verified: true },
  { id: 'org-tata', name: 'Tata Steel Foundation', type: 'funding', domain: 'tatasteel.com', website: 'https://tatasteelfoundation.org', verified: true },
  { id: 'org-ecofilter', name: 'EcoFilter Labs', type: 'startup', domain: 'ecofilter.in', website: 'https://ecofilter.in', verified: false }
];

const INITIAL_AI_SETTINGS = {
  duplicate_detection: true,
  priority_scoring: true,
  team_matching: true,
  model: 'google/gemini-2.5-flash',
  threshold: 0.75,
  usage_tokens: 342980,
  usage_errors: 2
};

const INITIAL_AUDIT_LOGS = [
  { id: 'lg-1', user: 'Super Admin', action: 'ROLE_PERMISSION_CHANGE', target: 'Government Officer', details: 'Added validate_challenge permission', ip: '103.45.210.12', status: 'success', time: '22 Aug 2026 20:30' },
  { id: 'lg-2', user: 'Super Admin', action: 'USER_VERIFICATION_CHANGE', target: 'demo.startup@civicsolve.ai', details: 'Status set to pending_verification', ip: '103.45.210.12', status: 'success', time: '22 Aug 2026 20:42' },
  { id: 'lg-3', user: 'demo.student@civicsolve.ai', action: 'USER_LOGIN', target: 'demo.student@civicsolve.ai', details: 'Role matches: student', ip: '115.110.42.98', status: 'success', time: '22 Aug 2026 20:45' }
];

// Initial Challenges dataset matching the first script details
const INITIAL_CHALLENGES = [
  {
    id: "monsoon-road-accessibility",
    title: "Monsoon Rural Road Accessibility",
    description: "Our village connectivity roads in Dumka district become completely muddy and unusable during heavy rainfall, preventing access to school, medical facilities, and trade markets for over 10 surrounding villages.",
    category: "Infrastructure",
    subcategory: "Transport & Logistics",
    severity: "high",
    status: "prototype",
    location: "Sikaripara Block, Dumka",
    district: "Dumka",
    latitude: 24.2548,
    longitude: 87.4265,
    affected_population: 1800,
    priority_score: 91,
    reports_count: 127,
    support_count: 314,
    skills_required: ["GIS", "Rainfall Prediction", "Road Monitoring", "Civil Engineering", "IoT"],
    reporter_id: "u-citizen",
    created_at: "2026-06-12T08:30:00Z",
    ai_analysis: {
      category: "Infrastructure",
      subcategory: "Transport & Logistics",
      severity: "High",
      priority_score: 91,
      affected_population_estimate: 1800,
      possible_causes: ["Inadequate drainage channels along rural pathways", "Erosion of soil due to high clay content under heavy rain"],
      suggested_technologies: ["Geographic Information Systems (GIS)", "Automated rainfall level analytics", "IoT road moisture sensors"]
    },
    evidence: [
      { id: "ev-1", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800", type: "image", name: "Flooded_Road_Sikaripara.jpg" }
    ],
    timeline: [
      { status: "reported", label: "Reported", date: "June 12, 2026", active: true },
      { status: "under_review", label: "AI Analyzed", date: "June 12, 2026", active: true },
      { status: "validated", label: "Validated", date: "June 14, 2026", active: true },
      { status: "published", label: "Published", date: "June 15, 2026", active: true },
      { status: "team_formation", label: "Team Formed", date: "June 20, 2026", active: true },
      { status: "active_development", label: "Solution Proposed", date: "June 28, 2026", active: true },
      { status: "prototype", label: "Prototype (68% Complete)", date: "July 20, 2026", active: true }
    ],
    comments: [
      { id: "c-1", user: "Ramesh Mahto (Gram Panchayat)", text: "This has been happening every year. We are cut off for at least 45 days every monsoon. High time we use smart monitoring.", date: "2 days ago" }
    ]
  },
  {
    id: "water-pipeline-leakage",
    title: "Water Pipeline Leakage Detection",
    description: "Major water distribution mainlines in Urban Ranchi (Ward 14) suffer from cracks, leading to over 30% water loss and contamination. Citizens experience low water pressure and supply interruptions.",
    category: "Water Management",
    subcategory: "Water Distribution Systems",
    severity: "high",
    status: "team_formation",
    location: "Ward 14, Kokar, Ranchi",
    district: "Ranchi",
    latitude: 23.3768,
    longitude: 85.3486,
    affected_population: 3200,
    priority_score: 85,
    reports_count: 127,
    support_count: 430,
    skills_required: ["Python", "GIS", "IoT", "Machine Learning", "Civil Engineering"],
    reporter_id: "u-citizen",
    created_at: "2026-07-02T10:15:00Z",
    ai_analysis: {
      category: "Water Management",
      subcategory: "Water Distribution Systems",
      severity: "High",
      priority_score: 85,
      affected_population_estimate: 3200,
      possible_causes: ["Aging pipe infrastructure", "Soil shifting stress"],
      suggested_technologies: ["Acoustic sensors", "Pressure differential telemetry"]
    },
    evidence: [],
    timeline: [
      { status: "reported", label: "Reported", date: "July 2, 2026", active: true },
      { status: "under_review", label: "AI Analyzed", date: "July 2, 2026", active: true },
      { status: "validated", label: "Validated", date: "July 5, 2026", active: true },
      { status: "published", label: "Published", date: "July 6, 2026", active: true },
      { status: "team_formation", label: "Team Formation", date: "Active", active: true }
    ],
    comments: []
  }
];

const INITIAL_TEAMS = [
  {
    id: "t-aquatech",
    challenge_id: "monsoon-road-accessibility",
    name: "Team AquaTech",
    progress_percentage: 68,
    repository_url: "https://github.com/sih2026/aquatech-road-drainage",
    presentation_url: "https://docs.google.com/presentation/d/sih-aquatech-roads",
    lead_id: "u-student",
    university: "Birla Institute of Technology (BIT) Mesra",
    skills: ["GIS", "IoT", "Rainfall analytics"],
    mentor_id: "u-expert",
    milestones: [
      { id: "m1", title: "Site Topographical Survey", status: "completed", date: "July 05, 2026" },
      { id: "m2", title: "Drainage CAD Design & GIS Overlay", status: "completed", date: "July 20, 2026" },
      { id: "m3", title: "Physical Sensor Board Calibration", status: "in_progress", date: "August 28, 2026" }
    ],
    tasks: [
      { id: "tsk-1", title: "Collect elevation profiles via Google Earth GIS", status: "completed", assigned_to: "Aarav Mehta" },
      { id: "tsk-2", title: "Set up micro-drainage slope calculator model", status: "completed", assigned_to: "Priya Sharma" },
      { id: "tsk-3", title: "Program LoRa microcontrollers for water level alerts", status: "in_progress", assigned_to: "Rohan Das" }
    ],
    members: [
      { id: "u-student", name: "Aarav Mehta", role: "AI / ML Engineer", compatibility: 97, branch: "Computer Science", year: "4th Year", avatar: "💻" },
      { id: "st-priya", name: "Priya Sharma", role: "Backend Developer", compatibility: 94, branch: "Information Technology", year: "3rd Year", avatar: "👩‍💻" },
      { id: "st-rohan", name: "Rohan Das", role: "IoT Engineer", compatibility: 90, branch: "Electronics", year: "4th Year", avatar: "👨‍💻" }
    ]
  }
];

const INITIAL_COLLABORATIONS = [
  {
    id: "col-1",
    challenge_id: "monsoon-road-accessibility",
    team_id: "t-aquatech",
    company_name: "GeoTech Solutions",
    logo: "🌍",
    expertise: ["GIS Systems", "Spatial Analytics"],
    contribution: "GIS Platform Access & Sensor Telemetry Gateway API",
    mentors: ["Mr. Vivek Anand (Lead Geologist)"],
    funding: 250000,
    status: "Active Collaboration"
  }
];

// Helper methods for storage management
const getStored = (key, fallback) => {
  const v = localStorage.getItem(`civicsolve_rbac_${key}`);
  if (v) return JSON.parse(v);
  localStorage.setItem(`civicsolve_rbac_${key}`, JSON.stringify(fallback));
  return fallback;
};

const setStored = (key, val) => {
  localStorage.setItem(`civicsolve_rbac_${key}`, JSON.stringify(val));
};

export const db = {
  getUsers: () => getStored('users', INITIAL_USERS),
  saveUsers: (data) => setStored('users', data),
  
  getOrganizations: () => getStored('organizations', INITIAL_ORGANIZATIONS),
  saveOrganizations: (data) => setStored('organizations', data),
  
  getPermissions: () => getStored('permissions', INITIAL_PERMISSIONS),
  
  getRolePermissions: () => getStored('role_permissions', DEFAULT_ROLE_PERMISSIONS),
  saveRolePermissions: (data) => setStored('role_permissions', data),

  getAiSettings: () => getStored('ai_settings', INITIAL_AI_SETTINGS),
  saveAiSettings: (data) => setStored('ai_settings', data),

  getAuditLogs: () => getStored('audit_logs', INITIAL_AUDIT_LOGS),
  saveAuditLogs: (data) => setStored('audit_logs', data),

  getChallenges: () => getStored('challenges', INITIAL_CHALLENGES),
  saveChallenges: (data) => setStored('challenges', data),

  getTeams: () => getStored('teams', INITIAL_TEAMS),
  saveTeams: (data) => setStored('teams', data),

  getCollaborations: () => getStored('collaborations', INITIAL_COLLABORATIONS),
  saveCollaborations: (data) => setStored('collaborations', data),

  // Operational APIs
  addAuditLog: (user, action, target, details) => {
    const logs = db.getAuditLogs();
    const newLog = {
      id: `lg-${Date.now()}`,
      user: user || 'Anonymous',
      action,
      target,
      details,
      ip: '103.45.210.12',
      status: 'success',
      time: new Date().toLocaleString(),
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    db.saveAuditLogs(updated);
  },

  checkPermission: (roleName, permissionKey) => {
    const rMap = db.getRolePermissions();
    const list = rMap[roleName] || [];
    return list.includes(permissionKey);
  },

  getStats: () => {
    const challenges = db.getChallenges();
    const users = db.getUsers();
    const orgs = db.getOrganizations();
    const collabs = db.getCollaborations();
    
    return {
      totalChallenges: challenges.length,
      pendingValidation: challenges.filter(c => c.status === 'reported' || c.status === 'under_review').length,
      solutionsInDev: db.getTeams().length,
      pilots: challenges.filter(c => c.status === 'pilot').length,
      implemented: challenges.filter(c => c.status === 'implemented' || c.status === 'resolved').length,
      peopleImpacted: 1248420,
      totalUsers: users.length,
      activeOrgs: orgs.filter(o => o.verified).length,
      collaborations: collabs.length
    };
  }
};
