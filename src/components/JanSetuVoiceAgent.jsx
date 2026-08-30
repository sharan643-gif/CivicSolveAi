import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Bot, User, FileText, Sparkles, Phone, PhoneOff } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';

// District coordinate database for Jharkhand
const DISTRICT_COORDS = {
  'ranchi': { lat: '23.3441', lng: '85.3090' },
  'dumka': { lat: '24.2686', lng: '87.2486' },
  'dhanbad': { lat: '23.7957', lng: '86.4304' },
  'east singhbhum': { lat: '22.8046', lng: '86.2029' },
  'jamshedpur': { lat: '22.8046', lng: '86.2029' },
  'bokaro': { lat: '23.6693', lng: '86.1511' },
  'deoghar': { lat: '24.4826', lng: '86.7003' },
  'hazaribagh': { lat: '23.9966', lng: '85.3637' },
  'giridih': { lat: '24.1856', lng: '86.3094' },
  'palamu': { lat: '24.0374', lng: '84.0725' },
  'west singhbhum': { lat: '22.5516', lng: '85.8083' },
  'chaibasa': { lat: '22.5516', lng: '85.8083' },
  'godda': { lat: '24.8327', lng: '87.2144' },
  'sahebganj': { lat: '25.2425', lng: '87.6433' },
  'pakur': { lat: '24.6340', lng: '87.8491' },
  'jamtara': { lat: '23.9629', lng: '86.8029' },
  'ramgarh': { lat: '23.6332', lng: '85.5149' },
  'lohardaga': { lat: '23.4354', lng: '84.6803' },
  'gumla': { lat: '23.0436', lng: '84.5414' },
  'simdega': { lat: '22.6167', lng: '84.5000' },
  'latehar': { lat: '23.7436', lng: '84.4983' },
  'garhwa': { lat: '24.1611', lng: '83.8119' },
  'koderma': { lat: '24.4674', lng: '85.5939' },
  'chatra': { lat: '24.2092', lng: '84.8711' },
  'khunti': { lat: '23.0723', lng: '85.2798' },
};

// ─── Humanize text for TTS (add natural pauses, filler words, breaths) ───────
function humanizeForSpeech(text, lang = 'en-IN') {
  if (!text) return '';
  let t = text;
  t = t.replace(/\.\s+/g, '. ... ');
  t = t.replace(/\!\s+/g, '! ... ');
  t = t.replace(/\?\s+/g, '? ... ');
  t = t.replace(/\,\s+/g, ', ... ');
  t = t.replace(/\s*[—–]\s*/g, ' ... ');
  if (lang === 'en-IN') {
    t = t.replace(/\b(So|Well|Okay|Alright|Hmm|Right)\b/gi, '$1, ...');
  }
  return t.trim();
}

// ─── Pick the most natural-sounding voice ─────────────────────────────────────
function pickBestVoice(lang = 'en-IN') {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  if (lang === 'hi-IN') {
    return voices.find(v => v.lang.includes('hi-IN') && (v.name.includes('Swara') || v.name.includes('Kalpana') || v.name.includes('Google') || v.name.includes('Natural')))
      || voices.find(v => v.lang.includes('hi'))
      || voices.find(v => v.lang.includes('en-IN'));
  }

  const preferred = [
    'Google UK English Female', 'Google UK English Male',
    'Google US English', 'Microsoft Aria', 'Microsoft Zira',
    'Samantha', 'Karen', 'Daniel', 'Ava',
    'Natural', 'Premium', 'Neural',
  ];

  for (const name of preferred) {
    const found = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
    if (found) return found;
  }

  return voices.find(v => v.lang.startsWith('en-IN'))
    || voices.find(v => v.lang.startsWith('en'))
    || voices[0];
}

