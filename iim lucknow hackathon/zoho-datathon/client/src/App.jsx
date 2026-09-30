import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import CommandCentreDashboard from './components/CommandCentre/CommandCentreDashboard';
import OfficerWorkspace from './components/OfficerWorkspace/OfficerWorkspace';
import './variables.css';
import './App.css';

import DemoWalkthrough from './components/DemoWalkthrough';

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--color-background)' }}>
        <header style={{ padding: '1rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>{t('command_centre')}</Link>
            <Link to="/officer" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>{t('officer_workspace')}</Link>
          </div>
          <button onClick={toggleLanguage} style={{ backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            {t('switch_lang')}
          </button>
        </header>
        
        <main style={{ flex: 1, overflow: 'auto', padding: '1rem', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<CommandCentreDashboard />} />
            <Route path="/officer" element={<OfficerWorkspace />} />
          </Routes>
          <DemoWalkthrough />
        </main>
      </div>
    </Router>
  );
}

export default App;
