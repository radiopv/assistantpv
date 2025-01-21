import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    caption?: string;
    category?: string;
    created_at: string;
    is_featured: boolean;
    children?: { name: string };
    sponsors?: { role: string };
  };
  onPhotoClick: (url: string) => void;
  onToggleFeature: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  "general": "Général",
  "daily-life": "Vie quotidienne",
  "activities": "Activités",
  "special-events": "Événements spéciaux",
  "family": "Famille"
};

export const PhotoCard = ({ photo, onPhotoClick, onToggleFeature, onDelete }: PhotoCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer relative group">
      <div className="aspect-square">
        <img 
          src={photo.url} 
          alt={photo.caption || "Photo"} 
          className="w-full h-full object-cover"
          onClick={() => onPhotoClick(photo.url)}
        />
      </div>
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFeature(photo.id, photo.is_featured);
          }}
          className={photo.is_featured ? "bg-yellow-100" : "bg-white/80"}
          title={photo.is_featured ? "Retirer des favoris" : "Marquer comme favori"}
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
          title="Supprimer la photo"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        {photo.category && (
          <Badge variant="secondary" className="mb-2">
            {CATEGORY_LABELS[photo.category] || photo.category}
          </Badge>
        )}
        
        {photo.caption && (
          <h3 className="font-medium mb-1">{photo.caption}</h3>
        )}
        
        {photo.description && (
          <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
        )}

        <p className="text-xs text-gray-500">
          {format(new Date(photo.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
        </p>
      </div>
    </Card>
  );
};