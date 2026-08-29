// CivicSolve AI - OpenRouter AI integration service with keyword-driven fallback engine

const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const hasApiKey = openRouterKey && openRouterKey !== 'your-openrouter-api-key';

// Mock rule-based categorization when AI API is not active
// Now accepts an optional `userCategory` hint from the form
const runMockAnalysis = (title = "", description = "", userCategory = "") => {
  const text = (title + " " + description).toLowerCase();
  const cat = (userCategory || '').toLowerCase();
  
  // Default values
  let category = userCategory || "Infrastructure";
  let subcategory = "General Public Issue";
  let suggested_technologies = [];
  let skills_required = [];
  let severity = "medium";
  let priority_score = 55;
  let affected_population_estimate = 500;
  let possible_causes = [];

  // ── Detect severity from keywords ──
  if (text.includes("emergency") || text.includes("critical") || text.includes("death") || text.includes("fatal") || text.includes("collapse")) {
    severity = "critical"; priority_score = 92;
  } else if (text.includes("urgent") || text.includes("severe") || text.includes("unusable") || text.includes("heavy") || text.includes("blocked") || text.includes("collapsed") || text.includes("contaminat")) {
    severity = "high"; priority_score = 82;
  } else if (text.includes("broken") || text.includes("damaged") || text.includes("leaking") || text.includes("overflow") || text.includes("flood")) {
    severity = "high"; priority_score = 78;
  } else if (text.includes("minor") || text.includes("small") || text.includes("slight")) {
    severity = "low"; priority_score = 42;
  } else {
    severity = "medium"; priority_score = 62;
  }

  // ── Detect population from keywords ──
  const popMatch = text.match(/(\d[\d,]*)\s*(people|person|citizen|family|household|village|student|patient)/);
  if (popMatch) {
    affected_population_estimate = parseInt(popMatch[1].replace(/,/g, '')) || 1500;
  } else if (text.includes("village") || text.includes("rural") || text.includes("block")) {
    affected_population_estimate = 2500;
  } else if (text.includes("city") || text.includes("urban") || text.includes("ward")) {
    affected_population_estimate = 8000;
  } else {
    affected_population_estimate = 1500;
  }

  // ── Category-specific analysis ──
  const isWater = cat.includes('water') || text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('drain') || text.includes('sewage') || text.includes('drinking') || text.includes('well') || text.includes('pump');
  const isInfra = cat.includes('infra') || text.includes('road') || text.includes('street') || text.includes('bridge') || text.includes('building') || text.includes('pothole') || text.includes('footpath') || text.includes('construction');
  const isHealth = cat.includes('health') || text.includes('doctor') || text.includes('medical') || text.includes('clinic') || text.includes('hospital') || text.includes('disease') || text.includes('ambulance');
  const isEdu = cat.includes('edu') || text.includes('school') || text.includes('college') || text.includes('student') || text.includes('teacher') || text.includes('classroom');
  const isEnergy = cat.includes('energy') || text.includes('electric') || text.includes('power') || text.includes('solar') || text.includes('light') || text.includes('transformer');
  const isAgri = cat.includes('agri') || text.includes('crop') || text.includes('soil') || text.includes('farmer') || text.includes('irrigation') || text.includes('fertilizer');
  const isWaste = cat.includes('waste') || text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('recycle') || text.includes('dump') || text.includes('sanitation');
  const isSafety = cat.includes('safety') || text.includes('crime') || text.includes('safety') || text.includes('theft') || text.includes('harassment') || text.includes('fire');

  if (isWater) {
    category = userCategory || 'Water Management';
    subcategory = text.includes('drain') ? 'Stormwater & Drainage' : text.includes('pipe') ? 'Water Distribution Systems' : text.includes('well') || text.includes('pump') ? 'Rural Water Supply' : 'Water Quality & Treatment';
    possible_causes = [
      'Aging water infrastructure with unmonitored leakage points',
      'Inadequate drainage capacity during peak monsoon rainfall',
      'Lack of real-time water quality monitoring systems',
      'Contamination from nearby agricultural runoff'
    ].slice(0, 3);
    suggested_technologies = ['Acoustic leak detection sensors', 'IoT water quality monitors', 'Smart flow telemetry', 'GIS-based pipe mapping'];
    skills_required = ['IoT Sensor Integration', 'Data Analysis', 'GIS Mapping', 'Civil Engineering'];
  } else if (isInfra) {
    category = userCategory || 'Infrastructure';
    subcategory = text.includes('road') || text.includes('pothole') || text.includes('street') ? 'Transport & Roadways' : text.includes('bridge') ? 'Bridges & Flyovers' : text.includes('building') ? 'Public Buildings' : 'General Infrastructure';
    possible_causes = [
      'Inadequate drainage along pathways causing erosion',
      'Material degradation from weather and heavy vehicle load',
      'Lack of preventive maintenance scheduling',
      'Poor soil compaction beneath road surfaces'
    ].slice(0, 3);
    suggested_technologies = ['GIS mapping & road condition surveys', 'IoT pothole detection sensors', 'Satellite imagery analysis', 'Automated traffic monitoring'];
    skills_required = ['Civil Engineering', 'GIS Mapping', 'IoT Prototyping', 'Data Analysis'];
  } else if (isHealth) {
    category = userCategory || 'Healthcare';
    subcategory = text.includes('ambulance') ? 'Emergency Response' : text.includes('disease') ? 'Disease Prevention' : 'Rural Health Services';
    possible_causes = [
      'Insufficient healthcare infrastructure in remote areas',
      'Shortage of trained medical personnel',
      'Poor access to diagnostic equipment',
      'Lack of ambulance and emergency transport'
    ].slice(0, 3);
    suggested_technologies = ['Telemedicine video consultation', 'IoT health monitoring wearables', 'AI-powered symptom checker', 'Drone-based medicine delivery'];
    skills_required = ['Web Development', 'Mobile App Development', 'Healthcare Domain', 'IoT Hardware'];
  } else if (isEdu) {
    category = userCategory || 'Education';
    subcategory = text.includes('college') ? 'Higher Education' : text.includes('teacher') ? 'Teacher Training' : 'School Infrastructure';
    possible_causes = [
      'Inadequate school building infrastructure',
      'Shortage of qualified teaching staff',
      'Lack of digital learning resources',
      'Poor sanitation facilities in schools'
    ].slice(0, 3);
    suggested_technologies = ['Digital classroom platforms', 'Low-cost tablet-based learning', 'Solar-powered school kits', 'Community tutoring networks'];
    skills_required = ['Educational Technology', 'Mobile Development', 'Content Design', 'Community Organizing'];
  } else if (isEnergy) {
    category = userCategory || 'Energy & Power';
    subcategory = text.includes('solar') ? 'Renewable Energy' : text.includes('light') ? 'Street Lighting' : 'Power Distribution';
    possible_causes = [
      'Overloaded transformers in underserved areas',
      'Aging power distribution lines',
      'Lack of renewable energy alternatives',
      'Frequent grid outages during peak demand'
    ].slice(0, 3);
    suggested_technologies = ['Solar microgrid systems', 'IoT energy monitoring', 'Smart meter deployment', 'Battery storage solutions'];
    skills_required = ['Electrical Engineering', 'Solar System Design', 'IoT Integration', 'Energy Auditing'];
  } else if (isAgri) {
    category = userCategory || 'Agriculture';
    subcategory = text.includes('irrigation') ? 'Irrigation Systems' : text.includes('soil') ? 'Soil Health' : 'Crop Management';
    possible_causes = [
      'Lack of affordable irrigation infrastructure',
      'Poor soil quality and nutrient depletion',
      'Inadequate market linkage for small farmers',
      'Climate unpredictability affecting crop cycles'
    ].slice(0, 3);
    suggested_technologies = ['Soil moisture sensors', 'Drone-based crop monitoring', 'Weather prediction APIs', 'Mobile market price platforms'];
    skills_required = ['Agronomy Basics', 'IoT Sensors', 'Mobile Development', 'Data Analysis'];
  } else if (isWaste) {
    category = userCategory || 'Waste Management';
    subcategory = text.includes('recycle') ? 'Recycling Programs' : text.includes('sanitation') ? 'Sanitation Services' : 'Solid Waste Collection';
    possible_causes = [
      'Inefficient waste collection routing',
      'Lack of segregated waste bins',
      'Overflowing community dumpsites',
      'Insufficient recycling awareness'
    ].slice(0, 3);
    suggested_technologies = ['Smart waste bin sensors', 'Route optimization algorithms', 'Waste-to-energy conversion', 'Community composting units'];
    skills_required = ['IoT Hardware', 'Route Optimization', 'Environmental Science', 'Community Outreach'];
  } else if (isSafety) {
    category = userCategory || 'Public Safety';
    subcategory = text.includes('fire') ? 'Fire Safety' : text.includes('crime') ? 'Crime Prevention' : 'General Safety';
    possible_causes = [
      'Inadequate street lighting in vulnerable areas',
      'Lack of surveillance infrastructure',
      'Slow emergency response times',
      'Community safety awareness gaps'
    ].slice(0, 3);
    suggested_technologies = ['CCTV with AI analytics', 'Emergency SOS mobile apps', 'Smart street lighting', 'Community alert networks'];
    skills_required = ['Software Development', 'AI/ML', 'Hardware Integration', 'Community Management'];
  } else {
    // Fallback: use the user-selected category as-is with generic analysis
    category = userCategory || 'Infrastructure';
    subcategory = 'General Public Issue';
    possible_causes = [
      'Insufficient monitoring and maintenance infrastructure',
      'Resource allocation gaps in the affected area',
      'Lack of community-driven reporting mechanisms'
    ];
    suggested_technologies = ['IoT monitoring sensors', 'Mobile reporting applications', 'Data analytics dashboards', 'GIS spatial mapping'];
    skills_required = ['Full-Stack Development', 'IoT Integration', 'Data Analysis', 'Community Engagement'];
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
  // userCategory: optional category hint from the form selection
  analyzeChallenge: async (title, description, userCategory = '') => {
    try {
      const res = await groqService.classifyComplaint(title, description);
      if (res && res.category && res.category !== 'Infrastructure') {
        // Use Groq's classification only if it's specific (not the generic fallback)
        return {
          category: res.category,
          subcategory: res.subcategory || 'General Maintenance',
          severity: res.severity || 'medium',
          priority_score: res.priority_score || 70,
          affected_population_estimate: res.affected_population_estimate || 1500,
          possible_causes: res.possible_causes || ['Infrastructure asset degradation', 'Environmental factor strain'],
          suggested_technologies: res.suggested_technologies || ['GIS Mapping', 'IoT Telemetry Nodes', 'Cloud Telemetry'],
          skills_required: res.skills_required || ['GIS', 'Civil Engineering', 'System Integration']
        };
      }
    } catch (e) {
      console.warn('[aiService] Groq classification failed, running local analysis:', e.message);
    }
    // Fall back to enhanced local analysis with user's category hint
    return runMockAnalysis(title, description, userCategory);
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

