import React, { createContext, useContext, useState, useEffect } from 'react';
import { frenchTranslations } from '../translations/fr';
import { spanishTranslations } from '../translations/es';
import { toast } from 'sonner';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  addTranslation: (key: string, text: string, language: Language) => void;
}

const translations = {
  fr: frenchTranslations,
  es: spanishTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [pendingTranslations, setPendingTranslations] = useState<Set<string>>(new Set());

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

  const addTranslation = async (key: string, text: string, language: Language) => {
    try {
      // Mettre à jour la base de données avec la nouvelle traduction
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          text,
          language
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Mettre à jour le state local
      translations[language] = {
        ...translations[language],
        [key]: text
      } as typeof translations[typeof language];

      setPendingTranslations(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });

      toast.success('Traduction ajoutée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la traduction:', err);
      toast.error('Erreur lors de l\'ajout de la traduction');
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    const translation = currentTranslations[key as keyof typeof currentTranslations];
    
    if (!translation) {
      console.log(`Missing translation for key: ${key} in language: ${language}`);
      
      // Si le texte semble être en anglais (plus de 3 caractères, contient des lettres)
      if (key.length > 3 && /[a-zA-Z]/.test(key)) {
        // Ajouter à la liste des traductions en attente
        setPendingTranslations(prev => new Set(prev).add(key));
        
        // Retourner le texte en anglais avec un style spécial
        return `${key} 🔄`;
      }
      
      return language === 'fr' ? 
        translations.fr.translationUnavailable || "Traduction indisponible" : 
        translations.es.translationUnavailable || "Traducción no disponible";
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