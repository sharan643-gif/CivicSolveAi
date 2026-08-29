// JanSetu V2 — Intelligent Civic Operating System Engine
// Supports Problem DNA, Civic Opportunity Score, Evidence Weight, Problem Momentum, 
// Solution DNA, Adaptation Engine, Early Warnings, Collaboration Graph, Judge Mode & more.

import { db } from './mockData';

// ─── 1. PROBLEM DNA GENERATOR ───────────────────────────────────────────────
export function getProblemDNA(challenge) {
  if (!challenge) return null;
  
  // Structured extraction or calculation from challenge data
  const isWater = (challenge.category || '').toLowerCase().includes('water') || (challenge.title || '').toLowerCase().includes('water');
  const isRoad = (challenge.category || '').toLowerCase().includes('infra') || (challenge.title || '').toLowerCase().includes('road');

  return {
    category: challenge.category || "Infrastructure",
    subcategory: challenge.subcategory || (isWater ? "Water Distribution" : "Transport & Logistics"),
    rootCauses: challenge.ai_analysis?.possible_causes || [
      isWater ? "Aging pipeline infrastructure & soil movement" : "Inadequate drainage channels & monsoon clay erosion",
      "Lack of real-time monitoring sensors",
      "Delayed seasonal maintenance protocol"
    ],
    affectedPopulation: challenge.affected_population || 2800,
    vulnerableGroups: ["Elderly Residents", "School Children", "Marginalized Farmers", "Daily Wage Earners"],
    geographicCharacteristics: {
      terrain: isRoad ? "Sub-Hilly Rural Corridor" : "Urban High-Density Basin",
      soilType: isRoad ? "High-Clay Red Soil" : "Alluvial Topsoil",
      district: challenge.district || "Dumka",
      coordinates: `${challenge.latitude || 24.25}, ${challenge.longitude || 87.42}`
    },
    urgency: challenge.severity === 'high' || challenge.priority_score > 80 ? "Critical (Immediate Action Required)" : "Moderate",
    severity: challenge.severity || "high",
    recurringPattern: isWater ? "Summer Supply Drop & Peak Monsoon Rupture" : "Monsoon Season (June - Sept Annually)",
    requiredExpertise: challenge.skills_required || ["Civil Engineering", "IoT Sensors", "Environmental Hydrology", "GIS Mapping"],
    infrastructureDependency: ["Gram Panchayat Sub-grid", "State Highway Connector", "Rural Pipe Pipeline Network"],
    seasonalDependency: "High (Monsoon & Pre-Summer Peak)",
    economicImpact: `₹${((challenge.affected_population || 1800) * 450).toLocaleString()} est. monthly loss in productivity & healthcare`,
    environmentalImpact: isWater ? "Water contamination & 30% pipeline loss" : "Topsoil erosion & village runoff contamination",
    historicalContext: "Reported consistently for past 3 consecutive years during monsoon transition.",
    relatedProblems: ["Water-borne illness spike in District Health Sub-center", "School absenteeism during heavy rain weeks"],
    possibleInterventionTypes: [
      "IoT Soil & Water Moisture Telemetry",
      "Eco-pavement clay stabilization",
      "Community-led Panchayat maintenance committee"
    ]
  };
}

// ─── 2. CIVIC OPPORTUNITY SCORE CALCULATOR ─────────────────────────────────
export function getCivicOpportunityScore(challenge) {
  if (!challenge) return { score: 85, breakdown: [] };

  const severity = challenge.severity === 'high' ? 95 : 75;
  const popScore = Math.min(100, Math.round((challenge.affected_population || 1000) / 50));
  const techAvailability = 90;
  const universityCapability = 94;
  const costEfficiency = 88;
  const communityReadiness = 86;

  const score = Math.round(
    severity * 0.2 +
    popScore * 0.2 +
    techAvailability * 0.15 +
    universityCapability * 0.15 +
    costEfficiency * 0.15 +
    communityReadiness * 0.15
  );

  return {
    score: Math.min(99, Math.max(70, score)),
    priorityScore: challenge.priority_score || 91,
    why: [
      { check: true, text: `High population affected (${(challenge.affected_population || 1800).toLocaleString()} citizens)` },
      { check: true, text: "Existing proven open-source technology available" },
      { check: true, text: "Strong local university capability (BIT Mesra / NIT Jamshedpur)" },
      { check: true, text: "Low deployment cost relative to long-term impact" },
      { check: true, text: "High potential for replication across 12 neighbouring blocks" },
      { check: true, text: "Gram Panchayat community participation ready" }
    ]
  };
}

