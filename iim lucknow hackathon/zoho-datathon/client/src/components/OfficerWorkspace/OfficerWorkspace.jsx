import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatAssistant from './AIChatAssistant';
import KnowledgeGraph from './KnowledgeGraph';
import InvestigationTimeline from './InvestigationTimeline';

const OfficerWorkspace = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('graph'); // 'graph' or 'timeline'

  React.useEffect(() => {
    const handleTabChange = (e) => {
      setActiveTab(e.detail);
    };
    window.addEventListener('demo:officer-tab', handleTabChange);
    return () => window.removeEventListener('demo:officer-tab', handleTabChange);
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', height: '100%' }}>
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--color-text-primary)' }}>{t('chat_assistant')}</h2>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AIChatAssistant />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('graph')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: activeTab === 'graph' ? 'var(--color-primary)' : 'var(--color-background)',
              color: activeTab === 'graph' ? 'white' : 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            {t('knowledge_graph')}
          </button>
          <button 
            onClick={() => setActiveTab('timeline')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: activeTab === 'timeline' ? 'var(--color-primary)' : 'var(--color-background)',
              color: activeTab === 'timeline' ? 'white' : 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            {t('timeline')}
          </button>
        </div>
        
        <div style={{ flex: 1, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          {activeTab === 'graph' ? <KnowledgeGraph /> : <InvestigationTimeline />}
        </div>
      </div>
    </div>
  );
};

export default OfficerWorkspace;
