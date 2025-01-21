export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};