// ─── 3. WHY THIS MATTERS STORY GENERATOR ──────────────────────────────────
export function getWhyThisMattersStory(challenge) {
  if (!challenge) return null;
  const pop = (challenge.affected_population || 1800).toLocaleString();
  const reports = challenge.reports_count || 127;
  const district = challenge.district || "Dumka";
  
  return {
    summary: `${reports} independent reports across ${district} district indicate a recurring ${challenge.category?.toLowerCase() || 'civic'} issue affecting approximately ${pop} people. Community complaints increased 38% over the last 60 days, concentrating in rural connectivity corridors.`,
    stats: {
      affectedPeople: pop,
      villages: 7,
      reportsCount: reports,
      trend: "+38%",
      healthRisk: challenge.severity === 'high' ? "High" : "Moderate"
    }
  };
}

// ─── 4. CITIZEN EVIDENCE WEIGHT CALCULATOR ────────────────────────────────
export function getEvidenceWeight(challenge) {
  const reportsCount = challenge?.reports_count || 127;
  const photoCount = Math.round(reportsCount * 0.18) + 3;
  const gpsCount = Math.round(reportsCount * 0.12) + 2;
  const govVerified = challenge?.status !== 'reported';
  const communityConfirms = Math.round(reportsCount * 0.65) + 14;

  const totalScore = Math.min(98, 45 + (reportsCount > 50 ? 25 : 15) + (govVerified ? 15 : 0) + 12);

  return {
    confidence: totalScore,
    breakdown: [
      { label: `${reportsCount} Independent Citizen Reports`, points: "+35%" },
      { label: `${photoCount} Photo & Media Evidences Uploaded`, points: "+20%" },
      { label: `${gpsCount} GPS-Confirmed Location Telemetry Reports`, points: "+15%" },
      { label: govVerified ? "Government Administrator Verified" : "Pending Govt Verification", points: govVerified ? "+15%" : "+0%" },
      { label: `${communityConfirms} Community "I Am Affected Too" Confirmations`, points: "+13%" }
    ]
  };
}

// ─── 5. COMMUNITY PULSE & MOMENTUM ─────────────────────────────────────────
export function getCommunityPulse(challenge) {
  const reportsCount = challenge?.reports_count || 127;
  const percentage = Math.min(96, Math.max(60, Math.round(reportsCount / 1.8)));
  return {
    percentage,
    state: percentage > 80 ? "Community concern is rapidly increasing." : "Community concern is stabilizing.",
    momentum: percentage > 85 ? "↑↑ Rapidly Growing" : percentage > 70 ? "↑ Growing" : "→ Stable",
    recentSubmissions: 24,
    confirmationsLast7Days: 89
  };
}

// ─── 6. EMERGING PROBLEMS & EARLY WARNINGS ─────────────────────────────────
export const EMERGING_PROBLEMS_LIST = [
  {
    id: "em-1",
    title: "Groundwater Heavy Metal Contamination Signal",
    category: "Water Management",
    district: "Dhanbad",
    momentum: "+72%",
    villagesCount: "4 → 11",
    reportsCount: "12 → 67",
    detectedDaysAgo: 9,
    escalationRisk: "HIGH",
    confidence: 84,
    signals: [
      "+72% surge in water taste & discolouration complaints",
      "Geographic cluster moving towards 7 school borewells",
      "Historical pre-monsoon industrial runoff correlation",
      "High local health center gastrointestinal case reports"
    ]
  },
  {
    id: "em-2",
    title: "Seasonal Crop Pest Outbreak Alert",
    category: "Agriculture & Rural",
    district: "Palamu",
    momentum: "+54%",
    villagesCount: "3 → 8",
    reportsCount: "8 → 42",
    detectedDaysAgo: 5,
    escalationRisk: "MEDIUM",
    confidence: 76,
    signals: [
      "+54% crop leaf damage photo submissions",
      "Spreading across contiguous paddy fields along North Koel river",
      "Favorable humidity weather window detected"
    ]
  }
];

