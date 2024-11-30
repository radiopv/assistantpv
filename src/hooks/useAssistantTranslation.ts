import { useTranslation } from '@/components/Translation/TranslationContext';
import { useAuth } from '@/components/Auth/AuthProvider';

export const useAssistantTranslation = () => {
  const { user } = useAuth();
  const translation = useTranslation();

  // Ne retourner les fonctions de traduction que pour les assistants
  if (user?.role !== 'assistant') {
    return {
      t: (key: string) => key,
      language: 'fr' as const,
      setLanguage: () => {},
      isLoading: false
    };
  }

  return translation;
};