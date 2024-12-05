import { Need } from "@/types/needs";
import { NeedBadge } from "./NeedBadge";

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
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Necesidades del niño</h3>
      <div className="grid grid-cols-1 gap-2">
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