// LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import thailandicon from '../settingModal/thailand.svg';
import usaicon from '../settingModal/usa.svg';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'th' ? 'th' : 'en';

  const handleToggle = () => {
    const newLang = currentLang === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100, display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.9)', borderRadius: '2rem', padding: '0.3rem 0.8rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} onClick={handleToggle}>
      <img src={thailandicon} alt="TH" style={{ width: 24, height: 24, opacity: currentLang === 'th' ? 1 : 0.4, marginRight: 8 }} />
      <span style={{ fontWeight: currentLang === 'th' ? 'bold' : 'normal', color: currentLang === 'th' ? '#8b090c' : '#888', marginRight: 8 }}>TH</span>
      <span style={{ fontWeight: currentLang === 'en' ? 'bold' : 'normal', color: currentLang === 'en' ? '#8b090c' : '#888', marginRight: 8 }}>EN</span>
      <img src={usaicon} alt="EN" style={{ width: 24, height: 24, opacity: currentLang === 'en' ? 1 : 0.4 }} />
    </div>
  );
};

export default LanguageSwitcher;
