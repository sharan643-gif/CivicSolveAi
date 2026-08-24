// CivicSolve AI — Feature Data Module
// Comprehensive mock data for all 30 advanced features

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  { id: 'n-1', type: 'verification', title: 'Problem Verified', text: 'Your report "Monsoon Road Accessibility" has been verified by the government department.', read: false, timestamp: '2026-08-23T10:30:00Z', userId: 'u-citizen' },
  { id: 'n-2', type: 'comment', title: 'New Comment', text: 'Dr. Pathak commented on your water pipeline issue: "I recommend acoustic sensor deployment."', read: false, timestamp: '2026-08-23T09:15:00Z', userId: 'u-citizen' },
  { id: 'n-3', type: 'support', title: 'Problem Supported', text: '15 new citizens supported your waste management report.', read: true, timestamp: '2026-08-22T14:00:00Z', userId: 'u-citizen' },
  { id: 'n-4', type: 'solution', title: 'Solution Proposed', text: 'Team AquaTech proposed a drainage solution for rural road accessibility.', read: false, timestamp: '2026-08-22T11:30:00Z', userId: 'u-gov' },
  { id: 'n-5', type: 'assignment', title: 'Problem Assigned', text: 'Your department has been assigned 3 new civic issues for review.', read: true, timestamp: '2026-08-21T16:45:00Z', userId: 'u-gov' },
  { id: 'n-6', type: 'status', title: 'Status Update', text: 'Soil Nutrient Mapping has moved to "Pilot" status.', read: true, timestamp: '2026-08-20T08:00:00Z', userId: 'u-student' },
  { id: 'n-7', type: 'expert', title: 'Expert Response', text: 'Dr. Bose reviewed your technical proposal and gave it 4.5/5 stars.', read: false, timestamp: '2026-08-20T13:20:00Z', userId: 'u-student' },
  { id: 'n-8', type: 'achievement', title: 'Achievement Unlocked!', text: 'You earned the "Civic Champion" badge for helping 50 citizens.', read: false, timestamp: '2026-08-19T10:00:00Z', userId: 'u-citizen' },
];

// ─── ACHIEVEMENTS / GAMIFICATION ──────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'ach-1', name: 'First Report', description: 'Reported your first civic problem', icon: '📋', color: '#3b82f6', requirement: 'Report 1 problem', unlocked: true },
  { id: 'ach-2', name: 'Community Helper', description: 'Supported 10 civic problems', icon: '🤝', color: '#10b981', requirement: 'Support 10 problems', unlocked: true },
  { id: 'ach-3', name: 'Civic Champion', description: 'Helped 50 citizens through reports and solutions', icon: '🏆', color: '#f59e0b', requirement: 'Help 50 citizens', unlocked: true },
  { id: 'ach-4', name: 'Change Maker', description: 'Proposed 5 solutions that were implemented', icon: '⚡', color: '#8b5cf6', requirement: '5 implemented solutions', unlocked: false },
  { id: 'ach-5', name: 'Civic Leader', description: 'Reached the top 10 on the leaderboard', icon: '👑', color: '#ef4444', requirement: 'Top 10 leaderboard', unlocked: false },
  { id: 'ach-6', name: 'Problem Solver', description: 'Resolved 3 civic issues', icon: '✅', color: '#10b981', requirement: 'Resolve 3 issues', unlocked: true },
  { id: 'ach-7', name: 'Sustainability Champion', description: 'Supported 5 environmental solutions', icon: '🌱', color: '#10b981', requirement: '5 eco solutions', unlocked: false },
  { id: 'ach-8', name: 'Evidence Provider', description: 'Uploaded 10 pieces of field evidence', icon: '📸', color: '#06b6d4', requirement: '10 evidence uploads', unlocked: true },
  { id: 'ach-9', name: 'Discussion Starter', description: 'Started 20 discussions on civic issues', icon: '💬', color: '#ec4899', requirement: '20 discussions', unlocked: false },
  { id: 'ach-10', name: '100 Citizens Helped', description: 'Your actions helped over 100 citizens', icon: '🌍', color: '#f59e0b', requirement: 'Help 100 citizens', unlocked: false },
];

