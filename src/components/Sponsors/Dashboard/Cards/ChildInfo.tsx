interface ChildInfoProps {
  description?: string;
  needs?: any[];
}

import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";

export const ChildInfo = ({ description, needs = [] }: ChildInfoProps) => {
  const convertedNeeds = convertJsonToNeeds(needs);

  return (
    <div className="flex-grow space-y-4">
      {description && (
        <div className="bg-white/60 rounded-lg p-3">
          <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Description</h4>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-medium text-sm text-cuba-warmGray">Besoins</h4>
        <div className="flex flex-wrap gap-2">
          {convertedNeeds.map((need: any, index: number) => (
            <Badge
              key={`${need.category}-${index}`}
              variant={need.is_urgent ? "destructive" : "secondary"}
              className="text-xs"
            >
              {need.category}
              {need.is_urgent && " (!)"} 
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};