import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    children: "Enfants",
    manageDonations: "Gérer les dons et parrainages",
    addChild: "Ajouter un enfant",
    profile: "Profil",
    edit: "Modifier",
    years: "ans",
    months: "mois",
    sponsored: "Parrainé",
    available: "Disponible",
    by: "par",
    description: "Description",
    story: "Histoire",
    comments: "Commentaires",
    needs: "Besoins",
    nameRequired: "Le nom est requis",
    genderRequired: "Le genre est requis",
    birthDateRequired: "La date de naissance est requise",
    birthDateInvalid: "La date de naissance est invalide",
    success: "Succès",
    successMessage: "L'enfant a été ajouté avec succès",
    error: "Erreur",
    errorMessage: "Une erreur est survenue lors de l'ajout de l'enfant",
    childInfo: "Informations sur l'enfant",
    cancel: "Annuler",
    adding: "Ajout en cours...",
    add: "Ajouter"
  },
  es: {
    children: "Niños",
    manageDonations: "Gestionar donaciones y patrocinios",
    addChild: "Añadir niño",
    profile: "Perfil",
    edit: "Editar",
    years: "años",
    months: "meses",
    sponsored: "Patrocinado",
    available: "Disponible",
    by: "por",
    description: "Descripción",
    story: "Historia",
    comments: "Comentarios",
    needs: "Necesidades",
    nameRequired: "El nombre es requerido",
    genderRequired: "El género es requerido",
    birthDateRequired: "La fecha de nacimiento es requerida",
    birthDateInvalid: "La fecha de nacimiento es inválida",
    success: "Éxito",
    successMessage: "El niño ha sido añadido con éxito",
    error: "Error",
    errorMessage: "Ha ocurrido un error al añadir el niño",
    childInfo: "Información del niño",
    cancel: "Cancelar",
    adding: "Añadiendo...",
    add: "Añadir"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Detect browser/device language
    const detectLanguage = () => {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) {
        setLanguage('es');
      } else if (browserLang.startsWith('fr')) {
        setLanguage('fr');
      }
      // Default to French if no match (already set in useState)
    };

    detectLanguage();
  }, []);

  // Store language preference
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
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