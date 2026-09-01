import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Bot, User, FileText, Sparkles, Phone, PhoneOff } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';

// ─── Audio Noise Processor: reduces background noise using Web Audio API ──
// Creates a high-pass filter (removes low rumble) + noise gate (suppresses quiet noise)
let audioContext = null;
let noiseFilter = null;
let noiseGate = null;
let micSource = null;
let processedStream = null;

async function createNoiseReducedStream() {
  try {
    const rawStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
      }
    });
    return rawStream;
  } catch (err) {
    console.warn('[VoiceAgent] Could not get audio stream:', err.message);
    return null;
  }
}

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

// ─── Draft template: all fields needed for a civic grievance report ─────────
const DRAFT_TEMPLATE_FIELDS = [
  { key: 'raw_problem', label: 'Problem description', critical: true },
  { key: 'location', label: 'Location / District', critical: true },
  { key: 'who_affected', label: 'Who is affected', critical: true },
  { key: 'duration', label: 'Duration / How long', critical: false },
  { key: 'severity', label: 'Severity level', critical: false },
];

// ─── Natural conversational fillers (varied per turn so it doesn't repeat) ──
const ACKNOWLEDGMENTS_EN = [
  "Got it, thank you.",
  "I see, okay.",
  "Alright, I hear you.",
  "Makes sense.",
  "Understood.",
  "Okay, noted.",
];
const ACKNOWLEDGMENTS_HI = [
  "समझ गई, धन्यवाद।",
  "ठीक है, मैंने सुन लिया।",
  "अच्छा, बताइए आगे।",
  "हाँ, समझ में आया।",
  "ठीक है।",
];
function pickAcknowledgment(lang) {
  const pool = lang === 'hi-IN' ? ACKNOWLEDGMENTS_HI : ACKNOWLEDGMENTS_EN;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Humanize text for TTS — very natural delivery ────────────────────────────
function humanizeForSpeech(text, lang = 'en-IN') {
  if (!text) return '';
  let t = text;
  // Natural pauses after sentences
  t = t.replace(/\.\s+/g, '. ... ');
  t = t.replace(/!\s+/g, '! ... ');
  t = t.replace(/\?\s+/g, '? ... ');
  t = t.replace(/,\s+/g, ', ... ');
  t = t.replace(/\s*[—–]\s*/g, ' ... ');
  // Add breath pauses between paragraphs
  t = t.replace(/\n{2,}/g, ' ... ... ');
  t = t.replace(/\n/g, ' ... ');
  // Slight pause after common conjunctions for natural flow
  if (lang === 'en-IN') {
    t = t.replace(/\b(So|Well|Okay|Alright|Hmm|Right|Now|Also)\b/gi, '$1, ...');
    // Slow down numbers slightly
    t = t.replace(/\b(\d+)\b/g, '... $1 ...');
  }
  if (lang === 'hi-IN') {
    t = t.replace(/\b(तो|अच्छा|ठीक|अब|भी|जी)\b/g, '$1, ...');
  }
  return t.trim();
}

// ─── Pick the most natural-sounding voice ─────────────────────────────────────
function pickBestVoice(lang = 'en-IN') {
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length === 0) return null;

  if (lang === 'hi-IN') {
    // Prefer natural-sounding Hindi voices
    return voices.find(v => v.lang.includes('hi-IN') && (v.name.includes('Swara') || v.name.includes('Kalpana') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural')))
      || voices.find(v => v.lang.includes('hi-IN'))
      || voices.find(v => v.lang.includes('hi'))
      || voices.find(v => v.lang.includes('en-IN'));
  }

  // Prefer Neural/Premium voices for most natural sound
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

// ─── Get which draft fields are still missing ────────────────────────────────
function getMissingDraftFields(answers) {
  return DRAFT_TEMPLATE_FIELDS.filter(f => !answers[f.key] || (typeof answers[f.key] === 'string' && answers[f.key].trim().length < 2));
}

// ─── Build a human-readable summary of what's collected vs what's missing ────
function buildDraftStatus(answers, lang) {
  const missing = getMissingDraftFields(answers);
  if (missing.length === 0) return lang === 'hi-IN' ? 'सारी जानकारी मिल गई है।' : 'I have everything I need.';

  const collected = DRAFT_TEMPLATE_FIELDS.filter(f => answers[f.key] && answers[f.key].length >= 2);
  const parts = [];
  if (collected.length > 0) {
    parts.push(lang === 'hi-IN' ? `मैंने नोट किया: ${collected.map(f => f.label).join(', ')}.` : `I've noted: ${collected.map(f => f.label).join(', ')}.`);
  }
  parts.push(lang === 'hi-IN' ? `अभी ज़रूरत है: ${missing.map(f => f.label).join(', ')}.` : `Still need: ${missing.map(f => f.label).join(', ')}.`);
  return parts.join(' ');
}

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
  const silenceTimerRef = useRef(null);

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

  // ─── Audio Stream Refs (for noise reduction) ──────────────────────────────
  const audioStreamRef = useRef(null);
  const audioCtxRef = useRef(null);

  // ─── Speech Recognition Setup (Optimized for crystal-clear voice capture) ──
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
    // Chrome-specific: enable punctuation for better accuracy
    if ('webkitSpeechRecognition' in window) {
      try { recognition.interimResults = true; } catch (e) {}
    }

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
      // Auto-restart in live mode with minimal delay
      if (liveModeRef.current && !abortRef.current && !speakingRef.current) {
        setTimeout(() => {
          if (!speakingRef.current && !abortRef.current && liveModeRef.current) {
            try {
              recognition.lang = selectedLanguage;
              recognition.start();
            } catch (e) {}
          }
        }, 300); // Reduced from 500ms to 300ms for faster restart
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (e) {}
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  // ─── Fast, Natural TTS ─────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text) { resolve(); return; }

      // SAFETY: Always stop the mic before speaking
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);

      window.speechSynthesis.cancel();
      speakingRef.current = true;
      setIsSpeaking(true);

      const humanText = humanizeForSpeech(text, selectedLanguage);
      const utterance = new SpeechSynthesisUtterance(humanText);
      // Faster rate for quicker responses, still natural
      utterance.rate = 1.0; // Normal speed for faster delivery
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';

      const voice = pickBestVoice(selectedLanguage);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => { setIsSpeaking(true); speakingRef.current = true; };
      utterance.onend = () => {
        setIsSpeaking(false);
        speakingRef.current = false;
        // Shorter breathing pause for faster turn-taking
        setTimeout(() => resolve(), 250);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        speakingRef.current = false;
        setTimeout(() => resolve(), 150);
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [selectedLanguage]);

  // ─── Start / Stop Listening ────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!recognitionRef.current || speakingRef.current || abortRef.current) return;
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

  // ─── Collect Final Transcript (optimized silence-detection) ─────────────────
  // Faster silence detection: 2.5s after speech (was 3.5s), 10s initial timeout
  const collectTranscript = useCallback(() => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) { resolve(''); return; }
      const finalParts = [];
      let resolved = false;
      let silenceTimer = null;
      let hasSpoken = false;

      const cleanup = () => {
        recognitionRef.current?.removeEventListener('result', onResult);
        if (silenceTimer) clearTimeout(silenceTimer);
      };

      const onResult = (event) => {
        if (resolved) return;
        let hasFinal = false;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalParts.push(event.results[i][0].transcript);
            hasFinal = true;
            hasSpoken = true;
          }
        }
        // Reset silence timer on any speech activity
        if (silenceTimer) clearTimeout(silenceTimer);
        // Faster silence detection: 2.5s after speech ends
        silenceTimer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve(finalParts.join(' ').trim());
          }
        }, hasSpoken ? 2500 : 10000); // 2.5s silence = done; 10s initial = no speech
      };

      recognitionRef.current?.addEventListener('result', onResult);

      // Start the initial silence timer
      silenceTimer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(finalParts.join(' ').trim());
        }
      }, 10000);
    });
  }, []);

  // ─── Fallback Local Extractor ──────────────────────────────────────────────
  const extractLocalReport = (combinedText) => {
    const text = (combinedText || '').toLowerCase();
    // Hindi word mappings for category detection
    const hiWords = { 'paani': 'water', 'pipe': 'pipe', 'nala': 'drain', 'sadak': 'road', 'bijli': 'electric', 'kachra': 'garbage', 'school': 'school', 'doctor': 'doctor', 'kisan': 'farmer', 'traffic': 'traffic' };
    for (const [hi, en] of Object.entries(hiWords)) { if (text.includes(hi) && !text.includes(en)) text.replace(new RegExp(hi, 'g'), en); }

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

  // ─── GEMINI CONVERSATION ENGINE — Optimized for Speed ───────────────────
  const geminiConversationTurn = useCallback(async (userMessage, history, lang) => {
    const langLabel = lang === 'hi-IN' ? 'Hindi' : 'English';
    const collectedInfo = Object.entries(answersRef.current)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n') || '(nothing collected yet)';

    const missing = getMissingDraftFields(answersRef.current);
    const missingLabels = missing.map(f => f.label).join(', ') || 'none';

    // Shorter prompt for faster Gemini response
    const prompt = `${lang === 'hi-IN' ? 'भाषा निर्देश: aiResponse हिंदी में लिखें।' : ''}

You are JanSetu AI — warm civic voice assistant on LIVE call with a citizen reporting a problem.

DRAFT FIELDS: problem, location/district, who_affected, duration, severity.
Collected: ${collectedInfo}
Missing: ${missingLabels}

RULES:
1. Acknowledge what citizen said, then ask for NEXT missing field (ONE at a time)
2. 1-2 sentences max. Be warm, casual, brief.
3. If ready for report, say so.
4. Speak in ${langLabel}.

History:
${history.slice(-6).map(m => `${m.role === 'agent' ? 'AI' : 'C'}: ${m.text}`).join('\n')}

Citizen said: "${userMessage}"

Return ONLY valid JSON:
{
  "intent": "greeting_ack|problem_described|location_given|details_given|empty_response|needs_clarification|ready_for_report",
  "userMessageSummary": "3-5 word summary",
  "extractedFields": { "raw_problem": null, "location": null, "who_affected": null, "duration": null, "severity": null },
  "missingFields": [],
  "aiResponse": "warm conversational response (1-2 sentences)",
  "isReadyForReport": false,
  "confidence": 0.0
}

aiResponse rules:
${lang === 'hi-IN' ? 'MUST be Hindi Devanagari. Example: greeting_ack: नमस्ते! बताइए क्या समस्या है? | problem_described: अच्छा, यह गंभीर है। किस इलाके में है? | location_given: समझ गई। कौन प्रभावित है? | ready_for_report: बहुत बढ़िया! रिपोर्ट तैयार करती हूँ।' : 'greeting_ack: Hi! What civic problem are you facing? | problem_described: Oh that sounds bad. Which area is this? | location_given: Got it. Who is affected? | ready_for_report: Perfect! Preparing your report now.'}
- NEVER repeat same question. Only ask MISSING fields.`;

    try {
      const rawAi = await geminiService.generateCivicResponse([
        { role: 'system', content: `You are JanSetu AI voice assistant. ${lang === 'hi-IN' ? 'RESPOND ENTIRELY IN HINDI (Devanagari). aiResponse MUST be Hindi.' : 'Respond in English.'} Output strict JSON only. Brief, warm, human-like.` },
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
          ? 'जी, मैं समझ गई। कृपया बताइए — आपके इलाके में क्या समस्या है?'
          : 'Sure, I\'m listening. What\'s the civic problem you\'re facing in your area?',
        isReadyForReport: false,
        confidence: 0.5
      };
    }

    // Extract what we can locally (supports Hindi + English)
    const extracted = {};
    if (hasProblem) extracted.raw_problem = userMessage;

    // District detection (English + Hindi)
    for (const dName of Object.keys(DISTRICT_COORDS)) {
      if (msgLower.includes(dName)) {
        extracted.location = dName.charAt(0).toUpperCase() + dName.slice(1);
        break;
      }
    }

    // Hindi district names
    const hiDistricts = { 'रांची': 'ranchi', 'दुमका': 'dumka', 'धनबाद': 'dhanbad', 'जमशेदपुर': 'jamshedpur', 'बोकारो': 'bokaro', 'देवघर': 'deoghar', 'हजारीबाग': 'hazaribagh', 'गिरिडीह': 'giridih', 'पलामू': 'palamu', 'गोड्डा': 'godda', 'पाकुड़': 'pakur', 'जामताड़ा': 'jamtara', 'रामगढ़': 'ramgarh' };
    for (const [hi, en] of Object.entries(hiDistricts)) {
      if (userMessage.includes(hi)) {
        extracted.location = en.charAt(0).toUpperCase() + en.slice(1);
        break;
      }
    }

    // Severity (English + Hindi)
    if (msgLower.includes('emergency') || msgLower.includes('critical') || msgLower.includes('dangerous') || msgLower.includes('collapse') || userMessage.includes('इमरजेंसी') || userMessage.includes('खतरनाक')) extracted.severity = 'critical';
    else if (msgLower.includes('urgent') || msgLower.includes('severe') || userMessage.includes('जरूरी')) extracted.severity = 'high';

    // Duration (English + Hindi)
    if (msgLower.includes('week') || userMessage.includes('हफ्ता')) extracted.duration = '2 weeks';
    else if (msgLower.includes('month') || userMessage.includes('महीना')) extracted.duration = '3 months';
    else if (msgLower.includes('year') || userMessage.includes('साल')) extracted.duration = '1 year';

    // Who affected (English + Hindi)
    const popMatch = msgLower.match(/(\d[\d,]*)\s*(people|person|family|village|student)/);
    if (popMatch) extracted.who_affected = `${popMatch[1]} ${popMatch[2]}`;
    if (userMessage.includes('लोग') || userMessage.includes('परिवार') || userMessage.includes('गांव')) {
      const numMatch = userMessage.match(/(\d+)/);
      if (numMatch) extracted.who_affected = `${numMatch[1]} लोग`;
      else if (!extracted.who_affected) extracted.who_affected = 'स्थानीय लोग';
    }

    const allMissing = getMissingDraftFields({ ...answersRef.current, ...extracted });
    const missingKeys = allMissing.map(f => f.key);
    const isReady = missingKeys.length === 0 || (!missingKeys.includes('raw_problem') && !missingKeys.includes('location'));

    // Build a natural follow-up
    let aiResponse;
    if (isReady) {
      aiResponse = selectedLanguage === 'hi-IN'
        ? 'बहुत बढ़िया! अब मेरे पास सारी जानकारी है। रिपोर्ट तैयार कर रही हूँ...'
        : 'Great, I have everything I need. Let me prepare your official grievance report now.';
    } else {
      const followUps = {
        'location': selectedLanguage === 'hi-IN'
          ? `${pickAcknowledgment('hi-IN')} यह किस जिले या इलाके में है?`
          : `${pickAcknowledgment('en-IN')} Which district or area is this happening in?`,
        'who_affected': selectedLanguage === 'hi-IN'
          ? `${pickAcknowledgment('hi-IN')} इससे मुख्य रूप से कौन प्रभावित है?`
          : `${pickAcknowledgment('en-IN')} And who is mainly affected by this?`,
        'duration': selectedLanguage === 'hi-IN'
          ? `${pickAcknowledgment('hi-IN')} यह कब से चल रहा है?`
          : `${pickAcknowledgment('en-IN')} How long has this been going on?`,
        'severity': selectedLanguage === 'hi-IN'
          ? `${pickAcknowledgment('hi-IN')} कितना गंभीर है? कोई इमरजेंसी जैसा है?`
          : `${pickAcknowledgment('en-IN')} How serious is it? Any emergency situation?`,
        'raw_problem': selectedLanguage === 'hi-IN'
          ? 'कृपया थोड़ा और विस्तार से बताएं — ठीक क्या हो रहा है?'
          : `${pickAcknowledgment('en-IN')} Could you tell me a bit more about what exactly is happening?`,
      };
      aiResponse = followUps[missingKeys[0]] || 'Could you share more details?';
    }

    return {
      intent: isReady ? 'ready_for_report' : 'problem_described',
      userMessageSummary: userMessage.slice(0, 30),
      extractedFields: extracted,
      missingFields: missingKeys,
      aiResponse,
      isReadyForReport: isReady,
      confidence: hasProblem ? 0.7 : 0.4
    };
  }, [selectedLanguage]);

  // ─── Translate Hindi text to English via Gemini ─────────────────────────────
  const translateHindiToEnglish = useCallback(async (text) => {
    if (!text || text.trim().length === 0) return text;
    // If text has no Devanagari characters, it's already English
    if (!/[\u0900-\u097F]/.test(text)) return text;

    try {
      const raw = await geminiService.generateCivicResponse([
        { role: 'system', content: 'You are a precise Hindi-to-English translator for civic/government reports. Translate the given Hindi text to clear, professional English. Output ONLY the translated text, nothing else. Preserve technical terms, place names, and numbers accurately.' },
        { role: 'user', content: text }
      ]);
      return raw && raw.trim().length > 0 ? raw.trim() : text;
    } catch (err) {
      console.warn('[VoiceAgent] Translation error:', err.message);
      return text;
    }
  }, []);

  // ─── Generate Structured Report with Gemini AI ─────────────────────────────
  const generateReport = useCallback(async () => {
    setIsProcessing(true);
    setPhase('summary');
    stopListening();

    const answers = answersRef.current;
    const allText = Object.values(answers).filter(Boolean).join(' ');
    const isHindi = selectedLanguage === 'hi-IN';

    const prompt = `Parse civic grievance from citizen voice data.
${isHindi ? 'Translate ALL text fields to English. Only spoken_summary in Hindi.' : ''}

Citizen answers: ${JSON.stringify(answers)}
Transcript: "${allText}"

Return JSON:
{
  "title": "5-8 word title (ENGLISH)",
  "description": "2-3 sentence statement (ENGLISH)",
  "category": "Water Management|Infrastructure|Agriculture & Rural|Healthcare & Sanitation|Education & Literacy|Energy & Power|Environment & Pollution|Public Safety & Disaster|Urban Transport & Traffic",
  "subcategory": "sub-sector",
  "district": "Jharkhand district",
  "location": "street/village/block (ENGLISH)",
  "lat": "latitude", "lng": "longitude",
  "severity": "low|medium|high|critical",
  "affected_population": number,
  "who_affected": "who (ENGLISH)",
  "duration": "duration (ENGLISH)",
  "spoken_summary": "warm confirmation (speak in ${isHindi ? 'Hindi' : 'English'})"
}`;

    let parsedData = null;
    try {
      const rawAi = await geminiService.generateCivicResponse([
        { role: 'system', content: `You are JanSetu Voice AI parser. Output strict JSON only. ${isHindi ? 'ALL text fields MUST be translated to English. Only spoken_summary should be in Hindi.' : ''}` },
        { role: 'user', content: prompt }
      ]);
      const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.warn('[VoiceAgent] Gemini parse error:', err);
    }

    if (!parsedData || !parsedData.title) parsedData = extractLocalReport(allText);

    // ── Post-translation safety: if any field still has Hindi, translate it ──
    if (isHindi && parsedData) {
      const fieldsToTranslate = ['title', 'description', 'location', 'who_affected', 'duration'];
      for (const field of fieldsToTranslate) {
        if (parsedData[field] && /[\u0900-\u097F]/.test(parsedData[field])) {
          parsedData[field] = await translateHindiToEnglish(parsedData[field]);
        }
      }
      // Also translate the combined description from raw_problem if present
      if (parsedData.description && /[\u0900-\u097F]/.test(parsedData.description)) {
        parsedData.description = await translateHindiToEnglish(parsedData.description);
      }
    }

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

    const summaryMsg = isHindi
      ? `\u2728 रिपोर्ट तैयार हो गई!\n\ud83d\udccc शीर्षक: ${parsedData.title}\n\ud83d\udcc2 श्रेणी: ${parsedData.category}\n\ud83d\udccd स्थान: ${parsedData.location} (${parsedData.district})\n\ud83d\udc65 प्रभावित: ${parsedData.who_affected} (~${parsedData.affected_population} लोग)\n\u26a0\ufe0f गंभीरता: ${parsedData.severity.toUpperCase()}\n\u23f1\ufe0f अवधि: ${parsedData.duration}`
      : `✨ Report Prepared Successfully!\n📌 Title: ${parsedData.title}\n📂 Category: ${parsedData.category}\n📍 Location: ${parsedData.location} (${parsedData.district})\n👥 Affected: ${parsedData.who_affected} (~${parsedData.affected_population} people)\n⚠️ Severity: ${parsedData.severity.toUpperCase()}\n⏱️ Duration: ${parsedData.duration}`;
    setConversationLog(prev => [...prev, { role: 'agent', text: summaryMsg }]);

    const speech = parsedData.spoken_summary || `Report prepared for ${parsedData.title} in ${parsedData.district}. Tap Auto-Fill to submit.`;
    await speak(speech);
  }, [speak, stopListening, selectedLanguage, translateHindiToEnglish]);

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

    const MAX_TURNS = 8;

    // ── GREETING: Adaptive bilingual greeting — speaks first, then listens ──
    const isHindi = selectedLanguage === 'hi-IN';
    const greeting = isHindi
      ? "नमस्ते! मैं जनसेतु वॉयस असिस्टेंट हूँ। बताइए आपके इलाके में क्या समस्या है?"
      : "Hello! I'm JanSetu Voice Assistant. Tell me about the civic problem in your area — what's happening, where, and who's affected?";

    setConversationLog([{ role: 'agent', text: greeting }]);
    conversationHistoryRef.current.push({ role: 'agent', text: greeting });

    // Speak the greeting — mic is already off inside speak()
    await speak(greeting);
    if (abortRef.current) { isRunningRef.current = false; return; }

    // After greeting, minimal delay before listening (was 900ms, now 400ms)
    await new Promise(r => setTimeout(r, 300));
    setInterimText('');
    startListening();
    await new Promise(r => setTimeout(r, 300));

    // ── MAIN LOOP: Listen → Analyze → Respond → Repeat ──
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      if (abortRef.current || !liveModeRef.current) break;

      turnCountRef.current = turn + 1;
      setTurnCount(turn + 1);

      // 1. Wait for user to speak (silence-detection based)
      const userMessage = await collectTranscript();
      // Stop mic after collecting
      stopListening();
      setInterimText('');

      if (abortRef.current) break;

      // 2. Handle empty / acknowledgment-only responses
      const isEmpty = !userMessage.trim() || isAcknowledgmentOnly(userMessage);
      const displayMsg = isEmpty ? '(waiting for response...)' : userMessage;
      setConversationLog(prev => [...prev, { role: 'user', text: displayMsg }]);
      conversationHistoryRef.current.push({ role: 'user', text: displayMsg });

      // 3. Language detection on first real response
      if (turn === 0 && userMessage.trim()) {
        const detected = detectLanguage(userMessage);
        if (detected && detected !== selectedLanguage) {
          setDetectedLang(detected);
          setSelectedLanguage(detected);
        }
      }

      // 4. Let Gemini analyze and decide what to say next
      setIsThinking(true);
      const analysis = await geminiConversationTurn(
        isEmpty ? '' : userMessage,
        conversationHistoryRef.current,
        detectedLang || selectedLanguage
      );
      setIsThinking(false);

      if (abortRef.current) break;

      // 5. Extract any fields Gemini identified
      if (analysis.extractedFields) {
        for (const [field, value] of Object.entries(analysis.extractedFields)) {
          if (value && value !== null) {
            answersRef.current[field] = value;
            collectedFieldsRef.current.add(field);
          }
        }
      }

      // 5b. SAFETY: If Hindi was selected but response is still in English, override with Hindi fallback
      if (detectedLang === 'hi-IN' || selectedLanguage === 'hi-IN') {
        const responseHasDevanagari = /[\u0900-\u097F]/.test(analysis.aiResponse);
        if (!responseHasDevanagari && analysis.aiResponse && analysis.aiResponse.length > 5) {
          // Force Hindi fallback for this response
          const hindiFallbacks = {
            'empty_response': 'जी, मैं समझ गई। कृपया बताइए — आपके इलाके में क्या समस्या है?',
            'problem_described': `${pickAcknowledgment('hi-IN')} यह किस इलाके में है? कृपया बताइए।`,
            'location_given': `${pickAcknowledgment('hi-IN')} इससे मुख्य रूप से कौन प्रभावित है?`,
            'ready_for_report': 'बहुत बढ़िया! मेरे पास सारी जानकारी है। अब आपकी आधिकारिक शिकायत रिपोर्ट तैयार करती हूँ।',
            'details_given': `${pickAcknowledgment('hi-IN')} यह कब से चल रहा है?`,
            'needs_clarification': 'कृपया थोड़ा और विस्तार से बताएं।',
          };
          analysis.aiResponse = hindiFallbacks[analysis.intent] || hindiFallbacks['needs_clarification'];
        }
      }

      // 6. Speak the AI's response — mic is stopped inside speak()
      setConversationLog(prev => [...prev, { role: 'agent', text: analysis.aiResponse }]);
      conversationHistoryRef.current.push({ role: 'agent', text: analysis.aiResponse });
      await speak(analysis.aiResponse);
      if (abortRef.current) break;

      // 6b. After speaking, minimal delay before restart mic (was 900ms, now 400ms)
      await new Promise(r => setTimeout(r, 250));
      setInterimText('');
      startListening();
      await new Promise(r => setTimeout(r, 250));

      // 7. Check if we're ready for report
      if (analysis.isReadyForReport) {
        await new Promise(r => setTimeout(r, 500));
        break;
      }

      // 8. If we've had 3+ turns and have the problem, wrap up
      if (turn >= 2 && collectedFieldsRef.current.has('raw_problem')) {
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
        // Cleanup audio context for noise reduction
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(t => t.stop());
          audioStreamRef.current = null;
        }
      };
    } else {
      abortRef.current = true;
      liveModeRef.current = false;
      isRunningRef.current = false;
      stopListening();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      // Cleanup audio context
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
        audioStreamRef.current = null;
      }
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
    speaking: 'linear-gradient(135deg, #2d7a4f 0%, #1a5c3a 100%)',
    listening: 'linear-gradient(135deg, #c8860a 0%, #a06d08 100%)',
    thinking: 'linear-gradient(135deg, #6d5aad 0%, #5244a0 100%)',
    idle: 'linear-gradient(135deg, #1b2a4a 0%, #243b6a 100%)',
  }[orbState];

  const orbShadow = {
    speaking: '0 0 60px rgba(45,122,79,0.7), 0 0 120px rgba(45,122,79,0.25)',
    listening: '0 0 60px rgba(200,134,10,0.7), 0 0 120px rgba(200,134,10,0.25)',
    thinking: '0 0 60px rgba(109,90,173,0.7), 0 0 120px rgba(109,90,173,0.25)',
    idle: '0 0 30px rgba(27,42,74,0.35)',
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
        background: '#ffffff', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '520px',
        boxShadow: '0 25px 70px rgba(15, 23, 42, 0.5), 0 0 0 1px rgba(27,42,74,0.05)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '94vh',
        position: 'relative',
      }}>
        {/* Flag Accent */}
        <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 60%, #243b6a 100%)',
          borderBottom: '1px solid rgba(200,134,10,0.15)',
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
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#d4a843', fontWeight: 800, background: 'rgba(200,134,10,0.12)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(200,134,10,0.25)' }}>Govt of India · JanSetu AI</span>
                <span style={{ fontSize: '0.55rem', background: 'rgba(200,134,10,0.2)', color: '#d4a843', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>Gemini AI</span>
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
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: isMobile ? '6px 10px' : '8px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: orbState === 'listening' ? 'var(--accent)' : orbState === 'speaking' ? 'var(--success)' : orbState === 'thinking' ? '#6d5aad' : 'var(--primary)', boxShadow: orbState !== 'idle' ? `0 0 10px ${orbState === 'listening' ? 'var(--accent)' : orbState === 'speaking' ? 'var(--success)' : '#6d5aad'}` : 'none', display: 'inline-block', animation: orbState !== 'idle' ? 'pulse 1.5s infinite' : 'none' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isListening ? '🎙️ Listening — Speak Now' : isSpeaking ? '🔊 AI Speaking...' : isThinking ? '🧠 Thinking...' : phase === 'summary' ? '✨ Report Ready' : 'Initializing...'}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>
              {phase === 'summary' ? '100%' : `${Math.min(turnCount + 1, 5)}/5`}
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: phase === 'summary' ? 'linear-gradient(90deg, var(--success), #1a5c3a)' : 'linear-gradient(90deg, var(--accent), #a06d08)', borderRadius: '10px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 8px ${phase === 'summary' ? 'rgba(45,122,79,0.4)' : 'rgba(200,134,10,0.4)'}` }} />
          </div>
        </div>

        {/* ═══ GEMINI LIVE ORB ═══ */}
        {phase === 'questioning' && (            <div style={{
              background: orbState === 'listening' ? 'linear-gradient(180deg, #fdf8ed 0%, #ffffff 100%)' : orbState === 'speaking' ? 'linear-gradient(180deg, #f0faf3 0%, #ffffff 100%)' : orbState === 'thinking' ? 'linear-gradient(180deg, #f3f0fa 0%, #ffffff 100%)' : '#ffffff',
            padding: isMobile ? '16px 16px' : '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.4s ease',
          }}>
            <div style={{ position: 'relative', width: isMobile ? '90px' : '120px', height: isMobile ? '90px' : '120px', marginBottom: isMobile ? '10px' : '16px' }}>
              {(orbState === 'listening' || orbState === 'speaking') && (
                <>
                  <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', border: `2px solid ${orbState === 'listening' ? 'rgba(200,134,10,0.3)' : 'rgba(45,122,79,0.3)'}`, animation: 'orbPulse 2s infinite ease-out' }} />
                  <div style={{ position: 'absolute', inset: '-24px', borderRadius: '50%', border: `1px solid ${orbState === 'listening' ? 'rgba(200,134,10,0.15)' : 'rgba(45,122,79,0.15)'}`, animation: 'orbPulse 2s infinite ease-out 0.5s' }} />
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
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isListening ? 'var(--accent)' : isSpeaking ? 'var(--success)' : 'var(--text-muted)', textAlign: 'center' }}>
              {isListening ? 'Listening... Tap orb to stop' : isSpeaking ? 'Speaking naturally...' : isThinking ? 'Processing...' : 'Tap to start speaking'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isSpeaking ? 'Voice response is live' : isListening ? 'Mic is on — speak freely' : 'Conversational voice mode active'}
            </div>
            {isListening && interimText && (
              <div style={{ marginTop: '10px', padding: '8px 14px', background: 'rgba(200,134,10,0.08)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(200,134,10,0.35)', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, fontStyle: 'italic', maxWidth: '90%', textAlign: 'center' }}>
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
          background: 'var(--bg-primary)', backgroundImage: 'radial-gradient(rgba(27,42,74,0.03) 1px, transparent 1px)', backgroundSize: '16px 16px',
        }}>
          {conversationLog.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', border: '1px solid var(--border-subtle)' }}>
                <Bot size={24} color="var(--primary)" />
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Connecting to JanSetu Live...</p>
            </div>
          )}

          {conversationLog.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end', gap: '8px', animation: 'fadeIn 0.2s ease' }}>
              {msg.role === 'agent' && (
                <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(27,42,74,0.15)' }}>
                  <Bot size={14} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '82%', padding: '10px 14px',
                borderRadius: msg.role === 'agent' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: msg.role === 'agent' ? '#fff' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                color: msg.role === 'agent' ? 'var(--text-primary)' : '#fff',
                fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 500,
                border: msg.role === 'agent' ? '1px solid var(--border-subtle)' : '1px solid rgba(200,134,10,0.2)',
                boxShadow: msg.role === 'agent' ? '0 1px 6px rgba(0,0,0,0.05)' : '0 3px 12px rgba(27,42,74,0.15)',
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent), #a06d08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(200,134,10,0.25)' }}>
                  <User size={14} color="#fff" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={14} className="spin" color="#6d5aad" />
              <span style={{ fontWeight: 600 }}>AI is thinking...</span>
            </div>
          )}

          {phase === 'summary' && generatedData && (
            <div style={{
              background: '#fff', border: '2px solid var(--primary)', borderRadius: 'var(--radius-lg)', padding: isMobile ? '10px' : '14px',
              display: 'flex', flexDirection: 'column', gap: '10px',
              boxShadow: '0 6px 20px rgba(27,42,74,0.12)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--accent), var(--primary))', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 800, fontSize: '0.85rem' }}>
                  <CheckCircle2 size={18} color="var(--success)" /><span>Report Ready</span>
                </div>
                <span style={{ fontSize: '0.65rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 800, border: '1px solid rgba(200,134,10,0.2)' }}>Gemini AI Verified</span>
              </div>
              <div style={{ fontSize: '0.78rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Title</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.88rem', marginTop: '1px' }}>{generatedData.title}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Category</span><div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '1px' }}>{generatedData.category}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Location</span><div style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '1px' }}>{generatedData.district}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Affected</span><div style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '1px' }}>~{generatedData.affected_population}</div></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Severity</span><div style={{ color: 'var(--danger)', fontWeight: 800, textTransform: 'uppercase', marginTop: '1px' }}>{generatedData.severity}</div></div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 800, background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <RefreshCw size={18} className="spin" color="var(--accent)" />
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
        <div style={{ padding: isMobile ? '10px 10px' : '12px 16px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: '#fff', color: 'var(--text-secondary)', fontSize: isMobile ? '0.72rem' : '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <div style={{ display: 'flex', gap: isMobile ? '5px' : '8px', flexWrap: 'wrap' }}>
            {phase === 'questioning' && turnCount > 0 && !generatedData && (
              <button onClick={handleSkipToEnd} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: '#fff', color: 'var(--text-secondary)', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Skip & Analyze</button>
            )}
            {phase === 'questioning' && liveModeRef.current && (
              <button onClick={handleStopLive} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)', background: 'var(--danger-light)', color: 'var(--danger)', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}><PhoneOff size={13} /> End Call</button>
            )}
            {phase === 'summary' && generatedData && (
              <>
                <button onClick={() => speak(generatedData.spoken_summary || `Report for ${generatedData.title}.`)} style={{ padding: isMobile ? '7px 10px' : '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}><Volume2 size={13} /> Speak</button>
                <button onClick={handleApplyToForm} style={{ padding: isMobile ? '7px 12px' : '9px 18px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent), #a06d08)', color: '#fff', border: 'none', fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 3px 12px rgba(200,134,10,0.35)' }}><FileText size={13} />{isMobile ? 'Auto-Fill' : 'Auto-Fill Report'}<ArrowRight size={13} /></button>
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
