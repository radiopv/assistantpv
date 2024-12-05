import React, { createContext, useContext, useState, useEffect } from 'react';
import { frenchTranslations } from '../translations/fr';
import { spanishTranslations } from '../translations/es';
import { useToast } from '@/components/ui/use-toast';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  addTranslation: (key: string, value: string, lang: Language) => void;
}

const translations = {
  fr: frenchTranslations,
  es: spanishTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const { toast } = useToast();
  const [dynamicTranslations, setDynamicTranslations] = useState<{
    fr: Record<string, string>;
    es: Record<string, string>;
  }>({ fr: {}, es: {} });

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

  const addTranslation = (key: string, value: string, lang: Language) => {
    setDynamicTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));

    // Log l'ajout de la traduction pour le débogage
    console.log(`Added translation for ${lang}:`, { key, value });
  };

  const t = (key: string): string => {
    // Vérifie d'abord dans les traductions dynamiques
    const dynamicTranslation = dynamicTranslations[language][key];
    if (dynamicTranslation) {
      return dynamicTranslation;
    }

    // Vérifie ensuite dans les traductions statiques
    const staticTranslations = translations[language];
    const translation = staticTranslations[key as keyof typeof staticTranslations];
    
    if (!translation) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      
      // Affiche une notification toast pour les traductions manquantes
      toast({
        title: "Traduction manquante",
        description: `La clé "${key}" n'a pas de traduction en ${language === 'fr' ? 'français' : 'espagnol'}.`,
        variant: "destructive",
      });

      // Retourne le message par défaut
      return "Traduction indisponible";
    }

    return translation;
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