export const CITIZEN_BADGES = [
  { name: 'Civic Starter', minScore: 0, color: '#6b7280', icon: '🌟' },
  { name: 'Community Helper', minScore: 100, color: '#3b82f6', icon: '🤝' },
  { name: 'Civic Champion', minScore: 300, color: '#10b981', icon: '🏆' },
  { name: 'Change Maker', minScore: 600, color: '#f59e0b', icon: '⚡' },
  { name: 'Civic Leader', minScore: 1000, color: '#8b5cf6', icon: '👑' },
];

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export const LEADERBOARD_DATA = {
  citizens: [
    { id: 'u-citizen', name: 'Aman Kumar', sector: 'citizen', score: 420, problemsReported: 3, solutionsSuggested: 1, helped: 156, avatar: '👤' },
    { id: 'lb-2', name: 'Priya Singh', sector: 'citizen', score: 380, problemsReported: 5, solutionsSuggested: 2, helped: 120, avatar: '👩' },
    { id: 'lb-3', name: 'Rajesh Mahto', sector: 'citizen', score: 310, problemsReported: 4, solutionsSuggested: 0, helped: 98, avatar: '👨' },
    { id: 'lb-4', name: 'Sunita Devi', sector: 'citizen', score: 280, problemsReported: 2, solutionsSuggested: 3, helped: 85, avatar: '👩' },
    { id: 'lb-5', name: 'Vikram Oraon', sector: 'citizen', score: 245, problemsReported: 6, solutionsSuggested: 1, helped: 72, avatar: '👨' },
  ],
  universities: [
    { id: 'u-uni', name: 'BIT Mesra', score: 890, projects: 12, students: 45, solutions: 8, avatar: '🎓' },
    { id: 'lb-u2', name: 'NIT Jamshedpur', score: 760, projects: 9, students: 38, solutions: 6, avatar: '🎓' },
    { id: 'lb-u3', name: 'Xavier University Ranchi', score: 520, projects: 5, students: 22, solutions: 3, avatar: '🎓' },
    { id: 'lb-u4', name: 'ISM Dhanbad', score: 480, projects: 4, students: 18, solutions: 2, avatar: '🎓' },
  ],
  experts: [
    { id: 'u-expert', name: 'Dr. Ramesh Pathak', score: 940, reviews: 28, mentored: 6, rating: 4.8, avatar: '🕵️' },
    { id: 'lb-e2', name: 'Dr. S. K. Bose', score: 870, reviews: 24, mentored: 5, rating: 4.9, avatar: '🕵️' },
    { id: 'lb-e3', name: 'Prof. Meera Jha', score: 720, reviews: 18, mentored: 4, rating: 4.7, avatar: '🕵️' },
  ],
  ngos: [
    { id: 'u-ngo', name: 'Jharkhand Vikas NGO', score: 680, projects: 8, beneficiaries: 12000, avatar: '🤝' },
    { id: 'lb-n2', name: 'Pratham Education Foundation', score: 540, projects: 6, beneficiaries: 8500, avatar: '🤝' },
    { id: 'lb-n3', name: 'WaterAid India', score: 490, projects: 4, beneficiaries: 15000, avatar: '🤝' },
  ],
  industry: [
    { id: 'u-industry', name: 'GeoTech Solutions', score: 820, sponsored: 5, invested: 1250000, mentored: 4, avatar: '🏢' },
    { id: 'lb-i2', name: 'Tata Steel Foundation', score: 750, sponsored: 4, invested: 2500000, mentored: 3, avatar: '🏢' },
    { id: 'lb-i3', name: 'Cognizant Foundation', score: 610, sponsored: 3, invested: 800000, mentored: 2, avatar: '🏢' },
  ],
};

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  { id: 'dept-1', name: 'Public Works Department', shortName: 'PWD', officers: 12, assignedProblems: 28, resolvedProblems: 15, avgResolutionDays: 22, color: '#3b82f6', icon: '🏗️' },
  { id: 'dept-2', name: 'Health & Family Welfare', shortName: 'H&FW', officers: 8, assignedProblems: 15, resolvedProblems: 9, avgResolutionDays: 18, color: '#ef4444', icon: '🏥' },
  { id: 'dept-3', name: 'Education Department', shortName: 'EDU', officers: 6, assignedProblems: 12, resolvedProblems: 7, avgResolutionDays: 25, color: '#f59e0b', icon: '📚' },
  { id: 'dept-4', name: 'Sanitation & Cleanliness', shortName: 'SWM', officers: 10, assignedProblems: 35, resolvedProblems: 20, avgResolutionDays: 15, color: '#10b981', icon: '🗑️' },
  { id: 'dept-5', name: 'Transport Department', shortName: 'TD', officers: 7, assignedProblems: 18, resolvedProblems: 10, avgResolutionDays: 20, color: '#8b5cf6', icon: '🚌' },
  { id: 'dept-6', name: 'Water Resources Department', shortName: 'WRD', officers: 9, assignedProblems: 22, resolvedProblems: 11, avgResolutionDays: 28, color: '#06b6d4', icon: '💧' },
  { id: 'dept-7', name: 'Environment & Forest', shortName: 'E&F', officers: 5, assignedProblems: 8, resolvedProblems: 4, avgResolutionDays: 30, color: '#10b981', icon: '🌿' },
];

