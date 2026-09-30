import React from 'react';

const InvestigationTimeline = () => {
  const events = [
    { date: '2023-10-01', title: 'FIR Filed', desc: 'FIR 102 registered at Station A' },
    { date: '2023-10-03', title: 'Evidence Collected', desc: 'CCTV footage obtained from Location X' },
    { date: '2023-10-05', title: 'Suspect Interrogated', desc: 'Suspect A questioned' },
    { date: '2023-10-10', title: 'Charge Sheet', desc: 'Charge sheet filed in court' }
  ];

  return (
    <div style={{ padding: '1rem', overflowY: 'auto', height: '100%' }}>
      <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem', marginLeft: '1rem' }}>
        {events.map((ev, i) => (
          <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: '-1.45rem', 
              top: '0.2rem',
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-secondary)' 
            }}></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>{ev.date}</div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{ev.title}</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{ev.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestigationTimeline;
