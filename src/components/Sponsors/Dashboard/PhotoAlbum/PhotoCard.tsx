import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    created_at: string;
    is_featured: boolean;
    children?: { name: string };
    sponsors?: { role: string };
  };
  onPhotoClick: (url: string) => void;
  onToggleFeature: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const PhotoCard = ({ photo, onPhotoClick, onToggleFeature, onDelete }: PhotoCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer relative group">
      <img 
        src={photo.url} 
        alt={photo.title || "Photo"} 
        className="w-full h-48 object-cover"
        onClick={() => onPhotoClick(photo.url)}
      />
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFeature(photo.id, photo.is_featured);
          }}
        >
          <Star className={`w-4 h-4 ${photo.is_featured ? "fill-yellow-400" : ""}`} />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(photo.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{photo.title || `Photo de ${photo.children?.name}`}</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>
            Ajoutée par: {photo.sponsors?.role === 'assistant' ? 'Assistant' : 'Parrain'}
          </p>
          <p>
            {format(new Date(photo.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        </div>
        {photo.description && (
          <p className="mt-2 text-sm text-gray-600">{photo.description}</p>
        )}
      </div>
    </Card>
  );
};