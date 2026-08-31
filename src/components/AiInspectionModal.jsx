import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, Mic, MicOff, SwitchCamera, Flashlight, FlashlightOff, StopCircle, Play, Image, FileText, AlertTriangle, CheckCircle2, X, Bot, User, RefreshCw, ArrowRight, MapPin, ChevronDown, ChevronUp, Eye, Shield, Volume2, VolumeX } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';
import { useCamera } from '../hooks/useCamera';

const INSPECTION_STATES = {
  IDLE: 'idle',
  CAMERA_PERMISSION: 'camera_permission',
  CONNECTING: 'connecting',
  LIVE: 'live',
  VOICE_ACTIVE: 'voice_active',
  PROCESSING: 'processing',
  NEEDS_INPUT: 'needs_input',
  READY_TO_REPORT: 'ready_to_report',
  REVIEW: 'review',
  SUBMITTED: 'submitted',
  ERROR: 'error',
};

const SAFETY_KEYWORDS = ['exposed wire', 'live wire', 'fire', 'spark', 'electrical hazard', 'collapse', 'falling', 'accident', 'flood water', 'deep water', 'toxic', 'chemical'];

// ─── Haptic Feedback ───────────────────────────────────────────────────────
function hapticFeedback(type = 'light') {
  if (!navigator.vibrate) return;
  switch (type) {
    case 'listen_start':   navigator.vibrate(30); break;   // short tap — mic on
    case 'speak_start':    navigator.vibrate([15, 30, 15]); break;  // double tap — AI speaking
    case 'thinking':       navigator.vibrate(10); break;   // subtle — processing
    case 'report_ready':   navigator.vibrate([50, 50, 50, 50, 100]); break;  // attention pattern
    case 'submit':         navigator.vibrate([30, 20, 80]); break;  // success
    case 'error':          navigator.vibrate([100, 30, 100]); break;  // error buzz
    default:               navigator.vibrate(15); break;
  }
}

function detectSafetyWarning(observation) {
  if (!observation) return null;
  const lower = observation.toLowerCase();
  for (const keyword of SAFETY_KEYWORDS) {
    if (lower.includes(keyword)) {
      if (lower.includes('wire') || lower.includes('electric') || lower.includes('spark')) {
        return '⚠️ SAFETY: Please do not approach. Exposed electrical hazard detected. Stay at a safe distance and contact emergency services.';
      }
      if (lower.includes('fire')) {
        return '🔥 SAFETY: Fire detected. Move to a safe location immediately and contact emergency services.';
      }
      if (lower.includes('collapse') || lower.includes('falling')) {
        return '⚠️ SAFETY: Structural hazard detected. Please maintain a safe distance from the affected area.';
      }
      if (lower.includes('flood') || lower.includes('deep water')) {
        return '🌊 SAFETY: Flooding detected. Do not attempt to cross standing water.';
      }
      return '⚠️ CAUTION: Potential safety hazard detected. Please maintain a safe distance.';
    }
  }
  return null;
}

// ─── Humanize text for TTS (natural pauses, filler words) ────────────────────
function humanizeForSpeech(text, lang = 'en-IN') {
  if (!text) return '';
  let t = text;
  // Add natural pauses at punctuation
  t = t.replace(/\.\s+/g, '. ... ');
  t = t.replace(/\!\s+/g, '! ... ');
  t = t.replace(/\?\s+/g, '? ... ');
  t = t.replace(/\,\s+/g, ', ... ');
  t = t.replace(/\s*[—–]\s*/g, ' ... ');
  // Add natural fillers for English
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

// ─── Detect language from text ────────────────────────────────────────────────
function detectLanguage(text) {
  if (!text) return null;
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return 'hi-IN';
  const lower = text.toLowerCase();
  const hindiWords = ['namaste', 'paani', 'sadak', 'bijli', 'kachra', 'nala', 'gao', 'jila', 'bhaiya', 'nahi', 'karo', 'hai', 'kripya', 'madad', 'haan', 'acha', 'thik'];
  if (hindiWords.some(w => lower.includes(w))) return 'hi-IN';
  return 'en-IN';
}

// ─── Detect user tone from text ───────────────────────────────────────────────
function detectToneHint(text) {
  if (!text) return 'normal conversational';
  const lower = text.toLowerCase();
  if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('danger') || lower.includes('help') || lower.includes('bachao') || lower.includes('jaldi')) return 'urgent and concerned';
  if (lower.includes('angry') || lower.includes('frustrat') || lower.includes('fed up') || lower.includes('enough') || lower.includes('bahut ho gaya')) return 'frustrated';
  if (lower.includes('thank') || lower.includes('good') || lower.includes('nice') || lower.includes('shukriya')) return 'appreciative';
  if (lower.includes('confus') || lower.includes('not sure') || lower.includes('samajh')) return 'confused';
  return 'normal conversational';
}

