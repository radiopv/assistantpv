import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedBadgeProps {
  category: string;
  isUrgent?: boolean;
  onNeedClick?: () => void;
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouets",
  vetement: "Vêtements",
  nourriture: "Nourriture",
  medicament: "Médicaments",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const NeedBadge = ({
  category,
  isUrgent = false,
  onNeedClick,
}: NeedBadgeProps) => {
  const { t } = useLanguage();

  const getBadgeStyle = (isUrgent: boolean) => {
    return isUrgent 
      ? "bg-red-100 text-red-800 hover:bg-red-200" 
      : "bg-blue-100 text-blue-800 hover:bg-blue-200";
  };

  return (
    <div className="relative">
      <Badge 
        variant="outline"
        className={`cursor-pointer transition-colors px-3 py-1 ${getBadgeStyle(isUrgent)}`}
        onClick={onNeedClick}
      >
        {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
      </Badge>
    </div>
  );
};