// ─── EXPERT MARKETPLACE ───────────────────────────────────────────────────────
export const EXPERTS = [
  { id: 'exp-1', name: 'Dr. Ramesh Pathak', expertise: ['Hydrology', 'IoT Systems', 'Water Engineering'], experience: '15 years', organization: 'NIT Jamshedpur', skills: ['LoRaWAN', 'Python', 'GIS', 'Sensor Design'], location: 'Ranchi', availability: 'Available', rating: 4.8, reviews: 28, projects: 6, hourlyRate: '₹2,500/hr', avatar: '🕵️', bio: 'Specialist in smart water infrastructure and IoT-based monitoring systems for rural and urban water distribution networks.' },
  { id: 'exp-2', name: 'Dr. S. K. Bose', expertise: ['Civil Engineering', 'Road Infrastructure', 'Geotechnical'], experience: '20 years', organization: 'BIT Mesra', skills: ['Structural Analysis', 'CAD', 'Material Science', 'GIS'], location: 'Ranchi', availability: 'Available', rating: 4.9, reviews: 24, projects: 8, hourlyRate: '₹3,000/hr', avatar: '🕵️', bio: 'Expert in rural road construction, soil mechanics, and sustainable infrastructure development for Jharkhand terrain.' },
  { id: 'exp-3', name: 'Prof. Meera Jha', expertise: ['Environmental Science', 'Pollution Control', 'Waste Management'], experience: '12 years', organization: 'Xavier University', skills: ['Environmental Impact', 'Waste Processing', 'Water Quality', 'Monitoring'], location: 'Ranchi', availability: 'Busy', rating: 4.7, reviews: 18, projects: 4, hourlyRate: '₹2,000/hr', avatar: '🕵️', bio: 'Researcher in municipal solid waste management, recycling technologies, and environmental compliance monitoring.' },
  { id: 'exp-4', name: 'Anil Kumar Singh', expertise: ['AI/ML', 'Data Science', 'Predictive Analytics'], experience: '8 years', organization: 'IIT Kharagpur', skills: ['TensorFlow', 'Python', 'Computer Vision', 'NLP'], location: 'Remote', availability: 'Available', rating: 4.6, reviews: 15, projects: 5, hourlyRate: '₹3,500/hr', avatar: '🕵️', bio: 'AI/ML engineer specializing in predictive analytics for civic infrastructure and public safety applications.' },
];

