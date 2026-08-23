// CivicSolve AI - OpenRouter AI integration service with keyword-driven fallback engine

const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const hasApiKey = openRouterKey && openRouterKey !== 'your-openrouter-api-key';

// Mock rule-based categorization when AI API is not active
const runMockAnalysis = (title = "", description = "") => {
  const text = (title + " " + description).toLowerCase();
  
  let category = "Infrastructure";
  let subcategory = "General Utilities";
  let suggested_technologies = ["Internet of Things (IoT)", "Cloud Databases", "Mobile Applications"];
  let skills_required = ["React", "Node.js", "System Integration"];
  let severity = "medium";
  let priority_score = 65;
  let affected_population_estimate = 500;
  let possible_causes = ["Lack of monitoring tools", "Aging infrastructure assets"];

  if (text.includes("road") || text.includes("street") || text.includes("rain") || text.includes("flood") || text.includes("mud") || text.includes("pothole")) {
    category = "Infrastructure";
    subcategory = "Transport & Logistics";
    severity = text.includes("heavy") || text.includes("unusable") || text.includes("critical") ? "high" : "medium";
    priority_score = severity === "high" ? 91 : 74;
    affected_population_estimate = text.includes("village") ? 1800 : 850;
    possible_causes = [
      "Inadequate drainage channels along rural pathways",
      "Erosion of top layers due to monsoon rain run-off",
      "Absence of asphalt reinforcement base"
    ];
    suggested_technologies = [
      "Geographic Information Systems (GIS)",
      "Rainfall intensity analytics",
      "IoT moisture sensor nodes",
      "Satellite remote sensing"
    ];
    skills_required = ["GIS Mapping", "Python Data Science", "IoT Prototyping", "Civil Engineering"];
  } else if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("drain") || text.includes("sewage")) {
    category = "Water Management";
    subcategory = "Water Distribution Systems";
    severity = text.includes("contamination") || text.includes("critical") ? "critical" : "high";
    priority_score = severity === "critical" ? 95 : 85;
    affected_population_estimate = 3200;
    possible_causes = [
      "Cracking in aging iron water pipelines",
      "Ground soil shift stresses",
      "Biofilm chemical erosion"
    ];
    suggested_technologies = [
      "Acoustic vibration leak sensing",
      "Pressure telemetry systems",
      "Machine Learning anomaly isolation"
    ];
    skills_required = ["Python", "GIS", "IoT Node Development", "Machine Learning", "Civil Engineering"];
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash") || text.includes("recycle") || text.includes("dump")) {
    category = "Waste Management";
    subcategory = "Smart Sanitation";
    severity = "medium";
    priority_score = 72;
    affected_population_estimate = 12000;
    possible_causes = [
      "Static waste collection routing lists",
      "Surge in single-use plastic package containers",
      "Insufficient civic collection bins"
    ];
    suggested_technologies = [
      "Ultrasonic container level sensors",
      "Dynamic logistics route optimizers",
      "LoRaWAN telemetry backhaul"
    ];
    skills_required = ["IoT Hardware Integration", "Dynamic Routing Algorithms", "Database Optimization"];
  } else if (text.includes("crop") || text.includes("soil") || text.includes("farmer") || text.includes("agriculture") || text.includes("fertilizer")) {
    category = "Agriculture";
    subcategory = "Precision Farming";
    severity = "medium";
    priority_score = 64;
    affected_population_estimate = 1200;
    possible_causes = [
      "Improper chemical NPK soil ratios",
      "Lack of accessible localized testing laboratories",
      "Volatile weather cycle changes"
    ];
    suggested_technologies = [
      "Colorimetric test spectrometers",
      "Offline mobile Android databases",
      "Geo-location customized nutrient algorithms"
    ];
    skills_required = ["Microfluidics", "Spectroscopy", "Mobile Apps", "Agronomy"];
  } else if (text.includes("doctor") || text.includes("medical") || text.includes("clinic") || text.includes("health") || text.includes("disease")) {
    category = "Healthcare";
    subcategory = "Rural Telemedicine";
    severity = "high";
    priority_score = 82;
    affected_population_estimate = 4500;
    possible_causes = [
      "Lack of specialized physicians in remote health centers",
      "Inadequate logistics routing for thermal medicines"
    ];
    suggested_technologies = [
      "Interactive telemedicine video hubs",
      "IoT temperature tracking packages",
      "Autonomous aerial drone delivery paths"
    ];
    skills_required = ["WebRTC", "React Native", "Embedded Programming", "Logistics Optimization"];
  }

  return {
    category,
    subcategory,
    severity,
    priority_score,
    affected_population_estimate,
    possible_causes,
    suggested_technologies,
    skills_required
  };
};

