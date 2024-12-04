import { Card } from "@/components/ui/card";
import { Need } from "@/types/needs";
import { NeedCard } from "./NeedCard";

interface ChildNeedsProps {
  child: any;
  needs: Need[];
}

export const ChildNeeds = ({ child, needs }: ChildNeedsProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">{child.name}</h3>
      <div className="space-y-4">
        {needs?.map((need: Need, index: number) => (
          <NeedCard key={`${need.category}-${index}`} need={need} index={index} />
        ))}
      </div>
    </Card>
  );
};