// ─── NGO MATCHING ─────────────────────────────────────────────────────────────
export const NGOS = [
  { id: 'ngo-1', name: 'Jharkhand Vikas NGO', causes: ['Rural Development', 'Education', 'Healthcare'], location: 'Ranchi', capacity: 'Medium', previousProjects: 12, beneficiaries: 12000, compatibility: 92, avatar: '🤝', bio: 'Grassroots organization focused on holistic rural development across Jharkhand\'s tribal and underserved communities.' },
  { id: 'ngo-2', name: 'Pratham Education Foundation', causes: ['Education', 'Digital Literacy', 'Youth Empowerment'], location: 'Pan-India', capacity: 'Large', previousProjects: 45, beneficiaries: 500000, compatibility: 85, avatar: '🤝', bio: 'One of India\'s largest education NGOs, working to improve learning outcomes for children in underserved communities.' },
  { id: 'ngo-3', name: 'WaterAid India', causes: ['Water', 'Sanitation', 'Hygiene'], location: 'Multiple States', capacity: 'Large', previousProjects: 28, beneficiaries: 200000, compatibility: 88, avatar: '🤝', bio: 'International organization committed to ensuring universal access to safe water, sanitation, and hygiene.' },
  { id: 'ngo-4', name: 'SEWA Jharkhand', causes: ['Women Empowerment', 'Employment', 'Micro-finance'], location: 'Ranchi', capacity: 'Small', previousProjects: 8, beneficiaries: 5000, compatibility: 78, avatar: '🤝', bio: 'Self-Employed Women\'s Association chapter supporting women workers in informal economy through skill development.' },
];

// ─── INDUSTRY PARTNERSHIPS ───────────────────────────────────────────────────
export const INDUSTRY_PARTNERS = [
  { id: 'ind-1', name: 'GeoTech Solutions', type: 'Technology', specialties: ['GIS', 'IoT', 'Remote Sensing'], csrBudget: 5000000, sponsored: 5, activePilots: 2, avatar: '🏢' },
  { id: 'ind-2', name: 'Tata Steel Foundation', type: 'CSR', specialties: ['Infrastructure', 'Education', 'Healthcare'], csrBudget: 25000000, sponsored: 12, activePilots: 5, avatar: '🏢' },
  { id: 'ind-3', name: 'Cognizant Foundation', type: 'Technology', specialties: ['Digital Skills', 'Youth Training', 'AI'], csrBudget: 8000000, sponsored: 4, activePilots: 1, avatar: '🏢' },
  { id: 'ind-4', name: 'Jharkhand State Electronics Dev Corp', type: 'Government', specialties: ['E-Governance', 'Digital Infrastructure'], csrBudget: 12000000, sponsored: 6, activePilots: 3, avatar: '🏢' },
];

// ─── CIVIC CROWDFUNDING ──────────────────────────────────────────────────────
export const CROWDFUNDING_PROJECTS = [
  { id: 'cf-1', challengeId: 'monsoon-road-accessibility', title: 'Rural Road IoT Monitoring System', target: 500000, raised: 320000, contributors: 48, daysLeft: 22, status: 'active', description: 'Deploy IoT sensors to monitor rural road conditions and enable predictive maintenance.' },
  { id: 'cf-2', challengeId: 'water-pipeline-leakage', title: 'Acoustic Leak Detection Grid', target: 250000, raised: 250000, contributors: 35, daysLeft: 0, status: 'funded', description: 'Install acoustic sensors across urban water mains to detect micro-cracks before major bursts.' },
  { id: 'cf-3', challengeId: 'agricultural-soil-nutrients', title: 'Soil Health Telemetry Network', target: 300000, raised: 120000, contributors: 22, daysLeft: 35, status: 'active', description: 'Deploy low-cost NPK soil sensors for real-time agricultural monitoring.' },
];

