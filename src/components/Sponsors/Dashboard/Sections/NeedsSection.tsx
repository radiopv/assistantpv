import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";

interface NeedsSectionProps {
  needs: any;
}

export const NeedsSection = ({ needs }: NeedsSectionProps) => {
  return (
    <ScrollArea className="h-[200px]">
      <div className="grid gap-3">
        {convertJsonToNeeds(needs).map((need, index) => (
          <div
            key={`${need.category}-${index}`}
            className={`p-4 rounded-lg ${
              need.is_urgent
                ? "bg-red-50 border border-red-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <Badge
                  variant={need.is_urgent ? "destructive" : "secondary"}
                  className="mb-2"
                >
                  {need.category}
                  {need.is_urgent && " (!)"} 
                </Badge>
                {need.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {need.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};