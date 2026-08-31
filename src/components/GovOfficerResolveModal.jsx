import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Building2, Send, Sparkles, X, User, MapPin, Layers, Radio } from 'lucide-react';
import { updateChallenge } from '../services/supabaseService';
import { accountabilityService } from '../services/accountabilityService';

export default function GovOfficerResolveModal({ challenge, isOpen, onClose, onSuccess }) {
  if (!isOpen || !challenge) return null;

  const [status, setStatus] = useState(challenge.status || 'under_review');
  const [remark, setRemark] = useState(challenge.official_remark || '');
  const [officerName, setOfficerName] = useState(challenge.assigned_officer || 'Er. Rajesh Kumar Sharma (Chief Engineer)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STATUS_OPTIONS = [
    { id: 'under_review', label: 'Under Review', desc: 'Cataloged & assigned to department supervisor', color: '#0284c7', bg: '#e0f2fe' },
    { id: 'in_progress', label: 'Work In Progress', desc: 'Field crew & equipment deployed on ground', color: '#d97706', bg: '#fef3c7' },
    { id: 'pilot', label: 'Pilot Project', desc: 'Testing & verification phase', color: '#7c3aed', bg: '#f3e8ff' },
    { id: 'resolved', label: 'Resolved / Fixed', desc: 'Ground work 100% completed & verified', color: '#059669', bg: '#dcfce7' },
  ];

  const handleGenerateAiRemark = () => {
    const defaultRemarks = {
      under_review: `Official Department Notice: Ticket #${challenge.id?.slice(0, 8)} has been reviewed by the Department Operations Cell. Inspection team assigned for site evaluation at ${challenge.location || 'site'}.`,
      in_progress: `Ground Operation Notice: Field crew and heavy machinery have been dispatched to ${challenge.location || 'location'}. On-site repair and structural work actively in progress.`,
      pilot: `Pilot Verification Notice: Phase 1 intervention at ${challenge.location || 'location'} complete. Hydraulic & civil load testing currently underway.`,
      resolved: `Official Resolution Order: Ground rectification at ${challenge.location || 'location'} has been 100% completed by the municipal engineering squad. Issue closed with photo evidence proof.`
    };
    setRemark(defaultRemarks[status] || defaultRemarks.in_progress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const statusLabels = {
        under_review: 'Under Review',
        in_progress: 'In Progress',
        pilot: 'Pilot Project',
        resolved: 'Resolved / Fixed',
        implemented: 'Implemented'
      };

      const updates = {
        status,
        status_label: statusLabels[status] || status,
        official_remark: remark || `Official update published by ${officerName}`,
        assigned_officer: officerName,
        last_updated_by: officerName,
        updated_at: new Date().toISOString(),
      };

      const updated = await updateChallenge(challenge.id, updates);

      // Add timeline entry to accountability ledger so progress bar advances
      const stageMap = {
        under_review: 'accepted',
        in_progress: 'work_started',
        pilot: 'work_started',
        resolved: 'resolved',
        implemented: 'resolved'
      };
      accountabilityService.addComplaintUpdate(challenge.id, {
        stage: stageMap[status] || 'accepted',
        note: remark || `Status updated to ${statusLabels[status]} by ${officerName}`,
        actor: officerName,
        role: 'Government Department Officer'
      });

      // Dispatch global real-time update event for instant cross-tab & app-wide re-render
      window.dispatchEvent(new CustomEvent('civicsolve_challenge_updated', {
        detail: updated || { ...challenge, ...updates }
      }));

      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(updated || { ...challenge, ...updates });
      }
      onClose();
    } catch (err) {
      console.error('Failed to update progress:', err);
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(2, 11, 25, 0.75)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px', fontFamily: 'var(--font-body)',
      animation: 'fadeIn 0.2s ease forwards',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(27,42,74, 0.2)',
        borderRadius: '16px', width: '100%', maxWidth: '620px',
        boxShadow: '0 25px 70px rgba(27,42,74, 0.35)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '94vh',
      }}>
        
        {/* Tricolor Header Strip */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #128807 100%)' }} />

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff',
          gap: '10px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
            }}>
              🏛️
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.62rem', background: 'var(--accent)', color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>
                  Government Portal
                </span>
                <span style={{ fontSize: '0.62rem', color: '#93c5fd', fontWeight: 700 }}>
                  Global Real-Time Broadcast
                </span>
              </div>
              <h3 style={{ fontSize: 'clamp(0.92rem, 3.8vw, 1.08rem)', fontWeight: 800, margin: '2px 0 0 0', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Publish Problem Resolution Progress
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', padding: '6px', cursor: 'pointer', flexShrink: 0 }}>
            <X size={17} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Target Challenge Info Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '180px', flex: 1 }}>
                <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b', fontWeight: 700 }}>
                  ID: #{challenge.id?.slice(0, 12)}
                </span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px 0' }}>
                  {challenge.title}
                </h4>
                <div style={{ fontSize: '0.76rem', color: '#475569', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span>📍 {challenge.location || challenge.district || 'Location Specified'}</span>
                  <span>📁 {challenge.category || 'Infrastructure'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Priority Score</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: challenge.priority_score > 75 ? '#dc2626' : '#d97706' }}>
                  {challenge.priority_score || 80}/100
                </span>
              </div>
            </div>
          </div>

          {/* Status Selection Pipeline */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '8px' }}>
              Select Official Progress Stage:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>

              {STATUS_OPTIONS.map(opt => {
                const isSelected = status === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setStatus(opt.id)}
                    style={{
                      padding: '12px', borderRadius: '10px', cursor: 'pointer',
                      border: isSelected ? `2px solid ${opt.color}` : '1px solid #cbd5e1',
                      background: isSelected ? opt.bg : '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 2px 10px ${opt.color}25` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? opt.color : '#0f172a' }}>
                        {opt.label}
                      </span>
                      {isSelected && <CheckCircle2 size={16} color={opt.color} />}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Officer & Department */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
              Assigned Government Officer / Chief Engineer:
            </label>
            <input
              type="text"
              value={officerName}
              onChange={e => setOfficerName(e.target.value)}
              placeholder="e.g. Er. Rajesh Kumar Sharma, Chief Engineer - PWD"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a',
                outline: 'none', fontWeight: 600,
              }}
            />
          </div>

          {/* Official Department Remarks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                Official Resolution Remarks & Progress Statement:
              </label>
              <button
                type="button"
                onClick={handleGenerateAiRemark}
                style={{
                  background: 'rgba(27,42,74, 0.08)', border: '1px solid rgba(27,42,74, 0.2)',
                  borderRadius: '6px', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700,
                  padding: '3px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <Sparkles size={12} color="var(--accent)" /> Auto-Generate Statement
              </button>
            </div>
            <textarea
              rows={3}
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="Enter official resolution details, ground crew status, or completion proof..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a',
                outline: 'none', fontFamily: 'inherit', resize: 'vertical',
              }}
            />
          </div>

          {/* Real-Time Broadcast Indicator Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(2,132,199,0.08) 100%)',
            border: '1px solid rgba(5,150,105,0.25)', borderRadius: '10px', padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Radio size={20} color="#059669" />
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', display: 'block' }}>
                Real-Time Public Feed Synchronization Active
              </span>
              <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                Upon publishing, citizens, public dashboards, and global maps will update immediately across all devices.
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1',
                background: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 22px', borderRadius: '8px', border: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                color: '#ffffff', fontSize: '0.88rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(27,42,74,0.3)',
              }}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Progress to Public'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
