import React, { createContext, useContext, useState } from 'react';
import { frenchTranslations } from '@/translations/fr';
import { spanishTranslations } from '@/translations/es';
import { Translations } from '@/types/translations';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  addTranslation: (key: string, value: string, language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState({
    fr: frenchTranslations,
    es: spanishTranslations
  });

  const t = (key: keyof Translations): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in ${language}`);
      return key;
    }
    return translation;
  };

  const addTranslation = (key: string, value: string, lang: Language) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, addTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};