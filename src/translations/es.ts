import { commonTranslations } from './es/common';
import { childrenTranslations } from './es/children';
import { filterTranslations } from './es/filters';

export const spanishTranslations = {
  ...commonTranslations,
  ...childrenTranslations,
  ...filterTranslations,
  
  // Navigation
  dashboard: "Panel",
  children: "Niños",
  donations: "Donaciones",
  messages: "Mensajes",
  settings: "Ajustes",
  home: "Inicio",
  profile: "Ver perfil",
  sponsors: "Padrinos",
  about: "Acerca de",
  contact: "Contacto",
  statistics: "Estadísticas",
  travels: "Viajes",
  faq: "Preguntas frecuentes",
  activity: "Registro de actividad",
  permissions: "Permisos",
  translationManager: "Gestor de traducciones",
  addDonation: "Agregar donación",
  addChildPhotos: "Álbum de fotos Padrino",
  associationParrainEnfants: "Asociación Padrinos-Niños",
  
  // Profile related
  name: "Nombre",
  birthDate: "Fecha de nacimiento",
  address: "Dirección",
  phone: "Teléfono",
  
  // Validation page
  validationPage: "Página de validación",
  sponsorshipRequests: "Solicitudes de apadrinamiento",
  photoValidation: "Validación de fotos",
  testimonialValidation: "Validación de testimonios",
  sponsorshipRequestApproved: "Solicitud de apadrinamiento aprobada",
  sponsorshipRequestRejected: "Solicitud de apadrinamiento rechazada",
  errorApprovingRequest: "Error al aprobar la solicitud",
  errorRejectingRequest: "Error al rechazar la solicitud",
  comingSoon: "Próximamente",
};