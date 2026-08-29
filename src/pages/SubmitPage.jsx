import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, AlertTriangle, Upload, Eye, FileText, Brain, ArrowRight, ArrowLeft, Wand2, Mic, X } from 'lucide-react';
import { aiService } from '../services/aiService';
import { groqService } from '../services/groqClientService';
import { CATEGORIES } from '../services/mockData';

export default function SubmitPage({ onSubmit, challenges = [], onNavigate, preFillData = null, onOpenVoice = () => {} }) {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water Management');
  const [subcategory, setSubcategory] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('23.3441');
  const [lng, setLng] = useState('85.3090');
  const [whoAffected, setWhoAffected] = useState('');
  const [affectedPop, setAffectedPop] = useState('1800');
  const [duration, setDuration] = useState('3 months');
  const [severity, setSeverity] = useState('high');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sync Voice Pre-fill Data if provided
  useEffect(() => {
    if (preFillData) {
      if (preFillData.title) setTitle(preFillData.title);
      if (preFillData.description) setDescription(preFillData.description);
      if (preFillData.category) setCategory(preFillData.category);
      // Put district first, then specific location
      if (preFillData.district) setLocation(preFillData.district);
      if (preFillData.location) setLocation(prev => prev ? `${prev}, ${preFillData.location}` : preFillData.location);
      if (preFillData.severity) setSeverity(preFillData.severity.toLowerCase());
      if (preFillData.affected_population) setAffectedPop(preFillData.affected_population.toString());
      if (preFillData.who_affected) setWhoAffected(preFillData.who_affected);
      if (preFillData.duration) setDuration(preFillData.duration);
    }
  }, [preFillData]);

  // UI Flow State
  const [step, setStep] = useState(1); // 1 = Form, 2 = AI Loading, 3 = Duplicate Alert, 4 = AI Preview/Approve
  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingText, setLoadingText] = useState('Initializing Cognitive Engine...');

  const handleGenerateDraft = async () => {
    const rawInput = title || description || prompt('Describe the issue in your own words (e.g., "Huge pothole near university entrance causing accidents"):');
    if (!rawInput) return;

    setIsGenerating(true);
    try {
      const draft = await groqService.generateComplaintDraft(rawInput);
      if (draft) {
        if (draft.title) setTitle(draft.title);
        if (draft.description) setDescription(draft.description);
        if (draft.category) setCategory(draft.category);
        if (draft.severity) setSeverity(draft.severity);
        if (draft.location_placeholder && !location) setLocation(draft.location_placeholder);
      }
    } catch (err) {
      console.warn('Draft generation fallback:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerAiAnalysis = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please provide a Title and Description first.");
      return;
    }

    setStep(2);
    setLoadingText('Scanning repository for duplicate submissions...');
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Run Duplicate detection
    const dupResult = aiService.detectDuplicates(title, description, challenges);
    if (dupResult.hasDuplicate) {
      setDuplicateMatch(dupResult);
      setStep(3);
      return;
    }

    proceedToAiAnalysis();
  };

  const proceedToAiAnalysis = async () => {
    setStep(2);
    setLoadingText('Executing semantic categorization & sub-sector parsing...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoadingText('Calculating local priority score based on severity & population density...');
    
    try {
      // 2. Call AI analyzer — pass user's selected category for context
      const analysis = await aiService.analyzeChallenge(title, description, category);
      if (analysis) {
        setAiAnalysis(analysis);
        // Populate form fields with AI output for confirmation
        setCategory(analysis.category);
        setSubcategory(analysis.subcategory || '');
        setSeverity((analysis.severity || 'medium').toLowerCase());
        setAffectedPop((analysis.affected_population_estimate || 1500).toString());
      }
    } catch (err) {
      console.warn('[SubmitPage] AI analysis failed, using defaults:', err.message);
      // Set a basic analysis so the submit button still works
      setAiAnalysis({
        category: category,
        subcategory: '',
        severity: severity || 'medium',
        priority_score: 50,
        affected_population_estimate: parseInt(affectedPop) || 1500,
        possible_causes: ['Issue requires further investigation'],
        suggested_technologies: ['Field assessment tools'],
        skills_required: ['General Engineering']
      });
    }
    setStep(4);
  };

  const handleFilesSelected = (files) => {
    const valid = files.filter(f => f.size <= 10 * 1024 * 1024); // 10MB limit
    const newFiles = valid.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFinalSubmit = () => {
    const finalChallenge = {
      id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(Math.random() * 1000),
      title: title,
      description: description,
      category: category,
      subcategory: subcategory,
      severity: severity,
      status: 'under_review', // starts Under Review -> Admin validates it later
      location: location || 'Rural Jharkhand',
      district: location.split(',').pop().trim() || 'Ranchi',
      latitude: parseFloat(lat) || 23.34,
      longitude: parseFloat(lng) || 85.30,
      affected_population: parseInt(affectedPop) || 1800,
      priority_score: aiAnalysis ? aiAnalysis.priority_score : 50,
      reports_count: 1,
      support_count: 0,
      skills_required: aiAnalysis ? aiAnalysis.skills_required : ['General Engineering'],
      ai_analysis: aiAnalysis || {},
      created_at: new Date().toISOString(),
      evidence: [],
      evidence_files: uploadedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
      _rawFiles: uploadedFiles.map(f => f.raw), // Pass raw File objects for upload in App.jsx
      comments: []
    };

    onSubmit(finalChallenge);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* STEP 1: Main Citizen Report Form */}
      {step === 1 && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '6px' }}>Report a Societal Challenge</h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fill out the citizen grievance details below:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onOpenVoice}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--accent)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255,98,0,0.3)',
                }}
              >
                <Mic size={15} />
                <span>Speak & AI Auto-Fill</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, borderRadius: '6px', cursor: 'pointer' }}
              >
                <Wand2 size={15} />
                {isGenerating ? 'Drafting with AI...' : 'Auto-Generate Draft'}
              </button>
            </div>
          </div>

          <form onSubmit={e => { e.preventDefault(); triggerAiAnalysis(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Problem Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Monsoon Rural Road Accessibility"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Describe the Problem in Detail *</label>
              <textarea 
                rows="5"
                placeholder="Describe what is happening, why it occurs, and how it impacts local life. (e.g. Our village connectivity roads in Dumka district become completely muddy and unusable during heavy rainfall...)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-input"
                style={{ resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category (AI will verify)</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Who is affected? *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Local school students, 10 farming villages"
                  value={whoAffected}
                  onChange={e => setWhoAffected(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>District / Specific Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sikaripara Block, Dumka"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Latitude (Optional)</label>
                <input type="text" value={lat} onChange={e => setLat(e.target.value)} className="form-input" />
              </div>

              <div className="form-group">
                <label>Longitude (Optional)</label>
                <input type="text" value={lng} onChange={e => setLng(e.target.value)} className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Approximate Affected Population</label>
                <input 
                  type="number" 
                  value={affectedPop} 
                  onChange={e => setAffectedPop(e.target.value)} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label>How long has the problem existed?</label>
                <input 
                  type="text" 
                  placeholder="e.g. 3 years, recurring every monsoon"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Document upload zone */}
            <div className="form-group">
              <label>Upload Supporting Evidence (Images / Documents)</label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf,video/mp4,video/webm"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  handleFilesSelected(Array.from(e.target.files));
                  // Reset so re-selecting same file triggers change
                  e.target.value = '';
                }}
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFilesSelected(Array.from(e.dataTransfer.files));
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragOver ? 'var(--primary)' : 'var(--border-medium)'}`,
                  borderRadius: '8px',
                  padding: '30px',
                  textAlign: 'center',
                  background: isDragOver ? 'rgba(0,48,135,0.04)' : 'rgba(255,255,255,0.01)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Upload size={24} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>Click to select files, or drag-and-drop evidence files here</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, PDF, MP4 (Max 10MB)</span>
              </div>

              {/* File previews */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        background: 'rgba(255,255,255,0.04)'
                      }}
                    >
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexDirection: 'column', gap: '4px', padding: '8px'
                        }}>
                          <FileText size={20} style={{ color: 'var(--primary)' }} />
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-all' }}>
                            {file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                          if (file.preview) URL.revokeObjectURL(file.preview);
                        }}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.65)', color: '#fff',
                          border: 'none', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                      <div style={{
                        position: 'absolute', bottom: '2px', left: '2px', right: '2px',
                        background: 'rgba(0,0,0,0.5)', color: '#fff',
                        fontSize: '0.55rem', padding: '2px 4px', borderRadius: '4px',
                        textAlign: 'center'
                      }}>
                        {(file.size / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-ai" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '8px', marginTop: '10px' }}>
              <Brain size={18} />
              Analyze with AI
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: AI Loading Overlay */}
      {step === 2 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--ai-purple), var(--primary))',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            animation: 'pulse 1.5s infinite alternate'
          }}>
            <Brain size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'white' }}>CivicSolve AI Analyst Running</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '360px', minHeight: '40px' }}>
            {loadingText}
          </p>
          <div style={{ width: '200px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
            <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
          </div>
        </div>
      )}

      {/* STEP 3: Duplicate Warning Overlay */}
      {step === 3 && duplicateMatch && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning)' }}>
            <AlertTriangle size={28} />
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'white' }}>Similar Challenge Detected ({duplicateMatch.similarity}% Similarity)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>We found an existing challenge that appears to overlap with your report.</p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '6px' }}>{duplicateMatch.challenge.title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {duplicateMatch.challenge.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div>District: <strong style={{ color: 'white' }}>{duplicateMatch.challenge.district}</strong></div>
              <div>Reports: <strong style={{ color: 'white' }}>{duplicateMatch.challenge.reports_count}</strong></div>
              <div>Distance: <strong style={{ color: 'white' }}>2.4 km away</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              onClick={() => onNavigate(`challenge/${duplicateMatch.challenge.id}`)} 
              className="btn btn-secondary"
            >
              <Eye size={14} />
              View Existing Challenge
            </button>
            <button 
              onClick={proceedToAiAnalysis} 
              className="btn btn-primary"
              style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
            >
              Continue as New Challenge
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Analysis Preview Editor */}
      {step === 4 && aiAnalysis && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={24} style={{ color: 'var(--ai-purple)' }} />
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'white' }}>AI-Generated Structuring Summary</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review the parameters determined by CivicSolve AI before committing.</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Calculated Priority</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-display)' }}>
                {aiAnalysis.priority_score}/100
              </span>
            </div>
          </div>

          {/* Structured Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
            
            {/* Left Box: Params */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Confirmed Category</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="form-input" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Confirmed Subcategory</label>
                  <input type="text" value={subcategory} onChange={e => setSubcategory(e.target.value)} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Confirmed Severity</label>
                  <select value={severity} onChange={e => setSeverity(e.target.value)} className="form-select">
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Affected Population Est.</label>
                  <input type="number" value={affectedPop} onChange={e => setAffectedPop(e.target.value)} className="form-input" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Detected Roots / Causes</label>
                <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {aiAnalysis.possible_causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Box: Techs & Skills */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Suggested Technologies</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {aiAnalysis.suggested_technologies.map((tech, i) => (
                    <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', background: 'var(--primary-light)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(0,48,135,0.15)', fontWeight: 600 }}>
                      🛠 {tech}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Required Skills Required</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {aiAnalysis.skills_required.map((skill, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '10px' }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={14} />
              Edit Description
            </button>

            <button onClick={handleFinalSubmit} className="btn btn-primary">
              Submit Challenge to Ecosystem
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
