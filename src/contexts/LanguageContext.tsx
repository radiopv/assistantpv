import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    donations: "Dons",
    manageDonations: "Gérez les dons et leur distribution",
    addDonation: "Ajouter un don",
    close: "Fermer",
    donationBy: "Don par",
    completed: "Complété",
    inProgress: "En cours",
    photos: "Photos",
    videos: "Vidéos",
    addPhotos: "Ajouter des photos",
    addVideos: "Ajouter des vidéos",
    comments: "Commentaires",
    city: "Ville",
    peopleHelped: "Personnes aidées",
    assistantName: "Nom de l'assistant",
    categories: "Catégories",
    modify: "Modifier",
    delete: "Supprimer",
    confirmDelete: "Êtes-vous sûr ?",
    deleteWarning: "Cette action est irréversible. Le don et toutes les données associées seront définitivement supprimés.",
    cancel: "Annuler",
    confirm: "Confirmer",
    searchPlaceholder: "Rechercher par ville, assistant ou commentaires...",
    filterByCity: "Filtrer par ville",
    allCities: "Toutes les villes",
    sortBy: "Trier par",
    date: "Date",
    noDonationsFound: "Aucun don ne correspond à vos critères de recherche",
    messages: "Messages",
    newMessage: "Nouveau message",
    recipient: "Destinataire",
    selectRecipient: "Sélectionner un destinataire",
    subject: "Sujet",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi en cours...",
    new: "Nouveau",
    selectMessageToRead: "Sélectionnez un message pour le lire",
    messageSent: "Message envoyé",
    messageSentSuccess: "Votre message a été envoyé avec succès",
    messageError: "Une erreur est survenue lors de l'envoi du message",
    fillAllFields: "Veuillez remplir tous les champs",
  },
  es: {
    donations: "Donaciones",
    manageDonations: "Gestione las donaciones y su distribución",
    addDonation: "Agregar donación",
    close: "Cerrar",
    donationBy: "Donación por",
    completed: "Completado",
    inProgress: "En curso",
    photos: "Fotos",
    videos: "Videos",
    addPhotos: "Agregar fotos",
    addVideos: "Agregar videos",
    comments: "Comentarios",
    city: "Ciudad",
    peopleHelped: "Personas ayudadas",
    assistantName: "Nombre del asistente",
    categories: "Categorías",
    modify: "Modificar",
    delete: "Eliminar",
    confirmDelete: "¿Está seguro?",
    deleteWarning: "Esta acción es irreversible. La donación y todos los datos asociados serán eliminados permanentemente.",
    cancel: "Cancelar",
    confirm: "Confirmar",
    searchPlaceholder: "Buscar por ciudad, asistente o comentarios...",
    filterByCity: "Filtrar por ciudad",
    allCities: "Todas las ciudades",
    sortBy: "Ordenar por",
    date: "Fecha",
    noDonationsFound: "No se encontraron donaciones que coincidan con sus criterios de búsqueda",
    messages: "Mensajes",
    newMessage: "Nuevo mensaje",
    recipient: "Destinatario",
    selectRecipient: "Seleccionar destinatario",
    subject: "Asunto",
    message: "Mensaje",
    send: "Enviar",
    sending: "Enviando...",
    new: "Nuevo",
    selectMessageToRead: "Seleccione un mensaje para leerlo",
    messageSent: "Mensaje enviado",
    messageSentSuccess: "Su mensaje ha sido enviado con éxito",
    messageError: "Ha ocurrido un error al enviar el mensaje",
    fillAllFields: "Por favor complete todos los campos",
  }
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
