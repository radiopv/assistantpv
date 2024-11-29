import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeProgressProps {
  name: string;
  description: string;
  currentPoints: number;
  requiredPoints: number;
  category: string;
  isUnlocked: boolean;
}

export const BadgeProgress = ({
  name,
  description,
  currentPoints,
  requiredPoints,
  category,
  isUnlocked,
}: BadgeProgressProps) => {
  const progress = Math.min((currentPoints / requiredPoints) * 100, 100);
  const remainingPoints = Math.max(requiredPoints - currentPoints, 0);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'engagement':
        return 'bg-blue-500';
      case 'générosité':
        return 'bg-green-500';
      case 'interaction':
        return 'bg-purple-500';
      case 'ambassadeur':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${getCategoryColor(category)} bg-opacity-10`}>
            <Award className={`w-6 h-6 ${getCategoryColor(category)} text-opacity-90`} />
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <Badge variant={isUnlocked ? "success" : "secondary"} className="mt-1">
              {category}
            </Badge>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {!isUnlocked && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500">
            {remainingPoints} points restants
          </p>
        </div>
      )}
    </div>
  );
};