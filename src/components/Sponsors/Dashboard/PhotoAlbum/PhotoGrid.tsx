import { useState } from "react";
import { PhotoCard } from "./PhotoCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PhotoGridProps {
  photos: any[];
  onPhotoClick?: (url: string) => void;
  onToggleFeature?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
  onPhotoDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
}

export const PhotoGrid = ({ 
  photos, 
  onPhotoClick = () => {}, 
  onToggleFeature,
  onDelete,
  onPhotoDelete,
  onToggleFavorite 
}: PhotoGridProps) => {
  const [showFeatureInfo, setShowFeatureInfo] = useState(false);

  if (!photos?.length) {
    return <p>Aucune photo disponible pour le moment.</p>;
  }

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
    if (onPhotoDelete) onPhotoDelete(id);
  };

  const handleToggleFeature = (id: string, currentStatus: boolean) => {
    setShowFeatureInfo(true);
    if (onToggleFeature) onToggleFeature(id, currentStatus);
    if (onToggleFavorite) onToggleFavorite(id, currentStatus);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onPhotoClick={onPhotoClick}
            onToggleFeature={handleToggleFeature}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Dialog open={showFeatureInfo} onOpenChange={setShowFeatureInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Photos en vedette</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                L'icône étoile permet de mettre une photo en vedette sur la page d'accueil.
                Une étoile jaune indique que la photo est actuellement en vedette.
              </p>
              <p>
                Important : Les photos doivent être approuvées par un administrateur avant
                d'apparaître sur la page d'accueil. Une fois approuvée, votre photo sera
                visible par tous les visiteurs.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};