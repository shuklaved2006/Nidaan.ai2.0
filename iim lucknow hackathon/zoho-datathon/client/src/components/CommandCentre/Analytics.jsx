import React from 'react';

const Analytics = ({ stats }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-around', padding: '1rem 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalCases}</div>
        <div style={{ color: 'var(--color-text-secondary)' }}>Total Active Cases</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.closedCases}</div>
        <div style={{ color: 'var(--color-text-secondary)' }}>Cases Closed This Month</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>12</div>
        <div style={{ color: 'var(--color-text-secondary)' }}>Critical Alerts</div>
      </div>
    </div>
  );
};

export default Analytics;
