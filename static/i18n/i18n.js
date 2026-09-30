/**
 * Module C: Global Application-Wide i18n Localization Engine
 * Supports runtime language switching, RTL auto-direction, unit conversions, and safe en-US fallback.
 */

class Nidaani18nEngine {
  constructor() {
    this.currentLocale = localStorage.getItem('nidaan_locale') || 'en-US';
    this.translations = {};
    this.fallbackTranslations = {};
    this.rtlLocales = ['ar-SA', 'he-IL', 'fa-IR', 'ur-PK'];
  }

  async init() {
    // Load default fallback en-US first
    try {
      const fbRes = await fetch('/i18n/locales/en-US.json');
      this.fallbackTranslations = await fbRes.json();
    } catch (e) {
      console.warn('Fallback locale en-US failed to load', e);
    }

    await this.setLocale(this.currentLocale);
  }

  async setLocale(localeCode) {
    this.currentLocale = localeCode;
    localStorage.setItem('nidaan_locale', localeCode);

    try {
      const res = await fetch(`/i18n/locales/${localeCode}.json`);
      if (res.ok) {
        this.translations = await res.json();
      } else {
        console.warn(`Locale ${localeCode} not found, falling back to en-US.`);
        this.translations = this.fallbackTranslations;
      }
    } catch (e) {
      this.translations = this.fallbackTranslations;
    }

    this.applyDirection();
    this.translateDOM();
  }

  t(key, defaultText = '') {
    return this.translations[key] || this.fallbackTranslations[key] || defaultText || key;
  }

  applyDirection() {
    const isRTL = this.rtlLocales.includes(this.currentLocale);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', this.currentLocale);
    if (isRTL) {
      document.body.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
    }
  }

  translateDOM() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key, el.textContent);
      }
    });
  }

  // Clinical Unit Converter Helper
  convertUnit(value, fromUnit, toUnit) {
    if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
      return (value * 0.0555).toFixed(2); // Blood glucose conversion
    } else if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
      return (value * 18.0182).toFixed(1);
    }
    return value;
  }
}

// Global instance attached to window for terminal scripts
window.i18nEngine = new Nidaani18nEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.i18nEngine.init();
});
