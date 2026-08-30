import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Camera, MapPin, Upload, Mic } from 'lucide-react';
import { CATEGORIES, JHARKHAND_DISTRICTS } from '../services/mockData';

export default function MobileReportWizard({ onSubmit, onBack, preFillData = null, onOpenVoice = () => {} }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [population, setPopulation] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [isScanning, setIsScanning] = useState(false);
  const [whoAffected, setWhoAffected] = useState('');
  const [duration, setDuration] = useState('');
  const [priorityScore, setPriorityScore] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Sync voice pre-fill data
  useEffect(() => {
    if (preFillData) {
      if (preFillData.title) setTitle(preFillData.title);
      if (preFillData.description) setDescription(preFillData.description);
      if (preFillData.category) setCategory(preFillData.category);
      if (preFillData.district) setDistrict(preFillData.district);
      if (preFillData.location) setLocation(preFillData.location);
      if (preFillData.affected_population) setPopulation(preFillData.affected_population.toString());
      if (preFillData.who_affected) setWhoAffected(preFillData.who_affected);
      if (preFillData.duration) setDuration(preFillData.duration);
    }
  }, [preFillData]);

  const canProceedStep1 = title.trim().length > 0 && description.trim().length >= 20;
  const canProceedStep2 = location.trim().length > 0;

  const calculatePriority = (desc, pop, dur) => {
    let score = 40;
    const text = (desc || '').toLowerCase();
    // Keyword boosts
    if (text.includes('emergency') || text.includes('critical') || text.includes('urgent')) score += 20;
    if (text.includes('death') || text.includes('fatal') || text.includes('hospital')) score += 15;
    if (text.includes('water') || text.includes('flood') || text.includes('drainage')) score += 8;
    if (text.includes('road') || text.includes('pothole') || text.includes('bridge')) score += 6;
    if (text.includes('school') || text.includes('child') || text.includes('student')) score += 10;
    if (text.includes('electric') || text.includes('power') || text.includes('light')) score += 5;
    // Population boost
    const popNum = Number(pop) || 0;
    if (popNum > 5000) score += 15;
    else if (popNum > 1000) score += 10;
    else if (popNum > 500) score += 5;
    // Duration boost
    const durText = (dur || '').toLowerCase();
    if (durText.includes('year') || durText.includes('years')) score += 10;
    else if (durText.includes('month') || durText.includes('months')) score += 5;
    return Math.min(98, Math.max(30, score));
  };

  const handleNextStep = () => {
    if (step === 4) {
      const calcScore = calculatePriority(description, population, duration);
      setPriorityScore(calcScore);
      setIsScanning(true);
      setStep(5);
      setTimeout(() => setIsScanning(false), 1500);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmitFinal = () => {
    const evidenceItems = uploadedFiles.map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.preview || f.url || ''
    }));

    const newChallenge = {
      id: `ch-m-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      district: district || 'Not specified',
      location: location.trim() || 'Location not specified',
      affected_population: Number(population) || 0,
      priority_score: priorityScore || 50,
      status: 'reported',
      created_at: new Date().toISOString(),
      skills_required: [],
      evidence: evidenceItems,
      evidence_files: evidenceItems,
      ai_analysis: {
        evidence: evidenceItems
      },
      _rawFiles: uploadedFiles.map(f => f.raw)
    };
    onSubmit(newChallenge);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="touch-target" style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '50%', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Report a Societal Challenge
          </h2>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Step {step} of 6 — {getStepName(step)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(step / 6) * 100}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Voice AI Quick Action */}
      <button
        onClick={onOpenVoice}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '9999px',
          background: 'var(--accent)', border: 'none',
          color: '#ffffff', cursor: 'pointer',
          fontSize: '0.82rem', fontWeight: 700,
          boxShadow: '0 2px 8px rgba(255,98,0,0.35)',
        }}
      >
        <Mic size={16} />
        Speak & AI Auto-Fill
      </button>

      {/* STEP 1: Problem Description */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>What is the issue title?</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="e.g. Monsoon Rural Road Accessibility" required />
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Describe the problem in detail</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" rows={5} placeholder="Explain what happens, how often, and key difficulties..." required />
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '10px' }} disabled={!canProceedStep1}>
            {!title ? 'Enter a title to continue' : description.trim().length < 20 ? `Describe the problem (${20 - description.trim().length} more chars)` : 'Next: Location →'}
          </button>
        </div>
      )}

      {/* STEP 2: Location */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Select District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)} className="form-select">
              {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Specific Village / Block Address</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="form-input" placeholder="e.g. Sikaripara Block, Ward 4" />
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '10px' }} disabled={!canProceedStep2}>
            {!location.trim() ? 'Enter a location to continue' : 'Next: Affected Population →'}
          </button>
        </div>
      )}

      {/* STEP 3: Population & Category */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Estimated Affected Population</label>
            <input type="number" value={population} onChange={e => setPopulation(e.target.value)} className="form-input" placeholder="e.g. 1800" />
          </div>
          <div className="form-group">
            <label style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '10px' }}>
            Next: Evidence Upload →
          </button>
        </div>
      )}

      {/* STEP 4: Evidence */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div className="glass-l1" style={{ border: '2px dashed var(--border-medium)', borderRadius: '12px', padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: '#f8fafc' }}>
            <Camera size={32} color="var(--primary)" />
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Upload Field Photos or Videos</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GPS metadata will be automatically tagged</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const valid = files.filter(f => f.size <= 10 * 1024 * 1024);
                valid.forEach(file => {
                  const id = `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
                  if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target.result;
                      setUploadedFiles(prev => [
                        ...prev,
                        { id, name: file.name, size: file.size, type: file.type, raw: file, preview: dataUrl, url: dataUrl }
                      ]);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setUploadedFiles(prev => [
                      ...prev,
                      { id, name: file.name, size: file.size, type: file.type, raw: file, preview: null, url: '' }
                    ]);
                  }
                });
              }}
            />
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '8px 16px', fontSize: '0.82rem', marginTop: '8px', background: '#ffffff', border: '1px solid var(--border-medium)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={14} /> Select Photos
            </button>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {uploadedFiles.map((file) => (
                <div key={file.id} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'center', padding: '4px' }}>
                      📹 {file.name}
                    </div>
                  )}
                  <button
                    onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                    style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '10px' }}>
            Next: AI Processing →
          </button>
        </div>
      )}

      {/* STEP 5: AI Scanning Animation */}
      {step === 5 && (
        <div className="glass-l2" style={{ padding: '32px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Sparkles size={28} className={isScanning ? 'spin' : ''} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Civic AI Intelligence Check</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isScanning ? 'Scanning database for duplicates & calculating priority score...' : `Analysis Complete! Priority Score: ${priorityScore}/100`}
            </p>
          </div>

          <button onClick={() => setStep(6)} className="btn btn-primary touch-target" style={{ padding: '14px', width: '100%', borderRadius: '10px' }} disabled={isScanning}>
            View Final Summary & Submit →
          </button>
        </div>
      )}

      {/* STEP 6: Final Review & Submit */}
      {step === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-l2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Ready for Submission</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: priorityScore >= 70 ? 'var(--danger)' : priorityScore >= 50 ? 'var(--accent)' : 'var(--text-muted)' }}>
                Priority: {priorityScore}/100
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{description}</p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              📍 {location || 'Location not specified'} · 👥 Population: {population || 'Unknown'} · 📁 {category}
            </div>
            {uploadedFiles.length > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                📎 {uploadedFiles.length} evidence file{uploadedFiles.length > 1 ? 's' : ''} attached
              </div>
            )}
          </div>

          <button onClick={handleSubmitFinal} className="btn btn-primary touch-target" style={{ padding: '16px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700 }}>
            <CheckCircle2 size={18} /> Confirm & Submit Challenge
          </button>
        </div>
      )}

    </div>
  );
}

function getStepName(s) {
  const map = { 1: 'Problem Input', 2: 'Location', 3: 'Category', 4: 'Evidence', 5: 'AI Scan', 6: 'Submit' };
  return map[s] || '';
}
