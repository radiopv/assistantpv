const NEED_CATEGORIES_FR = {
  education: "Éducation",
  jouet: "Jouets",
  vetement: "Vêtements",
  nourriture: "Nourriture",
  medicament: "Médicaments",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const translateNeedCategory = (category: string): string => {
  return NEED_CATEGORIES_FR[category as keyof typeof NEED_CATEGORIES_FR] || category;
};