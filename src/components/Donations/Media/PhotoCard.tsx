import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

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
  isReadOnly?: boolean;
}

export const PhotoCard = ({
  photo,
  onPhotoClick = () => {},
  onDelete,
  onToggleFavorite,
  isReadOnly = false
}: PhotoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="relative group overflow-hidden aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={photo.url}
        alt={photo.title || "Photo de donation"}
        onClick={() => onPhotoClick(photo.url)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
      />
      
      {!isReadOnly && (
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(photo.id, !!photo.is_featured)}
              className={`p-2 rounded-full ${photo.is_featured ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'} hover:bg-yellow-400 hover:text-black transition-colors`}
              title={photo.is_featured ? "Retirer des favoris" : "Marquer comme favori"}
            >
              <Star className="w-5 h-5" />
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(photo.id)}
              className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
              title="Supprimer la photo"
            >
              ×
            </button>
          )}
        </div>
      )}
    </Card>
  );
};