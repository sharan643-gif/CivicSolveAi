import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Zap } from 'lucide-react';

export default function EmergencyCivicBanner({ onTriggerEmergency }) {
  return (
    <div
      style={{
        padding: '14px 20px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #b91c1c, #991b1b)',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(185, 28, 28, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem'
          }}
        >
          🚨
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#fca5a5' }}>
            CRITICAL PUBLIC SAFETY PROTOCOL
          </div>
          <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>
            EMERGENCY CIVIC MODE: Fast-Track 24h SLA Active
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a
          href="tel:1070"
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <PhoneCall size={14} /> State Emergency: 1070
        </a>

        <button
          onClick={() => {
            if (onTriggerEmergency) onTriggerEmergency();
            alert('Emergency Civic Mode dispatched to District Collector and Disaster Vigilance Cells!');
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#ffffff',
            color: '#991b1b',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Zap size={14} color="#dc2626" /> Trigger Urgent Hazard Dispatch
        </button>
      </div>
    </div>
  );
}
