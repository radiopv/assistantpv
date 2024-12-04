import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  progress?: number;
}

export const BadgeCard = ({ 
  name, 
  description, 
  icon, 
  points, 
  isUnlocked,
  progress = 0 
}: BadgeCardProps) => {
  return (
    <Card className={cn(
      "p-4 relative transition-all duration-300",
      isUnlocked ? "bg-white" : "bg-gray-100"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-2 rounded-full",
          isUnlocked ? "bg-primary/10" : "bg-gray-200"
        )}>
          <Award className={cn(
            "w-8 h-8",
            isUnlocked ? "text-primary" : "text-gray-400"
          )} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {!isUnlocked && progress > 0 && (
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                Progression : {progress}%
              </p>
            </div>
          )}
          <Badge variant={isUnlocked ? "default" : "secondary"} className="mt-2">
            {points} points
          </Badge>
        </div>
      </div>
    </Card>
  );
};