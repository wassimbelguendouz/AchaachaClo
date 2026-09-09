import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useApp();

  return (
    <button
      onClick={toggleLanguage}
      className="btn-secondary flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      title="Changer de langue / تغيير اللغة"
    >
      <Globe className="w-4 h-4 text-cyan-400" />
      <span className="font-bold">{language === 'fr' ? 'العربية' : 'Français'}</span>
    </button>
  );
};
