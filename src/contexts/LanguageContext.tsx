import React, { createContext, useContext, useState, useEffect } from 'react';
import { frenchTranslations } from '../translations/fr';
import { spanishTranslations } from '../translations/es';
import { toast } from '@/hooks/use-toast';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: frenchTranslations,
  es: spanishTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const detectLanguage = () => {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) {
        setLanguage('es');
      } else if (browserLang.startsWith('fr')) {
        setLanguage('fr');
      }
    };

    detectLanguage();
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    const translation = currentTranslations[key as keyof typeof currentTranslations];
    
    if (!translation) {
      console.log(`Missing translation for key: ${key} in language: ${language}`);
      
      // Notify developers about missing translation
      toast({
        title: "Missing Translation",
        description: `Key "${key}" is missing in ${language} translations`,
        variant: "destructive",
      });
      
      return "Traduction indisponible";
    }
    
    return translation;
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