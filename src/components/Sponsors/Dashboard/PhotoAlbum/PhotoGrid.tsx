import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  photos: any[];
  onPhotoClick: (url: string) => void;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const PhotoGrid = ({ photos, onPhotoClick, onToggleFavorite, onDelete }: PhotoGridProps) => {
  if (!photos?.length) {
    return <p>Aucune photo disponible pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onPhotoClick={onPhotoClick}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};