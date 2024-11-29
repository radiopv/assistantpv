import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { NeedCard } from "./NeedCard";

interface ChildNeedsListProps {
  childName: string;
  needs: Need[];
  onDeleteNeed: (index: number) => void;
}

export const ChildNeedsList = ({ childName, needs, onDeleteNeed }: ChildNeedsListProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">{childName}</h3>
      <div className="space-y-4">
        {needs.map((need, index) => (
          <NeedCard
            key={`${need.categories.join('-')}-${index}`}
            need={need}
            onDelete={() => onDeleteNeed(index)}
          />
        ))}
      </div>
    </Card>
  );
};