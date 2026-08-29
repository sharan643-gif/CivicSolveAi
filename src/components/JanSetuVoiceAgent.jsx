import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Bot, User, FileText } from 'lucide-react';
import { groqService } from '../services/groqClientService';

// ─── Interview Steps ─────────────────────────────────────────────────────────
const INTERVIEW_STEPS = [
  {
    id: 'greeting',
    question: "Hello! I'm JanSetu AI, your civic issue reporter. I'll ask you a few questions to understand the problem and create a report for you. Are you ready? Just say yes to start.",
    field: null,
    isGreeting: true,
  },
  {
    id: 'problem',
    question: "Great! First, please describe the problem you're seeing. What's happening and where is it?",
    field: 'description',
  },
  {
    id: 'location',
    question: "Where exactly is this problem located? Please tell me the district name and any specific area or landmark.",
    field: 'location',
  },
  {
    id: 'who_affected',
    question: "Who is affected by this problem? For example: local students, commuters, farmers, residents.",
    field: 'who_affected',
  },
  {
    id: 'population',
    question: "How many people do you think are affected? An approximate number is fine.",
    field: 'affected_population',
  },
  {
    id: 'duration',
    question: "How long has this problem existed? For example: 2 weeks, 1 month, 6 months.",
    field: 'duration',
  },
];

