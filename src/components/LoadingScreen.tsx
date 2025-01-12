import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cuba-offwhite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};