import { PhotoCard } from "./PhotoCard";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoGridProps {
  photos: any[];
  onPhotoClick?: (url: string) => void;
  onPhotoDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
  className?: string;
}

export const PhotoGrid = ({ 
  photos, 
  onPhotoClick = () => {}, 
  onPhotoDelete,
  onToggleFavorite,
  className = ""
}: PhotoGridProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos?.length) {
    return <p className="text-gray-500 text-sm text-center">Aucune photo disponible</p>;
  }

  const handlePhotoClick = (url: string) => {
    setSelectedPhoto(url);
  };

  const handleDelete = async (id: string) => {
    console.log("Handling delete for photo ID:", id);
    if (onPhotoDelete) {
      onPhotoDelete(id);
    }
  };

  return (
    <>
      <div className={`grid gap-6 ${className}`}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onPhotoClick={handlePhotoClick}
            onDelete={handleDelete}
            onToggleFavorite={onToggleFavorite}
            isReadOnly={!onPhotoDelete && !onToggleFavorite}
          />
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-white p-0">
          {selectedPhoto && (
            <img 
              src={selectedPhoto} 
              alt="Photo agrandie"
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};