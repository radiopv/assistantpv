import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoPreviewProps {
  photos: File[];
  onRemove: (index: number) => void;
}

export const PhotoPreview = ({ photos, onRemove }: PhotoPreviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group aspect-square">
          <img
            src={URL.createObjectURL(photo)}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};