// ─── 7. INTERVENTION SIMULATOR MODEL ───────────────────────────────────────
export function simulateIntervention(challengeId, scenarioType) {
  return {
    current: {
      affectedPeople: 5000,
      availability: "60% Service Reliability",
      estCost: "₹0"
    },
    proposed: {
      intervention: scenarioType === 'iot' ? "Deploy Smart IoT Water/Road Sensors & Micro-Drainage" : "Deploy Community Solar Micro-grids",
      affectedReduction: "-68%",
      newAffectedPeople: 1600,
      implementationCost: "₹3,50,000",
      timeDays: 45,
      requiredPartners: ["BIT Mesra (University)", "GeoTech Solutions (Startup)", "Dept of Rural Dev"],
      potentialScaleVillages: 18
    },
    scaled: {
      villages: 25,
      totalAffectedServed: 22400,
      totalCost: "₹14,20,000",
      efficiencyGain: "+82%"
    }
  };
}

// ─── 8. SOLUTION DNA & ADAPTATION ENGINE ──────────────────────────────────
export const SOLUTION_DNA_ITEMS = [
  {
    id: "sol-1",
    title: "LoRaWAN Micro-Drainage & Road Moisture Sensor Array",
    problemTypesSolved: ["Infrastructure", "Monsoon Road Erosion", "Rural Isolation"],
    rootCausesAddressed: ["Lack of drainage telemetry", "Soil clay oversaturation"],
    technology: "LoRaWAN + ESP32 + Solar Power + GIS Web Dashboard",
    requiredSkills: ["IoT Firmware", "Embedded Electronics", "GIS", "React / Node.js"],
    costRange: "₹45,000 - ₹1,20,000 per block",
    deploymentEnvironment: "Rural Unpaved & Semi-paved Road Corridors",
    scaleCharacteristics: "High (Modular Sensor Nodes)",
    implementationDuration: "30 Days",
    communityRequirements: "Gram Panchayat Volunteer Caretaker",
    measurableOutcomes: "85% reduction in road washouts, 4.2x faster maintenance dispatch",
    failureConditions: "Extreme submersion without IP68 housing, network outage if non-mesh",
    maintenanceRequirements: "Quarterly solar panel cleaning & battery check",
    adaptationRecommendations: {
      similarity: 88,
      recommendedChanges: [
        "Upgrade to IP68 waterproof sealed enclosures for heavy rain",
        "Add local tribal language voice prompt UI for Panchayat volunteers",
        "Configure low-power sleep state during dry season"
      ]
    },
    failureKnowledge: [
      "Prototype v1 failed due to battery drain during 4 consecutive cloudy days. Solved using 5W solar panels with supercapacitors.",
      "Initial Bluetooth range was insufficient across 2km stretches. Switched to 868MHz LoRaWAN."
    ],
    lessonsLearned: [
      "Community training of local village youth for basic cleaning improved uptime from 40% to 98%.",
      "Maintenance ownership MUST be officially assigned to Gram Panchayat before deployment."
    ]
  }
];

// ─── 9. COLLABORATION GRAPH DATA ───────────────────────────────────────────
export const COLLABORATION_GRAPH_NODES = [
  { id: "prob-1", label: "Monsoon Road Crisis", type: "problem", group: "Problem" },
  { id: "govt-1", label: "Dept of Rural Dev (JH)", type: "govt", group: "Government" },
  { id: "univ-1", label: "BIT Mesra Ranchi", type: "university", group: "University" },
  { id: "fac-1", label: "Dr. S. K. Bose", type: "faculty", group: "Faculty Mentor" },
  { id: "stud-1", label: "Aarav Mehta (Team Lead)", type: "student", group: "Student Team" },
  { id: "start-1", label: "GeoTech Solutions", type: "startup", group: "Industry Partner" },
  { id: "csr-1", label: "Tata Steel Foundation", type: "csr", group: "CSR Funder" },
  { id: "sol-1", label: "IoT Eco-Drainage System", type: "solution", group: "Solution" },
  { id: "comm-1", label: "Sikaripara Gram Panchayat", type: "community", group: "Beneficiary" }
];

