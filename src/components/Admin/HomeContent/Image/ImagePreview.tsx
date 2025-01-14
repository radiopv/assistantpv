import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ImagePreviewProps {
  url: string | null;
  isLoading: boolean;
}

export const ImagePreview = ({ url, isLoading }: ImagePreviewProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  if (!url) return null;

  return (
    <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
      <img
        src={url}
        alt="Hero actuelle"
        className="w-full h-full object-cover"
      />
    </div>
  );
};