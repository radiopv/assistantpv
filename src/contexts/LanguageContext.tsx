import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [translations, setTranslations] = useState<Translations>(frenchTranslations as Translations);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const newTranslations = language === 'fr' ? frenchTranslations : spanishTranslations;
        setTranslations(newTranslations as Translations);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: keyof Translations): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return `Traduction indisponible: ${key}`;
    }
    return translation;
  };

  const addTranslation = (key: string, value: string, targetLanguage: Language) => {
    if (targetLanguage === 'fr') {
      frenchTranslations[key as keyof typeof frenchTranslations] = value;
    } else {
      spanishTranslations[key as keyof typeof spanishTranslations] = value;
    }
    
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