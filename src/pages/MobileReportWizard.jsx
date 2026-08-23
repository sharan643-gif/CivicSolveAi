import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Camera, MapPin, Upload } from 'lucide-react';
import { CATEGORIES, JHARKHAND_DISTRICTS } from '../services/mockData';

export default function MobileReportWizard({ onSubmit, onBack }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Dumka');
  const [location, setLocation] = useState('Sikaripara Block, Dumka');
  const [population, setPopulation] = useState('1800');
  const [category, setCategory] = useState('Infrastructure');
  const [isScanning, setIsScanning] = useState(false);

  const handleNextStep = () => {
    if (step === 4) {
      // Trigger AI Scan animation on Step 5
      setIsScanning(true);
      setStep(5);
      setTimeout(() => setIsScanning(false), 1500);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmitFinal = () => {
    const newChallenge = {
      id: `ch-m-${Date.now()}`,
      title: title || 'Monsoon Connectivity Failure',
      description: description || 'Village roads become impassable during heavy rainfall.',
      category,
      district,
      location,
      affected_population: Number(population) || 1800,
      priority_score: 91,
      status: 'reported',
      created_at: new Date().toISOString()
    };
    onSubmit(newChallenge);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="touch-target" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
            Report a Societal Challenge
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Step {step} of 6 — {getStepName(step)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(step / 6) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--ai-purple))', transition: 'width 0.3s ease' }} />
      </div>

      {/* STEP 1: Problem Description */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>What is the issue title?</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" placeholder="e.g. Monsoon Rural Road Accessibility" required />
          </div>
          <div className="form-group">
            <label>Describe the problem in detail</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" rows={5} placeholder="Explain what happens, how often, and key difficulties..." required />
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '12px' }} disabled={!title}>
            Next: Location →
          </button>
        </div>
      )}

      {/* STEP 2: Location */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Select District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)} className="form-select">
              {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Specific Village / Block Address</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="form-input" placeholder="e.g. Sikaripara Block, Ward 4" />
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '12px' }}>
            Next: Affected Population →
          </button>
        </div>
      )}

      {/* STEP 3: Population & Category */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Estimated Affected Population</label>
            <input type="number" value={population} onChange={e => setPopulation(e.target.value)} className="form-input" placeholder="e.g. 1800" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '12px' }}>
            Next: Evidence Upload →
          </button>
        </div>
      )}

      {/* STEP 4: Evidence */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '2px dashed var(--border-medium)', borderRadius: '16px', padding: '32px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Camera size={32} color="var(--primary)" />
            <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Upload Field Photos or Videos</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPS metadata will be verified automatically</span>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', marginTop: '8px' }}>
              <Upload size={14} /> Select Photos
            </button>
          </div>
          <button onClick={handleNextStep} className="btn btn-primary touch-target" style={{ padding: '14px', borderRadius: '12px' }}>
            Next: AI Processing →
          </button>
        </div>
      )}

      {/* STEP 5: AI Scanning Animation */}
      {step === 5 && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '32px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(139,92,246,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
            <Sparkles size={28} className={isScanning ? 'spin' : ''} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Civic AI Intelligence Check</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isScanning ? 'Scanning database for duplicates & calculating priority score...' : 'Analysis Complete! Priority Score Calculated: 91/100'}
            </p>
          </div>

          <button onClick={() => setStep(6)} className="btn btn-primary touch-target" style={{ padding: '14px', width: '100%', borderRadius: '12px' }} disabled={isScanning}>
            View Final Summary & Submit →
          </button>
        </div>
      )}

      {/* STEP 6: Final Review & Submit */}
      {step === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Ready for Submission</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{description}</p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 Location: {location} · Population: {population}</div>
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
