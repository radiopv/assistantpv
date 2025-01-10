import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    title?: string;
    is_featured?: boolean;
  };
  onPhotoClick?: (url: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
}

export const PhotoCard = ({ 
  photo, 
  onPhotoClick = () => {}, 
  onDelete,
  onToggleFavorite 
}: PhotoCardProps) => {
  return (
    <Card className="relative group overflow-hidden">
      <img
        src={photo.url}
        alt={photo.title || "Photo"}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onPhotoClick(photo.url)}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(photo.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {onToggleFavorite && (
          <Button
            variant={photo.is_featured ? "default" : "secondary"}
            size="icon"
            onClick={() => onToggleFavorite(photo.id, !!photo.is_featured)}
            className="h-8 w-8"
          >
            <Star className="h-4 w-4" fill={photo.is_featured ? "currentColor" : "none"} />
          </Button>
        )}
      </div>
    </Card>
  );
};