import { groqService } from './groqClientService';

export { groqService };

export const aiService = {
  // Analyze challenge via Groq AI or fallback engine
  analyzeChallenge: async (title, description) => {
    try {
      const res = await groqService.classifyComplaint(title, description);
      if (res && res.category) {
        return {
          category: res.category,
          subcategory: res.subcategory || 'General Maintenance',
          severity: res.severity || 'medium',
          priority_score: res.priority_score || 70,
          affected_population_estimate: 1500,
          possible_causes: ['Infrastructure asset degradation', 'Environmental factor strain'],
          suggested_technologies: ['GIS Mapping', 'IoT Telemetry Nodes', 'Cloud Telemetry'],
          skills_required: res.skills_required || ['GIS', 'Civil Engineering', 'System Integration']
        };
      }
    } catch (e) {
      console.warn('[aiService] Groq classification failed, running local analysis:', e.message);
    }
    return runMockAnalysis(title, description);
  },

  // Simulate duplicate similarity detection
  detectDuplicates: (newTitle, newDescription, existingChallenges) => {
    const text = (newTitle + " " + newDescription).toLowerCase();
    let bestMatch = null;
    let maxSimilarity = 0;

    for (const challenge of existingChallenges) {
      const chalText = (challenge.title + " " + challenge.description).toLowerCase();
      const wordsA = new Set(text.split(/\W+/).filter(w => w.length > 3));
      const wordsB = new Set(chalText.split(/\W+/).filter(w => w.length > 3));
      
      let intersectionCount = 0;
      for (const word of wordsA) {
        if (wordsB.has(word)) intersectionCount++;
      }
      
      const unionCount = wordsA.size + wordsB.size - intersectionCount;
      const similarity = unionCount > 0 ? (intersectionCount / unionCount) : 0;
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatch = challenge;
      }
    }

    let scorePercent = Math.round(maxSimilarity * 100 * 2.2);
    if (scorePercent > 98) scorePercent = 98;
    
    if (scorePercent >= 40 && bestMatch) {
      return {
        hasDuplicate: true,
        similarity: scorePercent,
        challenge: bestMatch
      };
    }

    return { hasDuplicate: false };
  },

  // Floating chatbot dialogue using Groq AI
  askCivicAI: async (question, activeChallenges = []) => {
    try {
      const messages = [{ role: 'user', content: question }];
      const response = await groqService.generateCivicResponse(messages);
      if (response && !response.includes('temporarily unavailable')) {
        return response;
      }
    } catch (e) {
      console.warn('[aiService] Groq chat call failed, falling back:', e.message);
    }

    const q = question.toLowerCase();
    if (q.includes("road") || q.includes("monsoon") || q.includes("mud") || q.includes("pothole")) {
      return "For road damage and pothole issues, report under the 'Infrastructure' category. The Municipal Roads Department handles road maintenance. You can use the 'Generate Complaint' button to create a pre-formatted draft.";
    }
    if (q.includes("leak") || q.includes("water") || q.includes("pipe") || q.includes("drain")) {
      return "Water pipeline leakages and drainage issues are managed by the Water Supply & Sewerage Board. Provide your Ward or street landmark for rapid routing.";
    }
    if (q.includes("garbage") || q.includes("waste") || q.includes("trash")) {
      return "Public sanitation & garbage collection complaints are assigned to the Solid Waste Management Department. Attaching a photo helps officers verify the issue faster.";
    }
    return "Hello! I am your CivicSolve AI Assistant. Ask me how to report potholes, garbage dumps, water pipe leakages, or help draft a formal complaint to local authorities.";
  }
};

