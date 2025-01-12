import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-cuba-turquoise" />
    </div>
  );
};