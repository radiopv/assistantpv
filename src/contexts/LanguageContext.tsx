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
    // Children page
    addChild: "Ajouter un enfant",
    searchChild: "Rechercher un enfant...",
    city: "Ville",
    allCities: "Toutes les villes",
    gender: "Genre",
    allGenders: "Tous",
    male: "Masculin",
    female: "Féminin",
    age: "Âge",
    allAges: "Tous les âges",
    status: "Statut",
    allStatus: "Tous les statuts",
    available: "Disponible",
    sponsored: "Parrainé",
    pending: "En attente",
    urgent: "Besoins urgents",
    // Child profile
    profile: "Profil",
    basicInfo: "Informations de base",
    needs: "Besoins",
    story: "Histoire",
    comments: "Commentaires",
    description: "Description",
    sponsorAlbum: "Photos de l'album parrain",
    sponsorAlbumDescription: "Ces photos seront visibles dans l'espace parrain. Elles permettent de partager des moments de la vie de l'enfant avec son parrain.",
    // Donations page
    addDonation: "Ajouter un don",
    closeDonation: "Fermer",
    manageDonations: "Gérez les dons et leur distribution",
    searchDonation: "Rechercher un don...",
    noDonations: "Aucun don ne correspond à vos critères de recherche",
    // Messages page
    newMessage: "Nouveau message",
    selectMessage: "Sélectionnez un message pour le lire",
    from: "De",
    // Media page
    uploadMedia: "Télécharger un média",
    gallery: "Galerie",
    // Common actions
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    back: "Retour",
    // Common
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    years: "ans",
    months: "mois",
    // Additional translations
    by: "par",
    selectSponsor: "Sélectionner un parrain",
    removeSponsor: "Retirer le parrain",
    sponsorUpdated: "Parrain mis à jour avec succès",
    sponsorRemoved: "Parrain retiré avec succès",
    errorUpdatingSponsor: "Erreur lors de la mise à jour du parrain",
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
    // Children page
    addChild: "Añadir niño",
    searchChild: "Buscar niño...",
    city: "Ciudad",
    allCities: "Todas las ciudades",
    gender: "Género",
    allGenders: "Todos",
    male: "Masculino",
    female: "Femenino",
    age: "Edad",
    allAges: "Todas las edades",
    status: "Estado",
    allStatus: "Todos los estados",
    available: "Disponible",
    sponsored: "Patrocinado",
    pending: "Pendiente",
    urgent: "Necesidades urgentes",
    // Child profile
    profile: "Perfil",
    basicInfo: "Información básica",
    needs: "Necesidades",
    story: "Historia",
    comments: "Comentarios",
    description: "Descripción",
    sponsorAlbum: "Fotos del álbum del patrocinador",
    sponsorAlbumDescription: "Estas fotos serán visibles en el espacio del patrocinador. Permiten compartir momentos de la vida del niño con su patrocinador.",
    // Donations page
    addDonation: "Añadir donación",
    closeDonation: "Cerrar",
    manageDonations: "Gestione las donaciones y su distribución",
    searchDonation: "Buscar donación...",
    noDonations: "Ninguna donación corresponde a sus criterios de búsqueda",
    // Messages page
    newMessage: "Nuevo mensaje",
    selectMessage: "Seleccione un mensaje para leerlo",
    from: "De",
    // Media page
    uploadMedia: "Subir medio",
    gallery: "Galería",
    // Common actions
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    back: "Volver",
    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    years: "años",
    months: "meses",
    // Additional translations
    by: "por",
    selectSponsor: "Seleccionar patrocinador",
    removeSponsor: "Eliminar patrocinador",
    sponsorUpdated: "Patrocinador actualizado con éxito",
    sponsorRemoved: "Patrocinador eliminado con éxito",
    errorUpdatingSponsor: "Error al actualizar el patrocinador",
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