// ─── CIVIC INNOVATION CHALLENGES ─────────────────────────────────────────────
export const INNOVATION_CHALLENGES = [
  { id: 'ic-1', title: 'AI-Powered Waste Management', description: 'Develop an AI solution for smart waste collection routing and bin monitoring.', deadline: '2026-10-15', eligibility: 'Students & Startups', prize: '₹5,00,000', submissions: 8, status: 'open', organization: 'Dhanbad Municipal Corporation' },
  { id: 'ic-2', title: 'Smart Water Quality Monitoring', description: 'Create an IoT-based real-time water quality monitoring system for rural areas.', deadline: '2026-11-01', eligibility: 'University Teams', prize: '₹3,00,000', submissions: 5, status: 'open', organization: 'Jharkhand Water Resources Dept' },
  { id: 'ic-3', title: 'Rural Healthcare Telemedicine Hub', description: 'Design a low-cost telemedicine solution for remote tribal villages.', deadline: '2026-09-30', eligibility: 'Open to All', prize: '₹7,50,000', submissions: 12, status: 'judging', organization: 'Ministry of Health & Family Welfare' },
];

// ─── CIVIC INTELLIGENCE DATA ─────────────────────────────────────────────────
export const CIVIC_INTELLIGENCE = {
  emergingProblems: [
    { title: 'Monsoon flooding in Dumka', trend: '+45% reports this week', severity: 'critical', category: 'Infrastructure' },
    { title: 'Water contamination in Ranchi Wards', trend: '+32% reports this week', severity: 'high', category: 'Water Management' },
    { title: 'School infrastructure damage', trend: '+28% reports this week', severity: 'medium', category: 'Education' },
  ],
  hotspots: [
    { location: 'Sikaripara Block, Dumka', problems: 12, severity: 'critical', population: 18000 },
    { location: 'Ward 14, Kokar, Ranchi', problems: 8, severity: 'high', population: 3200 },
    { location: 'Jharia Market, Dhanbad', problems: 6, severity: 'medium', population: 12000 },
  ],
  riskPredictions: [
    { prediction: 'Road infrastructure collapse in Dumka', probability: '85%', timeframe: '2 weeks', impact: 'High' },
    { prediction: 'Water supply disruption in Ward 14', probability: '72%', timeframe: '1 month', impact: 'High' },
    { prediction: 'Agricultural crop damage in Hazaribagh', probability: '60%', timeframe: '3 weeks', impact: 'Medium' },
  ],
  recommendedActions: [
    { action: 'Deploy emergency drainage teams to Sikaripara Block', priority: 'Critical', department: 'PWD' },
    { action: 'Accelerate pipeline replacement in Ward 14', priority: 'High', department: 'Water Resources' },
    { action: 'Issue flood advisory for Dumka district', priority: 'Critical', department: 'Disaster Management' },
  ],
  impactOpportunities: [
    { opportunity: 'Rural Road IoT Monitoring', impact: '12,000 citizens', cost: '₹5,00,000', roi: '340%' },
    { opportunity: 'Water Leak Detection Grid', impact: '3,200 citizens', cost: '₹2,50,000', roi: '280%' },
  ],
  weeklyBrief: {
    majorProblems: ['Monsoon flooding escalation in Dumka', 'Water contamination in Ranchi urban areas'],
    majorImprovements: ['Road pilot completed in 2 villages', '3 water sensors deployed successfully'],
    emergingTrends: ['Flood-related reports increasing 45% week-over-week', 'IoT solution adoption growing among student teams'],
    recommendedPriorities: ['Emergency flood response', 'Water infrastructure repair', 'School building assessment'],
  },
};

