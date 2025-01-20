import { differenceInMonths, differenceInYears, parseISO } from "date-fns";

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};

export const formatAge = (birthDate: string): string => {
  if (!birthDate) return "Âge non disponible";
  
  try {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;
    
    if (years === 0) {
      return `${months} mois`;
    }
    
    if (months === 0) {
      return `${years} ans`;
    }
    
    return `${years} ans ${months} mois`;
  } catch (error) {
    console.error('Error calculating age:', error);
    return "Âge non disponible";
  }
};