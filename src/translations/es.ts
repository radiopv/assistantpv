import { TranslationType } from '@/integrations/supabase/types/translations';

export const spanishTranslations: TranslationType = {
  sponsorship: {
    management: "Gestión de Apadrinamientos",
    newSponsorship: "Nuevo Apadrinamiento",
    createSponsorship: "Crear nuevo apadrinamiento",
    deleteSponsorship: "Eliminar apadrinamiento",
    deleteConfirmation: "¿Está seguro de que desea eliminar este apadrinamiento? Esta acción no se puede deshacer.",
    sponsoredChild: "Niño apadrinado",
    confirmReassign: "Este niño ya está apadrinado. ¿Realmente desea reasignar este niño a un nuevo padrino?",
    reassignmentInfo: "Puede seleccionar cualquier niño, incluso si ya está apadrinado. Se solicitará confirmación para los niños ya apadrinados.",
    success: {
      created: "El apadrinamiento se ha creado con éxito",
      deleted: "El apadrinamiento se ha eliminado con éxito"
    },
    error: {
      create: "Se produjo un error al crear el apadrinamiento",
      delete: "Se produjo un error al eliminar el apadrinamiento"
    }
  },
  sponsored: "Apadrinado",
  available: "Disponible",
  reassign: "Reasignar",
  select: "Seleccionar",
  searchChild: "Buscar un niño..."
};
