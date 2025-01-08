import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AssociationHeaderProps {
  onLanguageChange: () => void;
}

export const AssociationHeader = ({ onLanguageChange }: AssociationHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <Button
        variant="outline"
        size="icon"
        onClick={onLanguageChange}
        title={t("toggleLanguage")}
      >
        <Globe className="h-4 w-4" />
      </Button>
    </div>
  );
};