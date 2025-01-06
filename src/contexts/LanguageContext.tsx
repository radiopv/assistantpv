import React, { createContext, useContext, useState, useEffect } from 'react';
import { frenchTranslations } from '../translations/fr';
import { spanishTranslations } from '../translations/es';
import { TranslationType } from '@/integrations/supabase/types/translations';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, TranslationType> = {
  fr: frenchTranslations,
  es: spanishTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    const browserLang = navigator.language.toLowerCase();
    
    if (storedLanguage && (storedLanguage === 'fr' || storedLanguage === 'es')) {
      setLanguage(storedLanguage);
    } else if (browserLang.startsWith('es')) {
      setLanguage('es');
    } else if (browserLang.startsWith('fr')) {
      setLanguage('fr');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    const parts = key.split('.');
    let value: any = translations[language];
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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