// ─── Check if user response is just an acknowledgment (not actual info) ──────
const ACKNOWLEDGMENT_PATTERNS = /^(yes|yeah|yep|ok|okay|sure|start|begin|hello|hi|namaste|ji|haan|acha|thik hai|chal|start karo|batao|bataiye|haan batao|sure|please start|yes please|go ahead|i'm ready|i am ready)$/i;
const isAcknowledgmentOnly = (text) => {
  if (!text) return true;
  const trimmed = text.trim();
  if (trimmed.length < 4) return true;
  return ACKNOWLEDGMENT_PATTERNS.test(trimmed);
};

export default function JanSetuVoiceAgent({ isOpen, onClose, onNavigate, onAutoFillReport }) {
  // ─── Voice & Speech States ───────────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Interview state
  const [conversationLog, setConversationLog] = useState([]);
  const [phase, setPhase] = useState('intro');
  const [generatedData, setGeneratedData] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── Refs ────────────────────────────────────────────────────────────────
  const answersRef = useRef({});
  const recognitionRef = useRef(null);
  const abortRef = useRef(false);
  const isRunningRef = useRef(false);
  const speakingRef = useRef(false);
  const liveModeRef = useRef(false);
  const conversationHistoryRef = useRef([]);
  const turnCountRef = useRef(0);
  const collectedFieldsRef = useRef(new Set());

  // ─── Language Detection ───────────────────────────────────────────────────
  const detectLanguage = (text) => {
    if (!text) return null;
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) return 'hi-IN';
    const lower = text.toLowerCase();
    const hindiWords = ['namaste', 'paani', 'sadak', 'bijli', 'kachra', 'nala', 'gao', 'jila', 'bhaiya', 'nahi', 'karo', 'hai', 'kripya', 'madad'];
    if (hindiWords.some(w => lower.includes(w))) return 'hi-IN';
    return 'en-IN';
  };

  // ─── Speech Recognition Setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (!event.results[i].isFinal) {
          interim += event.results[i][0].transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      console.warn('[VoiceAgent] Recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access denied. Please enable microphone permissions.');
      } else if (event.error === 'network') {
        setErrorMsg('Network issue with voice recognition.');
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (liveModeRef.current && !abortRef.current && !speakingRef.current) {
        setTimeout(() => {
          try {
            recognition.lang = selectedLanguage;
            recognition.start();
          } catch (e) {}
        }, 150);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (e) {}
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  // ─── High-Quality TTS with Human-Like Voice ────────────────────────────────
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text) { resolve(); return; }

      window.speechSynthesis.cancel();
      speakingRef.current = true;
      setIsSpeaking(true);

      const humanText = humanizeForSpeech(text, selectedLanguage);
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';

      const voice = pickBestVoice(selectedLanguage);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => { setIsSpeaking(true); speakingRef.current = true; };
      utterance.onend = () => { setIsSpeaking(false); speakingRef.current = false; resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); speakingRef.current = false; resolve(); };

      window.speechSynthesis.speak(utterance);
    });
  }, [selectedLanguage]);

  // ─── Start / Stop Listening ────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('[VoiceAgent] Start listening warning:', e.message);
    }
  }, [selectedLanguage]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {}
  }, []);

  // ─── Collect Final Transcript ──────────────────────────────────────────────
  const collectTranscript = useCallback(() => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) { resolve(''); return; }
      const finalParts = [];
      let resolved = false;

      const onResult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalParts.push(event.results[i][0].transcript);
          }
        }
      };

      const onEnd = () => {
        if (!resolved) {
          resolved = true;
          recognitionRef.current?.removeEventListener('result', onResult);
          recognitionRef.current?.removeEventListener('end', onEnd);
          resolve(finalParts.join(' ').trim());
        }
      };

      recognitionRef.current?.addEventListener('result', onResult);
      recognitionRef.current?.addEventListener('end', onEnd);

      // Auto resolve if quiet for 15 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          recognitionRef.current?.removeEventListener('result', onResult);
          recognitionRef.current?.removeEventListener('end', onEnd);
          try { recognitionRef.current?.stop(); } catch (e) {}
          resolve(finalParts.join(' ').trim());
        }
      }, 15000);
    });
  }, []);

  // ─── Fallback Local Extractor ──────────────────────────────────────────────
  const extractLocalReport = (combinedText) => {
    const text = (combinedText || '').toLowerCase();
    let category = 'Infrastructure';
    if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('paani')) category = 'Water Management';
    else if (text.includes('garbage') || text.includes('waste') || text.includes('kachra')) category = 'Waste Management';
    else if (text.includes('light') || text.includes('electric') || text.includes('bijli')) category = 'Energy & Power';
    else if (text.includes('health') || text.includes('hospital') || text.includes('doctor')) category = 'Healthcare & Sanitation';
    else if (text.includes('school') || text.includes('teacher')) category = 'Education & Literacy';
    else if (text.includes('farm') || text.includes('kisan')) category = 'Agriculture & Rural';
    else if (text.includes('traffic') || text.includes('road')) category = 'Urban Transport & Traffic';

    let severity = 'medium';
    if (text.includes('emergency') || text.includes('critical') || text.includes('collapse')) severity = 'critical';
    else if (text.includes('urgent') || text.includes('severe')) severity = 'high';

    let district = 'Ranchi', lat = '23.3441', lng = '85.3090';
    for (const [dName, coords] of Object.entries(DISTRICT_COORDS)) {
      if (text.includes(dName)) { district = dName.charAt(0).toUpperCase() + dName.slice(1); lat = coords.lat; lng = coords.lng; break; }
    }

    let affectedPop = 1500;
    const popMatch = text.match(/(\d[\d,]*)\s*(people|person|citizen|family|village)/);
    if (popMatch) affectedPop = parseInt(popMatch[1].replace(/,/g, '')) || 1500;

    let duration = '2 months';
    if (text.includes('week')) duration = '2 weeks';
    else if (text.includes('month')) duration = '3 months';
    else if (text.includes('year')) duration = '1 year';

    return {
      title: combinedText.slice(0, 55) || 'Civic Infrastructure Grievance',
      description: combinedText || 'Civic problem reported via JanSetu Voice Assistant.',
      category, subcategory: 'Public Utility Maintenance', district,
      location: `${district} Ward / Block Area`, lat, lng, severity,
      affected_population: affectedPop,
      who_affected: 'Local community residents',
      duration,
      spoken_summary: `I have drafted your grievance report for ${category} in ${district}. It is ready for submission.`
    };
  };

  // ─── GEMINI CONVERSATION ENGINE: Decides what to ask next ─────────────────
  // This is the brain — Gemini analyzes everything said so far and decides:
  // 1. Has the user described a real problem? (vs just "yes, start")
  // 2. What info is still missing?
  // 3. What should the AI say next?
  const geminiConversationTurn = useCallback(async (userMessage, history, lang) => {
    const langLabel = lang === 'hi-IN' ? 'Hindi' : 'English';
    const collectedInfo = Object.entries(answersRef.current)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n') || '(nothing collected yet)';

    const prompt = `You are JanSetu AI, a warm, intelligent civic grievance voice assistant for the Government of India. You are having a LIVE voice call with a citizen.

CRITICAL RULES:
1. The citizen may say things like "yes, please start" or "hello" — these are NOT problem descriptions. If the user hasn't described an actual civic problem yet, you MUST ask them to describe what's wrong.
2. Never assume or fabricate a problem. Wait for the citizen to actually tell you what's happening.
3. Be conversational, warm, and natural — like a helpful government service agent on a phone call.
4. If the user gives a RICH description (10+ words about an actual issue), acknowledge what they said and ask about missing details.
5. If the user gives a SHORT or EMPTY response, or just an acknowledgment, gently ask them to describe the problem.
6. Speak in ${langLabel}.

Information collected so far:
${collectedInfo}

Conversation history:
${history.map(m => `${m.role === 'agent' ? 'AI' : 'Citizen'}: ${m.text}`).join('\n')}

Citizen just said: "${userMessage}"

Your task: Decide the NEXT action. Return ONLY valid JSON:
{
  "intent": "greeting_ack" | "problem_described" | "location_given" | "details_given" | "empty_response" | "needs_clarification" | "ready_for_report",
  "userMessageSummary": "Brief 3-5 word summary of what the citizen said",
  "extractedFields": {
    "raw_problem": "Extracted problem description or null if not yet described",
    "location": "Extracted location/district/area or null",
    "who_affected": "Who is affected or null",
    "duration": "How long or null",
    "severity": "low|medium|high|critical or null"
  },
  "missingFields": ["list of still-missing critical fields"],
  "aiResponse": "Your natural conversational response to the citizen. Be warm and specific.",
  "isReadyForReport": false,
  "confidence": 0.0
}

Rules for aiResponse:
- If intent is "empty_response" or "greeting_ack": Say something like "I understand you'd like to report a civic issue. Could you please tell me what's happening? For example, is there a broken road, water leak, garbage problem, or something else?"
- If intent is "problem_described": Acknowledge warmly, then ask for the next most important missing detail (location, affected people, duration)
- If intent is "ready_for_report": Say "I now have all the information I need. Let me prepare your official grievance report."
- Keep responses SHORT (1-2 sentences max) since this is voice.
- Be encouraging and helpful, not robotic.`;

    try {
      const rawAi = await geminiService.generateCivicResponse([
        { role: 'system', content: `You are a warm civic intake AI having a live voice call. Respond in ${langLabel}. Output strict JSON only.` },
        { role: 'user', content: prompt }
      ]);
      const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (err) {
      console.warn('[VoiceAgent] Gemini turn error:', err);
    }

    // ── Fallback: Local intelligent response ──
    const msgLower = (userMessage || '').toLowerCase();
    const hasProblem = msgLower.length > 15 && !isAcknowledgmentOnly(userMessage);

    if (!hasProblem) {
      return {
        intent: 'empty_response',
        userMessageSummary: userMessage || '(empty)',
        extractedFields: {},
        missingFields: ['raw_problem'],
        aiResponse: selectedLanguage === 'hi-IN'
          ? 'जी, मैं समझ गई। कृपया बताइए — आपके इलाके में क्या समस्या है? जैसे सड़क टूटी है, पानी का पाइप फूटा है, या कचरा जमा है?'
          : 'I understand. Please tell me — what is the civic problem in your area? For example, a broken road, water leak, garbage dump, or something else?',
        isReadyForReport: false,
        confidence: 0.5
      };
    }

    // Extract what we can locally
    const extracted = {};
    if (hasProblem) extracted.raw_problem = userMessage;

    // Location extraction
    for (const dName of Object.keys(DISTRICT_COORDS)) {
      if (msgLower.includes(dName)) {
        extracted.location = dName.charAt(0).toUpperCase() + dName.slice(1);
        break;
      }
    }

    // Severity
    if (msgLower.includes('emergency') || msgLower.includes('critical') || msgLower.includes('dangerous') || msgLower.includes('collapse')) extracted.severity = 'critical';
    else if (msgLower.includes('urgent') || msgLower.includes('severe')) extracted.severity = 'high';

    // Duration
    if (msgLower.includes('week')) extracted.duration = '2 weeks';
    else if (msgLower.includes('month')) extracted.duration = '3 months';
    else if (msgLower.includes('year')) extracted.duration = '1 year';

    // Who affected
    const popMatch = msgLower.match(/(\d[\d,]*)\s*(people|person|family|village|student)/);
    if (popMatch) extracted.who_affected = `${popMatch[1]} ${popMatch[2]}`;

    const missing = [];
    if (!extracted.raw_problem) missing.push('raw_problem');
    if (!extracted.location) missing.push('location');
    if (!extracted.who_affected) missing.push('who_affected');
    if (!extracted.duration) missing.push('duration');

    const followUps = {
      'location': selectedLanguage === 'hi-IN'
        ? 'बहुत अच्छा! यह किस जिले या इलाके में है?'
        : 'Great! Which district or area is this in?',
      'who_affected': selectedLanguage === 'hi-IN'
        ? 'समझ गई। इससे मुख्य रूप से कौन प्रभावित है?'
        : 'Got it. Who is mainly affected by this?',
      'duration': selectedLanguage === 'hi-IN'
        ? 'यह कब से चल रहा है?'
        : 'How long has this been going on?',
      'raw_problem': selectedLanguage === 'hi-IN'
        ? 'कृपया थोड़ा और विस्तार से बताएं — ठीक क्या हो रहा है?'
        : 'Could you describe a bit more about what exactly is happening?',
    };

    const isReady = missing.length === 0;

    return {
      intent: isReady ? 'ready_for_report' : 'problem_described',
      userMessageSummary: userMessage.slice(0, 30),
      extractedFields: extracted,
      missingFields: missing,
      aiResponse: isReady
        ? (selectedLanguage === 'hi-IN' ? 'बहुत बढ़िया! अब मेरे पास सारी जानकारी है। रिपोर्ट तैयार कर रही हूँ...' : 'Perfect! I have all the information I need. Preparing your report now...')
        : (followUps[missing[0]] || 'Could you share more details?'),
      isReadyForReport: isReady,
      confidence: hasProblem ? 0.7 : 0.4
    };
  }, [selectedLanguage]);

  // ─── Generate Structured Report with Gemini AI ─────────────────────────────
  const generateReport = useCallback(async () => {
    setIsProcessing(true);
    setPhase('summary');
    stopListening();

    const answers = answersRef.current;
    const allText = Object.values(answers).filter(Boolean).join(' ');

    const prompt = `You are the JanSetu Civic Voice AI Parser.
A citizen has spoken the following answers regarding their civic issue:
${JSON.stringify(answers, null, 2)}

Combined Citizen Voice Transcript:
"${allText}"

Extract and return a valid JSON object matching the exact schema below:
{
  "title": "Concise professional 5-8 word problem title",
  "description": "Clear, detailed 2-3 sentence problem statement",
  "category": "Water Management | Infrastructure | Agriculture & Rural | Healthcare & Sanitation | Education & Literacy | Energy & Power | Environment & Pollution | Public Safety & Disaster | Digital Services & Governance | Urban Transport & Traffic",
  "subcategory": "Specific sub-sector",
  "district": "Extracted Jharkhand district name",
  "location": "Specific street, village, block, ward or landmark",
  "lat": "Approximate latitude string",
  "lng": "Approximate longitude string",
  "severity": "low | medium | high | critical",
  "affected_population": number,
  "who_affected": "Who is affected",
  "duration": "Duration",
  "spoken_summary": "Warm 1-sentence confirmation for the citizen"
}`;

    let parsedData = null;
    try {
      const rawAi = await geminiService.generateCivicResponse([
        { role: 'system', content: 'You are JanSetu Voice AI parser. Output strict JSON only.' },
        { role: 'user', content: prompt }
      ]);
      const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.warn('[VoiceAgent] Gemini parse error:', err);
    }

    if (!parsedData || !parsedData.title) parsedData = extractLocalReport(allText);

    const distKey = (parsedData.district || '').toLowerCase().trim();
    if (DISTRICT_COORDS[distKey]) {
      if (!parsedData.lat) parsedData.lat = DISTRICT_COORDS[distKey].lat;
      if (!parsedData.lng) parsedData.lng = DISTRICT_COORDS[distKey].lng;
    } else {
      if (!parsedData.lat) parsedData.lat = '23.3441';
      if (!parsedData.lng) parsedData.lng = '85.3090';
    }

    setGeneratedData(parsedData);
    setIsProcessing(false);

    const summaryMsg = `✨ Report Prepared Successfully!\n📌 Title: ${parsedData.title}\n📂 Category: ${parsedData.category}\n📍 Location: ${parsedData.location} (${parsedData.district})\n👥 Affected: ${parsedData.who_affected} (~${parsedData.affected_population} people)\n⚠️ Severity: ${parsedData.severity.toUpperCase()}\n⏱️ Duration: ${parsedData.duration}`;
    setConversationLog(prev => [...prev, { role: 'agent', text: summaryMsg }]);

    const speech = parsedData.spoken_summary || `Report prepared for ${parsedData.title} in ${parsedData.district}. Tap Auto-Fill to submit.`;
    await speak(speech);
  }, [speak, stopListening]);

  // ═══ FULLY ADAPTIVE GEMINI LIVE CONVERSATION ════════════════════════════════
  const startLiveConversation = useCallback(async () => {
    liveModeRef.current = true;
    answersRef.current = {};
    conversationHistoryRef.current = [];
    collectedFieldsRef.current = new Set();
    turnCountRef.current = 0;
    setConversationLog([]);
    setPhase('questioning');
    setGeneratedData(null);
    setTurnCount(0);
    abortRef.current = false;
    isRunningRef.current = false;

    const MAX_TURNS = 8; // Safety limit to prevent infinite loops

    // ── GREETING: Say hello and immediately listen ──
    const greeting = selectedLanguage === 'hi-IN'
      ? "नमस्ते! मैं जनसेतु वॉयस असिस्टेंट हूँ। बताइए आपके इलाके में क्या समस्या है? आप खुलकर बोलिए।"
      : "Hello! I'm JanSetu Voice Assistant. Tell me about the civic problem in your area — what's happening, where, and who's affected? Just speak naturally!";

    setConversationLog([{ role: 'agent', text: greeting }]);
    conversationHistoryRef.current.push({ role: 'agent', text: greeting });
    stopListening();
    await speak(greeting);
    if (abortRef.current) { isRunningRef.current = false; return; }

    // ── MAIN LOOP: Listen → Analyze → Respond → Repeat ──
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      if (abortRef.current || !liveModeRef.current) break;

      turnCountRef.current = turn + 1;
      setTurnCount(turn + 1);

      // 1. Start listening
      setInterimText('');
      startListening();

      // 2. Wait for user to speak
      const userMessage = await collectTranscript();
      stopListening();
      setInterimText('');

      if (abortRef.current) break;

      // 3. Handle empty / acknowledgment-only responses
      const isEmpty = !userMessage.trim() || isAcknowledgmentOnly(userMessage);
      const displayMsg = isEmpty ? '(waiting for response...)' : userMessage;
      setConversationLog(prev => [...prev, { role: 'user', text: displayMsg }]);
      conversationHistoryRef.current.push({ role: 'user', text: displayMsg });

      // 4. Language detection on first real response
      if (turn === 0 && userMessage.trim()) {
        const detected = detectLanguage(userMessage);
        if (detected && detected !== selectedLanguage) {
          setDetectedLang(detected);
          setSelectedLanguage(detected);
        }
      }

      // 5. Let Gemini analyze and decide what to say next
      setIsThinking(true);
      const analysis = await geminiConversationTurn(
        isEmpty ? '' : userMessage,
        conversationHistoryRef.current,
        detectedLang || selectedLanguage
      );
      setIsThinking(false);

      if (abortRef.current) break;

      // 6. Extract any fields Gemini identified
      if (analysis.extractedFields) {
        for (const [field, value] of Object.entries(analysis.extractedFields)) {
          if (value && value !== null) {
            answersRef.current[field] = value;
            collectedFieldsRef.current.add(field);
          }
        }
      }

      // 7. Speak the AI's response
      setConversationLog(prev => [...prev, { role: 'agent', text: analysis.aiResponse }]);
      conversationHistoryRef.current.push({ role: 'agent', text: analysis.aiResponse });
      await speak(analysis.aiResponse);
      if (abortRef.current) break;

      // 8. Check if we're ready for report
      if (analysis.isReadyForReport) {
        // Small pause for natural feel
        await new Promise(r => setTimeout(r, 500));
        break;
      }

      // 9. If confidence is very low and we've had 3+ turns, try to wrap up
      if (turn >= 2 && collectedFieldsRef.current.has('raw_problem')) {
        // We have the problem — check if we can generate with what we have
        const hasMinimum = answersRef.current.raw_problem;
        if (hasMinimum && turn >= 3) {
          const wrapUp = selectedLanguage === 'hi-IN'
            ? "ठीक है, मेरे पास जो जानकारी है उसके आधार पर रिपोर्ट तैयार करती हूँ।"
            : "Alright, let me prepare your report with the information I have.";
          setConversationLog(prev => [...prev, { role: 'agent', text: wrapUp }]);
          await speak(wrapUp);
          break;
        }
      }
    }

    // ── GENERATE REPORT ──
    if (!abortRef.current && liveModeRef.current) {
      // If we never got a problem description, ask one more time
      if (!answersRef.current.raw_problem || answersRef.current.raw_problem.length < 5) {
        const lastChance = selectedLanguage === 'hi-IN'
          ? "मुझे आपकी समस्या के बारे में और बताइए — ठीक क्या हो रहा है?"
          : "I still need to understand the problem. What exactly is happening?";
        setConversationLog(prev => [...prev, { role: 'agent', text: lastChance }]);
        await speak(lastChance);
        startListening();
        const lastAnswer = await collectTranscript();
        stopListening();
        if (lastAnswer.trim() && !isAcknowledgmentOnly(lastAnswer)) {
          setConversationLog(prev => [...prev, { role: 'user', text: lastAnswer }]);
          answersRef.current.raw_problem = lastAnswer;
          const thinkingMsg = selectedLanguage === 'hi-IN' ? "समझ गई! रिपोर्ट तैयार कर रही हूँ..." : "Got it! Preparing your report...";
          setConversationLog(prev => [...prev, { role: 'agent', text: thinkingMsg }]);
          await speak(thinkingMsg);
        }
      }

      await generateReport();
    }
    isRunningRef.current = false;
  }, [selectedLanguage, detectedLang, speak, startListening, stopListening, collectTranscript, generateReport, geminiConversationTurn]);

  // ─── Modal Open / Close Lifecycle ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      }

      answersRef.current = {};
      conversationHistoryRef.current = [];
      collectedFieldsRef.current = new Set();
      turnCountRef.current = 0;
      setConversationLog([]);
      setPhase('intro');
      setGeneratedData(null);
      setInterimText('');
      setErrorMsg('');
      setDetectedLang(null);
      setTurnCount(0);
      liveModeRef.current = false;
      abortRef.current = false;
      isRunningRef.current = false;

      const timer = setTimeout(() => startLiveConversation(), 600);

      return () => {
        clearTimeout(timer);
        abortRef.current = true;
        liveModeRef.current = false;
        isRunningRef.current = false;
        stopListening();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    } else {
      abortRef.current = true;
      liveModeRef.current = false;
      isRunningRef.current = false;
      stopListening();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // ─── Handle Apply to Form ──────────────────────────────────────────────────
  const handleApplyToForm = () => {
    if (generatedData && onAutoFillReport) {
      onAutoFillReport(generatedData);
      onClose();
      onNavigate('report');
    }
  };

  // ─── Skip to End ───────────────────────────────────────────────────────────
  const handleSkipToEnd = () => {
    abortRef.current = true;
    liveModeRef.current = false;
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    generateReport();
  };

  // ─── Stop Live Session ─────────────────────────────────────────────────────
  const handleStopLive = () => {
    abortRef.current = true;
    liveModeRef.current = false;
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  if (!isOpen) return null;

  const progress = phase === 'summary' ? 100 : Math.min(Math.round((turnCount / 5) * 100), 90);

  // ─── Orb State ─────────────────────────────────────────────────────────────
  const orbState = isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'idle';
  const orbColor = {
    speaking: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    listening: 'linear-gradient(135deg, #FF6200 0%, #dc2626 100%)',
    thinking: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    idle: 'linear-gradient(135deg, #003087 0%, #0284c7 100%)',
  }[orbState];

  const orbShadow = {
    speaking: '0 0 60px rgba(16,185,129,0.8), 0 0 120px rgba(16,185,129,0.3)',
    listening: '0 0 60px rgba(255,98,0,0.8), 0 0 120px rgba(255,98,0,0.3)',
    thinking: '0 0 60px rgba(139,92,246,0.8), 0 0 120px rgba(139,92,246,0.3)',
    idle: '0 0 30px rgba(0,48,135,0.4)',
  }[orbState];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(2, 11, 25, 0.85)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px', fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{
        background: '#ffffff', border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '20px', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 70px rgba(0, 15, 45, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '94vh',
        position: 'relative',
      }}>
        {/* Flag Accent */}
        <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051630 0%, #020b18 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          padding: isMobile ? '10px 10px' : '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: isMobile ? '8px' : '10px',
              background: orbColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: orbShadow, transition: 'all 0.4s ease',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              {isListening ? <Mic size={18} color="#fff" /> : isSpeaking ? <Volume2 size={18} color="#fff" /> : isThinking ? <RefreshCw size={18} color="#fff" className="spin" /> : <Bot size={18} color="#fff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.12)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>Govt of India · JanSetu AI</span>
                <span style={{ fontSize: '0.55rem', background: 'linear-gradient(135deg, #FF6200, #d97706)', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800, boxShadow: '0 2px 5px rgba(255,98,0,0.4)' }}>Gemini AI</span>
              </div>
              <h3 style={{ fontSize: isMobile ? '0.8rem' : '0.95rem', fontWeight: 800, margin: '2px 0 0', color: '#fff', letterSpacing: '-0.01em' }}>JanSetu Live</h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', color: '#fff', fontSize: '0.7rem', padding: '4px 6px', outline: 'none', cursor: 'pointer', fontWeight: 700 }}>
              <option value="en-IN" style={{ color: '#0f172a' }}>English</option>
              <option value="hi-IN" style={{ color: '#0f172a' }}>हिन्दी</option>
            </select>
            <button onClick={onClose} title="Close" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', color: '#fff', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: isMobile ? '6px 10px' : '8px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: orbState === 'listening' ? '#FF6200' : orbState === 'speaking' ? '#10b981' : orbState === 'thinking' ? '#8b5cf6' : '#0284c7', boxShadow: orbState !== 'idle' ? `0 0 10px ${orbState === 'listening' ? '#FF6200' : orbState === 'speaking' ? '#10b981' : '#8b5cf6'}` : 'none', display: 'inline-block', animation: orbState !== 'idle' ? 'pulse 1.5s infinite' : 'none' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>
                {isListening ? '🎙️ Listening — Speak Now' : isSpeaking ? '🔊 AI Speaking...' : isThinking ? '🧠 Thinking...' : phase === 'summary' ? '✨ Report Ready' : 'Initializing...'}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#003087', fontWeight: 800 }}>
              {phase === 'summary' ? '100%' : `${Math.min(turnCount + 1, 5)}/5`}
            </span>
          </div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: phase === 'summary' ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #FF6200, #d97706)', borderRadius: '10px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 8px rgba(255,98,0,0.5)' }} />
          </div>
        </div>

        {/* ═══ GEMINI LIVE ORB ═══ */}
        {phase === 'questioning' && (
          <div style={{
            background: orbState === 'listening' ? 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)' : orbState === 'speaking' ? 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)' : orbState === 'thinking' ? 'linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)' : '#ffffff',
            padding: isMobile ? '16px 16px' : '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.4s ease',
          }}>
            <div style={{ position: 'relative', width: isMobile ? '90px' : '120px', height: isMobile ? '90px' : '120px', marginBottom: isMobile ? '10px' : '16px' }}>
              {(orbState === 'listening' || orbState === 'speaking') && (
                <>
                  <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: `2px solid ${orbState === 'listening' ? 'rgba(255,98,0,0.3)' : 'rgba(16,185,129,0.3)'}`, animation: 'orbPulse 2s infinite ease-out' }} />
                  <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: `1px solid ${orbState === 'listening' ? 'rgba(255,98,0,0.15)' : 'rgba(16,185,129,0.15)'}`, animation: 'orbPulse 2s infinite ease-out 0.5s' }} />
                </>
              )}
              <div style={{
                width: isMobile ? '90px' : '120px', height: isMobile ? '90px' : '120px', borderRadius: '50%', background: orbColor, boxShadow: orbShadow,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease',
                animation: orbState === 'speaking' ? 'orbBreathe 1.5s infinite ease-in-out' : orbState === 'thinking' ? 'orbSpin 3s infinite linear' : 'none',
                cursor: 'pointer',
              }} onClick={isListening ? stopListening : startListening}>
                {isListening && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px' }}>
                    {[8, 20, 14, 28, 10, 24, 12, 26, 8, 20, 14, 22, 10, 18].map((h, idx) => (
                      <div key={idx} style={{ width: '3px', height: `${h}px`, background: '#fff', borderRadius: '2px', animation: `waveBar 0.4s infinite alternate ease-in-out ${idx * 0.05}s` }} />
                    ))}
                  </div>
                )}
                {isSpeaking && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '40px' }}>
                    {[10, 18, 12, 24, 14, 20, 16, 22, 10, 18, 14, 20, 12, 16].map((h, idx) => (
                      <div key={idx} style={{ width: '3px', height: `${h}px`, background: 'rgba(255,255,255,0.9)', borderRadius: '2px', animation: `waveBar 0.5s infinite alternate ease-in-out ${idx * 0.06}s` }} />
                    ))}
                  </div>
                )}
                {isThinking && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: `thinkingDot 1.2s infinite ease-in-out ${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
                {!isListening && !isSpeaking && !isThinking && <Mic size={36} color="#fff" />}
              </div>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isListening ? '#FF6200' : isSpeaking ? '#059669' : '#64748b', textAlign: 'center' }}>
              {isListening ? 'Listening... Tap orb to stop' : isSpeaking ? 'Speaking naturally...' : isThinking ? 'Processing...' : 'Tap to start speaking'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
              {isSpeaking ? 'Voice response is live' : 'Conversational voice mode active'}
            </div>
            {isListening && interimText && (
              <div style={{ marginTop: '10px', padding: '8px 14px', background: 'rgba(255,98,0,0.08)', borderRadius: '10px', border: '1px dashed rgba(255,98,0,0.4)', fontSize: '0.8rem', color: '#c2410c', fontWeight: 600, fontStyle: 'italic', maxWidth: '90%', textAlign: 'center' }}>
                "{interimText}..."
              </div>
            )}
          </div>
        )}

        {/* ═══ CONVERSATION LOG ═══ */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: isMobile ? '12px 10px' : '16px',
          display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '10px',
          minHeight: phase === 'questioning' ? (isMobile ? '80px' : '120px') : (isMobile ? '180px' : '260px'), maxHeight: phase === 'questioning' ? (isMobile ? '120px' : '160px') : (isMobile ? '280px' : '360px'),
          background: '#f1f5f9', backgroundImage: 'radial-gradient(rgba(0, 48, 135, 0.03) 1px, transparent 1px)', backgroundSize: '16px 16px',
        }}>
          {conversationLog.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 48, 135, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '1px solid rgba(0, 48, 135, 0.15)' }}>
                <Bot size={24} color="#003087" />
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>Connecting to JanSetu Live...</p>
            </div>
          )}

          {conversationLog.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end', gap: '8px', animation: 'fadeIn 0.2s ease' }}>
              {msg.role === 'agent' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #003087, #001d5a)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,48,135,0.2)' }}>
                  <Bot size={14} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '82%', padding: '10px 14px',
                borderRadius: msg.role === 'agent' ? '3px 14px 14px 14px' : '14px 3px 14px 14px',
                background: msg.role === 'agent' ? '#fff' : 'linear-gradient(135deg, #003087, #002266)',
                color: msg.role === 'agent' ? '#0f172a' : '#fff',
                fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 500,
                border: msg.role === 'agent' ? '1px solid #e2e8f0' : '1px solid rgba(56,189,248,0.3)',
                boxShadow: msg.role === 'agent' ? '0 1px 6px rgba(0,0,0,0.05)' : '0 3px 12px rgba(0,48,135,0.2)',
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6200, #c2410c)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(255,98,0,0.3)' }}>
                  <User size={14} color="#fff" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
              <RefreshCw size={14} className="spin" color="#8b5cf6" />
              <span style={{ fontWeight: 600 }}>AI is thinking...</span>
            </div>
          )}

          {phase === 'summary' && generatedData && (
            <div style={{
              background: '#fff', border: '2px solid #003087', borderRadius: '14px', padding: isMobile ? '10px' : '14px',
              display: 'flex', flexDirection: 'column', gap: '10px',
              boxShadow: '0 6px 20px rgba(0,48,135,0.12)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #0284c7)', borderRadius: '14px 14px 0 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={18} color="#16a34a" /><span>Report Ready</span>
                </div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(2,132,199,0.1)', color: '#0284c7', padding: '2px 8px', borderRadius: '100px', fontWeight: 800, border: '1px solid rgba(2,132,199,0.2)' }}>Gemini AI Verified</span>
              </div>
              <div style={{ fontSize: '0.78rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Title</div>
                <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.88rem', marginTop: '1px' }}>{generatedData.title}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                <div><span style={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Category</span><div style={{ color: '#003087', fontWeight: 700, marginTop: '1px' }}>{generatedData.category}</div></div>
                <div><span style={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Location</span><div style={{ color: '#0f172a', fontWeight: 700, marginTop: '1px' }}>{generatedData.district}</div></div>
                <div><span style={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Affected</span><div style={{ color: '#0f172a', fontWeight: 700, marginTop: '1px' }}>~{generatedData.affected_population}</div></div>
                <div><span style={{ color: '#64748b', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Severity</span><div style={{ color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', marginTop: '1px' }}>{generatedData.severity}</div></div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', color: '#003087', fontSize: '0.82rem', fontWeight: 800, background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <RefreshCw size={18} className="spin" color="#FF6200" />
              <span>Structuring official grievance...</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: '#fef2f2', borderTop: '1px solid #fecaca', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700 }}>
            <AlertCircle size={14} />{errorMsg}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: isMobile ? '10px 10px' : '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontSize: isMobile ? '0.72rem' : '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <div style={{ display: 'flex', gap: isMobile ? '5px' : '8px', flexWrap: 'wrap' }}>
            {phase === 'questioning' && turnCount > 0 && !generatedData && (
              <button onClick={handleSkipToEnd} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Skip & Analyze</button>
            )}
            {phase === 'questioning' && liveModeRef.current && (
              <button onClick={handleStopLive} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: '8px', border: '1px solid #dc2626', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}><PhoneOff size={13} /> End Call</button>
            )}
            {phase === 'summary' && generatedData && (
              <>
                <button onClick={() => speak(generatedData.spoken_summary || `Report for ${generatedData.title}.`)} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: '8px', border: '1px solid #003087', background: 'rgba(0,48,135,0.06)', color: '#003087', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}><Volume2 size={13} /> Speak</button>
                <button onClick={handleApplyToForm} style={{ padding: isMobile ? '7px 12px' : '9px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF6200, #ea580c)', color: '#fff', border: 'none', fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 3px 12px rgba(255,98,0,0.4)' }}><FileText size={13} />{isMobile ? 'Auto-Fill' : 'Auto-Fill Report'}<ArrowRight size={13} /></button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes orbBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes orbSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes waveBar { 0% { transform: scaleY(0.4); } 100% { transform: scaleY(1); } }
        @keyframes thinkingDot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
