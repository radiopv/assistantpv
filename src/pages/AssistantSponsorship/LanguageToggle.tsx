import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  language: string;
  onLanguageChange: (language: 'fr' | 'es') => void;
}

export const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  const { t } = useLanguage();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onLanguageChange(language === 'fr' ? 'es' : 'fr')}
      title={t("toggleLanguage")}
    >
      <Globe className="h-4 w-4" />
    </Button>
  );
};