export const COLLABORATION_GRAPH_EDGES = [
  { from: "prob-1", to: "govt-1", label: "Validated By" },
  { from: "govt-1", to: "univ-1", label: "Assigned Challenge To" },
  { from: "univ-1", to: "fac-1", label: "Supervised By" },
  { from: "fac-1", to: "stud-1", label: "Mentors Team" },
  { from: "stud-1", to: "sol-1", label: "Built Solution" },
  { from: "start-1", to: "stud-1", label: "Provides GIS Telemetry API" },
  { from: "csr-1", to: "sol-1", label: "Grants ₹2.5L CSR Funding" },
  { from: "sol-1", to: "comm-1", label: "Deployed For 1,800 Citizens" }
];

// ─── 10. CAPABILITY GAP & TEAM INTELLIGENCE ───────────────────────────────
export function getCapabilityGapAndTeam(challenge) {
  return {
    requiredCapabilities: [
      { name: "Civil Engineering (Drainage)", present: true, provider: "BIT Mesra Dept of Civil Eng" },
      { name: "IoT & Embedded Firmware", present: true, provider: "Aarav Mehta (Student Lead)" },
      { name: "Water Resources Hydrology", present: true, provider: "Dr. Ramesh Pathak (Expert)" },
      { name: "Low-Power Mesh Electronics", present: false, provider: null }
    ],
    capabilityGap: "Low-Power Mesh Electronics & IP68 Enclosure Design",
    recommendedBridgePartners: [
      { type: "Startup", name: "EcoFilter Labs (Ranchi)", help: "Can supply pre-certified IP68 enclosures" },
      { type: "Industry", name: "GeoTech Solutions", help: "Can supply LoRa gateway telemetry" }
    ],
    recommendedTeam: [
      { name: "Dr. S. K. Bose", role: "Faculty Advisor", branch: "Civil & Environmental", readiness: "100%" },
      { name: "Aarav Mehta", role: "Student Lead & Firmware", branch: "CSE / IoT", readiness: "95%" },
      { name: "Priya Sharma", role: "GIS Web Developer", branch: "IT", readiness: "92%" },
      { name: "Rohan Das", role: "Hardware Assembly", branch: "ECE", readiness: "88%" },
      { name: "Sita Marandi", role: "Field Research & Community Lead", branch: "Social Work", readiness: "94%" }
    ],
    overallReadiness: 91
  };
}

// ─── 11. DEPLOYMENT & COMMUNITY READINESS SCORE ────────────────────────────
export function getDeploymentReadiness(challenge) {
  return {
    overallScore: 84,
    status: "READY_FOR_PILOT",
    gates: [
      { name: "Technology Readiness Level (TRL-7)", passed: true, score: "90/100" },
      { name: "Infrastructure Connectivity Check", passed: true, score: "85/100" },
      { name: "Government Administrator Approval", passed: true, score: "100/100" },
      { name: "Community Readiness & Local Training", passed: true, score: "82/100" },
      { name: "CSR / Innovation Funding Secured", passed: true, score: "95/100" },
      { name: "Gram Panchayat Maintenance Owner Signed", passed: true, score: "100/100" },
      { name: "Field Safety & Environmental Clearance", passed: false, score: "Pending Sign-off" }
    ]
  };
}

