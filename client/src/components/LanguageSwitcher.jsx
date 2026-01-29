import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="
      relative flex items-center gap-1
      backdrop-blur-xl
      bg-white/20 dark:bg-white/5
      border border-white/20 dark:border-white/10
      rounded-xl p-1.5
      shadow-lg shadow-black/10
      transition-all duration-300
    ">

      {/* English */}
      <button
        onClick={() => setLanguage('en')}
        className={`
          relative px-4 py-1.5 rounded-lg
          flex items-center gap-1.5 text-sm font-semibold
          transition-all duration-300

          ${language === 'en'
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg scale-105'
            : 'text-gray-300 hover:text-white hover:bg-white/10'}
        `}
      >
        <Globe size={16} />
        EN
      </button>

      {/* Thai */}
      <button
        onClick={() => setLanguage('th')}
        className={`
          relative px-4 py-1.5 rounded-lg
          flex items-center gap-1.5 text-sm font-semibold
          transition-all duration-300

          ${language === 'th'
            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg scale-105'
            : 'text-gray-300 hover:text-white hover:bg-white/10'}
        `}
      >
        <Globe size={16} />
        TH
      </button>

    </div>
  );
};
