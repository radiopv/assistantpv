export const frenchTranslations: TranslationType = {
  sponsorship: {
    management: "Gestion des parrainages",
    newSponsorship: "Nouveau parrainage",
    createSponsorship: "Créer un parrainage",
    deleteSponsorship: "Supprimer le parrainage",
    deleteConfirmation: "Êtes-vous sûr de vouloir supprimer ce parrainage ?",
    sponsoredChild: "Enfant parrainé",
    confirmReassign: "Êtes-vous sûr de vouloir réassigner cet enfant ?",
    reassignmentInfo: "L'enfant sera retiré du parrain actuel et assigné au nouveau parrain.",
    success: {
      created: "Parrainage créé avec succès",
      deleted: "Parrainage supprimé avec succès",
      updated: "Parrainage mis à jour avec succès"
    },
    error: {
      create: "Erreur lors de la création du parrainage",
      delete: "Erreur lors de la suppression du parrainage",
      update: "Erreur lors de la mise à jour du parrainage"
    }
  },
  translationManager: "Gestionnaire de traductions",
  translationError: "Erreur de traduction",
  translationUpdated: "Traductions mises à jour",
  scanningTranslations: "Scan des traductions",
  scanAssistantSection: "Scanner les traductions",
  frenchTranslations: "Traductions françaises",
  spanishTranslations: "Traductions espagnoles",
  save: "Enregistrer",
  searchChild: "Rechercher un enfant",
  sponsored: "Parrainé",
  available: "Disponible",
  reassign: "Réassigner",
  select: "Sélectionner",
  requestApproved: "Demande approuvée",
  requestRejected: "Demande rejetée",
  errorApprovingRequest: "Erreur lors de l'approbation de la demande",
  errorRejectingRequest: "Erreur lors du rejet de la demande"
};

export type { TranslationType } from '@/integrations/supabase/types/translations';