const HI_STEPS = [
  {
    id: 'greeting',
    question: "नमस्ते! मैं जनसेतु AI हूँ। मैं आपसे कुछ सवाल पूछूँगा। क्या आप तैयार हैं?",
    field: null,
    isGreeting: true,
  },
  {
    id: 'problem',
    question: "बढ़िया! कृपया बताएं कि आपको क्या समस्या दिख रही है। क्या हो रहा है और कहाँ है?",
    field: 'description',
  },
  {
    id: 'location',
    question: "यह समस्या कहाँ स्थित है? जिले का नाम और स्थान बताएं।",
    field: 'location',
  },
  {
    id: 'who_affected',
    question: "इस समस्या से कौन प्रभावित है?",
    field: 'who_affected',
  },
  {
    id: 'population',
    question: "कितने लोग इससे प्रभावित हैं?",
    field: 'affected_population',
  },
  {
    id: 'duration',
    question: "यह समस्या कितने समय से है?",
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
  const [phase, setPhase] = useState('intro');
  const [generatedData, setGeneratedData] = useState(null);
  const [detectedLang, setDetectedLang] = useState(null); // null = not yet detected

  // ─── Refs for stable access in async flows ────────────────────────────────
  const answersRef = useRef({});
  const recognitionRef = useRef(null);
  const stepsRef = useRef(INTERVIEW_STEPS);
  const abortRef = useRef(false);

  const steps = selectedLanguage === 'hi-IN' ? HI_STEPS : INTERVIEW_STEPS;
  stepsRef.current = steps;

  // ─── Speech Recognition Setup ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

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
          setErrorMsg('Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'network') {
          setErrorMsg('Network issue with speech recognition.');
        }
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Speech recognition not supported. Please try Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [selectedLanguage]);

  // ─── Text-to-Speech ────────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';
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
      console.warn('[VoiceAgent] Start error:', e);
    }
  }, [selectedLanguage]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); setIsListening(false); } catch (e) {}
  }, []);

  // ─── Collect Final Transcript from Recognition ─────────────────────────────
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

      // Fallback timeout
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

  // ─── Category Detection: weighted keyword scoring (English + Hindi) ─────────
  // Format: [keyword, weight] — higher weight = more specific/important
  const detectCategory = (text) => {
    const lower = (text || '').toLowerCase();
    const rules = [
      {
        category: 'Water Management',
        keywords: [
          // English
          ['water leak',3],['pipe leak',3],['drainage',3],['waterlogging',3],['sewage',3],['borewell',3],
          ['pipe',2],['pipeline',2],['leak',2],['leakage',2],['drain',2],['flood',2],['flooded',2],
          ['toilet',2],['latrine',2],['septic',2],['irrigation',2],['groundwater',2],
          ['water',1],['well',1],['tank',1],['reservoir',1],['rainwater',1],['monsoon',1],
          ['drought',1],['dry',1],['tap',1],['faucet',1],
          // Hindi — single words
          ['paani',2],['paip',2],['nal',2],['nala',2],['naali',2],
          ['baadh',3],['baarish',2],['jal',1],['kuwa',2],['tubewell',2],
          ['shouchalay',2],['gilne wala',2],
          // Hindi — natural phrases people actually speak
          ['paani nahi aa raha',3],['paani nahi hai',3],['paani ruk gaya',3],
          ['ganda paani',3],['paani ganda hai',3],['paani black hai',3],
          ['nal toot gaya',3],['nal band hai',3],['nala band hai',3],
          ['naali saaf karo',3],['drainage band',3],['nali blocked hai',3],
          ['baadh aa gayi',3],['paani bhar gaya',3],['lood aaya hai',3],
          ['toilet nahi hai',2],['shauchalay ganda hai',2],
        ],
      },
      {
        category: 'Infrastructure',
        keywords: [
          // English
          ['pothole',3],['broken road',3],['damaged road',3],['flyover',3],['culvert',3],
          ['bridge',2],['pavement',2],['sidewalk',2],['footpath',2],['highway',2],
          ['tarring',2],['asphalt',2],['cement',2],
          ['road',1],['street',1],['lane',1],['alley',1],['construction',1],
          ['building',1],['wall',1],['fence',1],['gate',1],['public property',1],['infrastructure',1],
          // Hindi — single words
          ['sadak',2],['gaddha',3],['pul',2],['paththar',1],
          ['nirmaan',1],['imarat',1],['deewar',1],['chhat',1],
          // Hindi — natural phrases
          ['sadak kharab hai',3],['sadak toot gayi',3],['gaddha hai sadak mein',3],
          ['road kharaab hai',3],['sadak mein gaddha',3],
          ['pul toot gaya',3],['pul kharab hai',3],
          ['buildin gir gayi',3],['deewar gir gayi',3],
          ['nirmaan ho raha hai',2],['raasta band hai',2],
        ],
      },
      {
        category: 'Agriculture & Rural',
        keywords: [
          // English
          ['farming',3],['crop',3],['harvest',3],['fertilizer',3],['cold storage',3],
          ['tractor',2],['agriculture',2],['farmer',2],['livestock',2],['cattle',2],
          ['dairy',2],['poultry',2],['fishery',2],['mandi',2],
          ['farm',1],['seed',1],['rural',1],['village',1],['fish',1],['pond',1],
          ['market',1],['warehouse',1],
          // Hindi — single words
          ['kheti',2],['fasal',3],['kisan',2],['khad',2],
          ['beej',2],['paudha',1],['gaon',1],['pashu',2],['maweshi',2],
          ['machhli',2],['taalab',1],
          ['khet',1],['zameen',1],
          // Hindi — natural phrases
          ['fasal kharab ho gayi',3],['fasal barbaad',3],
          ['kisan pareshan hai',2],['khet sookh gaya',3],
          ['paani ki kami hai',3],['sichai nahi hai',3],
          ['gaon mein paani nahi',3],['gaon ki sadak kharab',2],
          ['maweshi mar gaye',3],['pashu bimaar hai',2],
        ],
      },
      {
        category: 'Healthcare & Sanitation',
        keywords: [
          // English
          ['hospital',3],['clinic',3],['ambulance',3],['epidemic',3],['outbreak',3],
          ['dispensary',3],['vaccine',3],['immunization',3],
          ['doctor',2],['medicine',2],['pharmacy',2],['disease',2],
          ['sanitation',2],['garbage',2],['waste',2],['trash',2],['dustbin',2],
          ['maternal',2],['pregnant',2],
          ['health',1],['refuse',1],['decompose',1],
          // Hindi — single words
          ['aspatal',3],['davakhana',3],['mahamari',3],
          ['dawa',2],['dawai',2],['bimari',2],['rog',2],
          ['kachra',2],['kuda',2],['safai',2],
          ['prasav',2],['garbhwati',2],
          // Hindi — natural phrases
          ['aspatal mein dawa nahi',3],['dawai nahi mil rahi',3],
          ['ambulance nahi aa rahi',3],['doctor nahi hai',2],
          ['kachra pada hai',3],['kachra utha lo',3],
          ['safai nahi ho rahi',3],['ganda lag raha hai',2],
          ['bimari phail rahi hai',3],['mahamari lag gayi',3],
          ['garbhwati ko dawa chahiye',3],
        ],
      },
      {
        category: 'Education & Literacy',
        keywords: [
          // English
          ['school',3],['college',3],['university',3],['classroom',3],
          ['anganwadi',3],['midday meal',3],['scholarship',3],
          ['student',2],['teacher',2],['education',2],['literacy',2],
          ['library',2],['laboratory',2],['textbook',2],
          ['study',1],['exam',1],['computer',1],['internet',1],['uniform',1],
          // Hindi — single words
          ['vidyalaya',3],['pathshala',3],
          ['vidhyarthi',2],['shikshak',2],
          ['padhai',2],['shiksha',2],['kitab',1],['pariksha',1],
          ['pustakalaya',2],
          // Hindi — natural phrases
          ['school band hai',3],['school nahi khula',3],
          ['teacher nahi aa rahe',3],['padhai nahi ho rahi',3],
          ['bachche padh nahi rahe',2],['midday meal nahi mil raha',3],
          ['kitab nahi mili',2],['uniform nahi hai',2],
          ['school mein paani nahi',3],
        ],
      },
      {
        category: 'Energy & Power',
        keywords: [
          // English
          ['transformer',3],['electricity',3],['outage',3],['blackout',3],
          ['streetlight',3],['power cut',3],
          ['electric',2],['power',2],['voltage',2],['grid',2],
          ['solar',2],['wire',2],['cable',2],['meter',2],
          ['light',1],['lamp',1],['panel',1],['connection',1],
          ['bill',1],['battery',1],['renewable',1],['wind',1],['current',1],
          // Hindi — single words
          ['bijli',3],['vidyut',2],['taar',2],
          ['generator',2],['ups',2],
          // Hindi — natural phrases
          ['bijli nahi hai',3],['bijli chali gayi',3],['bijli nahi aa rahi',3],
          ['bijli ka katav',3],['light nahi hai',3],
          ['transformer phata',3],['transformer jal gaya',3],
          ['bijli bahut kam aa rahi',3],['voltage low hai',3],
          ['street light band hai',3],['light nahi jal rahi',3],
          ['bijli ka bill zyada',2],['meter kharab hai',2],
        ],
      },
      {
        category: 'Urban Transport & Traffic',
        keywords: [
          // English
          ['traffic jam',3],['traffic signal',3],['road rage',3],
          ['traffic',2],['congestion',2],['commute',2],
          ['bus',1],['auto',1],['rickshaw',1],['taxi',1],['cab',1],
          ['train',1],['railway',1],['airport',1],['parking',1],
          ['signal',1],['jam',1],['route',1],['accident',1],
          ['helmet',1],['speed',1],['transport',1],
          // Hindi — single words
          ['riksha',1],
          ['bhid',2],['raasta',1],['marg',1],
          // Hindi — natural phrases
          ['traffic jam hai',3],['traffic bahut hai',3],
          ['sadak durghatna',3],['accident ho gaya',3],
          ['bhid lag gayi',2],['raasta band hai',2],
          ['bus nahi aa rahi',2],['auto nahi mil raha',2],
          ['train late hai',2],['parking nahi hai',2],
          ['signal kaam nahi kar raha',3],
        ],
      },
      {
        category: 'Environment & Pollution',
        keywords: [
          // English
          ['air pollution',3],['noise pollution',3],['water pollution',3],
          ['deforestation',3],['contamination',3],
          ['pollution',2],['emission',2],['factory',2],['industrial',2],
          ['chemical',2],['smog',2],['wildlife',2],
          ['environment',1],['air',1],['smoke',1],['noise',1],['sound',1],
          ['plastic',1],['tree',1],['green',1],['forest',1],
          ['animal',1],['bird',1],['climate',1],['warming',1],
          // Hindi — single words
          ['pradushan',3],['dhuan',2],['shor',2],['awaaz',2],
          ['udhog',2],['rasayn',2],
          ['ped',1],['jungle',1],['van',1],
          ['hawa',1],['aawaz',2],
          // Hindi — natural phrases
          ['pradushan bahut hai',3],['hawa gandi hai',3],
          ['dhuan aa raha hai',3],['factory se dhuan',3],
          ['shor bahut hai',3],['awaaz aa rahi hai',2],
          ['ped kaat diye',3],['jungle khatam ho raha',3],
          ['plastic pada hai',2],['ganda lag raha hai',2],
        ],
      },
      {
        category: 'Public Safety & Disaster',
        keywords: [
          // English
          ['earthquake',3],['cyclone',3],['flood disaster',3],
          ['crime',2],['theft',2],['robbery',2],['violence',2],
          ['murder',2],['assault',2],['harassment',2],
          ['disaster',2],['rescue',2],['emergency',2],
          ['fire',1],['storm',1],['fraud',1],['scam',1],
          ['safety',1],['police',1],['patrol',1],
          ['warning',1],['alert',1],['station',1],
          // Hindi — single words
          ['bhukamp',3],['toofan',3],['aafat',3],
          ['chori',2],['lut',2],['hinsa',2],['atyachar',2],
          ['aatank',2],['thana',1],
          ['bachav',2],
          // Hindi — natural phrases
          ['bhukamp aaya',3],['dharti hili',3],
          ['aag lag gayi',3],['aag bahut hai',3],
          ['chori ho gayi',3],['chori hui hai',3],
          ['hinsa ho rahi hai',3],['police bulaao',2],
          ['toofan aa raha hai',3],['aafat aa gayi',3],
          ['rescue karo',2],['bachao',2],
        ],
      },
      {
        category: 'Digital Services & Governance',
        keywords: [
          // English
          ['aadhaar',3],['ration card',3],['pension scheme',3],
          ['certificate',2],['license',2],['permit',2],
          ['registration',2],['grievance',2],['rti',2],
          ['digital',1],['online',1],['website',1],['app',1],['portal',1],
          ['ration',1],['pension',1],['welfare',1],['scheme',1],
          ['government',1],['service',1],['bpl',1],
          ['complaint',1],
          // Hindi — single words
          ['praman patra',2],['ijazatnama',2],
          ['panjikaran',2],['shikayat',2],['sarkar',1],
          ['yojana',1],['seva',1],
          // Hindi — natural phrases
          ['aadhaar nahi ban raha',3],['aadhaar update nahi ho raha',3],
          ['ration card nahi mil raha',3],['ration band hai',3],
          ['pension nahi aa rahi',3],['certificate nahi mil raha',3],
          ['online kaam nahi kar raha',2],['website down hai',2],
          ['sarkari kaam nahi ho raha',2],['registration ruk gaya',2],
          ['shikayat darj karo',2],['grievance file karo',2],
        ],
      },
    ];

    let bestCategory = 'Infrastructure';
    let bestScore = 0;
    let bestMaxWeight = 0;
    let bestMatched = [];

    for (const rule of rules) {
      let score = 0;
      let maxWeight = 0;
      let matched = [];
      for (const [kw, weight] of rule.keywords) {
        if (lower.includes(kw)) {
          score += weight;
          matched.push(kw);
          if (weight > maxWeight) maxWeight = weight;
        }
      }
      if (score > bestScore ||
          (score === bestScore && score > 0 && maxWeight > bestMaxWeight) ||
          (score === bestScore && score > 0 && maxWeight === bestMaxWeight && maxWeight >= 3)) {
        bestScore = score;
        bestMaxWeight = maxWeight;
        bestCategory = rule.category;
        bestMatched = matched;
      }
    }

    // Confidence: based on score and max keyword weight
    // score 1-2 = low, 3-4 = medium, 5+ = high
    // maxWeight 3 = boost confidence
    let confidence = 'low';
    if (bestScore >= 5 || (bestScore >= 3 && bestMaxWeight >= 3)) {
      confidence = 'high';
    } else if (bestScore >= 2 || (bestScore >= 1 && bestMaxWeight >= 3)) {
      confidence = 'medium';
    }
    // No keywords matched at all
    if (bestScore === 0) confidence = 'low';

    return { category: bestCategory, confidence, matchedKeywords: bestMatched, score: bestScore };
  };

  // ─── Severity Detection: keyword-based mapping ─────────────────────────────
  const detectSeverity = (text) => {
    const lower = (text || '').toLowerCase();
    if (lower.match(/\b(urgent|emergency|critical|severe|dangerous|accident|death|fatal|collapsed|flooding|fire|explosion|urgent|critical|dangerous|emergency)\b/) ||
        lower.match(/\b(aafat|bhayankar|jaanleva|emergency|maut|accident|aatish|dhamaka)\b/)) return 'critical';
    if (lower.match(/\b(high|serious|major|broken|damaged|risk|hazard|unsafe|alarming)\b/) ||
        lower.match(/\b(gambhir|kharab|toota|bigda|khatra|unsafe)\b/)) return 'high';
    if (lower.match(/\b(medium|moderate|concern|issue|problem|needs|fix|repair)\b/) ||
        lower.match(/\b(samasya|pareshani|theek|sudhar|dikkat)\b/)) return 'medium';
    return 'low';
  };

  // ─── Auto Language Detection ────────────────────────────────────────────────
  const detectLanguage = (text) => {
    if (!text) return null;
    // 1. Devanagari Unicode range (Hindi script)
    const devanagari = text.match(/[\u0900-\u097F]/g);
    if (devanagari && devanagari.length >= 2) return 'hi-IN';

    // 2. Common Hinglish words (Roman Hindi)
    const hinglishWords = [
      'hai','hain','ho','tha','the','thi','nahi','na','aur','mein','mai','se','ko','ka','ki','ke',
      'kya','kab','kahan','kyun','kaun','kitna','kitne','bahut','zyada','kam','thoda','abhi',
      'paani','bijli','sadak','gaddha','kharab','band','toot','phata','gayi','gaya',
      'school','hospital','aspatal','doctor','dawa','kachra','safai','traffic','signal',
      'transformer','pipe','nal','nala','drainage','flood','baadh','baarish',
      'kisan','fasal','kheti','gaon','pashu','maweshi',
      'police','thana','chori','aag','bhukamp','toofan',
      'aadhaar','ration','pension','certificate','sarkar','yojana',
      'pradushan','dhuan','shor','awaaz','ped','jungle',
      'nahi hai','nahi aa raha','nahi mil raha','ho gaya','ho raha','lag gaya',
    ];
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);
    let hinglishCount = 0;
    for (const word of words) {
      if (hinglishWords.includes(word)) hinglishCount++;
    }
    // If 30%+ of words are Hinglish, treat as Hindi
    if (words.length >= 2 && hinglishCount / words.length >= 0.3) return 'hi-IN';

    return 'en-IN'; // default English
  };

  // ─── Field Parsers: clean raw voice answers into proper values ─────────────
  const parsePopulation = (raw) => {
    if (!raw) return 500;
    const text = raw.toLowerCase().replace(/[^\d\w\s]/g, ' ').trim();
    // Extract numbers from patterns like 'around 1000 people', 'approximately 500', 'about 2000 residents'
    const numbers = text.match(/\d[\d,]*\.?\d*/g);
    if (numbers && numbers.length > 0) {
      // Take the largest number found (likely the population count)
      const parsed = numbers.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n));
      if (parsed.length > 0) return Math.max(...parsed);
    }
    // Word-to-number fallback (English + Hindi)
    const wordNums = {
      'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
      'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,'sixteen':16,'seventeen':17,'eighteen':18,'nineteen':19,'twenty':20,
      'thirty':30,'forty':40,'fifty':50,'sixty':60,'seventy':70,'eighty':80,'ninety':90,'hundred':100,'thousand':1000,'lakh':100000,'million':1000000,
      // Hindi numbers
      'ek':1,'do':2,'teen':3,'chaar':4,'paanch':5,'chhe':6,'saat':7,'aath':8,'nau':9,'dus':10,
      'gyarah':11,'barah':12,'terah':13,'chaudah':14,'pandrah':15,'solah':16,'satrah':17,'atharah':18,'unnis':19,'bees':20,
      'tees':30,'chalees':40,'pachas':50,'saath':60,'sattar':70,'assi':80,'nabbe':90,'sau':100,'hazaar':1000,'lakh':100000,'crore':10000000,
    };
    let total = 0;
    let current = 0;
    for (const word of text.split(/\s+/)) {
      if (wordNums[word] !== undefined) {
        const val = wordNums[word];
        if (val === 100 || val === 1000 || val === 100000 || val === 1000000) {
          current = current === 0 ? val : current * val;
          total += current;
          current = 0;
        } else {
          current += val;
        }
      }
    }
    total += current;
    if (total > 0) return total;
    return 500; // default
  };

  const parseDuration = (raw) => {
    if (!raw) return 'Unknown';
    const text = raw.toLowerCase().trim();
    // Match patterns like '3 months', '2 weeks', '6 months', 'one year'
    const match = text.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|half|quarter|several|few|many)?\s*(day|week|month|year|monsoon|season|hour)s?/i);
    if (match) {
      let num = match[1];
      const wordMap = {
        'one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9','ten':'10',
        'eleven':'11','twelve':'12','half':'0.5','quarter':'0.25','several':'6','few':'3','many':'12',
        // Hindi
        'ek':'1','do':'2','teen':'3','chaar':'4','paanch':'5','chhe':'6','saat':'7','aath':'8','nau':'9','dus':'10',
        'gyarah':'11','barah':'12','adha':'0.5','aadha':'0.5',
      };
      if (wordMap[num]) num = wordMap[num];
      if (!num) num = '1';
      return `${num} ${match[2]}s`;
    }
    // Handle 'since last monsoon', 'since 2024', etc.
    if (text.includes('monsoon') || text.includes('rain') || text.includes('baarish')) return 'Since last monsoon';
    if (text.includes('year') || text.includes('saal') || text.includes('varsh')) return '1 year';
    if (text.includes('month') || text.includes('mahina') || text.includes('mahine')) return '3 months';
    if (text.includes('week') || text.includes('hafta') || text.includes('hafte')) return '2 weeks';
    if (text.includes('day') || text.includes('din') || text.includes('dinon')) return '3 days';
    // Return cleaned original
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  const parseLocation = (raw) => {
    if (!raw) return { district: 'Ranchi', location: 'Reported via Voice' };
    const districts = ['ranchi','dumka','dhanbad','jamshedpur','east singhbhum','west singhbhum','bokaro','hazaribagh','deoghar','giridih','palamu','latehar','simdega','khunti','lohardaga','gumla','saraikela','chaibasa','pakur','godda','sahebganj','mandar','ranchi','dumka','dhanbad','bokaro','hazaribagh','deoghar','giridih','koderma','chatra','lotwa','mobile'];
    const lower = raw.toLowerCase();
    let district = '';
    for (const d of districts) {
      if (lower.includes(d)) {
        district = d.charAt(0).toUpperCase() + d.slice(1);
        break;
      }
    }
    // Clean location: remove filler phrases
    let cleaned = raw
      .replace(/\b(it is happening|i think|i believe|it is located|the problem is)\b/gi, '')
      .replace(/\b(near|close to|next to|beside|besides|in front of|behind|opposite to|around|at the|in the|on the)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    // Capitalize first letter
    if (cleaned.length > 0) cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    if (cleaned.length > 80) cleaned = cleaned.slice(0, 80);
    return { district: district || 'Ranchi', location: cleaned || raw };
  };

  const parseWhoAffected = (raw) => {
    if (!raw) return 'Local residents';
    // Clean filler words but keep descriptive text
    let cleaned = raw.replace(/\b(people|persons|who are|that are|which are|are being)\b/gi, '').trim();
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    if (cleaned.length > 100) cleaned = cleaned.slice(0, 100);
    return cleaned || 'Local residents';
  };

  // ─── Build the TTS readout text from generated data ────────────────────────
  const buildReportReadout = useCallback((data) => {
    const lang = selectedLanguage === 'hi-IN' ? 'hi' : 'en';
    if (lang === 'hi') {
      return `आपकी रिपोर्ट तैयार है।
      शीर्षक: ${data.title}.
      श्रेणी: ${data.category}.
      जिला: ${data.district}.
      स्थान: ${data.location}.
      गंभीरता: ${data.severity}.
      प्रभावित लोग: ${data.who_affected}.
      अनुमानित जनसंख्या: ${data.affected_population}.
      अवधि: ${data.duration}.
      विवरण: ${data.description}.
      क्या आप इस रिपोर्ट को सबमिट करना चाहेंगे?`;
    }
    const confText = data.categoryConfidence === 'high' ? ' with high confidence' : data.categoryConfidence === 'medium' ? '' : '. Note, the category may need verification';
    return `Your report is ready. Here's a summary.
    Title: ${data.title}.
    Category: ${data.category}${confText}.
    District: ${data.district}.
    Location: ${data.location}.
    Severity: ${data.severity}.
    Affected group: ${data.who_affected}.
    Estimated population: ${data.affected_population}.
    Duration: ${data.duration}.
    Description: ${data.description}.
    Would you like to submit this report?`;
  }, [selectedLanguage]);

  // ─── Generate Report from collected answers (uses answersRef) ──────────────
  const generateReport = useCallback(async () => {
    setIsProcessing(true);
    setPhase('summary');

    try {
      // Read directly from ref — always has latest answers
      const a = answersRef.current;
      const rawDescription = a.description || '';
      const rawLocation = a.location || '';
      const rawWhoAffected = a.who_affected || '';
      const rawPopulation = a.affected_population || '';
      const rawDuration = a.duration || '';

      // Parse and clean each field
      const description = rawDescription;
      const locationResult = parseLocation(rawLocation);
      const location = locationResult.location;
      const district = locationResult.district;
      const whoAffected = parseWhoAffected(rawWhoAffected);
      const population = parsePopulation(rawPopulation);
      const duration = parseDuration(rawDuration);

      const prompt = `You are a civic issue report assistant. Based on the following conversation answers, extract and return a valid JSON object ONLY with no surrounding text or markdown ticks:

User's answers:
- Problem description: "${description}"
- Location: "${location}"
- Who is affected: "${whoAffected}"
- Affected population: "${population}"
- Duration: "${duration}"

Return JSON:
{
  "title": "Clear concise 5-8 word problem title",
  "description": "Well-structured 2-3 sentence problem statement",
  "category": "Infrastructure" | "Water Management" | "Agriculture & Rural" | "Healthcare & Sanitation" | "Education & Literacy" | "Energy & Power" | "Environment & Pollution" | "Public Safety & Disaster" | "Digital Services & Governance" | "Urban Transport & Traffic",
  "district": "Extract district name or use Ranchi",
  "location": "Specific location details",
  "severity": "critical" | "high" | "medium" | "low",
  "affected_population": "Extracted number as integer",
  "who_affected": "Who is affected",
  "duration": "Duration of problem",
  "spoken_summary": "Short friendly confirmation"
}`;

      let parsedData = null;
      try {
        const rawAi = await groqService.generateCivicResponse([
          { role: 'system', content: 'You are JanSetu Voice AI parser. Output strict JSON only.' },
          { role: 'user', content: prompt }
        ]);
        const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn('[VoiceAgent] AI parsing fallback:', err);
      }

      // Fallback if AI failed
      if (!parsedData || !parsedData.title) {
        const catResult = detectCategory(description + ' ' + whoAffected);
        parsedData = {
          title: description.slice(0, 60) || 'Civic Issue Report',
          description: description || 'Issue reported via voice.',
          category: catResult.category,
          categoryConfidence: catResult.confidence,
          categoryKeywords: catResult.matchedKeywords,
          district: district,
          location: location,
          severity: detectSeverity(description),
          affected_population: population,
          who_affected: whoAffected || 'Local residents',
          duration: duration,
          spoken_summary: 'Your report is ready.'
        };
      }

      // Validate category matches available options
      const validCategories = ['Infrastructure','Water Management','Agriculture & Rural','Healthcare & Sanitation','Education & Literacy','Energy & Power','Environment & Pollution','Public Safety & Disaster','Digital Services & Governance','Urban Transport & Traffic'];
      if (!validCategories.includes(parsedData.category)) {
        const catResult = detectCategory(description + ' ' + (parsedData.category || ''));
        parsedData.category = catResult.category;
        parsedData.categoryConfidence = catResult.confidence;
        parsedData.categoryKeywords = catResult.matchedKeywords;
      }

      // Validate severity
      const validSeverities = ['critical','high','medium','low'];
      if (!validSeverities.includes(parsedData.severity)) {
        parsedData.severity = detectSeverity(description);
      }

      // Ensure all fields are present and cleaned
      parsedData.who_affected = whoAffected || parsedData.who_affected || 'Local residents';
      parsedData.duration = duration;
      parsedData.description = description || parsedData.description || 'Issue reported via voice.';
      parsedData.affected_population = population;
      parsedData.location = location || parsedData.location || 'Reported via Voice';
      parsedData.district = district || parsedData.district || 'Ranchi';

      // Category confidence — run detection on final category for score
      if (!parsedData.categoryConfidence) {
        const catResult = detectCategory(parsedData.category + ' ' + description + ' ' + whoAffected);
        parsedData.categoryConfidence = catResult.confidence;
        parsedData.categoryKeywords = catResult.matchedKeywords;
      }

      // Final sanitization: ensure affected_population is always a clean integer
      if (typeof parsedData.affected_population === 'string') {
        parsedData.affected_population = parsePopulation(parsedData.affected_population);
      }
      if (!parsedData.affected_population || isNaN(parsedData.affected_population)) {
        parsedData.affected_population = 500;
      }

      setGeneratedData(parsedData);
      triggerHaptic([100, 50, 100]); // success pattern

      // Add summary to conversation
      const confLabel = parsedData.categoryConfidence === 'high' ? '\n✅ High confidence match' : parsedData.categoryConfidence === 'medium' ? '\n⚡ Medium confidence — verify category' : '\n⚠️ Low confidence — please verify category';
      const summaryMsg = `Here's your drafted report:\n📌 ${parsedData.title}\n📂 ${parsedData.category}${confLabel}\n📍 District: ${parsedData.district}\n📌 Location: ${parsedData.location}\n⚠️ Severity: ${parsedData.severity}\n👥 ${parsedData.who_affected} · ~${parsedData.affected_population} people\n⏱️ Duration: ${parsedData.duration}`;
      setConversationLog(prev => [...prev, { role: 'agent', text: summaryMsg }]);

      // TTS: Read the full report aloud
      const readoutText = buildReportReadout(parsedData);
      await speak(readoutText);

    } catch (e) {
      console.error('[VoiceAgent] Report generation error:', e);
      setErrorMsg('Failed to generate report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [speak, buildReportReadout]);

  // ─── Run Interview (non-recursive, uses refs) ─────────────────────────────
  const runInterview = useCallback(async () => {
    abortRef.current = false;
    answersRef.current = {};

    for (let stepIdx = 0; stepIdx < stepsRef.current.length; stepIdx++) {
      if (abortRef.current) return;

      const step = stepsRef.current[stepIdx];
      setCurrentStep(stepIdx);

      if (step.isGreeting) {
        // Ask greeting
        setConversationLog(prev => [...prev, { role: 'agent', text: step.question }]);
        setPhase('questioning');
        stopListening();
        await speak(step.question);
        if (abortRef.current) return;

        // Listen for user response
        startListening();
        const answer = await collectTranscript();
        stopListening();
        setInterimText('');

        // Auto-detect language from greeting answer
        const detected = detectLanguage(answer);
        if (detected && detected !== selectedLanguage) {
          setDetectedLang(detected);
          setSelectedLanguage(detected);
          // Re-speak greeting in detected language if different
          const newSteps = detected === 'hi-IN' ? HI_STEPS : INTERVIEW_STEPS;
          stepsRef.current = newSteps;
        }

        setConversationLog(prev => [...prev, { role: 'user', text: answer || 'Yes' }]);
        continue; // Move to first real question
      }

      // Regular question
      setConversationLog(prev => [...prev, { role: 'agent', text: step.question }]);
      setPhase('questioning');
      stopListening();
      await speak(step.question);
      if (abortRef.current) return;

      // Listen for answer
      startListening();
      const answer = await collectTranscript();
      stopListening();
      setInterimText('');

      // Auto-detect language from first real answer (if not yet detected)
      if (!detectedLang && stepIdx === 1) {
        const detected = detectLanguage(answer);
        if (detected && detected !== selectedLanguage) {
          setDetectedLang(detected);
          setSelectedLanguage(detected);
          stepsRef.current = detected === 'hi-IN' ? HI_STEPS : INTERVIEW_STEPS;
          // Notify user
          const switchMsg = detected === 'hi-IN'
            ? '🔄 Hindi detected! Switching to Hindi mode...'
            : '🔄 English detected! Switching to English mode...';
          setConversationLog(prev => [...prev, { role: 'agent', text: switchMsg }]);
        } else if (detected) {
          setDetectedLang(detected);
        }
      }

      if (!answer.trim()) {
        // Retry once
        const retryMsg = selectedLanguage === 'hi-IN'
          ? "मैं नहीं सुन पाई। कृपया फिर से बताएं।"
          : "I didn't catch that. Could you please repeat?";
        setConversationLog(prev => [...prev, { role: 'agent', text: retryMsg }]);
        await speak(retryMsg);
        if (abortRef.current) return;

        startListening();
        const retryAnswer = await collectTranscript();
        stopListening();
        setInterimText('');

        if (retryAnswer.trim()) {
          setConversationLog(prev => [...prev, { role: 'user', text: retryAnswer }]);
          answersRef.current[step.field] = retryAnswer;
        } else {
          setConversationLog(prev => [...prev, { role: 'user', text: '(skipped)' }]);
          answersRef.current[step.field] = '';
        }
      } else {
        setConversationLog(prev => [...prev, { role: 'user', text: answer }]);
        answersRef.current[step.field] = answer;
      }
    }

    // All questions done — generate report
    if (!abortRef.current) {
      await generateReport();
    }
  }, [selectedLanguage, speak, startListening, stopListening, collectTranscript, generateReport]);

  // ─── Haptic Feedback (mobile vibration) ─────────────────────────────────────
  const triggerHaptic = (pattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern || [50, 30, 50]);
    }
  };

  // ─── Start / Stop Interview on Open ────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Haptic feedback on open
      triggerHaptic();

      // Reset everything
      answersRef.current = {};
      setConversationLog([]);
      setCurrentStep(0);
      setPhase('intro');
      setGeneratedData(null);
      setInterimText('');
      setErrorMsg('');
      setDetectedLang(null);
      abortRef.current = false;

      const timer = setTimeout(() => runInterview(), 500);
      return () => {
        clearTimeout(timer);
        abortRef.current = true;
        stopListening();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    } else {
      abortRef.current = true;
      stopListening();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // ─── Handle Apply to Form ──────────────────────────────────────────────────
  const handleApplyToForm = () => {
    if (generatedData && onAutoFillReport) {
      triggerHaptic([30, 20, 30, 20, 50]); // confirmation pattern
      onAutoFillReport(generatedData);
      onClose();
      onNavigate('report');
    }
  };

  // ─── Handle Skip / End Early ───────────────────────────────────────────────
  const handleSkipToEnd = () => {
    abortRef.current = true;
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    generateReport();
  };

  if (!isOpen) return null;

  // Current question text
  const currentQuestion = phase === 'questioning' && currentStep < steps.length
    ? steps[currentStep]?.question : '';

  // Progress
  const progress = phase === 'summary' ? 100 : Math.round((currentStep / steps.length) * 100);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(0, 24, 68, 0.45)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.2s ease forwards',
    }}>
      <div style={{
        background: '#ffffff', border: '1px solid var(--border-medium)',
        borderRadius: '16px', width: '100%', maxWidth: '540px',
        boxShadow: '0 20px 60px rgba(0, 48, 135, 0.3)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
          borderBottom: '4px solid #FF6200',
          padding: '14px 18px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: isListening ? '#FF6200' : isSpeaking ? '#10b981' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isListening ? '0 0 16px rgba(255,98,0,0.8)' : isSpeaking ? '0 0 16px rgba(16,185,129,0.6)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {isListening ? <Mic size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>JanSetu Voice AI</h3>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>
                {isListening ? '🎙️ Listening...' : isSpeaking ? '🔊 Speaking...' : phase === 'summary' ? '✨ Report Ready' : detectedLang === 'hi-IN' ? '🗣️ Hindi Mode — Interview' : detectedLang === 'en-IN' ? '🗣️ English Mode — Interview' : 'Conversational Interview Mode'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px', color: '#fff', fontSize: '0.72rem',
                padding: '4px 8px', outline: 'none', cursor: 'pointer', fontWeight: 600,
              }}
            >
              <option value="en-IN" style={{ color: '#000' }}>English</option>
              <option value="hi-IN" style={{ color: '#000' }}>हिन्दी</option>
            </select>
            {detectedLang && (
              <span style={{
                fontSize: '0.55rem',
                background: 'rgba(16,185,129,0.2)',
                color: '#6ee7b7',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                Auto
              </span>
            )}
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '6px', color: '#fff', padding: '6px',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: '#f0f4f8' }}>
          <div style={{ height: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: phase === 'summary' ? 'var(--success)' : 'var(--accent)',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '6px 18px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600,
          }}>
            <span>Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</span>
            <span>{progress}% complete</span>
          </div>
        </div>

        {/* Conversation Area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: '10px',
          maxHeight: '320px', background: '#fafbfc',
        }}>
          {conversationLog.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Bot size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p>Starting conversation...</p>
            </div>
          )}

          {conversationLog.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: msg.role === 'agent' ? 'flex-start' : 'flex-end',
              gap: '8px', animation: 'fadeIn 0.2s ease',
            }}>
              {msg.role === 'agent' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--primary)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={14} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '10px 14px',
                borderRadius: msg.role === 'agent' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background: msg.role === 'agent' ? '#ffffff' : 'var(--primary)',
                color: msg.role === 'agent' ? 'var(--text-primary)' : '#ffffff',
                fontSize: '0.84rem', lineHeight: 1.5,
                border: msg.role === 'agent' ? '1px solid var(--border-subtle)' : 'none',
                boxShadow: msg.role === 'agent' ? '0 1px 4px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,48,135,0.2)',
                whiteSpace: 'pre-line',
              }}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--accent)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={14} color="#fff" />
                </div>
              )}
            </div>
          ))}

          {/* Current question bubble */}
          {phase === 'questioning' && currentQuestion && (
            <div style={{ display: 'flex', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--primary)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={14} color="#fff" />
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: '4px 14px 14px 14px',
                background: '#ffffff', border: '1px solid var(--border-subtle)',
                fontSize: '0.84rem', lineHeight: 1.5,
                color: 'var(--text-primary)', maxWidth: '80%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                {currentQuestion}
              </div>
            </div>
          )}

          {/* Interim transcript */}
          {isListening && interimText && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <div style={{
                padding: '8px 14px', borderRadius: '14px 4px 14px 14px',
                background: 'rgba(255,98,0,0.1)', border: '1px dashed rgba(255,98,0,0.3)',
                fontSize: '0.82rem', color: 'var(--text-secondary)',
                fontStyle: 'italic', maxWidth: '80%',
              }}>
                {interimText}...
              </div>
            </div>
          )}

          {/* Summary data preview */}
          {phase === 'summary' && generatedData && (
            <div style={{
              background: '#ffffff', border: '1px solid var(--border-medium)',
              borderRadius: '12px', padding: '14px',
              display: 'flex', flexDirection: 'column', gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'var(--success)', fontWeight: 700, fontSize: '0.8rem',
              }}>
                <CheckCircle2 size={16} />
                <span>Report Drafted Successfully</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.76rem' }}>
                <div><strong>Title:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.title}</span></div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Category:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.category}</span>
                  {generatedData.categoryConfidence && (
                    <span style={{
                      display: 'inline-block',
                      marginLeft: '6px',
                      padding: '1px 7px',
                      borderRadius: '9999px',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      verticalAlign: 'middle',
                      background: generatedData.categoryConfidence === 'high' ? '#dcfce7' : generatedData.categoryConfidence === 'medium' ? '#fef3c7' : '#fee2e2',
                      color: generatedData.categoryConfidence === 'high' ? '#166534' : generatedData.categoryConfidence === 'medium' ? '#92400e' : '#991b1b',
                      border: `1px solid ${generatedData.categoryConfidence === 'high' ? '#bbf7d0' : generatedData.categoryConfidence === 'medium' ? '#fde68a' : '#fecaca'}`,
                    }}>
                      {generatedData.categoryConfidence === 'high' ? 'High confidence' : generatedData.categoryConfidence === 'medium' ? 'Medium confidence' : 'Low confidence'}
                    </span>
                  )}
                  {generatedData.categoryKeywords && generatedData.categoryKeywords.length > 0 && (
                    <div style={{ marginTop: '3px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Matched: {generatedData.categoryKeywords.slice(0, 5).join(', ')}
                    </div>
                  )}
                </div>
                <div><strong>District:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.district}</span></div>
                <div><strong>Severity:</strong> <span style={{ color: '#ea580c', fontWeight: 700, textTransform: 'capitalize' }}>{generatedData.severity}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Location:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.location}</span></div>
                <div><strong>Affected:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.who_affected}</span></div>
                <div><strong>Population:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.affected_population}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Duration:</strong> <span style={{ color: 'var(--text-secondary)' }}>{generatedData.duration}</span></div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Description:</strong>
                  <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0', fontSize: '0.74rem', lineHeight: 1.4 }}>{generatedData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Processing spinner */}
          {isProcessing && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '12px',
              color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600,
            }}>
              <RefreshCw size={16} className="spin" />
              <span>Drafting your report with AI...</span>
            </div>
          )}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', background: 'var(--danger-light)',
            borderTop: '1px solid rgba(192,57,43,0.2)',
            color: 'var(--danger)', fontSize: '0.8rem',
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mic Indicator */}
        {phase === 'questioning' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '12px 18px',
            background: isListening ? 'rgba(255,98,0,0.04)' : '#f8fafc',
            borderTop: '1px solid var(--border-subtle)',
            transition: 'all 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: isListening ? '#FF6200' : 'var(--primary)',
                  border: '3px solid #ffffff', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isListening ? '0 0 20px rgba(255,98,0,0.5)' : '0 4px 12px rgba(0,48,135,0.3)',
                  cursor: 'pointer',
                  transform: isListening ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                {isListening ? <Mic size={20} /> : <MicOff size={18} />}
              </button>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isListening ? '#FF6200' : 'var(--text-primary)' }}>
                  {isListening ? 'Listening... speak now' : 'Tap mic to speak'}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {isSpeaking ? 'Please wait...' : 'Your answer will be captured'}
                </div>
              </div>
            </div>
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '8px', height: '18px' }}>
                {[10, 18, 14, 22, 12, 20, 16, 24, 10, 18].map((h, idx) => (
                  <div key={idx} style={{
                    width: '3px', height: `${h}px`, background: 'var(--accent)',
                    borderRadius: '2px', animation: `pulse 0.6s infinite alternate ease-in-out ${idx * 0.08}s`,
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '12px 18px', background: '#f8fafc',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 14px', borderRadius: '6px',
            border: '1px solid var(--border-medium)', background: '#fff',
            color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {phase === 'questioning' && currentStep > 0 && !generatedData && (
              <button onClick={handleSkipToEnd} style={{
                padding: '8px 14px', borderRadius: '6px',
                border: '1px solid var(--border-medium)', background: '#fff',
                color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Skip to End
              </button>
            )}

            {phase === 'summary' && generatedData && (
              <>
                <button onClick={generateReport} style={{
                  padding: '8px 14px', borderRadius: '6px',
                  border: '1px solid var(--border-medium)', background: '#fff',
                  color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Volume2 size={13} /> Read Again
                </button>
                <button onClick={handleApplyToForm} style={{
                  padding: '9px 18px', borderRadius: '6px',
                  background: '#FF6200', color: '#fff', border: 'none',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 8px rgba(255,98,0,0.4)',
                }}>
                  <FileText size={14} />
                  <span>Auto-Fill Report</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
