import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { groqService } from '../services/groqClientService';
import { aiService } from '../services/aiService';

export default function JanSetuVoiceAgent({ isOpen, onClose, onNavigate, onAutoFillReport }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponseText, setAiResponseText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN'); // 'en-IN' | 'hi-IN'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript + ' ';
          } else {
            interim += item[0].transcript;
          }
        }
        if (final) {
          setTranscript(prev => (prev + ' ' + final).trim());
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        console.warn('[JanSetuVoiceAgent] Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'network') {
          setErrorMsg('Network issue with speech recognition service.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Speech recognition is not supported in this browser. Please try Google Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  // Handle open / auto-start listening
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimText('');
      setAiResponseText('');
      setExtractedData(null);
      setErrorMsg('');
      startListening();
    } else {
      stopListening();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('[VoiceAgent] Start error:', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {}
  };

  // Text-to-Speech Assistant Voice
  const speakVoice = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = selectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Process User's Spoken Input with AI
  const handleProcessVoiceInput = async () => {
    const fullText = (transcript + ' ' + interimText).trim();
    if (!fullText) {
      setErrorMsg('Please speak into the microphone first.');
      return;
    }

    stopListening();
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const lower = fullText.toLowerCase();

      // Check for Direct Voice Commands (Navigation)
      if (lower.includes('dashboard') || lower.includes('overview') || lower.includes('home')) {
        const reply = "Navigating to Platform Dashboard.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('dashboard');
        }, 1200);
        return;
      }
      if (lower.includes('explore') || lower.includes('challenges') || lower.includes('problems')) {
        const reply = "Opening Societal Challenges Explorer.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('explore');
        }, 1200);
        return;
      }
      if (lower.includes('solution') || lower.includes('prototype') || lower.includes('marketplace')) {
        const reply = "Opening Solutions Marketplace.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('solutions');
        }, 1200);
        return;
      }
      if (lower.includes('command center') || lower.includes('district command')) {
        const reply = "Opening District Command Center.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('command-center');
        }, 1200);
        return;
      }
      if (lower.includes('funding') || lower.includes('csr') || lower.includes('grant')) {
        const reply = "Opening CSR Grants and Funding Ecosystem.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('funding');
        }, 1200);
        return;
      }
      if (lower.includes('research') || lower.includes('papers') || lower.includes('datasets')) {
        const reply = "Opening Academic Research and Knowledge Hub.";
        setAiResponseText(reply);
        speakVoice(reply);
        setTimeout(() => {
          onClose();
          onNavigate('research-hub');
        }, 1200);
        return;
      }

      // Civic Issue Recognition & Auto-Fill Mode
      const prompt = `Analyze this spoken citizen grievance: "${fullText}".
Extract and return a valid JSON object ONLY with no surrounding text or markdown ticks:
{
  "title": "Clear concise 5-8 word problem title",
  "category": "Road Infrastructure" | "Water Management" | "Agriculture & Rural" | "Education & Youth" | "Sanitation & Waste" | "Health & Hygiene" | "Energy & Power",
  "district": "Ranchi" | "Dumka" | "Dhanbad" | "Jamshedpur" | "Bokaro" | "Hazaribagh" | "Deoghar" | "Giridih",
  "location": "Specific landmark or village mentioned",
  "severity": "critical" | "high" | "medium" | "low",
  "affected_population": "Estimated number of residents as integer (e.g. 1500)",
  "description": "2-3 sentences structured problem statement",
  "spoken_summary": "Short 1-sentence confirmation message for voice response (e.g. 'I recognized road waterlogging in Dumka with high severity.')"
}`;

      let parsedData = null;
      try {
        const rawAi = await groqService.generateCivicResponse([
          { role: 'system', content: 'You are JanSetu Voice AI parser. Output strict JSON only.' },
          { role: 'user', content: prompt }
        ]);

        const jsonMatch = rawAi.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('Groq parsing fallback:', err);
      }

      // Fallback heuristic if API failed or offline
      if (!parsedData || !parsedData.title) {
        parsedData = {
          title: fullText.slice(0, 50) + (fullText.length > 50 ? '...' : ''),
          category: lower.includes('water') || lower.includes('leak') ? 'Water Management' : lower.includes('road') || lower.includes('pothole') ? 'Road Infrastructure' : 'Sanitation & Waste',
          district: lower.includes('dumka') ? 'Dumka' : lower.includes('dhanbad') ? 'Dhanbad' : lower.includes('jamshedpur') ? 'East Singhbhum' : 'Ranchi',
          location: 'Reported via Voice Telemetry',
          severity: lower.includes('urgent') || lower.includes('accident') || lower.includes('severe') ? 'high' : 'medium',
          affected_population: 1200,
          description: fullText,
          spoken_summary: `I parsed your issue and prepared the submission form for you.`
        };
      }

      setExtractedData(parsedData);
      const voiceReply = parsedData.spoken_summary || `Recognized ${parsedData.title} in ${parsedData.district}. Form ready for submission.`;
      setAiResponseText(voiceReply);
      speakVoice(voiceReply);

    } catch (e) {
      console.error('[VoiceAgent] Analysis error:', e);
      setErrorMsg('Failed to process voice input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToForm = () => {
    if (extractedData && onAutoFillReport) {
      onAutoFillReport(extractedData);
      onClose();
      onNavigate('report');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      background: 'rgba(0, 24, 68, 0.45)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.2s ease forwards',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        boxShadow: '0 20px 60px rgba(0, 48, 135, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
          borderBottom: '4px solid #FF6200',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: isListening ? '#FF6200' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isListening ? '0 0 16px rgba(255,98,0,0.8)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              <Mic size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                JanSetu Voice AI Engine
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
                Active Speech Recognition & AI Form Telemetry
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.75rem',
                padding: '4px 8px',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <option value="en-IN" style={{ color: '#000' }}>English (India)</option>
              <option value="hi-IN" style={{ color: '#000' }}>हिन्दी (Hindi)</option>
            </select>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Waveform / Pulse Mic Center */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            background: isListening ? 'var(--primary-light)' : '#f8fafc',
            border: `2px dashed ${isListening ? 'var(--primary)' : 'var(--border-medium)'}`,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
          }}>
            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: isListening ? '#FF6200' : 'var(--primary)',
                border: '4px solid #ffffff',
                color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isListening ? '0 0 24px rgba(255, 98, 0, 0.6)' : '0 4px 14px rgba(0, 48, 135, 0.3)',
                cursor: 'pointer',
                transform: isListening ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.25s ease',
                marginBottom: '14px',
              }}
            >
              {isListening ? <Mic size={32} /> : <MicOff size={30} />}
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isListening ? '#FF6200' : 'var(--text-primary)' }}>
                {isListening ? '🎙️ Listening... Speak naturally now' : 'Click Mic to Start Speaking'}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Example: "Severe road damage near Dumka college causing traffic" or "Navigate to Dashboard"
              </p>
            </div>

            {/* Audio waveform bar animation */}
            {isListening && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '14px', height: '24px' }}>
                {[12, 22, 16, 28, 18, 24, 14, 26, 12, 20].map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '4px',
                      height: `${h}px`,
                      background: 'var(--primary)',
                      borderRadius: '2px',
                      animation: `pulse 0.6s infinite alternate ease-in-out ${idx * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Transcript Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Live Speech Transcript
              </span>
              {(transcript || interimText) && (
                <button
                  onClick={() => { setTranscript(''); setInterimText(''); setExtractedData(null); setAiResponseText(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear text
                </button>
              )}
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px 14px',
              minHeight: '70px',
              maxHeight: '120px',
              overflowY: 'auto',
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
            }}>
              {transcript || interimText ? (
                <span>
                  {transcript} <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>{interimText}</span>
                </span>
              ) : (
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  Speak about an issue in your district or a voice command...
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--danger-light)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.8rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Voice Feedback Banner */}
          {aiResponseText && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: 'var(--primary-light)',
              border: '1px solid rgba(0,48,135,0.2)',
              borderRadius: '8px',
              padding: '12px 14px',
            }}>
              <Volume2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.82rem', color: 'var(--primary)', display: 'block' }}>
                  AI Voice Feedback:
                </strong>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {aiResponseText}
                </span>
              </div>
            </div>
          )}

          {/* AI Extracted Structured Data Preview */}
          {extractedData && (
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 700, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} />
                <span>AI Structured Field Extraction Complete</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                <div><strong>Title:</strong> <span style={{ color: 'var(--text-secondary)' }}>{extractedData.title}</span></div>
                <div><strong>Category:</strong> <span style={{ color: 'var(--text-secondary)' }}>{extractedData.category}</span></div>
                <div><strong>District:</strong> <span style={{ color: 'var(--text-secondary)' }}>{extractedData.district}</span></div>
                <div><strong>Severity:</strong> <span style={{ color: '#ea580c', fontWeight: 700, textTransform: 'capitalize' }}>{extractedData.severity}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 20px',
          background: '#f8fafc',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleProcessVoiceInput}
              disabled={isProcessing || (!transcript && !interimText)}
              className="btn btn-primary"
              style={{
                padding: '9px 18px',
                fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '6px',
                opacity: (!transcript && !interimText) ? 0.6 : 1,
              }}
            >
              {isProcessing ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
              <span>{isProcessing ? 'Analyzing Voice...' : 'Analyze with AI'}</span>
            </button>

            {extractedData && (
              <button
                onClick={handleApplyToForm}
                style={{
                  padding: '9px 18px',
                  borderRadius: '6px',
                  background: '#FF6200',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 8px rgba(255,98,0,0.4)',
                }}
              >
                <span>Auto-Fill Report</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
