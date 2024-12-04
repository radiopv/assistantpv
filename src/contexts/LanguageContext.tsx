import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Dashboard translations
    dashboard: "Tableau de bord",
    children: "Enfants",
    donations: "Dons",
    messages: "Messages",
    media: "Médias",
    sponsors: "Parrains",
    statistics: "Statistiques",
    settings: "Paramètres",
    // Stats translations
    activeSponsors: "Parrains actifs",
    totalChildren: "Nombre d'enfants",
    totalDonations: "Dons totaux",
    pendingRequests: "Demandes en attente",
    // Actions
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
  },
  es: {
    // Dashboard translations
    dashboard: "Panel de control",
    children: "Niños",
    donations: "Donaciones",
    messages: "Mensajes",
    media: "Medios",
    sponsors: "Patrocinadores",
    statistics: "Estadísticas",
    settings: "Configuración",
    // Stats translations
    activeSponsors: "Patrocinadores activos",
    totalChildren: "Número de niños",
    totalDonations: "Donaciones totales",
    pendingRequests: "Solicitudes pendientes",
    // Actions
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
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