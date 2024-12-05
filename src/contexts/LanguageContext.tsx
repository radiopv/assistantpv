import React, { createContext, useContext, useState, useEffect } from 'react';
import { commonTranslations } from '@/translations/fr/common';
import { authTranslations } from '@/translations/fr/auth';
import { dashboardTranslations } from '@/translations/fr/dashboard';
import { sponsorshipTranslations } from '@/translations/fr/sponsorship';
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
  const [translations, setTranslations] = useState<Translations>({
    ...commonTranslations,
    ...authTranslations,
    ...dashboardTranslations,
    ...sponsorshipTranslations
  } as Translations);

  const t = (key: keyof Translations): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return `Traduction indisponible: ${key}`;
    }
    return translation;
  };

  const addTranslation = (key: string, value: string, targetLanguage: Language) => {
    if (targetLanguage === language) {
      setTranslations(prev => ({
        ...prev,
        [key]: value
      }));
    }
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