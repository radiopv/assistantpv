import { cn } from "@/lib/utils";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoCardProps {
  photo: any;
  onPhotoClick?: (url: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  isReadOnly?: boolean;
}

export const PhotoCard = ({ 
  photo, 
  onPhotoClick = () => {}, 
  onDelete,
  onToggleFavorite,
  isReadOnly = false
}: PhotoCardProps) => {
  return (
    <div className="relative group">
      <img
        src={photo.url}
        alt={photo.title || `Photo ${photo.id}`}
        className="h-48 w-full object-cover rounded-md cursor-pointer"
        onClick={() => onPhotoClick(photo.url)}
      />
      
      {!isReadOnly && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 bg-white/80 hover:bg-white",
                photo.is_featured && "text-yellow-500"
              )}
              onClick={() => onToggleFavorite(photo.id, !photo.is_featured)}
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
              onClick={() => onDelete(photo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};