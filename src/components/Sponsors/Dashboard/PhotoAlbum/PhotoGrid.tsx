import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";

interface PhotoGridProps {
  photos: any[];
  onPhotoDelete: (id: string) => void;
  onToggleFeature: (id: string, featured: boolean) => void;
}

export const PhotoGrid = ({ photos, onPhotoDelete, onToggleFeature }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos?.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.url}
            alt=""
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onPhotoDelete(photo.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant={photo.is_featured ? "default" : "secondary"}
              size="icon"
              onClick={() => onToggleFeature(photo.id, !photo.is_featured)}
            >
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};