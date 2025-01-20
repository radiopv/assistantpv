export const spanishTranslations = {
  welcomeMessage: "Bienvenido",
  inviteFriends: "Invitar amigos",
  viewAlbum: "Ver álbum",
  noPhotos: "No hay fotos disponibles",
  loading: "Cargando...",
  error: "Error al cargar las fotos",
  sponsorshipRequestSent: "Su solicitud de patrocinio para {{name}} ha sido enviada con éxito",
  errorSendingRequest: "Se produjo un error al enviar su solicitud de patrocinio",
  
  // Navigation
  home: "Inicio",
  dashboard: "Panel de control",
  children: "Niños",
  donations: "Donaciones",
  settings: "Configuración",
  profile: "Perfil",
  
  // Actions
  sponsor: "Apadrinar",
  viewProfile: "Ver perfil",
  
  // Messages
  errorLoadingChildren: "Error al cargar los niños",
  noChildrenFound: "No se encontraron niños",
  
  // Views
  gridView: "Vista cuadrícula",
  tableView: "Vista tabla"
} as const;

export type SpanishTranslations = typeof spanishTranslations;