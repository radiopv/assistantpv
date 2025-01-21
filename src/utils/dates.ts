export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatAge = (birthDate: string | Date): string => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return `${age} ans`;
};