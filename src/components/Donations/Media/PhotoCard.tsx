import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

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

export const PhotoCard = ({ photo, onPhotoClick, onToggleFeature, onDelete }: PhotoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="relative group overflow-hidden aspect-square cursor-pointer hover:scale-105 transition-transform duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPhotoClick(photo.url)}
    >
      <img
        src={photo.url}
        alt={photo.title || "Photo de donation"}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{ minHeight: "300px" }} // Doublé la taille minimale
      />
      
      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {onToggleFeature && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeature(photo.id, !!photo.is_featured);
            }}
            className={`p-2 rounded-full ${photo.is_featured ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'} hover:bg-yellow-400 hover:text-black transition-colors`}
            title={photo.is_featured ? "Retirer des favoris" : "Marquer comme favori"}
          >
            <Star className="w-5 h-5" />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
                onDelete(photo.id);
              }
            }}
            className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
            title="Supprimer la photo"
          >
            ×
          </button>
        )}
      </div>
    </Card>
  );
};