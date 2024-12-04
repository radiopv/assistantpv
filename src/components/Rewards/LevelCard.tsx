import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  name: string;
  description: string;
  currentPoints: number;
  requiredPoints: number;
  benefits: string[];
  isCurrent: boolean;
}

export const LevelCard = ({
  name,
  description,
  currentPoints,
  requiredPoints,
  benefits,
  isCurrent
}: LevelCardProps) => {
  const progress = Math.min((currentPoints / requiredPoints) * 100, 100);

  return (
    <Card className={cn(
      "p-4 transition-all duration-300",
      isCurrent ? "border-primary" : ""
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-2 rounded-full",
          isCurrent ? "bg-primary/10" : "bg-gray-100"
        )}>
          <Trophy className={cn(
            "w-8 h-8",
            isCurrent ? "text-primary" : "text-gray-400"
          )} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{currentPoints} points</span>
              <span>{requiredPoints} points requis</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {benefits.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Avantages :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};