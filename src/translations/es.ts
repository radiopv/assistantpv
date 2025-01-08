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

  // Sponsorship page specific
  title: "Asociación Padrinos-Niños",
  transferTitle: "Confirmar transferencia",
  transferDescription: "Este niño ya está apadrinado por {sponsor}. ¿Desea transferir este niño a otro padrino?",
  cancel: "Cancelar",
  confirmTransfer: "Confirmar transferencia",
  loading: "Cargando...",
  error: {
    title: "Error",
    selectBoth: "Por favor seleccione un niño y un padrino",
    association: "Ocurrió un error durante la asociación",
    transfer: "Ocurrió un error durante la transferencia",
    removal: "Ocurrió un error durante la eliminación del apadrinamiento"
  },
  success: {
    title: "Éxito",
    association: "La asociación se ha creado con éxito",
    removal: "El apadrinamiento se ha eliminado con éxito"
  },
  toggleLanguage: "Cambiar idioma",
  searchChildren: "Buscar niños...",
  searchSponsor: "Buscar padrino...",
  age: "Edad",
  city: "Ciudad",
  comments: "Comentarios",
  select: "Seleccionar",
  removeSponsorship: "Eliminar apadrinamiento",
  createAssociation: "Crear asociación",
  selectedChild: "Niño seleccionado",
  selectedSponsor: "Padrino seleccionado",
  noChildSelected: "Ningún niño seleccionado",
  noSponsorSelected: "Ningún padrino seleccionado",
  createAssociationButton: "Crear asociación"
};