import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedBadgeProps {
  category: string;
  isUrgent?: boolean;
  isSelected?: boolean;
  description?: string;
  comment?: string;
  onNeedClick?: () => void;
  onCommentChange?: (comment: string) => void;
  onSubmit?: (isUrgent: boolean) => void;
  onClose?: () => void;
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
  isSelected = false,
  description = "",
  comment = "",
  onNeedClick,
  onCommentChange,
  onSubmit,
  onClose,
}: NeedBadgeProps) => {
  const { t } = useLanguage();

  const getBadgeStyle = (isUrgent: boolean) => {
    if (isUrgent) {
      return "bg-red-100 hover:bg-red-200 text-red-800 border-red-200";
    }
    return "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200";
  };

  return (
    <div className="relative">
      <Badge 
        variant="outline"
        className={`cursor-pointer transition-colors px-3 py-1.5 text-sm font-medium ${getBadgeStyle(isUrgent)}`}
        onClick={onNeedClick}
      >
        {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
      </Badge>
    </div>
  );
};