// ─── ANALYTICS DATA ──────────────────────────────────────────────────────────
export const ANALYTICS_DATA = {
  problemsByCategory: [
    { category: 'Infrastructure', count: 45, percentage: 32 },
    { category: 'Water Management', count: 28, percentage: 20 },
    { category: 'Agriculture', count: 18, percentage: 13 },
    { category: 'Healthcare', count: 15, percentage: 11 },
    { category: 'Education', count: 12, percentage: 9 },
    { category: 'Environment', count: 10, percentage: 7 },
    { category: 'Public Safety', count: 8, percentage: 6 },
    { category: 'Other', count: 4, percentage: 3 },
  ],
  problemsByLocation: [
    { district: 'Dumka', count: 18, critical: 4, high: 8, medium: 6 },
    { district: 'Ranchi', count: 25, critical: 3, high: 10, medium: 12 },
    { district: 'Dhanbad', count: 15, critical: 2, high: 6, medium: 7 },
    { district: 'Hazaribagh', count: 10, critical: 1, high: 4, medium: 5 },
    { district: 'Bokaro', count: 8, critical: 1, high: 3, medium: 4 },
  ],
  monthlyTrend: [
    { month: 'Jan', reported: 12, resolved: 5 },
    { month: 'Feb', reported: 15, resolved: 8 },
    { month: 'Mar', reported: 18, resolved: 10 },
    { month: 'Apr', reported: 22, resolved: 12 },
    { month: 'May', reported: 28, resolved: 15 },
    { month: 'Jun', reported: 35, resolved: 18 },
    { month: 'Jul', reported: 42, resolved: 22 },
    { month: 'Aug', reported: 38, resolved: 25 },
  ],
  departmentPerformance: [
    { name: 'PWD', resolved: 15, pending: 13, avgDays: 22 },
    { name: 'H&FW', resolved: 9, pending: 6, avgDays: 18 },
    { name: 'EDU', resolved: 7, pending: 5, avgDays: 25 },
    { name: 'SWM', resolved: 20, pending: 15, avgDays: 15 },
    { name: 'TD', resolved: 10, pending: 8, avgDays: 20 },
    { name: 'WRD', resolved: 11, pending: 11, avgDays: 28 },
  ],
};

// ─── PROBLEM TIMELINE TEMPLATES ──────────────────────────────────────────────
export const TIMELINE_STATUSES = [
  { status: 'reported', label: 'Reported', icon: '📋', color: '#3b82f6' },
  { status: 'under_review', label: 'AI Analyzed', icon: '🤖', color: '#8b5cf6' },
  { status: 'validated', label: 'Validated', icon: '✅', color: '#10b981' },
  { status: 'published', label: 'Published', icon: '📢', color: '#06b6d4' },
  { status: 'assigned', label: 'Assigned', icon: '👤', color: '#f59e0b' },
  { status: 'team_formation', label: 'Team Formed', icon: '👥', color: '#ec4899' },
  { status: 'active_development', label: 'Solution Proposed', icon: '💡', color: '#8b5cf6' },
  { status: 'prototype', label: 'Prototype', icon: '🔧', color: '#3b82f6' },
  { status: 'pilot', label: 'Pilot', icon: '🚀', color: '#10b981' },
  { status: 'implemented', label: 'Implemented', icon: '🎉', color: '#10b981' },
];

// ─── EVIDENCE VERIFICATION INDICATORS ────────────────────────────────────────
export const EVIDENCE_QUALITY = {
  excellent: { label: 'Excellent', color: '#10b981', score: 95 },
  good: { label: 'Good', color: '#3b82f6', score: 80 },
  fair: { label: 'Fair', color: '#f59e0b', score: 65 },
  poor: { label: 'Needs Review', color: '#ef4444', score: 40 },
};

// ─── TRANSPARENCY DATA ───────────────────────────────────────────────────────
export const TRANSPARENCY_STATS = {
  totalReported: 139,
  totalResolved: 67,
  avgResolutionDays: 21.5,
  activeProjects: 18,
  citizensParticipating: 2847,
  communitiesBenefited: 45,
  totalFunding: 12500000,
  universitiesInvolved: 12,
  ngosPartnered: 8,
  expertsEngaged: 24,
};
