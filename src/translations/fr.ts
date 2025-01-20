export const frenchTranslations = {
  // Auth
  login: "Connexion",
  logout: "Déconnexion",
  email: "Email",
  password: "Mot de passe",
  forgotPassword: "Mot de passe oublié ?",
  resetPassword: "Réinitialiser le mot de passe",
  register: "S'inscrire",
  loginError: "Erreur de connexion",
  invalidCredentials: "Email ou mot de passe invalide",

  // Navigation
  home: "Accueil",
  dashboard: "Tableau de bord",
  children: "Enfants",
  donations: "Dons",
  settings: "Paramètres",
  profile: "Profil",
  messages: "Messages",
  notifications: "Notifications",

  // Children
  addChild: "Ajouter un enfant",
  editChild: "Modifier l'enfant",
  deleteChild: "Supprimer l'enfant",
  childName: "Nom de l'enfant",
  childAge: "Âge",
  childCity: "Ville",
  childDescription: "Description",
  childStory: "Histoire",
  childNeeds: "Besoins",
  sponsor: "Parrainer",
  viewProfile: "Voir le profil",
  sponsored: "Parrainé",
  available: "Disponible",
  status: "Statut",
  actions: "Actions",
  name: "Nom",
  age: "Âge",
  city: "Ville",
  years: "ans",
  months: "mois",
  ageNotAvailable: "Âge non disponible",

  // Sponsorship
  sponsoredBy: "Parrainé par",
  assignSponsor: "Assigner un parrain",
  removeSponsor: "Retirer le parrain",
  sponsorshipRequestSent: "Votre demande de parrainage pour {{name}} a été envoyée avec succès",
  errorSendingRequest: "Une erreur est survenue lors de l'envoi de votre demande de parrainage",

  // Views
  gridView: "Vue grille",
  tableView: "Vue tableau",

  // Messages
  errorLoadingChildren: "Erreur lors du chargement des enfants",
  childrenList: "Liste des enfants",
  noChildrenFound: "Aucun enfant trouvé",
  loading: "Chargement...",

  // Filters
  search: "Rechercher",
  filterByCity: "Filtrer par ville",
  filterByAge: "Filtrer par âge",
  filterByStatus: "Filtrer par statut",
  allCities: "Toutes les villes",
  allAges: "Tous les âges",
  allStatus: "Tous les statuts",

  // Success Messages
  childAdded: "Enfant ajouté avec succès",
  childUpdated: "Enfant mis à jour avec succès",
  childDeleted: "Enfant supprimé avec succès",
  sponsorAssigned: "Parrain assigné avec succès",
  sponsorRemoved: "Parrain retiré avec succès",

  // Error Messages
  errorAddingChild: "Erreur lors de l'ajout de l'enfant",
  errorUpdatingChild: "Erreur lors de la mise à jour de l'enfant",
  errorDeletingChild: "Erreur lors de la suppression de l'enfant",
  errorAssigningSponsor: "Erreur lors de l'assignation du parrain",
  errorRemovingSponsor: "Erreur lors du retrait du parrain",

  // Validation
  required: "Ce champ est requis",
  invalidEmail: "Email invalide",
  invalidPhone: "Numéro de téléphone invalide",
  passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
  passwordsDontMatch: "Les mots de passe ne correspondent pas",

  // Misc
  cancel: "Annuler",
  save: "Enregistrer",
  delete: "Supprimer",
  edit: "Modifier",
  confirm: "Confirmer",
  back: "Retour",
  next: "Suivant",
  finish: "Terminer",
  close: "Fermer"
} as const;

export type FrenchTranslations = typeof frenchTranslations;
