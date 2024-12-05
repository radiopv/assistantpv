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
    <div className="relative py-4">
      {/* Top separator */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      <h3 className="text-sm font-semibold text-red-600 mb-3 text-center relative">
        {/* Decorative elements */}
        <span className="absolute left-0 top-1/2 h-px w-12 bg-gradient-to-r from-transparent to-red-600/20 transform -translate-y-1/2" />
        <span className="relative px-4">Necesidades del niño</span>
        <span className="absolute right-0 top-1/2 h-px w-12 bg-gradient-to-l from-transparent to-red-600/20 transform -translate-y-1/2" />
      </h3>

      <div className="grid grid-cols-1 gap-2 px-2">
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

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
};