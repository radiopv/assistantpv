import { Textarea } from "@/components/ui/textarea";
import { Need } from "@/types/needs";
import { NeedsBadge } from "./NeedsBadge";

interface NeedsCellProps {
  needs: Need[];
  isEditing: boolean;
  onUpdate: (updatedNeeds: Need[]) => void;
}

export const NeedsCell = ({ needs, isEditing, onUpdate }: NeedsCellProps) => {
  const handleNeedUpdate = (index: number, updatedNeed: Need) => {
    const newNeeds = [...needs];
    newNeeds[index] = updatedNeed;
    onUpdate(newNeeds);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {needs.map((need, index) => (
        <NeedsBadge
          key={index}
          need={need}
          isEditing={isEditing}
          onUpdate={(updatedNeed) => handleNeedUpdate(index, updatedNeed)}
        />
      ))}
    </div>
  );
};