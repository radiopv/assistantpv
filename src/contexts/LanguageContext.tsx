import React, { createContext, useContext, useState } from 'react';
import { frenchTranslations } from '@/translations/fr';
import { spanishTranslations } from '@/translations/es';
import { englishTranslations } from '@/translations/en';

type Language = 'fr' | 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  addTranslation: (key: string, value: string, language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations, setTranslations] = useState({
    fr: frenchTranslations,
    es: spanishTranslations,
    en: englishTranslations
  });

  const t = (key: string): string => {
    // Essayer d'abord la langue sélectionnée
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    if (translation) return translation;

    // Si pas trouvé, essayer l'anglais comme fallback
    const englishTranslation = translations.en[key as keyof typeof translations['en']];
    if (englishTranslation) return englishTranslation;

    // Si toujours pas trouvé, retourner la clé
    return key;
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