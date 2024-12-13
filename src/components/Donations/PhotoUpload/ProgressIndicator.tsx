import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500 text-center">{Math.round(progress)}%</p>
    </div>
  );
};