import React from 'react';

const LiveFeed = () => {
  const alerts = [
    { id: 1, type: 'critical', message: 'Suspect matched with CCTV footage in Zone A', time: '10:42 AM' },
    { id: 2, type: 'warning', message: 'Unusual gathering near Station Rd', time: '10:15 AM' },
    { id: 3, type: 'info', message: 'Patrol dispatched to JP Nagar', time: '09:30 AM' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {alerts.map(alert => (
        <div key={alert.id} style={{ 
          padding: '0.75rem', 
          borderLeft: `4px solid ${alert.type === 'critical' ? 'var(--color-danger)' : alert.type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}`,
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{alert.time}</div>
          <div style={{ color: 'var(--color-text-primary)' }}>{alert.message}</div>
        </div>
      ))}
    </div>
  );
};

export default LiveFeed;
