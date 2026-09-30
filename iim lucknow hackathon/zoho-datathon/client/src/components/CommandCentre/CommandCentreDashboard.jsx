import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HotspotMap from './HotspotMap';
import LiveFeed from './LiveFeed';
import Analytics from './Analytics';
import axios from 'axios';

const CommandCentreDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ totalCases: 0, closedCases: 0 });

  useEffect(() => {
    // Mock fetching stats from backend
    setStats({ totalCases: 1245, closedCases: 890 });
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ color: 'var(--color-text-primary)' }}>{t('hotspots')}</h2>
          <div style={{ height: 'calc(100% - 40px)' }}>
            <HotspotMap />
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ color: 'var(--color-text-primary)' }}>{t('analytics')}</h2>
          <Analytics stats={stats} />
        </div>
      </div>
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ color: 'var(--color-text-primary)' }}>{t('live_feed')}</h2>
        <LiveFeed />
      </div>
    </div>
  );
};

export default CommandCentreDashboard;
