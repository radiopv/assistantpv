import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/Auth/AuthProvider';

type Language = 'fr' | 'es';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface Translation {
  key: string;
  fr: string;
  es: string;
  context: string;
}

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const { user } = useAuth();
  
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_translations')
        .select('*');
      
      if (error) throw error;
      return data as Translation[];
    },
    enabled: !!user,
  });

  const translationsMap = new Map<string, Translation>();
  translations?.forEach(translation => {
    translationsMap.set(translation.key, translation);
  });

  const t = (key: string): string => {
    const translation = translationsMap.get(key);
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  useEffect(() => {
    // Récupérer la langue préférée depuis le localStorage
    const savedLanguage = localStorage.getItem('assistant_language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Sauvegarder la langue dans le localStorage
    localStorage.setItem('assistant_language', language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};