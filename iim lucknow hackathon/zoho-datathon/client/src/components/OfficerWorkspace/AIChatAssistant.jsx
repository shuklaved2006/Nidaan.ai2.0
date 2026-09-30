import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AIChatAssistant = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: i18n.language === 'kn' ? 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' : 'Hello, how can I assist you with the investigation?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    try {
      // Mock API call to NLP translation/chat backend
      // const response = await axios.post('/api/chat', { message: input, lang: i18n.language });
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: 'I have logged your query and checking the database.' }]);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const handleBilingual = () => {
      setMessages(prev => [...prev, { id: Date.now()+2, sender: 'user', text: 'ನಗರದಲ್ಲಿ ಇತ್ತೀಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳು ಯಾವುವು?' }]);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+3, sender: 'ai', text: 'Here are the recent theft cases in the city (translated from Kannada): 3 cases in Ashok Nagar.' }]);
      }, 1500);
    };

    const handleOSINT = () => {
      setMessages(prev => [...prev, { id: Date.now()+4, sender: 'ai', text: '🚨 OSINT Alert: We have correlated social media activity with Suspect Shiva in Ashok Nagar area at 23:00 hours last night.' }]);
    };

    const handlePDF = () => {
      setMessages(prev => [...prev, { id: Date.now()+5, sender: 'ai', text: '📄 PDF Summary: The uploaded forensic report confirms the vehicle KA01 belongs to Suspect A. Match accuracy: 98%.' }]);
    };

    window.addEventListener('demo:chat-bilingual', handleBilingual);
    window.addEventListener('demo:osint-correlation', handleOSINT);
    window.addEventListener('demo:pdf-summary', handlePDF);

    return () => {
      window.removeEventListener('demo:chat-bilingual', handleBilingual);
      window.removeEventListener('demo:osint-correlation', handleOSINT);
      window.removeEventListener('demo:pdf-summary', handlePDF);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-background)',
            color: msg.sender === 'user' ? 'white' : 'var(--color-text-primary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            maxWidth: '80%'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend}
          style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatAssistant;
