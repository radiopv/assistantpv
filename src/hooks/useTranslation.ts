import { useLanguage } from "@/contexts/LanguageContext";
import { frenchTranslations } from "@/translations/fr";
import { spanishTranslations } from "@/translations/es";

export const useTranslation = () => {
  const { language } = useLanguage();

  const translations = language === 'fr' ? frenchTranslations : spanishTranslations;

  return { translations };
};