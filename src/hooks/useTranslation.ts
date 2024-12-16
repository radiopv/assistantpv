import { useLanguage } from "@/contexts/LanguageContext";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const translations = currentLanguage === 'fr' ? frenchTranslations : spanishTranslations;

  return { translations };
};