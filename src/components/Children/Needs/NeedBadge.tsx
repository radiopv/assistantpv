import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface NeedBadgeProps {
  category: string;
  isUrgent: boolean;
  isSelected: boolean;
  description?: string;
  comment: string;
  onCommentChange: (comment: string) => void;
  onNeedClick: () => void;
  onSubmit: (isUrgent: boolean) => void;
  onClose: () => void;
}

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouet",
  vetement: "Vêtement",
  nourriture: "Nourriture",
  medicament: "Médicament",
  hygiene: "Hygiène",
  autre: "Autre"
};

export const NeedBadge = ({
  category,
  isUrgent,
  isSelected,
  description,
  comment,
  onCommentChange,
  onNeedClick,
  onSubmit,
  onClose
}: NeedBadgeProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <Badge 
        variant={isUrgent ? "destructive" : "default"}
        className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1"
        onClick={onNeedClick}
      >
        {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
      </Badge>

      {isSelected && (
        <Card className="absolute z-10 top-full mt-2 p-3 w-64 space-y-3">
          <p className="text-sm font-medium">
            {NEED_CATEGORIES[category as keyof typeof NEED_CATEGORIES]}
          </p>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <Input
            placeholder={t("addComment")}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isUrgent ? "default" : "destructive"}
              onClick={() => onSubmit(!isUrgent)}
            >
              {isUrgent ? t("markAsNormal") : t("markAsUrgent")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              {t("close")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};