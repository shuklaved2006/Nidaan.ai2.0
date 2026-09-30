import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Strategic Dashboard', description: 'Overview of city-wide metrics and status.' },
  { id: 2, title: 'Ashok Nagar Hotspot', description: 'Zooming into the Ashok Nagar crime hotspot.' },
  { id: 3, title: 'Timeline', description: 'Step-by-step case timeline presentation.' },
  { id: 4, title: 'D3 Graph Shiva Node Auto-Expansion', description: 'Expanding knowledge graph around suspect Shiva.' },
  { id: 5, title: 'Bilingual Chat Suggestions', description: 'AI chat with Kannada/English bilingual suggestions.' },
  { id: 6, title: 'OSINT Event Correlation', description: 'Correlating social media and OSINT feeds.' },
  { id: 7, title: 'PDF Summaries', description: 'Automated summarization of uploaded PDF reports.' }
];

const DemoWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    executeStep(currentStep);
  }, [currentStep]);

  const executeStep = (stepIndex) => {
    const step = STEPS[stepIndex];
    if (!step) return;

    switch (step.id) {
      case 1:
        navigate('/');
        window.dispatchEvent(new CustomEvent('demo:reset'));
        break;
      case 2:
        navigate('/');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:hotspot-ashok-nagar'));
        }, 500);
        break;
      case 3:
        navigate('/officer');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:officer-tab', { detail: 'timeline' }));
        }, 500);
        break;
      case 4:
        navigate('/officer');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:officer-tab', { detail: 'graph' }));
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('demo:expand-shiva-node'));
          }, 800);
        }, 500);
        break;
      case 5:
        navigate('/officer');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:chat-bilingual'));
        }, 500);
        break;
      case 6:
        navigate('/officer');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:osint-correlation'));
        }, 500);
        break;
      case 7:
        navigate('/officer');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('demo:pdf-summary'));
        }, 500);
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      color: 'white',
      padding: '15px 25px',
      borderRadius: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      zIndex: 9999,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: '250px' }}>
        <span style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Demo Mode ({currentStep + 1}/{STEPS.length})
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{STEPS[currentStep].title}</span>
        <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{STEPS[currentStep].description}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentStep === 0}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: currentStep === 0 ? '#333' : '#444',
            color: currentStep === 0 ? '#666' : 'white',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          Previous
        </button>
        <button 
          onClick={handleNext} 
          disabled={currentStep === STEPS.length - 1}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: currentStep === STEPS.length - 1 ? '#333' : '#3b82f6',
            color: currentStep === STEPS.length - 1 ? '#666' : 'white',
            cursor: currentStep === STEPS.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            fontWeight: 'bold'
          }}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default DemoWalkthrough;
