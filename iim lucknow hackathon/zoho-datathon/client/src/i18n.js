import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "command_centre": "Command Centre Dashboard",
      "officer_workspace": "Officer Workspace",
      "hotspots": "Crime Hotspots",
      "live_feed": "Live Intelligence Feed",
      "analytics": "Crime Analytics",
      "chat_assistant": "AI Chat Assistant",
      "knowledge_graph": "Knowledge Graph",
      "timeline": "Investigation Timeline",
      "switch_lang": "ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ"
    }
  },
  kn: {
    translation: {
      "command_centre": "ಕಮಾಂಡ್ ಸೆಂಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "officer_workspace": "ಅಧಿಕಾರಿ ಕಾರ್ಯಸ್ಥಳ",
      "hotspots": "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
      "live_feed": "ಲೈವ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಫೀಡ್",
      "analytics": "ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ",
      "chat_assistant": "ಎಐ ಚಾಟ್ ಸಹಾಯಕ",
      "knowledge_graph": "ನಾಲೆಡ್ಜ್ ಗ್ರಾಫ್",
      "timeline": "ತನಿಖೆ ಟೈಮ್‌ಲೈನ್",
      "switch_lang": "Switch to English"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