// ─── 12. IMPACT CERTIFICATE & REPLAY TIMELINE ─────────────────────────────
export function getImpactCertificate(challenge) {
  return {
    certificateId: `JANSETU-IMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title: "JanSetu Verified Impact Record",
    projectName: challenge?.title || "Monsoon Rural Road & Drainage Stabilization",
    district: challenge?.district || "Dumka, Jharkhand",
    university: "Birla Institute of Technology (BIT) Mesra",
    partners: ["Dept of Rural Development JH", "GeoTech Solutions", "Tata Steel Foundation"],
    citizensBenefited: (challenge?.affected_population || 1800).toLocaleString(),
    verifiedMetrics: [
      { label: "Road Washout Reduction", value: "88%" },
      { label: "Community Access Restored", value: "10 Villages" },
      { label: "Average Resolution Speed", value: "42 Days" }
    ],
    issuedDate: "August 28, 2026",
    verificationStatus: "JanSetu Verified Impact Record (Official Govt Partner Ledger)"
  };
}

export const REPLAY_TIMELINE_STAGES = [
  { step: 1, label: "Citizen Report Filed", desc: "127 citizens reported road washout in Sikaripara via mobile voice & photos.", time: "June 12, 2026" },
  { step: 2, label: "AI Analysis & DNA", desc: "Groq AI categorized issue as Infrastructure/Erosion, Priority 91/100.", time: "June 12, 2026" },
  { step: 3, label: "Duplicate & Cluster Detection", desc: "Merged 142 duplicate raw reports into single Master Problem DNA.", time: "June 13, 2026" },
  { step: 4, label: "Govt Officer Verification", desc: "Shri R. K. Verma (Rural Dev Dept) verified issue on-site.", time: "June 14, 2026" },
  { step: 5, label: "University Capability Match", desc: "Matched with BIT Mesra Civil & IoT department.", time: "June 18, 2026" },
  { step: 6, label: "Team Formation & CSR Match", desc: "Team AquaTech formed; ₹2.5L CSR funding locked from Tata Steel Fdn.", time: "June 20, 2026" },
  { step: 7, label: "Prototype & Field Pilot", desc: "Deployed 12 LoRaWAN moisture sensors & eco-drainage channels.", time: "July 20, 2026" },
  { step: 8, label: "Citizen Validation & Impact", desc: "Community confirmed 88% improvement during monsoon peak.", time: "August 15, 2026" },
  { step: 9, label: "Solution DNA & Scale Opportunity", desc: "Indexed into Solution Adaptation Engine for 18 neighbouring blocks.", time: "August 28, 2026" }
];

// ─── 13. ASK JANSETU AI ENGINE ────────────────────────────────────────────
export function askJanSetu(query, userRole = 'citizen') {
  const q = query.toLowerCase();
  
  if (q.includes('water') || q.includes('ranchi') || q.includes('dumka')) {
    return {
      answer: "Based on real-time JanSetu platform telemetry: In Dumka district, the Monsoon Rural Road & Drainage challenge is currently at Prototype stage (68% complete) benefiting 1,800 citizens. In Ranchi Ward 14, a high-priority Water Pipeline Leakage challenge affects 3,200 residents and is currently in Team Formation under BIT Mesra.",
      sources: ["Challenges Database", "BIT Mesra Project Registry"],
      confidence: "98%"
    };
  }
  if (q.includes('university') || q.includes('best') || q.includes('team')) {
    return {
      answer: "BIT Mesra is currently the top-matched institution for Infrastructure & IoT challenges with a 94% capability readiness score. NIT Jamshedpur excels in Environmental Water Hydrology.",
      sources: ["University Capability Matrix", "JanSetu RBAC Ledger"],
      confidence: "95%"
    };
  }
  if (q.includes('risk') || q.includes('emerging')) {
    return {
      answer: "Emerging Risk Alert: Dhanbad district has detected a +72% surge in Groundwater Heavy Metal Contamination reports across 11 villages in the last 9 days. Immediate Field Verification is recommended.",
      sources: ["Emerging Problems Radar", "Community Pulse Telemetry"],
      confidence: "84%"
    };
  }
  return {
    answer: "JanSetu Operating System has indexed 1,284 challenges, 4,820 implemented solutions, and 236 registered universities across 24 districts of Jharkhand. How can I assist your sector decision today?",
    sources: ["JanSetu Global Index"],
    confidence: "99%"
  };
}

// ─── 14. JANSETU IMPACT LEDGER ──────────────────────────────────────────────
export const JANSETU_IMPACT_LEDGER = {
  citizensBenefited: 1248420,
  estimatedSavings: "₹14.2 Crore",
  solutionsDeployed: 4820,
  districtsImpacted: 24,
  hoursSaved: 384000,
  waterSavedLiters: "1.2 Billion",
  jobsCreated: 420,
  universitiesActive: 236
};

// ─── 15. DISTRICT SCORECARD DATA ────────────────────────────────────────────
export const DISTRICT_SCORECARDS = [
  { district: "Ranchi", score: 88, challenges: 142, resolved: 98, universities: 12, health: "Strong Innovation Engine" },
  { district: "Dumka", score: 82, challenges: 94, resolved: 68, universities: 4, health: "High Rural Impact" },
  { district: "Dhanbad", score: 79, challenges: 110, resolved: 72, universities: 6, health: "Active Industrial Focus" },
  { district: "East Singhbhum", score: 85, challenges: 120, resolved: 91, universities: 8, health: "Strong CSR Integration" },
  { district: "Palamu", score: 71, challenges: 64, resolved: 38, universities: 3, health: "Needs Agri Support" }
];
