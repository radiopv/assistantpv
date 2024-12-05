import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { NeedBadge } from "./NeedBadge";
import { Need } from "@/types/needs";

interface NeedsSectionProps {
  needs: Need[];
  selectedNeed: string | null;
  comment: string;
  onNeedClick: (category: string) => void;
  onCommentChange: (comment: string) => void;
  onCommentSubmit: (category: string, isUrgent: boolean) => void;
  onClose: () => void;
}

export const NeedsSection = ({
  needs,
  selectedNeed,
  comment,
  onNeedClick,
  onCommentChange,
  onCommentSubmit,
  onClose
}: NeedsSectionProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-sm text-gray-700">{t("needs")}</h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center">
            <Badge variant="default" className="mr-1 px-1">
              {t("normalNeed")}
            </Badge>
          </span>
          <span className="flex items-center">
            <Badge variant="destructive" className="mr-1 px-1">
              {t("urgentNeed")}
            </Badge>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {needs.map((need, index) => (
          <NeedBadge
            key={`${need.category}-${index}`}
            category={need.category}
            isUrgent={need.is_urgent}
            isSelected={selectedNeed === need.category}
            description={need.description}
            comment={comment}
            onCommentChange={onCommentChange}
            onNeedClick={() => onNeedClick(need.category)}
            onSubmit={(isUrgent) => onCommentSubmit(need.category, isUrgent)}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};