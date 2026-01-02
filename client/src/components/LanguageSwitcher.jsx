import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded transition-all duration-300 flex items-center gap-1 text-sm font-medium ${
          language === 'en'
            ? 'bg-purple-500 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
        title="English"
      >
        <Globe size={16} />
        EN
      </button>
      <button
        onClick={() => setLanguage('th')}
        className={`px-3 py-1 rounded transition-all duration-300 flex items-center gap-1 text-sm font-medium ${
          language === 'th'
            ? 'bg-purple-500 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
        title="Thai"
      >
        <Globe size={16} />
        TH
      </button>
    </div>
  );
};
