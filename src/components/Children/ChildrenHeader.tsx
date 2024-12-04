import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChildrenHeaderProps {
  onAddChild: () => void;
}

export const ChildrenHeader = ({ onAddChild }: ChildrenHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("children")}</h1>
        <p className="text-gray-600 mt-2">{t("manageDonations")}</p>
      </div>
      <Button onClick={onAddChild}>
        <Plus className="w-4 h-4 mr-2" />
        {t("addChild")}
      </Button>
    </div>
  );
};