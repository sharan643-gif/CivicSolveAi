import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Bot, User, FileText, Sparkles } from 'lucide-react';
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

// ─── Conversational Interview Questions ───────────────────────────────────────
const INTERVIEW_STEPS = [
  {
    id: 'greeting',
    question: "Hello! I'm JanSetu Voice Assistant. Please tell me about the civic problem in your area — what is happening, where is it located, and who is affected? Speak naturally!",
    field: 'raw_problem',
    isGreeting: true,
  },
  {
    id: 'location',
    question: "Got it. Could you tell me the exact district, block, or nearby landmark for this issue?",
    field: 'location',
  },
  {
    id: 'who_affected',
    question: "Who is most affected by this, and roughly how many people or families are facing difficulty?",
    field: 'who_affected',
  },
  {
    id: 'duration',
    question: "How long has this issue been going on, and how severe is the danger or disruption?",
    field: 'duration',
  },
];

const HI_STEPS = [
  {
    id: 'greeting',
    question: "नमस्ते! मैं जनसेतु वॉयस असिस्टेंट हूँ। आप अपने इलाके की नागरिक समस्या के बारे में बताइए — क्या परेशानी है, कहाँ पर है, और कौन प्रभावित है? आप खुलकर बताइए!",
    field: 'raw_problem',
    isGreeting: true,
  },
  {
    id: 'location',
    question: "समझ गया। कृपया अपना जिला, प्रखंड (Block) या नजदीकी लैंडमार्क बताएं।",
    field: 'location',
  },
  {
    id: 'who_affected',
    question: "इस समस्या से मुख्य रूप से कौन प्रभावित हैं और लगभग कितने लोग या परिवार परेशान हैं?",
    field: 'who_affected',
  },
  {
    id: 'duration',
    question: "यह समस्या कितने समय से चल रही है, और स्थिति कितनी गंभीर है?",
    field: 'duration',
  },
];