export default function AiInspectionModal({ isOpen, onClose, onSubmitInspection }) {
  const camera = useCamera();
  const [inspectionState, setInspectionState] = useState(INSPECTION_STATES.IDLE);
  const [conversationLog, setConversationLog] = useState([]);
  const [observations, setObservations] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [safetyWarning, setSafetyWarning] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [reportDraft, setReportDraft] = useState(null);
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [showObservationPanel, setShowObservationPanel] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // ─── Voice States ──────────────────────────────────────────────────────────
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [detectedLang, setDetectedLang] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceTurnCount, setVoiceTurnCount] = useState(0);
  const [missingInfoList, setMissingInfoList] = useState([]);
  const [voiceErrorMsg, setVoiceErrorMsg] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ─── Mobile detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On mobile, start with observation panel collapsed
  useEffect(() => {
    if (isMobile) setShowObservationPanel(false);
  }, [isMobile]);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const conversationHistoryRef = useRef([]);
  const frameCountRef = useRef(0);
  const lastAnalysisTimeRef = useRef(0);
  const abortRef = useRef(false);
  const videoContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);
  const voiceModeRef = useRef(false);
  const voiceTurnCountRef = useRef(0);
  const previousObservationsRef = useRef([]);
  const spokenResponsesRef = useRef(new Set());
  const collectedInfoRef = useRef({});
  const logEndRef = useRef(null);

  // ─── Audio Waveform Refs ──────────────────────────────────────────────────
  const waveformCanvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const waveformAnimFrameRef = useRef(null);
  const smoothDataRef = useRef(new Float32Array(64).fill(0));
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isThinkingRef = useRef(false);

  // Color palettes: 3 gradient stops [r, g, b, a] for each mode
  const COLOR_PALETTES = useRef({
    idle:      { stops: [[100,100,100,0.08],[100,100,100,0.25],[100,100,100,0.5]],  glow: [100,100,100,0.3] },
    listening: { stops: [[255,98,0,0.15],[255,98,0,0.6],[255,98,0,0.95]],         glow: [255,98,0,0.5] },
    speaking:  { stops: [[16,185,129,0.15],[16,185,129,0.6],[16,185,129,0.95]],    glow: [16,185,129,0.5] },
    thinking:  { stops: [[139,92,246,0.1],[139,92,246,0.4],[139,92,246,0.8]],      glow: [139,92,246,0.4] },
  });
  // Current interpolated colors: [3 stops x 4 channels] + glow
  const currentColorsRef = useRef({
    stops: [[100,100,100,0.08],[100,100,100,0.25],[100,100,100,0.5]],
    glow: [100,100,100,0.3],
  });

  // Keep refs in sync with state for waveform closure
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);

  // ─── Auto-scroll conversation log ──────────────────────────────────────────
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationLog]);

  // ─── Request geolocation ───────────────────────────────────────────────────
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setIsGettingLocation(false);
      },
      () => { setIsGettingLocation(false); },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // ─── Add message to conversation log ───────────────────────────────────────
  const addMessage = useCallback((role, text, extra = {}) => {
    const msg = { role, text, timestamp: Date.now(), ...extra };
    setConversationLog(prev => [...prev, msg]);
    conversationHistoryRef.current.push(msg);
  }, []);

  // ─── Speech Recognition Setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceErrorMsg('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setIsListening(true); hapticFeedback('listen_start'); };

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
      console.warn('[AiInspection] Recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setVoiceErrorMsg('Microphone access denied. Please enable microphone permissions.');
      } else if (event.error === 'network') {
        setVoiceErrorMsg('Network issue with voice recognition.');
      }
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if in voice mode
      if (voiceModeRef.current && !abortRef.current && !speakingRef.current) {
        setTimeout(() => {
          try {
            recognition.lang = selectedLanguage;
            recognition.start();
          } catch (e) {}
        }, 200);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch (e) {}
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  // ─── Text-to-Speech ────────────────────────────────────────────────────────
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

      utterance.onstart = () => { setIsSpeaking(true); speakingRef.current = true; hapticFeedback('speak_start'); };
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
      console.warn('[AiInspection] Start listening warning:', e.message);
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

      // Auto resolve if quiet for 12 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          recognitionRef.current?.removeEventListener('result', onResult);
          recognitionRef.current?.removeEventListener('end', onEnd);
          try { recognitionRef.current?.stop(); } catch (e) {}
          resolve(finalParts.join(' ').trim());
        }
      }, 12000);
    });
  }, []);

  // ─── Handle camera frame analysis (non-voice mode) ────────────────────────
  // Faster analysis: 1.5s throttle + auto-capture evidence when civic issue detected
  const handleFrame = useCallback(async (frame) => {
    if (abortRef.current || isPaused || voiceModeRef.current) return;

    // Throttle: analyze every 1.5 seconds for faster detection
    const now = Date.now();
    if (now - lastAnalysisTimeRef.current < 1500) return;
    lastAnalysisTimeRef.current = now;

    frameCountRef.current++;

    try {
      const result = await geminiService.inspectFrame(
        frame.base64,
        conversationHistoryRef.current.slice(-6),
        '',
        frame.mimeType
      );

      if (abortRef.current) return;

      if (result.success && result.observation) {
        setCurrentAnalysis(result);

        // Check for safety warnings
        const warning = detectSafetyWarning(result.observation);
        if (warning) { setSafetyWarning(warning); hapticFeedback('error'); }

        // Auto-capture evidence when a real civic issue is detected (not just blurry/unclear)
        const isRealIssue = result.category && result.category !== 'Unknown' && result.confidence !== 'low';
        if (isRealIssue && frameCountRef.current % 3 === 1) {
          setEvidenceImages(prev => [...prev, {
            id: `ev-auto-${Date.now()}`,
            base64: frame.base64,
            mimeType: frame.mimeType,
            timestamp: new Date().toISOString(),
            autoCaptured: true,
          }]);
        }

        // Add observation to list (deduplicate)
        setObservations(prev => {
          const lastObs = prev[prev.length - 1];
          if (lastObs && lastObs.category === result.category && Math.abs(lastObs.confidence === result.confidence)) {
            return prev;
          }
          return [...prev.slice(-9), result.observation];
        });

        // Add AI observation to conversation (only every 3rd frame to avoid spam)
        if (frameCountRef.current % 3 === 1) {
          addMessage('agent', result.observation, {
            category: result.category,
            severity: result.severity,
            confidence: result.confidence,
          });
        }
      }
    } catch (err) {
      console.warn('[AiInspection] Frame analysis error:', err);
    }
  }, [isPaused, addMessage]);

  // ─── LOCAL VOICE FALLBACK — smart state-machine when API fails ─────────────
  // Use a turn counter to vary responses and avoid repetition
  const localFallbackTurnRef = useRef(0);

  // ─── INTELLIGENT LOCAL VOICE RESPONSE ──────────────────────────────────────
  // Analyzes what the camera can see vs what it needs to ask about.
  // Only asks about info that CANNOT be determined from the camera frame.
  const generateLocalVoiceResponse = useCallback((userText, lang) => {
    const lower = (userText || '').toLowerCase();
    const info = collectedInfoRef.current;
    localFallbackTurnRef.current++;
    const turn = localFallbackTurnRef.current;
    const pick = (arr) => arr[(turn - 1) % arr.length];

    const isAck = !userText.trim() || lower.match(/^(yes|yeah|ok|okay|sure|hello|hi|namaste|haan|acha|ji|start|begin|go ahead|i\'m ready)$/);

    // ── EXTRACT info from EVERY message (bilingual) ──
    if (!isAck && userText.trim().length > 5) {
      if (!info.raw_problem && lower.length > 10) info.raw_problem = userText.trim();

      // Category
      if (!info.category) {
        if (lower.match(/flood|waterlog|drain|sewage|overflow|paani|nala|baadh|jalbhar/)) info.category = 'Water Management';
        else if (lower.match(/pothole|road|street|bridge|path|sadak|gali|crack|ghaav|toot/)) info.category = 'Road Infrastructure';
        else if (lower.match(/garbage|waste|trash|dump|kachra|safai|rubbish|gandagi/)) info.category = 'Waste Management';
        else if (lower.match(/light|electric|wire|power|bijli|streetlight|transformer|current/)) info.category = 'Energy & Power';
        else if (lower.match(/tree|fallen|branch|ped|pedh|gira/)) info.category = 'Environment';
        else if (lower.match(/pipe|leak|burst|tap|water supply|nal|pipeline/)) info.category = 'Water Supply';
        else if (lower.match(/encroach|illegal|construction|awaidh/)) info.category = 'Urban Planning';
      }

      // Severity
      if (!info.severity || info.severity === 'medium') {
        if (lower.match(/emergency|critical|dangerous|collapse|fire|accident|death|injur|khatarnak|aag|bhaag/)) info.severity = 'critical';
        else if (lower.match(/urgent|severe|badly|heavily|extensive|widespread|bahut|zyada|gambhir/)) info.severity = 'high';
        else if (lower.match(/small|minor|little|slight|thoda|halka/)) info.severity = 'low';
      }

      // Duration (bilingual)
      if (!info.duration) {
        const hindiNumMap = { 'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5, 'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10, 'bees': 20, 'tees': 30 };
        if (lower.match(/\b(\d+)\s*day/)) info.duration = lower.match(/\b(\d+)\s*day/)[1] + ' days';
        else if (lower.match(/\b(\d+)\s*week/)) info.duration = lower.match(/\b(\d+)\s*week/)[1] + ' weeks';
        else if (lower.match(/\b(\d+)\s*month/)) info.duration = lower.match(/\b(\d+)\s*month/)[1] + ' months';
        else if (lower.match(/\b(\d+)\s*year/)) info.duration = lower.match(/\b(\d+)\s*year/)[1] + ' years';
        else if (lower.match(/(ek|do|teen|char|paanch|chhe|saat|aath|nau|das|bees|tees)\s*(din|days)/)) {
          const num = hindiNumMap[lower.match(/(ek|do|teen|char|paanch|chhe|saat|aath|nau|das|bees|tees)/)[1]] || 1;
          info.duration = num + ' days';
        }
        else if (lower.match(/(ek|do|teen|char|paanch)\s*(haft|week)/)) {
          const num = hindiNumMap[lower.match(/(ek|do|teen|char|paanch)/)[1]] || 1;
          info.duration = num + ' weeks';
        }
        else if (lower.match(/(ek|do|teen|char|paanch|chhe|saat|aath|nau|das)\s*(mahin|month)/)) {
          const num = hindiNumMap[lower.match(/(ek|do|teen|char|paanch|chhe|saat|aath|nau|das)/)[1]] || 1;
          info.duration = num + ' months';
        }
        else if (userText.match(/(एक|दो|तीन|चार|पांच|छह|सात|आठ|नौ|दस|बीस)\s*(दिन|हफ्त|महिन|साल)/)) {
          const match = userText.match(/(एक|दो|तीन|चार|पांच|छह|सात|आठ|नौ|दस|बीस)\s*(दिन|हफ्त|महिन|साल)/);
          const devaNumMap = { 'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'बीस': 20 };
          const unitMap = { 'दिन': 'days', 'हफ्त': 'weeks', 'महिन': 'months', 'साल': 'years' };
          info.duration = (devaNumMap[match[1]] || 1) + ' ' + (unitMap[match[2]] || 'days');
        }
        else if (lower.match(/long time|bahut din|kaafi|pichle|since|bahut pehle/)) info.duration = 'over 6 months';
        else if (lower.match(/recently|abhi|kal|today|aaj/)) info.duration = 'recently';
      }

      // Who is affected
      if (!info.who_affected) {
        const popMatch = lower.match(/(\d[\d,]*)\s*(people|person|family|village|student|house|household|colony|mohalla|ward)/);
        if (popMatch) info.who_affected = `${popMatch[1]} ${popMatch[2]}s`;
        else if (lower.match(/(ek\s*do|do\s*char|kuch|kaafi|sab|poore?)\s*(log|ghar|parivar|family)/)) {
          info.who_affected = userText.trim().slice(0, 40);
        }
        else if (lower.match(/everyone|sab|poora|entire|whole/)) info.who_affected = 'Entire neighborhood';
        else if (lower.match(/my family|mera ghar|hamara|our/)) info.who_affected = 'Local families';
      }

      // Location
      if (!info.location) {
        const districts = ['ranchi', 'dumka', 'dhanbad', 'jamshedpur', 'bokaro', 'deoghar', 'hazaribagh', 'giridih', 'palamu', 'godda', 'pakur', 'jamtara', 'ramgarh', 'lohardaga', 'gumla', 'simdega', 'latehar', 'garhwa', 'koderma', 'chatra', 'khunti'];
        for (const d of districts) {
          if (lower.includes(d)) { info.location = d.charAt(0).toUpperCase() + d.slice(1); break; }
        }
        if (!info.location && lower.match(/(mere\s*ghar|hamare\s*ghar|ghar\s*ke\s*paas|paas|idhar|yahan|is\s*area|wahan)/)) {
          info.location = userText.trim().slice(0, 40);
        }
        if (!info.location && lower.match(/(near\s*my|here|this\s*area|this\s*place|my\s*house|my\s*street|my\s*colony|my\s*ward)/)) {
          info.location = userText.trim().slice(0, 40);
        }
        if (!info.location) {
          const areaMatch = lower.match(/(near|in|at|behind|next to|paas|mein)\s+(.+?)(?:\.|,|$)/);
          if (areaMatch) info.location = areaMatch[2].trim().slice(0, 40);
        }
      }
    }

    // ── DETERMINE WHAT'S MISSING (camera can see category/severity, but NOT duration/location/who) ──
    const hasProblem = !!info.raw_problem;
    const hasLocation = !!info.location;
    const hasDuration = !!info.duration;
    const hasAffected = !!info.who_affected;
    const hasCategory = !!info.category;
    const allCollected = hasProblem && hasLocation && hasDuration && hasAffected;

    // ── IF WE HAVE EVERYTHING → AUTO-DRAFT ──
    if (allCollected) {
      info._readyForReport = true;
      return lang === 'hi-IN'
        ? `Perfect! ${info.category || 'samasya'} — ${info.location} mein, ${info.duration} se, ${info.who_affected} ko affect kar raha hai. Report bana rahi hoon...`
        : `Perfect! I have everything — ${info.category || 'issue'} in ${info.location}, going on for ${info.duration}, affecting ${info.who_affected}. Let me draft your report now...`;
    }

    // ── ASK ONLY WHAT CAMERA CANNOT SEE — natural, contextual questions ──
    // Camera CAN see: category, severity, visual description
    // Camera CANNOT see: duration, location name, who is affected, how many people

    if (isAck) {
      // Just acknowledge — prompt them to show/describe
      if (!hasProblem && !hasCategory) {
        return lang === 'hi-IN'
          ? 'Haan, dikhao — camera us problem ki taraf rakho aur batao kya ho raha hai.'
          : 'Go ahead — point the camera at the problem and tell me what you see happening.';
      }
      // We already have something from camera — ask what we're missing
      if (!hasLocation) {
        return lang === 'hi-IN'
          ? `Haan, ${info.category || 'yeh samasya'} dikh raha hai. Yeh kis area mein hai? Ward, mohalla, ya koi landmark batao.`
          : `I can see the ${info.category || 'issue'}. Which area or neighborhood is this in?`;
      }
      if (!hasDuration) {
        return lang === 'hi-IN'
          ? `${info.location} mein hai — theek hai. Yeh kab se chal raha hai?`
          : `Got it — in ${info.location}. How long has this been going on?`;
      }
      if (!hasAffected) {
        return lang === 'hi-IN'
          ? `${info.duration} se hai. Kaun kaun log isse pareshan hain? Kitne ghar, kitne log?`
          : `Going on for ${info.duration}. Who is mainly affected by this?`;
      }
    }

    // ── SMART QUESTION ORDER: location → duration → who (camera already got category/severity) ──
    if (hasProblem && !hasLocation) {
      return lang === 'hi-IN'
        ? `${info.category || 'Yeh samasya'} dikh raha hai. Yeh kis shehar, ward, ya area mein hai? Koi nearby landmark batao.`
        : `I see the ${info.category || 'issue'}. Which district, ward, or area is this in? Any nearby landmark?`;
    }

    if (hasProblem && hasLocation && !hasDuration) {
      return lang === 'hi-IN'
        ? `${info.location} mein hai. Yeh kab se chal raha hai — din, hafta, ya mahina?`
        : `In ${info.location} — got it. How long has this been going on?`;
    }

    if (hasProblem && hasLocation && hasDuration && !hasAffected) {
      return lang === 'hi-IN'
        ? `${info.duration} se hai. Kitne log ya kaun se log isse pareshan hain?`
        : `For ${info.duration}. How many people or which community is affected?`;
    }

    // Fallback — ask for anything we're missing
    if (!hasProblem) {
      return lang === 'hi-IN'
        ? 'Kya ho raha hai wahan? Camera se dikh raha hai, par thoda aur batao kya problem hai.'
        : 'What exactly is happening? I can see through the camera, but tell me more about the problem.';
    }

    return lang === 'hi-IN'
      ? 'Aur kuch jo mujhe pata hona chahiye? Jaise yeh kitne logon ko affect kar raha hai?'
      : 'Anything else I should know? Like how many people this is affecting?';
  }, []);

  // ─── VOICE CONVERSATION ENGINE ─────────────────────────────────────────────
  // This is the core loop: Listen → Send frame+voice to Gemini → Speak → Repeat
  const startVoiceConversation = useCallback(async () => {
    voiceModeRef.current = true;
    setIsVoiceMode(true);
    voiceTurnCountRef.current = 0;
    setVoiceTurnCount(0);
    previousObservationsRef.current = [];
    spokenResponsesRef.current = new Set();
    collectedInfoRef.current = {};
    abortRef.current = false;

    // ── STEP 1: Greet + analyze camera frame FIRST ──
    const lang = detectedLang || selectedLanguage;
    const greeting = lang === 'hi-IN'
      ? 'Namaste! Camera on hai — main dekh rahi hoon. Batao kya ho raha hai.'
      : 'Hi! Camera is on — I can see your view. Tell me what you see and I\'ll help document everything.';
    addMessage('agent', greeting);
    await speak(greeting);

    if (abortRef.current) { voiceModeRef.current = false; return; }

    // ── STEP 2: Analyze camera frame FIRST to extract what we can see ──
    const initFrame = camera.latestFrameRef.current;
    const hasInitFrame = initFrame?.base64 && initFrame.base64.length > 100;

    if (hasInitFrame) {
      setIsThinking(true);
      try {
        const initResult = await geminiService.inspectFrame(
          initFrame.base64, [], '', initFrame.mimeType || 'image/jpeg', null
        );
        if (initResult?.success && initResult.category && initResult.category !== 'Unknown') {
          collectedInfoRef.current.category = initResult.category;
          collectedInfoRef.current.severity = initResult.severity || 'medium';
          setCurrentAnalysis(initResult);
          if (initResult.observation) {
            previousObservationsRef.current.push(initResult.observation);
            setObservations(prev => [...prev, initResult.observation]);
          }
          const seeMsg = lang === 'hi-IN'
            ? `Main dekh rahi hoon — ${initResult.observation || initResult.category}. Ab batana: yeh kis area mein hai aur kitne din se chal raha hai?`
            : `I can see — ${initResult.observation || initResult.category}. Now tell me: which area is this in and how long has it been going on?`;
          addMessage('agent', seeMsg, { category: initResult.category, severity: initResult.severity });
          await speak(seeMsg);
        } else {
          const askMsg = lang === 'hi-IN'
            ? 'Camera se kuch dikh nahi raha clearly. Batao kya ho raha hai wahan?'
            : 'Camera view isn\'t clear yet. What\'s happening there? Describe the problem.';
          addMessage('agent', askMsg);
          await speak(askMsg);
        }
      } catch (err) {
        const askMsg = lang === 'hi-IN'
          ? 'Thoda wait — analyze ho raha hai. Batao kya dikh raha hai?'
          : 'Give me a moment. What problem do you see?';
        addMessage('agent', askMsg);
        await speak(askMsg);
      }
      setIsThinking(false);
    }

    if (abortRef.current) { voiceModeRef.current = false; return; }

    // ── STEP 3: Main conversation — ask ONLY what camera can't determine ──
    const MAX_VOICE_TURNS = 6;

    for (let turn = 0; turn < MAX_VOICE_TURNS; turn++) {
      if (abortRef.current || !voiceModeRef.current) break;

      voiceTurnCountRef.current = turn + 1;
      setVoiceTurnCount(turn + 1);

      // 1. Start listening
      setInterimText('');
      startListening();

      // 2. Wait for user to speak
      const userMessage = await collectTranscript();
      stopListening();
      setInterimText('');

      if (abortRef.current) break;

      // 3. Handle empty responses
      const isEmpty = !userMessage.trim();
      const displayMsg = isEmpty ? '(waiting for you to speak...)' : userMessage;

      if (!isEmpty) {
        addMessage('user', displayMsg);

        // Detect language on first response
        if (turn === 0) {
          const detected = detectLanguage(userMessage);
          if (detected && detected !== selectedLanguage) {
            setDetectedLang(detected);
            setSelectedLanguage(detected);
          }
        }

        // Track collected info
        const lower = userMessage.toLowerCase();
        if (!collectedInfoRef.current.raw_problem && lower.length > 10) {
          collectedInfoRef.current.raw_problem = userMessage;
        }
        // Location detection
        const districts = ['ranchi', 'dumka', 'dhanbad', 'jamshedpur', 'bokaro', 'deoghar', 'hazaribagh', 'giridih', 'palamu', 'godda', 'pakur', 'jamtara', 'ramgarh', 'lohardaga', 'gumla', 'simdega', 'latehar', 'garhwa', 'koderma', 'chatra', 'khunti'];
        for (const d of districts) {
          if (lower.includes(d)) {
            collectedInfoRef.current.location = d.charAt(0).toUpperCase() + d.slice(1);
            break;
          }
        }
      }

      // 4. Send frame + voice to Gemini (or use local fallback)
      setIsThinking(true);
      hapticFeedback('thinking');
      const latestFrame = camera.latestFrameRef.current;
      const hasFrame = latestFrame?.base64 && latestFrame.base64.length > 100;

      let result;
      const localLang = detectedLang || selectedLanguage;

      if (hasFrame && !isEmpty) {
        // We have a frame AND user text — try the full API
        try {
          result = await geminiService.inspectFrame(
            latestFrame.base64,
            conversationHistoryRef.current.slice(-12),
            userMessage,
            latestFrame.mimeType || 'image/jpeg',
            {
              spokenText: userMessage,
              language: localLang,
              toneHint: detectToneHint(userMessage),
              previousObservations: previousObservationsRef.current.slice(-5),
              turnNumber: turn + 1,
            }
          );
        } catch (err) {
          result = null; // Will fall through to local fallback
        }
      } else if (hasFrame && isEmpty) {
        // Frame only, no speech — do silent frame analysis
        try {
          result = await geminiService.inspectFrame(
            latestFrame.base64,
            conversationHistoryRef.current.slice(-12),
            '',
            latestFrame.mimeType || 'image/jpeg',
            null
          );
        } catch (err) {
          result = null;
        }
      }

      // If API failed or no frame available — use local intelligence
      if (!result || !result.success) {
        const localResponse = generateLocalVoiceResponse(userMessage, localLang);
        const localInfo = collectedInfoRef.current;
        result = {
          success: true,
          spokenResponse: localResponse,
          observation: isEmpty ? null : userMessage,
          category: localInfo.category || 'Unknown',
          severity: localInfo.severity || 'medium',
          confidence: 'medium',
          missingInfo: [],
          suggestedAction: '',
          department: '',
          isReadyForReport: !!localInfo._readyForReport,
          _localFallback: true,
        };
      }

      setIsThinking(false);
      if (abortRef.current) break;

      // 5. Process result
      if (result.success) {
        // Update analysis display
        setCurrentAnalysis(result);

        // Track observation (no repeats)
        if (result.observation && !spokenResponsesRef.current.has(result.observation)) {
          previousObservationsRef.current.push(result.observation);
          spokenResponsesRef.current.add(result.observation);

          setObservations(prev => [...prev.slice(-9), result.observation]);
        }

        // Check safety
        const warning = detectSafetyWarning(result.observation || result.spokenResponse);
        if (warning) { setSafetyWarning(warning); hapticFeedback('error'); }

        // Track missing info
        if (result.missingInfo && result.missingInfo.length > 0) {
          setMissingInfoList(result.missingInfo);
        }

        // Get the spoken response
        const spokenResponse = result.spokenResponse || result.observation || 'I see something here. Let me analyze further.';

        // Check if we already said something very similar (dedup)
        // Only dedup if the response is EXACTLY the same (not just similar prefix)
        // Dedup — ask CONTEXTUAL questions based on what's actually missing
        let finalResponse = spokenResponse;
        if (spokenResponsesRef.current.has(spokenResponse)) {
          const info = collectedInfoRef.current;
          const localLang2 = detectedLang || selectedLanguage;
          if (!info.location) {
            finalResponse = localLang2 === 'hi-IN' ? 'Yeh kis area mein hai? Ward ya landmark batao.' : 'Which area or neighborhood is this in?';
          } else if (!info.duration) {
            finalResponse = localLang2 === 'hi-IN' ? `${info.location} mein hai. Kab se chal raha hai?` : `In ${info.location}. How long has this been going on?`;
          } else if (!info.who_affected) {
            finalResponse = localLang2 === 'hi-IN' ? 'Kitne log isse pareshan hain?' : 'How many people are affected?';
          } else {
            finalResponse = localLang2 === 'hi-IN' ? 'Aur kuch jo mujhe pata hona chahiye?' : 'Anything else I should know?';
          }
        }

        // Add to conversation and speak
        addMessage('agent', finalResponse, {
          category: result.category,
          severity: result.severity,
        });

        await speak(finalResponse);
        spokenResponsesRef.current.add(finalResponse);

        // Check if ready for report
        if (result.isReadyForReport) {
          const readyMsg = selectedLanguage === 'hi-IN'
            ? 'Bas! Saari info mil gayi. Ab report bana rahi hoon...'
            : 'Excellent! I now have all the information I need. Let me prepare your inspection report...';
          addMessage('agent', readyMsg);
          await speak(readyMsg);
          break;
        }
      } else {
        // Error handling — use local fallback instead of repeating error
        const errorMsg = generateLocalVoiceResponse(userMessage, detectedLang || selectedLanguage);
        addMessage('agent', errorMsg);
        await speak(errorMsg);
        spokenResponsesRef.current.add(errorMsg);
      }

      if (abortRef.current) break;
    }

    // ── WRAP UP ──
    if (!abortRef.current && voiceModeRef.current) {
      // If we never got enough info, ask one more time
      if (!collectedInfoRef.current.raw_problem) {
        const lastChance = selectedLanguage === 'hi-IN'
          ? 'Mujhe abhi tak samajh nahi aaya. Batao na — exact kya ho raha hai wahan?'
          : 'I still need to understand the problem. What exactly is happening here?';
        addMessage('agent', lastChance);
        await speak(lastChance);
        startListening();
        const lastAnswer = await collectTranscript();
        stopListening();
        if (lastAnswer.trim()) {
          addMessage('user', lastAnswer);
          collectedInfoRef.current.raw_problem = lastAnswer;
        }
      }

      voiceModeRef.current = false;
      setIsVoiceMode(false);

      // Check if we have enough info for auto-report
      const info = collectedInfoRef.current;
      const hasEnough = info.raw_problem && info.location && info.duration && info.who_affected;

      if (hasEnough) {
        // Auto-generate report immediately
        const readyMsg = selectedLanguage === 'hi-IN'
          ? 'Shukriya! Sab info mil gayi. Ab report bana rahi hoon...'
          : 'Thank you! I have all the info. Generating your report now...';
        addMessage('agent', readyMsg);
        await speak(readyMsg);
        hapticFeedback('report_ready');

        // Auto-trigger report generation
        setInspectionState(INSPECTION_STATES.PROCESSING);
        try {
          const reportResult = await geminiService.generateInspectionReport({
            observations: previousObservationsRef.current,
            category: info.category || currentAnalysis?.category || '',
            location: info.location || location || '',
            userNotes: conversationHistoryRef.current.filter(m => m.role === 'user').map(m => m.text).join(' '),
          });
          if (!abortRef.current && reportResult.success) {
            setReportDraft(reportResult);
            setInspectionState(INSPECTION_STATES.REVIEW);
            hapticFeedback('report_ready');
          }
        } catch (err) {
          console.warn('[AiInspection] Auto-report generation error:', err);
          setInspectionState(INSPECTION_STATES.READY_TO_REPORT);
        }
      } else {
        // Not enough info — show manual report button
        setInspectionState(INSPECTION_STATES.READY_TO_REPORT);
        addMessage('agent', selectedLanguage === 'hi-IN'
          ? 'Shukriya! Aapki report ban rahi hai. Ek second...'
          : 'Thank you! Your inspection report is being prepared.');
      }
    }

    voiceModeRef.current = false;
    setIsVoiceMode(false);
  }, [selectedLanguage, detectedLang, speak, startListening, stopListening, collectTranscript, addMessage, camera]);

  // ─── Start inspection (non-voice) ──────────────────────────────────────────
  const handleStartInspection = useCallback(async () => {
    abortRef.current = false;
    setInspectionState(INSPECTION_STATES.CAMERA_PERMISSION);

    const started = await camera.startCamera(true);
    if (!started) {
      setInspectionState(INSPECTION_STATES.ERROR);
      return;
    }

    setInspectionState(INSPECTION_STATES.CONNECTING);
    requestLocation();
    await new Promise(r => setTimeout(r, 800));

    addMessage('agent', 'Camera active. I can see your view. Point me at the civic issue and I\'ll analyze it in real-time.');

    setInspectionState(INSPECTION_STATES.LIVE);
    camera.startFrameCapture(handleFrame, 1);
  }, [camera, handleFrame, addMessage, requestLocation]);

  // ─── Start voice inspection ────────────────────────────────────────────────
  const handleStartVoiceInspection = useCallback(async () => {
    abortRef.current = false;
    setInspectionState(INSPECTION_STATES.CAMERA_PERMISSION);

    const started = await camera.startCamera(true);
    if (!started) {
      setInspectionState(INSPECTION_STATES.ERROR);
      return;
    }

    setInspectionState(INSPECTION_STATES.CONNECTING);
    requestLocation();
    await new Promise(r => setTimeout(r, 800));

    setInspectionState(INSPECTION_STATES.VOICE_ACTIVE);

    // Start voice conversation (this handles its own frame analysis)
    await startVoiceConversation();

    // After voice conversation ends, check state
    if (!abortRef.current) {
      setInspectionState(INSPECTION_STATES.READY_TO_REPORT);
    }
  }, [camera, requestLocation, startVoiceConversation]);

  // ─── Stop inspection ───────────────────────────────────────────────────────
  const handleStopInspection = useCallback(() => {
    abortRef.current = true;
    voiceModeRef.current = false;
    setIsVoiceMode(false);
    camera.stopFrameCapture();
    camera.stopCamera();
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsListening(false);
    setInspectionState(INSPECTION_STATES.READY_TO_REPORT);
    addMessage('agent', 'Inspection paused. You can generate a report from what we\'ve observed, or resume inspection.');
  }, [camera, addMessage, stopListening]);

  // ─── Pause/Resume ──────────────────────────────────────────────────────────
  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      if (!voiceModeRef.current) {
        camera.startFrameCapture(handleFrame, 1);
      }
      addMessage('agent', 'Inspection resumed.');
    } else {
      setIsPaused(true);
      camera.stopFrameCapture();
      addMessage('agent', 'Inspection paused. Camera is still active.');
    }
  }, [isPaused, camera, handleFrame, addMessage]);

  // ─── Capture evidence still ────────────────────────────────────────────────
  const handleCaptureEvidence = useCallback(() => {
    const still = camera.captureStill();
    if (still) {
      setEvidenceImages(prev => [...prev, {
        id: `ev-${Date.now()}`,
        base64: still.base64,
        mimeType: still.mimeType,
        timestamp: new Date().toISOString(),
      }]);
      addMessage('user', '📸 Evidence photo captured');
    }
  }, [camera, addMessage]);

  // ─── Send chat message (text fallback) ─────────────────────────────────────
  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    addMessage('user', userMsg);

    setIsThinking(true);
    const latestFrame = camera.latestFrameRef.current;
    try {
      const result = await geminiService.inspectFrame(
        latestFrame?.base64 || '',
        conversationHistoryRef.current.slice(-8),
        userMsg,
        latestFrame?.mimeType || 'image/jpeg'
      );

      if (result.success && result.observation) {
        addMessage('agent', result.spokenResponse || result.observation, {
          category: result.category,
          severity: result.severity,
        });
      }
    } catch (err) {
      addMessage('agent', 'I had trouble processing that. Could you try again?');
    } finally {
      setIsThinking(false);
    }
  }, [chatInput, camera, addMessage]);

  // ─── Generate final report ─────────────────────────────────────────────────
  const handleGenerateReport = useCallback(async () => {
    setIsGeneratingReport(true);
    setInspectionState(INSPECTION_STATES.PROCESSING);

    try {
      const result = await geminiService.generateInspectionReport({
        observations,
        category: currentAnalysis?.category || '',
        location,
        userNotes: conversationLog.filter(m => m.role === 'user').map(m => m.text).join(' '),
      });

      if (result.success) {
        setReportDraft(result);
        setInspectionState(INSPECTION_STATES.REVIEW);
        hapticFeedback('report_ready');
      }
    } catch (err) {
      console.warn('[AiInspection] Report generation error:', err);
      hapticFeedback('error');
    } finally {
      setIsGeneratingReport(false);
    }
  }, [observations, currentAnalysis, location, conversationLog]);

  // ─── Submit report ─────────────────────────────────────────────────────────
  const handleSubmitReport = useCallback(() => {
    if (!reportDraft) return;

    const evidenceItems = evidenceImages.map(img => ({
      id: img.id,
      name: `evidence-${img.timestamp}.jpg`,
      type: img.mimeType,
      size: Math.round((img.base64.length * 3) / 4),
      url: `data:${img.mimeType};base64,${img.base64}`,
    }));

    onSubmitInspection?.({
      ...reportDraft,
      latitude: coords?.lat || 23.3441,
      longitude: coords?.lng || 85.3090,
      location: location || reportDraft.location || '',
      evidence: evidenceItems,
      ai_inspected: true,
      ai_observations: observations,
      ai_confidence: reportDraft.aiConfidence,
      inspection_started_at: conversationLog[0]?.timestamp ? new Date(conversationLog[0].timestamp).toISOString() : null,
      inspection_completed_at: new Date().toISOString(),
    });

    setInspectionState(INSPECTION_STATES.SUBMITTED);
    hapticFeedback('submit');
    setTimeout(() => onClose?.(), 1500);
  }, [reportDraft, evidenceImages, coords, location, observations, conversationLog, onSubmitInspection, onClose]);

  // ─── Audio Waveform: Setup & Teardown ─────────────────────────────────────
  const stopWaveform = useCallback(() => {
    if (waveformAnimFrameRef.current) {
      cancelAnimationFrame(waveformAnimFrameRef.current);
      waveformAnimFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    // Clear canvas
    const canvas = waveformCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startWaveform = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;

      const canvas = waveformCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const smoothData = smoothDataRef.current;

      let thinkingPhase = 0; // Counter for idle thinking animation

      function drawWaveform() {
        waveformAnimFrameRef.current = requestAnimationFrame(drawWaveform);

        // Resize canvas to match display size (handle DPR)
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);
        }

        const w = rect.width;
        const h = rect.height;

        ctx.clearRect(0, 0, w, h);

        // Read live state from refs (avoids stale closure)
        const listening = isListeningRef.current;
        const speaking = isSpeakingRef.current;
        const thinking = isThinkingRef.current;
        const isActive = listening || speaking || thinking;

        // If nothing active, decay bars smoothly and return
        if (!isActive) {
          let hasBars = false;
          for (let i = 0; i < smoothData.length; i++) {
            if (smoothData[i] > 0.01) { smoothData[i] *= 0.85; hasBars = true; }
          }
          if (!hasBars) return;
        }

        // Only fetch real audio data when mic is active
        if (listening || speaking) {
          analyser.getByteFrequencyData(dataArray);
        }

        // Pick a subset of frequency bins for the bars
        const barCount = 48;
        const step = Math.floor(bufferLength / barCount);
        const barWidth = Math.max(2, (w - (barCount - 1) * 3) / barCount);
        const maxHeight = h * 0.85;

        // Determine color mode
        let mode = 'idle';
        if (listening) mode = 'listening';
        else if (speaking) mode = 'speaking';
        else if (thinking) mode = 'thinking';

        // Smoothly interpolate colors toward target palette
        const target = COLOR_PALETTES.current[mode];
        const current = currentColorsRef.current;
        const lerpSpeed = 0.06; // ~6 frames to mostly transition
        for (let s = 0; s < 3; s++) {
          for (let c = 0; c < 4; c++) {
            current.stops[s][c] += (target.stops[s][c] - current.stops[s][c]) * lerpSpeed;
          }
        }
        for (let c = 0; c < 4; c++) {
          current.glow[c] += (target.glow[c] - current.glow[c]) * lerpSpeed;
        }

        // Build gradient from interpolated colors
        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        for (let s = 0; s < 3; s++) {
          const [r, g, b, a] = current.stops[s];
          gradient.addColorStop(s * 0.5, `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(3)})`);
        }

        // Smoothly lerp the canvas container background color
        const bg = current.stops[0]; // Use bottom stop color, fade to black
        canvas.style.background = `linear-gradient(180deg, rgba(${Math.round(bg[0])},${Math.round(bg[1])},${Math.round(bg[2])},0.08) 0%, rgba(0,0,0,0.5) 100%)`;
        // Smoothly lerp the border color
        const borderC = current.stops[1]; // Use middle stop for border
        canvas.style.borderColor = `rgba(${Math.round(borderC[0])},${Math.round(borderC[1])},${Math.round(borderC[2])},0.35)`;

        // Center the waveform
        const totalWidth = barCount * (barWidth + 3) - 3;
        const offsetX = (w - totalWidth) / 2;

        // Advance thinking phase for idle animation
        if (thinking && !listening && !speaking) {
          thinkingPhase += 0.04;
        }

        for (let i = 0; i < barCount; i++) {
          let val;

          if (listening || speaking) {
            // Real audio data
            const dataIndex = Math.min(i * step, bufferLength - 1);
            const raw = dataArray[dataIndex] / 255.0;
            const smoothFactor = 0.35;
            smoothData[i] = smoothData[i] * (1 - smoothFactor) + raw * smoothFactor;
            val = smoothData[i];
          } else if (thinking) {
            // Idle thinking animation: gentle wave that flows across bars
            // Combine multiple sine waves for organic feel
            const normalizedPos = i / barCount;
            const wave1 = Math.sin(normalizedPos * Math.PI * 3 + thinkingPhase) * 0.3;
            const wave2 = Math.sin(normalizedPos * Math.PI * 5 + thinkingPhase * 1.3) * 0.15;
            const wave3 = Math.sin(normalizedPos * Math.PI * 1.5 + thinkingPhase * 0.7) * 0.2;
            // Envelope: stronger in the center, quieter at edges
            const envelope = Math.sin(normalizedPos * Math.PI) * 0.8 + 0.2;
            const target = (0.15 + wave1 + wave2 + wave3) * envelope;
            // Smooth toward target
            smoothData[i] = smoothData[i] * 0.88 + target * 0.12;
            val = Math.max(0.04, smoothData[i]);
          } else {
            // Decay
            smoothData[i] *= 0.85;
            val = smoothData[i];
          }

          const barH = Math.max(2, val * maxHeight);
          const x = offsetX + i * (barWidth + 3);
          const y = (h - barH) / 2;

          ctx.fillStyle = gradient;
          ctx.beginPath();
          const radius = Math.min(barWidth / 2, 4);
          ctx.roundRect(x, y, barWidth, barH, radius);
          ctx.fill();

          // Glow effect on taller bars
          if (val > 0.4) {
            const [gr, gg, gb, ga] = current.glow;
            ctx.shadowColor = `rgba(${Math.round(gr)}, ${Math.round(gg)}, ${Math.round(gb)}, ${ga.toFixed(3)})`;
            ctx.shadowBlur = val * 15;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      drawWaveform();
    } catch (err) {
      console.warn('[AiInspection] Could not start waveform:', err.message);
    }
  }, []);

  // Start/stop waveform based on voice mode + listening/speaking/thinking state
  useEffect(() => {
    if (isVoiceMode && (isListening || isSpeaking || isThinking)) {
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        startWaveform();
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
  }, [isVoiceMode, isListening, isSpeaking, isThinking, startWaveform]);

  // Cleanup waveform on unmount
  useEffect(() => {
    return () => stopWaveform();
  }, [stopWaveform]);

  // ─── Cleanup on close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      abortRef.current = true;
      voiceModeRef.current = false;
      setIsVoiceMode(false);
      camera.stopFrameCapture();
      camera.stopCamera();
      stopListening();
      stopWaveform();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setConversationLog([]);
      setObservations([]);
      setCurrentAnalysis(null);
      setSafetyWarning(null);
      setEvidenceImages([]);
      setReportDraft(null);
      setInspectionState(INSPECTION_STATES.IDLE);
      setIsPaused(false);
      setIsListening(false);
      setIsSpeaking(false);
      setIsThinking(false);
      setVoiceTurnCount(0);
      setMissingInfoList([]);
      setInterimText('');
      frameCountRef.current = 0;
      conversationHistoryRef.current = [];
      previousObservationsRef.current = [];
      spokenResponsesRef.current = new Set();
      collectedInfoRef.current = {};
    }
  }, [isOpen, camera, stopListening, stopWaveform]);

  if (!isOpen) return null;

  const orbState = isVoiceMode
    ? (isSpeaking ? 'speaking' : isListening ? 'listening' : isThinking ? 'thinking' : 'live')
    : inspectionState === 'LIVE' ? (isPaused ? 'paused' : 'live') : inspectionState === 'PROCESSING' ? 'thinking' : 'idle';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(2, 11, 25, 0.92)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '8px', fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '920px',
        boxShadow: '0 25px 70px rgba(0, 15, 45, 0.6), 0 0 30px rgba(27,42,74, 0.15)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '95vh',
        position: 'relative',
      }}>
        {/* Flag accent */}
        <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }} />        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 60%, #243b6a 100%)',
          borderBottom: '1px solid rgba(200,134,10,0.15)',
          padding: isMobile ? '8px 10px' : '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: isMobile ? '28px' : '34px', height: isMobile ? '28px' : '34px', borderRadius: isMobile ? '8px' : '10px',
              background: orbState === 'live' ? 'linear-gradient(135deg, #10b981, #059669)'
                : orbState === 'speaking' ? 'linear-gradient(135deg, #10b981, #059669)'
                : orbState === 'listening' ? 'linear-gradient(135deg, var(--accent), #dc2626)'
                : orbState === 'thinking' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                : orbState === 'paused' ? 'linear-gradient(135deg, #d97706, #b45309)'
                : 'linear-gradient(135deg, var(--primary), #0284c7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: orbState === 'live' ? '0 0 20px rgba(16,185,129,0.6)'
                : orbState === 'speaking' ? '0 0 20px rgba(16,185,129,0.6)'
                : orbState === 'listening' ? '0 0 20px rgba(200,134,10,0.6)'
                : orbState === 'thinking' ? '0 0 20px rgba(139,92,246,0.6)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {isListening ? <Mic size={17} color="#fff" /> : isSpeaking ? <Volume2 size={17} color="#fff" /> : <Eye size={17} color="#fff" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.52rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#d4a843', fontWeight: 800, background: 'rgba(200,134,10,0.12)', padding: '2px 6px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(200,134,10,0.25)' }}>AI Inspect</span>
                <span style={{ fontSize: '0.52rem', background: 'rgba(200,134,10,0.2)', color: '#d4a843', padding: '2px 6px', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>Gemini AI</span>
                {isVoiceMode && (
                  <span style={{ fontSize: '0.52rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '1px 5px', borderRadius: '6px', fontWeight: 800, animation: 'pulse 1.5s infinite' }}>🎙️ LIVE VOICE</span>
                )}
              </div>
              <h3 style={{ fontSize: isMobile ? '0.75rem' : '0.9rem', fontWeight: 800, margin: '2px 0 0', color: '#fff' }}>Camera Inspection</h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Language selector */}
            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', color: '#fff', fontSize: '0.65rem', padding: '3px 5px', outline: 'none', cursor: 'pointer', fontWeight: 700 }}>
              <option value="en-IN" style={{ color: '#0f172a' }}>English</option>
              <option value="hi-IN" style={{ color: '#0f172a' }}>हिन्दी</option>
            </select>
            {(inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.2)', padding: '3px 8px', borderRadius: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>LIVE</span>
              </div>
            )}
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '6px', color: '#fff', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Camera Panel */}
          <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', flexDirection: 'column', position: 'relative', background: '#000', minWidth: 0, height: isMobile ? '45vh' : undefined, minHeight: isMobile ? '200px' : undefined }}>
            {/* Video Feed */}
            <div ref={videoContainerRef} style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '120px' : '300px' }}>
              <video
                ref={camera.videoRef}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: camera.isActive ? 'block' : 'none' }}
                playsInline
                muted
              />
              <canvas ref={camera.canvasRef} style={{ display: 'none' }} />

              {/* ═══ WAVEFORM VISUALIZATION CANVAS ═══ */}
              {isVoiceMode && (isListening || isSpeaking || isThinking) && (
                <canvas
                  ref={waveformCanvasRef}
                  style={{
                    position: 'absolute', bottom: '70px', left: '10px', right: '10px',
                    height: '70px', zIndex: 5, pointerEvents: 'none',
                    borderRadius: '12px',
                    // Solid background that lerps smoothly via JS (CSS can't transition gradients)
                    background: 'rgba(0,0,0,0.45)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    backdropFilter: 'blur(4px)',
                    transition: 'border-color 0.6s ease, background 0.6s ease',
                  }}
                />
              )}

              {/* Waveform label */}
              {isVoiceMode && (isListening || isSpeaking || isThinking) && (
                <div style={{
                  position: 'absolute', bottom: '145px', left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 12px', borderRadius: '8px',
                  background: isListening ? 'rgba(200,134,10,0.85)' : isSpeaking ? 'rgba(16,185,129,0.85)' : 'rgba(139,92,246,0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '6px', zIndex: 5,
                  boxShadow: isListening ? '0 2px 12px rgba(200,134,10,0.4)' : isSpeaking ? '0 2px 12px rgba(16,185,129,0.4)' : '0 2px 12px rgba(139,92,246,0.4)',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                  animation: isThinking && !isListening && !isSpeaking ? 'thinkingPulse 2s ease-in-out infinite' : 'none',
                }}>
                  {isListening ? (
                    <><Mic size={12} /> Listening — Speak now</>
                  ) : isSpeaking ? (
                    <><Volume2 size={12} /> AI is speaking...</>
                  ) : (
                    <><RefreshCw size={12} className="spin" /> Analyzing what you said...</>
                  )}
                </div>
              )}

              {/* Camera inactive overlay */}
              {!camera.isActive && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 100%)', color: '#fff', gap: isMobile ? '8px' : '16px', padding: isMobile ? '10px' : '0' }}>
                  <div style={{ width: isMobile ? '48px' : '72px', height: isMobile ? '48px' : '72px', borderRadius: '50%', background: 'rgba(200,134,10,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(200,134,10,0.3)' }}>
                    <Camera size={isMobile ? 22 : 32} color="#d4a843" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: isMobile ? '0.85rem' : '1.1rem', fontWeight: 800, margin: '0 0 2px' }}>AI Inspect</h3>
                    {!isMobile && <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, maxWidth: '300px' }}>Point your camera at a civic problem. Gemini AI will analyze it — with voice conversation or live text.</p>}
                  </div>
                  {camera.error && (
                    <div style={{ padding: '8px 14px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', fontSize: '0.78rem', color: '#fca5a5', maxWidth: '300px', textAlign: 'center' }}>
                      {camera.error}
                    </div>
                  )}
                  {voiceErrorMsg && (
                    <div style={{ padding: '8px 14px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', fontSize: '0.78rem', color: '#fca5a5', maxWidth: '300px', textAlign: 'center' }}>
                      {voiceErrorMsg}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: isMobile ? '8px' : '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={handleStartVoiceInspection} style={{
                      padding: isMobile ? '10px 16px' : '12px 24px', borderRadius: '10px', border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                      fontSize: isMobile ? '0.78rem' : '0.88rem', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                    }}>
                      <Mic size={16} /> Start Voice Inspection
                    </button>
                    <button onClick={handleStartInspection} style={{
                      padding: isMobile ? '10px 16px' : '12px 24px', borderRadius: '10px', border: '1px solid rgba(200,134,10,0.4)',
                      background: 'rgba(200,134,10,0.1)', color: '#d4a843',
                      fontSize: isMobile ? '0.78rem' : '0.85rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <Play size={14} /> Camera Only
                    </button>
                  </div>
                </div>
              )}

              {/* Safety Warning Overlay */}
              {safetyWarning && (
                <div style={{
                  position: 'absolute', top: '10px', left: '10px', right: '10px',
                  padding: '10px 14px', background: 'rgba(220, 38, 38, 0.95)',
                  borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  animation: 'fadeIn 0.3s ease',
                  boxShadow: '0 4px 16px rgba(220,38,38,0.4)',
                }}>
                  <Shield size={18} />
                  <span>{safetyWarning}</span>
                  <button onClick={() => setSafetyWarning(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={14} /></button>
                </div>
              )}

              {/* Live indicator */}
              {(inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && !isPaused && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  padding: '4px 10px', borderRadius: '6px',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isVoiceMode && isSpeaking ? '#10b981' : isVoiceMode && isListening ? 'var(--accent)' : '#ef4444', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '0.68rem', color: '#fff', fontWeight: 700 }}>{isVoiceMode ? (isSpeaking ? 'SPEAKING' : isListening ? 'LISTENING' : 'VOICE') : 'REC'}</span>
                  <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Frame {frameCountRef.current}</span>
                </div>
              )}

              {/* Voice listening indicator with interim text */}
              {isVoiceMode && isListening && interimText && (
                <div style={{
                  position: 'absolute', top: '50px', left: '10px', right: '10px',
                  padding: '10px 14px', background: 'rgba(200,134,10,0.9)', backdropFilter: 'blur(8px)',
                  borderRadius: '10px', color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                  fontStyle: 'italic', textAlign: 'center',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  🎙️ "{interimText}..."
                </div>
              )}

              {/* Voice thinking indicator */}
              {isVoiceMode && isThinking && (
                <div style={{
                  position: 'absolute', top: '50px', left: '10px', right: '10px',
                  padding: '10px 14px', background: 'rgba(139,92,246,0.9)', backdropFilter: 'blur(8px)',
                  borderRadius: '10px', color: '#fff', fontSize: '0.82rem', fontWeight: 700,
                  textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <RefreshCw size={14} className="spin" />
                  <span>Analyzing what you said...</span>
                </div>
              )}

              {/* Gemini Observation Bubble — Real-time detection overlay */}
              {currentAnalysis && (inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && (
                <div style={{
                  position: 'absolute', bottom: '10px', left: '10px', right: '10px',
                  padding: '10px 14px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
                  borderRadius: '12px', border: '1px solid rgba(200,134,10,0.3)',
                  animation: 'fadeIn 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Bot size={14} color="#d4a843" />
                    <span style={{ fontSize: '0.7rem', color: '#d4a843', fontWeight: 700 }}>Gemini Observation</span>
                    {currentAnalysis.category && currentAnalysis.category !== 'Unknown' && (
                      <span style={{
                        fontSize: '0.58rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, marginLeft: 'auto',
                        background: currentAnalysis.severity === 'critical' ? 'rgba(220,38,38,0.3)' : currentAnalysis.severity === 'high' ? 'rgba(234,88,12,0.3)' : 'rgba(16,185,129,0.3)',
                        color: currentAnalysis.severity === 'critical' ? '#fca5a5' : currentAnalysis.severity === 'high' ? '#fdba74' : '#6ee7b7'
                      }}>
                        {currentAnalysis.category} • {currentAnalysis.severity}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                    {currentAnalysis.observation}
                  </p>
                  {currentAnalysis.missingInfo && currentAnalysis.missingInfo.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {currentAnalysis.missingInfo.map((info, i) => (
                        <span key={i} style={{ fontSize: '0.58rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,193,7,0.2)', color: '#fbbf24', fontWeight: 700 }}>❓ {info}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Camera Controls Bar */}
            {camera.isActive && (
              <div style={{
                padding: isMobile ? '6px 8px' : '8px 12px', background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '5px' : '8px', flexWrap: 'wrap',
              }}>
                {/* Voice toggle button */}
                {!isVoiceMode && (
                  <button onClick={handleStartVoiceInspection} title="Start Voice Mode" style={{
                    width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #10b981',
                    background: 'rgba(16,185,129,0.15)', color: '#10b981', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse 2s infinite',
                  }}>
                    <Mic size={18} />
                  </button>
                )}

                {isVoiceMode && (
                  <button onClick={() => { abortRef.current = true; voiceModeRef.current = false; setIsVoiceMode(false); stopListening(); if (window.speechSynthesis) window.speechSynthesis.cancel(); setIsSpeaking(false); setIsListening(false); setInspectionState(INSPECTION_STATES.LIVE); camera.startFrameCapture(handleFrame, 1); }} title="Exit Voice Mode" style={{
                    width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                    background: 'rgba(255,255,255,0.1)', color: '#fbbf24', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <VolumeX size={16} />
                  </button>
                )}

                {!isVoiceMode && (
                  <button onClick={handleTogglePause} title={isPaused ? 'Resume' : 'Pause'} style={{
                    width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                    background: isPaused ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                    color: isPaused ? '#10b981' : '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPaused ? <Play size={16} /> : <PauseIcon size={16} />}
                  </button>
                )}

                <button onClick={handleCaptureEvidence} title="Capture Evidence" style={{
                  width: '42px', height: '42px', borderRadius: '50%', border: '3px solid #fff',
                  background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}>
                  <Image size={18} color="#fff" />
                </button>

                <button onClick={camera.switchCamera} title="Switch Camera" style={{
                  width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                  background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SwitchCamera size={16} />
                </button>

                {camera.hasTorch && (
                  <button onClick={camera.toggleTorch} title="Toggle Flashlight" style={{
                    width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                    background: camera.torchOn ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.1)',
                    color: camera.torchOn ? '#fbbf24' : '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {camera.torchOn ? <Flashlight size={16} /> : <FlashlightOff size={16} />}
                  </button>
                )}

                <button onClick={handleStopInspection} title="Stop Inspection" style={{
                  width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                  background: 'rgba(220,38,38,0.2)', color: '#ef4444', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <StopCircle size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: Observation + Chat */}
          <div style={{
            width: isMobile ? '100%' : '320px', display: 'flex', flexDirection: 'column',
            borderLeft: isMobile ? 'none' : '1px solid var(--border-subtle)', borderTop: isMobile ? '1px solid var(--border-subtle)' : 'none',
            background: 'var(--bg-secondary)', flexShrink: 0, flex: isMobile ? 1 : 'none', minHeight: isMobile ? 0 : undefined,
            overflow: 'hidden',
          }}>
            {/* Panel Header */}
            <div style={{ padding: isMobile ? '8px 10px' : '10px 12px', borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} color="var(--primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gemini Observation</span>
                  {isVoiceMode && (
                    <span style={{ fontSize: '0.58rem', background: 'var(--success-light)', color: 'var(--success)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>🎙️ Voice Active</span>
                  )}
                </div>
                <button onClick={() => setShowObservationPanel(!showObservationPanel)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  {showObservationPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {/* Observation Details — Real-Time Detection Card */}
            {showObservationPanel && (
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
                {/* Detection Status Card */}
                <div style={{
                  padding: '8px 10px', borderRadius: '8px', marginBottom: '8px',
                  background: currentAnalysis?.category && currentAnalysis.category !== 'Unknown'
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))'
                    : 'rgba(100,116,139,0.05)',
                  border: `1px solid ${currentAnalysis?.category && currentAnalysis.category !== 'Unknown' ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.15)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: currentAnalysis?.category && currentAnalysis.category !== 'Unknown' ? '#10b981' : '#94a3b8',
                      animation: (inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && !isPaused ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: currentAnalysis?.category && currentAnalysis.category !== 'Unknown' ? '#059669' : '#64748b' }}>
                      {currentAnalysis?.category && currentAnalysis.category !== 'Unknown' ? 'Issue Detected' : 'Scanning...'}
                    </span>
                    {evidenceImages.length > 0 && (
                      <span style={{ fontSize: '0.58rem', background: 'rgba(27,42,74,0.08)', color: 'var(--primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, marginLeft: 'auto' }}>
                        📸 {evidenceImages.length} photo{evidenceImages.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {/* Detection metrics row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.55rem', letterSpacing: '0.06em' }}>Category</span>
                      <div style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '1px', fontSize: '0.72rem' }}>{currentAnalysis?.category || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.55rem', letterSpacing: '0.06em' }}>Severity</span>
                      <div style={{
                        fontWeight: 800, marginTop: '1px', textTransform: 'uppercase', fontSize: '0.72rem',
                        color: currentAnalysis?.severity === 'critical' ? '#dc2626' : currentAnalysis?.severity === 'high' ? '#ea580c' : currentAnalysis?.severity === 'medium' ? '#0284c7' : '#059669'
                      }}>{currentAnalysis?.severity || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.55rem', letterSpacing: '0.06em' }}>Dept</span>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '1px', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentAnalysis?.department || '—'}</div>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  {currentAnalysis?.confidence && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Confidence</span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: currentAnalysis.confidence === 'high' ? '#059669' : currentAnalysis.confidence === 'medium' ? '#d97706' : '#dc2626' }}>{currentAnalysis.confidence}</span>
                      </div>
                      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
                          width: currentAnalysis.confidence === 'high' ? '90%' : currentAnalysis.confidence === 'medium' ? '60%' : '30%',
                          background: currentAnalysis.confidence === 'high' ? 'linear-gradient(90deg, #10b981, #059669)' : currentAnalysis.confidence === 'medium' ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)'
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                {currentAnalysis?.suggestedAction && (
                  <div style={{ padding: '6px 8px', background: 'rgba(27,42,74,0.04)', borderRadius: '6px', border: '1px solid rgba(27,42,74,0.1)' }}>
                    <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Suggested Action</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#1e293b', lineHeight: 1.4 }}>{currentAnalysis.suggestedAction}</p>
                  </div>
                )}

                {/* Missing Info Panel */}
                {missingInfoList.length > 0 && (
                  <div style={{ marginTop: '6px', padding: '6px 8px', background: 'rgba(255,193,7,0.08)', borderRadius: '6px', border: '1px solid rgba(255,193,7,0.25)' }}>
                    <span style={{ fontSize: '0.58rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>❓ Information Needed</span>
                    <ul style={{ margin: '4px 0 0', paddingLeft: '14px', fontSize: '0.65rem', color: '#78350f' }}>
                      {missingInfoList.map((info, i) => <li key={i} style={{ marginBottom: '1px' }}>{info}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Location */}                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>                  <MapPin size={12} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Add location (e.g., Main Road, Ranchi)"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '0.75rem', color: 'var(--text-primary)', outline: 'none' }}
                />
                {isGettingLocation && <RefreshCw size={12} className="spin" color="var(--text-muted)" />}
              </div>
            </div>            {/* Conversation Log */}
            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '8px 10px' : '10px 12px', display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px', minHeight: 0, background: 'var(--bg-primary)', backgroundImage: 'radial-gradient(rgba(27,42,74,0.025) 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
              {conversationLog.length === 0 && (

                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Start inspection to begin AI analysis
                </div>
              )}
              {conversationLog.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end', gap: '6px', animation: 'fadeIn 0.2s ease' }}>
                  {msg.role === 'agent' && (
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={11} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%', padding: '7px 10px',
                    borderRadius: msg.role === 'agent' ? '2px 10px 10px 10px' : '10px 2px 10px 10px',
                    background: msg.role === 'agent' ? '#fff' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                    color: msg.role === 'agent' ? 'var(--text-primary)' : '#fff',
                    fontSize: '0.75rem', lineHeight: 1.45, fontWeight: 500,
                    border: msg.role === 'agent' ? '1px solid var(--border-subtle)' : 'none',
                    boxShadow: msg.role === 'agent' ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 8px rgba(27,42,74,0.15)',
                  }}>
                    {msg.text}
                    {msg.category && (
                      <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(27,42,74,0.08)', color: 'var(--primary)', fontWeight: 700 }}>{msg.category}</span>
                        {msg.severity && <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: msg.severity === 'critical' ? 'rgba(220,38,38,0.1)' : msg.severity === 'high' ? 'rgba(234,88,12,0.1)' : 'rgba(27,42,74,0.08)', color: msg.severity === 'critical' ? '#dc2626' : msg.severity === 'high' ? '#ea580c' : 'var(--primary)', fontWeight: 700 }}>{msg.severity}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && !isVoiceMode && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={12} className="spin" color="#6d5aad" />
                  <span style={{ fontWeight: 600 }}>AI analyzing...</span>
                </div>
              )}
              <div ref={logEndRef} />
            </div>

            {/* Voice Turn Counter */}
            {isVoiceMode && (
              <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border-subtle)', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 700 }}>
                  🎙️ Voice Turn {voiceTurnCount}/6
                </span>
                <div style={{ height: '3px', flex: 1, margin: '0 8px', background: '#dcfce7', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((voiceTurnCount / 6) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--success), #1a5c3a)', borderRadius: '10px', transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 800 }}>
                  {isSpeaking ? '🔊' : isListening ? '🎙️' : isThinking ? '🧠' : '⏳'}
                </span>
              </div>
            )}

            {/* Chat Input (text fallback, hidden in voice mode) */}
            {!isVoiceMode && (
              <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border-subtle)', background: '#fff' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Ask Gemini about what you see..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                    style={{ flex: 1, padding: '7px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', outline: 'none', fontFamily: 'inherit', background: '#fff', color: 'var(--text-primary)' }}
                  />
                  <button onClick={handleSendChat} disabled={!chatInput.trim()} style={{
                    padding: '7px 12px', borderRadius: '8px', border: 'none',
                    background: chatInput.trim() ? 'linear-gradient(135deg, var(--accent), #a06d08)' : 'var(--border-subtle)',
                    color: chatInput.trim() ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem', fontWeight: 700, cursor: chatInput.trim() ? 'pointer' : 'default',
                  }}>Send</button>
                </div>
              </div>
            )}

            {/* Evidence & Actions */}
            <div style={{ padding: isMobile ? '8px 10px' : '10px 12px', borderTop: '1px solid var(--border-subtle)', background: '#fff' }}>
              {/* Evidence thumbnails */}
              {evidenceImages.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {evidenceImages.map(img => (
                    <div key={img.id} style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '2px solid var(--primary)', flexShrink: 0, position: 'relative' }}>
                      <img src={`data:${img.mimeType};base64,${img.base64}`} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {img.autoCaptured && (
                        <div style={{ position: 'absolute', bottom: '1px', left: '1px', right: '1px', background: 'rgba(5,150,105,0.85)', fontSize: '0.4rem', color: '#fff', textAlign: 'center', padding: '1px', fontWeight: 800, borderRadius: '0 0 4px 4px' }}>AUTO</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && (
                  <button onClick={handleStopInspection} style={{
                    flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)',
                    background: '#fff', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  }}>
                    <StopCircle size={13} /> Stop
                  </button>
                )}

                {(inspectionState === INSPECTION_STATES.READY_TO_REPORT || inspectionState === INSPECTION_STATES.LIVE || inspectionState === INSPECTION_STATES.VOICE_ACTIVE) && observations.length > 0 && (
                  <button onClick={handleGenerateReport} disabled={isGeneratingReport} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), #ea580c)', color: '#fff',
                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    boxShadow: '0 2px 8px rgba(200,134,10,0.3)',
                  }}>
                    {isGeneratingReport ? <RefreshCw size={13} className="spin" /> : <FileText size={13} />}
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </button>
                )}

                {inspectionState === INSPECTION_STATES.REVIEW && reportDraft && (
                  <button onClick={handleSubmitReport} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                    fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                  }}>
                    <CheckCircle2 size={13} /> Submit Complaint
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Report Modal */}
        {inspectionState === INSPECTION_STATES.REVIEW && reportDraft && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <div style={{
              background: '#fff', borderRadius: '14px', padding: '20px', maxWidth: '480px', width: '90%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxHeight: '80vh', overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Review AI-Generated Report</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
                  <input type="text" value={reportDraft.title} onChange={e => setReportDraft({ ...reportDraft, title: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Category</label>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>{reportDraft.category}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Department</label>
                    <div style={{ color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>{reportDraft.department}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Severity</label>
                    <div style={{ color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>{reportDraft.severity}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AI Confidence</label>
                    <div style={{ fontWeight: 700, marginTop: '2px' }}>{reportDraft.aiConfidence}</div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Description</label>
                  <textarea value={reportDraft.description} onChange={e => setReportDraft({ ...reportDraft, description: e.target.value })}
                    rows={3} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', resize: 'vertical', marginTop: '2px' }} />
                </div>

                {reportDraft.observations?.length > 0 && (
                  <div>
                    <label style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AI Observations</label>
                    <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '0.78rem', color: '#475569' }}>
                      {reportDraft.observations.map((obs, i) => <li key={i} style={{ marginBottom: '2px' }}>{obs}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setInspectionState(INSPECTION_STATES.READY_TO_REPORT); setReportDraft(null); }}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', background: '#fff', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={handleSubmitReport} style={{
                  padding: '8px 18px', borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                  fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  Submit Complaint <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submitted confirmation */}
        {inspectionState === INSPECTION_STATES.SUBMITTED && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <CheckCircle2 size={48} color="#10b981" />
              <h3 style={{ margin: '12px 0 4px', fontSize: '1.1rem' }}>Complaint Submitted</h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Your AI-inspected report has been submitted.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`\n        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }\n        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n        @keyframes thinkingPulse { 0%, 100% { opacity: 0.85; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.04); } }\n        .spin { animation: spin 1s linear infinite; }\n        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n      `}</style>
    </div>
  );
}

// Pause icon (not in lucide-react)
function PauseIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
