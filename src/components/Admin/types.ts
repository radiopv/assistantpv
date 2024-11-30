export interface Permission {
  page: string;
  label: string;
  description: string;
}

export const pagePermissions: Permission[] = [
  { page: "dashboard", label: "Dashboard", description: "Accès au tableau de bord" },
  { page: "children", label: "Enfants", description: "Accès à la liste des enfants" },
  { page: "donations", label: "Dons", description: "Accès aux dons" },
  { page: "sponsorships", label: "Parrainages", description: "Accès aux parrainages" },
  { page: "media", label: "Médias", description: "Accès à la gestion des médias" },
];

export const actionPermissions: Permission[] = [
  { page: "delete_children", label: "Supprimer des enfants", description: "Autoriser la suppression d'enfants" },
  { page: "edit_children", label: "Modifier des enfants", description: "Autoriser la modification des enfants" },
  { page: "delete_media", label: "Supprimer des médias", description: "Autoriser la suppression des médias" },
  { page: "edit_donations", label: "Modifier les dons", description: "Autoriser la modification des dons" },
  { page: "delete_donations", label: "Supprimer les dons", description: "Autoriser la suppression des dons" },
];