export default function JanSetuVoiceAgent({ isOpen, onClose, onNavigate, onAutoFillReport }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Interview state
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationLog, setConversationLog] = useState([]);
  const [phase, setPhase] = useState('intro'); // 'intro' | 'questioning' | 'summary'
  const [generatedData, setGeneratedData] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null);

  // ─── Refs for stable async execution ──────────────────────────────────────
  const answersRef = useRef({});
  const recognitionRef = useRef(null);
  const stepsRef = useRef(INTERVIEW_STEPS);
  const abortRef = useRef(false);
  const isRunningRef = useRef(false);

  const steps = selectedLanguage === 'hi-IN' ? HI_STEPS : INTERVIEW_STEPS;
  stepsRef.current = steps;

  // ─── Language Detection ───────────────────────────────────────────────────
  const detectLanguage = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const hindiWords = ['namaste', 'paani', 'sadak', 'bijli', 'kachra', 'nala', 'gao', 'jila', 'bhaiya', 'nahi', 'karo', 'hai', 'kripya', 'madad', 'ganda', 'toot', 'problem'];
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hasHindiKeywords = hindiWords.some(w => lower.includes(w));
    if (hasDevanagari || hasHindiKeywords) {
      return 'hi-IN';
    }
    return 'en-IN';
  };

  // ─── Speech Recognition Setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
      };

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
          setErrorMsg('Microphone access denied. Please enable microphone permissions in your browser.');
        } else if (event.error === 'network') {
          setErrorMsg('Network connectivity issue with voice recognition.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Speech recognition not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  // ─── Natural Text-to-Speech Engine ─────────────────────────────────────────
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !text) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Conversational audio tuning: slightly warm pitch & human cadence
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
      utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';

      // Pick natural human voice if available
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        if (selectedLanguage === 'hi-IN') {
          const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.includes('Swara') || v.name.includes('Kalpana'));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          const naturalVoice = voices.find(v => 
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online') || v.name.includes('Samantha') || v.name.includes('Aria') || v.name.includes('Zira')) &&
            (v.lang.startsWith('en'))
          ) || voices.find(v => v.lang.startsWith('en'));
          if (naturalVoice) utterance.voice = naturalVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };

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

  // ─── Collect Final Transcript from Speech Recognition ──────────────────────
  const collectTranscript = useCallback(() => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) {
        resolve('');
        return;
      }
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

  // ─── Fallback Local Extractor ──────────────────────────────────────────────
  const extractLocalReport = (combinedText) => {
    const text = (combinedText || '').toLowerCase();
    
    // Category mapping
    let category = 'Infrastructure';
    if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('paani') || text.includes('nal')) {
      category = 'Water Management';
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('kachra') || text.includes('dump')) {
      category = 'Waste Management';
    } else if (text.includes('light') || text.includes('electric') || text.includes('wire') || text.includes('bijli') || text.includes('power')) {
      category = 'Energy & Power';
    } else if (text.includes('health') || text.includes('hospital') || text.includes('clinic') || text.includes('doctor') || text.includes('disease')) {
      category = 'Healthcare & Sanitation';
    } else if (text.includes('school') || text.includes('teacher') || text.includes('student') || text.includes('college') || text.includes('padhai')) {
      category = 'Education & Literacy';
    } else if (text.includes('farm') || text.includes('crop') || text.includes('kisan') || text.includes('soil') || text.includes('irrigation')) {
      category = 'Agriculture & Rural';
    } else if (text.includes('traffic') || text.includes('bus') || text.includes('transport') || text.includes('auto') || text.includes('road')) {
      category = 'Urban Transport & Traffic';
    }

    // Severity mapping
    let severity = 'medium';
    if (text.includes('emergency') || text.includes('critical') || text.includes('death') || text.includes('fatal') || text.includes('accident') || text.includes('collapse')) {
      severity = 'critical';
    } else if (text.includes('urgent') || text.includes('severe') || text.includes('heavy') || text.includes('blocked') || text.includes('hazard')) {
      severity = 'high';
    }

    // District detection
    let district = 'Ranchi';
    let lat = '23.3441';
    let lng = '85.3090';
    for (const [dName, coords] of Object.entries(DISTRICT_COORDS)) {
      if (text.includes(dName)) {
        district = dName.charAt(0).toUpperCase() + dName.slice(1);
        lat = coords.lat;
        lng = coords.lng;
        break;
      }
    }

    // Population estimation
    let affectedPop = 1500;
    const popMatch = text.match(/(\d[\d,]*)\s*(people|person|citizen|family|household|village|student)/);
    if (popMatch) {
      affectedPop = parseInt(popMatch[1].replace(/,/g, '')) || 1500;
    } else if (text.includes('village') || text.includes('gao')) {
      affectedPop = 2500;
    }

    // Duration
    let duration = '2 months';
    if (text.includes('week') || text.includes('din') || text.includes('day')) duration = '2 weeks';
    else if (text.includes('month') || text.includes('mahine')) duration = '3 months';
    else if (text.includes('year') || text.includes('saal')) duration = '1 year';

    return {
      title: combinedText.slice(0, 55) || 'Civic Infrastructure Grievance',
      description: combinedText || 'Civic problem reported via JanSetu Voice Assistant.',
      category,
      subcategory: 'Public Utility Maintenance',
      district,
      location: `${district} Ward / Block Area`,
      lat,
      lng,
      severity,
      affected_population: affectedPop,
      who_affected: 'Local community residents & daily commuters',
      duration,
      spoken_summary: `I have drafted your grievance report for ${category} in ${district}. It is ready for submission.`
    };
  };

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
  "title": "Concise professional 5-8 word problem title (e.g. Monsoon Rural Road Washout & Bridge Collapse)",
  "description": "Clear, detailed 2-3 sentence problem statement describing what is happening, why, and civic impact",
  "category": "Water Management | Infrastructure | Agriculture & Rural | Healthcare & Sanitation | Education & Literacy | Energy & Power | Environment & Pollution | Public Safety & Disaster | Digital Services & Governance | Urban Transport & Traffic",
  "subcategory": "Specific sub-sector (e.g. Road Connectivity, Water Pipeline, Solid Waste Collection)",
  "district": "Extracted Jharkhand district name (e.g. Ranchi, Dumka, Dhanbad, Jamshedpur, Bokaro, Deoghar, Hazaribagh, etc.)",
  "location": "Specific street, village, block, ward or landmark",
  "lat": "Approximate latitude string (e.g. 24.2686 for Dumka, 23.3441 for Ranchi)",
  "lng": "Approximate longitude string (e.g. 87.2486 for Dumka, 85.3090 for Ranchi)",
  "severity": "low | medium | high | critical",
  "affected_population": number (e.g. 1800),
  "who_affected": "Who is affected (e.g. Local school students, 10 farming villages, daily commuters)",
  "duration": "Duration (e.g. 3 months, 2 weeks, 6 months)",
  "spoken_summary": "Warm, lively 1-sentence confirmation for the citizen explaining what report was prepared"
}`;

    let parsedData = null;
    try {
      const rawAi = await geminiService.generateCivicResponse([
        { role: 'system', content: 'You are JanSetu Voice AI parser. Output strict JSON only matching the schema.' },
        { role: 'user', content: prompt }
      ]);

      const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('[VoiceAgent] Gemini AI parsing error:', err);
    }

    if (!parsedData || !parsedData.title) {
      parsedData = extractLocalReport(allText);
    }

    // Auto-fill district coordinates if missing
    const distKey = (parsedData.district || '').toLowerCase().trim();
    if (DISTRICT_COORDS[distKey]) {
      if (!parsedData.lat) parsedData.lat = DISTRICT_COORDS[distKey].lat;
      if (!parsedData.lng) parsedData.lng = DISTRICT_COORDS[distKey].lng;
    } else {
      if (!parsedData.lat) parsedData.lat = '23.3441';
      if (!parsedData.lng) parsedData.lng = '85.3090';
    }

    // Validate category
    const validCats = [
      'Water Management', 'Infrastructure', 'Agriculture & Rural', 'Healthcare & Sanitation',
      'Education & Literacy', 'Energy & Power', 'Environment & Pollution', 'Public Safety & Disaster',
      'Digital Services & Governance', 'Urban Transport & Traffic'
    ];
    if (!validCats.includes(parsedData.category)) {
      parsedData.category = 'Infrastructure';
    }

    setGeneratedData(parsedData);
    setIsProcessing(false);

    // Add summary message to conversation
    const summaryMsg = `✨ Report Prepared Successfully!\n📌 Title: ${parsedData.title}\n📂 Category: ${parsedData.category}\n📍 Location: ${parsedData.location} (${parsedData.district})\n👥 Affected: ${parsedData.who_affected} (~${parsedData.affected_population} people)\n⚠️ Severity: ${parsedData.severity.toUpperCase()}\n⏱️ Duration: ${parsedData.duration}\n\n👉 Click 'Auto-Fill Report' below to populate all form fields instantly!`;
    
    setConversationLog(prev => [...prev, { role: 'agent', text: summaryMsg }]);

    // Speak warm confirmation readout
    const confirmationSpeech = parsedData.spoken_summary || `I have drafted your grievance for ${parsedData.title} in ${parsedData.district}. Please review and tap Auto-Fill to submit.`;
    await speak(confirmationSpeech);

  }, [speak]);

  // ─── Main Interview Conversation Loop ──────────────────────────────────────
  const runInterview = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    abortRef.current = false;
    answersRef.current = {};

    const activeSteps = stepsRef.current;

    for (let stepIdx = 0; stepIdx < activeSteps.length; stepIdx++) {
      if (abortRef.current) break;

      const step = activeSteps[stepIdx];
      setCurrentStep(stepIdx);
      setPhase('questioning');

      // 1. Post and Speak Question
      setConversationLog(prev => [...prev, { role: 'agent', text: step.question }]);
      stopListening();
      await speak(step.question);
      if (abortRef.current) break;

      // 2. Start Listening
      startListening();
      const answer = await collectTranscript();
      stopListening();
      setInterimText('');

      if (abortRef.current) break;

      // Language Auto-Detection on first turn
      if (stepIdx === 0 && answer.trim()) {
        const detected = detectLanguage(answer);
        if (detected && detected !== selectedLanguage) {
          setDetectedLang(detected);
          setSelectedLanguage(detected);
          stepsRef.current = detected === 'hi-IN' ? HI_STEPS : INTERVIEW_STEPS;
        }
      }

      if (answer.trim()) {
        setConversationLog(prev => [...prev, { role: 'user', text: answer }]);
        answersRef.current[step.field] = answer;

        // If the user provided a rich explanation on step 0 (more than 18 words), we can synthesize early!
        const wordCount = answer.trim().split(/\s+/).length;
        if (stepIdx === 0 && wordCount >= 16) {
          const acknowledgeMsg = selectedLanguage === 'hi-IN'
            ? "बहुत बढ़िया! मुझे सारी मुख्य जानकारी मिल गई है। मैं आपकी रिपोर्ट तैयार कर रही हूँ..."
            : "Thank you! I have captured your complete issue details. Preparing your structured report now...";
          
          setConversationLog(prev => [...prev, { role: 'agent', text: acknowledgeMsg }]);
          await speak(acknowledgeMsg);
          break;
        }
      } else {
        // If empty on greeting, record default acknowledgement
        if (step.isGreeting) {
          setConversationLog(prev => [...prev, { role: 'user', text: 'Yes, please start.' }]);
          answersRef.current[step.field] = 'User agreed to report';
        } else {
          setConversationLog(prev => [...prev, { role: 'user', text: '(skipped)' }]);
          answersRef.current[step.field] = '';
        }
      }
    }

    // Finished questions — generate complete report
    if (!abortRef.current) {
      await generateReport();
    }
    isRunningRef.current = false;
  }, [selectedLanguage, speak, startListening, stopListening, collectTranscript, generateReport]);

  // ─── Modal Open / Close Lifecycle ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      answersRef.current = {};
      setConversationLog([]);
      setCurrentStep(0);
      setPhase('intro');
      setGeneratedData(null);
      setInterimText('');
      setErrorMsg('');
      setDetectedLang(null);
      abortRef.current = false;
      isRunningRef.current = false;

      const timer = setTimeout(() => {
        runInterview();
      }, 400);

      return () => {
        clearTimeout(timer);
        abortRef.current = true;
        isRunningRef.current = false;
        stopListening();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    } else {
      abortRef.current = true;
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

  // ─── Skip to End Early ─────────────────────────────────────────────────────
  const handleSkipToEnd = () => {
    abortRef.current = true;
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    generateReport();
  };

  if (!isOpen) return null;

  const progress = phase === 'summary' ? 100 : Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(2, 11, 25, 0.75)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px', fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.25s ease forwards',
    }}>
      {/* Main HUD Window */}
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px', width: '100%', maxWidth: '580px',
        boxShadow: '0 25px 70px rgba(0, 15, 45, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '94vh',
        position: 'relative',
      }}>

        {/* National Flag Accent Strip */}
        <div style={{
          height: '4px', width: '100%',
          background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)',
        }} />

        {/* Futuristic Responsive Header */}
        <div style={{
          background: 'linear-gradient(135deg, #051630 0%, #020b18 100%)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '12px 14px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', color: '#ffffff',
          gap: '8px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            {/* Glowing Avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: isListening 
                ? 'linear-gradient(135deg, #FF6200 0%, #dc2626 100%)' 
                : isSpeaking 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #003087 0%, #0284c7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: isListening 
                ? '0 0 16px rgba(255,98,0,0.8)' 
                : isSpeaking 
                ? '0 0 16px rgba(16,185,129,0.7)' 
                : '0 0 12px rgba(2,132,199,0.4)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              {isListening ? <Mic size={18} color="#ffffff" /> : <Bot size={18} color="#ffffff" />}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.58rem', letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: '#38bdf8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.12)',
                  padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)',
                  whiteSpace: 'nowrap'
                }}>
                  Govt of India · JanSetu AI
                </span>
                <span style={{
                  fontSize: '0.58rem', background: 'linear-gradient(135deg, #FF6200, #d97706)',
                  color: '#ffffff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800,
                  boxShadow: '0 2px 5px rgba(255,98,0,0.4)', whiteSpace: 'nowrap'
                }}>
                  Gemini AI
                </span>
              </div>
              <h3 style={{ fontSize: 'clamp(0.9rem, 3.6vw, 1.05rem)', fontWeight: 800, margin: '2px 0 0 0', color: '#ffffff', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                JanSetu Voice Assistant
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '6px', color: '#ffffff', fontSize: '0.72rem',
                padding: '5px 7px', outline: 'none', cursor: 'pointer', fontWeight: 700,
                backdropFilter: 'blur(4px)',
              }}
            >
              <option value="en-IN" style={{ color: '#0f172a', background: '#ffffff' }}>English</option>
              <option value="hi-IN" style={{ color: '#0f172a', background: '#ffffff' }}>हिन्दी</option>
            </select>
            <button onClick={onClose} title="Close HUD" style={{
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '6px', color: '#ffffff', padding: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={15} />
            </button>
          </div>
        </div>


        {/* Futuristic Status Bar & Telemetry */}
        <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isListening ? '#FF6200' : isSpeaking ? '#10b981' : '#0284c7',
                boxShadow: isListening ? '0 0 10px #FF6200' : isSpeaking ? '0 0 10px #10b981' : 'none',
                display: 'inline-block',
              }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
                {isListening ? '🎙️ Live Audio Input Active — Speak Now' : isSpeaking ? '🔊 JanSetu AI Speaking...' : phase === 'summary' ? '✨ Structured Grievance Ready' : 'Conversational Intake'}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#003087', fontWeight: 800 }}>
              {phase === 'summary' ? '100% Complete' : `Step ${Math.min(currentStep + 1, steps.length)} of ${steps.length} (${progress}%)`}
            </span>
          </div>

          {/* Saffron Glowing Progress Track */}
          <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: phase === 'summary' 
                ? 'linear-gradient(90deg, #10b981, #059669)' 
                : 'linear-gradient(90deg, #FF6200, #d97706)',
              borderRadius: '10px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 8px rgba(255,98,0,0.5)',
            }} />
          </div>
        </div>

        {/* Conversation Log Feed */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '14px',
          minHeight: '260px', maxHeight: '360px', background: '#f1f5f9',
          backgroundImage: 'radial-gradient(rgba(0, 48, 135, 0.03) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}>
          {conversationLog.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(0, 48, 135, 0.08)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
                border: '1px solid rgba(0, 48, 135, 0.15)',
              }}>
                <Bot size={28} color="#003087" />
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Initializing JanSetu Voice Assistant...</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>State Public Grievance AI Intake Portal</p>
            </div>
          )}

          {conversationLog.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end',
              gap: '10px', animation: 'fadeIn 0.2s ease',
            }}>
              {msg.role === 'agent' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,48,135,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <Bot size={17} color="#ffffff" />
                </div>
              )}
              <div style={{
                maxWidth: '85%', padding: '13px 17px',
                borderRadius: msg.role === 'agent' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                background: msg.role === 'agent' ? '#ffffff' : 'linear-gradient(135deg, #003087 0%, #002266 100%)',
                color: msg.role === 'agent' ? '#0f172a' : '#ffffff',
                fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 500,
                border: msg.role === 'agent' ? '1px solid #cbd5e1' : '1px solid rgba(56,189,248,0.3)',
                boxShadow: msg.role === 'agent' ? '0 2px 10px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,48,135,0.25)',
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FF6200 0%, #c2410c 100%)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255,98,0,0.3)',
                }}>
                  <User size={17} color="#ffffff" />
                </div>
              )}
            </div>
          ))}

          {/* Interim speech transcript */}
          {isListening && interimText && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <div style={{
                padding: '11px 16px', borderRadius: '16px 4px 16px 16px',
                background: 'rgba(255,98,0,0.1)', border: '1px dashed rgba(255,98,0,0.5)',
                fontSize: '0.86rem', color: '#c2410c', fontWeight: 600,
                fontStyle: 'italic', maxWidth: '85%',
              }}>
                🗣️ "{interimText}..."
              </div>
            </div>
          )}

          {/* Generated Structured Report Card */}
          {phase === 'summary' && generatedData && (
            <div style={{
              background: '#ffffff', border: '2px solid #003087',
              borderRadius: '16px', padding: '18px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              boxShadow: '0 8px 24px rgba(0,48,135,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: 'linear-gradient(90deg, #10b981, #0284c7)',
              }} />

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0', paddingBottom: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <span>Structured Grievance Report Ready</span>
                </div>
                <span style={{
                  fontSize: '0.72rem', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7',
                  padding: '3px 10px', borderRadius: '100px', fontWeight: 800, border: '1px solid rgba(2, 132, 199, 0.2)',
                }}>
                  Verified by Gemini AI
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Title</span>
                  <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.92rem', marginTop: '2px' }}>{generatedData.title}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Category</span>
                  <div style={{ color: '#003087', fontWeight: 700, marginTop: '2px' }}>{generatedData.category}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>District / Location</span>
                  <div style={{ color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>{generatedData.district} ({generatedData.location})</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Affected Population</span>
                  <div style={{ color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>~{generatedData.affected_population} residents</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Severity Level</span>
                  <div style={{ color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>{generatedData.severity}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Draft Summary Statement</span>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '0.8rem', lineHeight: 1.5 }}>{generatedData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', padding: '18px',
              color: '#003087', fontSize: '0.88rem', fontWeight: 800,
              background: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1',
            }}>
              <RefreshCw size={20} className="spin" color="#FF6200" />
              <span>Analyzing spoken responses & structuring official grievance...</span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: '#fef2f2',
            borderTop: '1px solid #fecaca',
            color: '#dc2626', fontSize: '0.82rem', fontWeight: 700,
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Futuristic Mic Controller HUD Bar */}
        {phase === 'questioning' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '16px 20px',
            background: isListening ? 'linear-gradient(180deg, #fff7ed 0%, #fff 100%)' : '#ffffff',
            borderTop: '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: isListening 
                    ? 'linear-gradient(135deg, #FF6200 0%, #dc2626 100%)' 
                    : 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
                  border: '4px solid #ffffff', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isListening 
                    ? '0 0 30px rgba(255,98,0,0.7), 0 0 10px rgba(255,98,0,0.4)' 
                    : '0 6px 20px rgba(0,48,135,0.3)',
                  cursor: 'pointer',
                  transform: isListening ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                {isListening ? <Mic size={26} color="#fff" /> : <MicOff size={24} color="#fff" />}
              </button>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isListening ? '#FF6200' : '#0f172a' }}>
                  {isListening ? 'Listening... Speak Now' : 'Tap Microphone to Speak'}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  {isSpeaking ? '🔊 JanSetu AI is speaking...' : 'Speech is transcribed live in real time'}
                </div>
              </div>
            </div>

            {/* Audio Waveform Animation */}
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '12px', height: '24px' }}>
                {[12, 22, 16, 26, 14, 24, 18, 28, 12, 22, 16, 24, 14, 20].map((h, idx) => (
                  <div key={idx} style={{
                    width: '4px', height: `${h}px`,
                    background: 'linear-gradient(180deg, #FF6200, #d97706)',
                    borderRadius: '3px',
                    animation: `pulse 0.5s infinite alternate ease-in-out ${idx * 0.06}s`,
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          padding: '14px 20px', background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 18px', borderRadius: '8px',
            border: '1px solid #cbd5e1', background: '#ffffff',
            color: '#334155', fontSize: '0.85rem', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}>
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {phase === 'questioning' && currentStep > 0 && !generatedData && (
              <button onClick={handleSkipToEnd} style={{
                padding: '10px 18px', borderRadius: '8px',
                border: '1px solid #cbd5e1', background: '#ffffff',
                color: '#475569', fontSize: '0.82rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Skip & Analyze with AI
              </button>
            )}

            {phase === 'summary' && generatedData && (
              <>
                <button onClick={() => {
                  const speech = generatedData.spoken_summary || `Report prepared for ${generatedData.title}.`;
                  speak(speech);
                }} style={{
                  padding: '10px 16px', borderRadius: '8px',
                  border: '1px solid #003087', background: 'rgba(0,48,135,0.06)',
                  color: '#003087', fontSize: '0.84rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Volume2 size={16} /> Speak Summary
                </button>
                
                <button onClick={handleApplyToForm} style={{
                  padding: '11px 22px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #FF6200 0%, #ea580c 100%)',
                  color: '#ffffff', border: 'none',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 14px rgba(255,98,0,0.4)',
                }}>
                  <FileText size={16} />
                  <span>Auto-Fill Official Report</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

