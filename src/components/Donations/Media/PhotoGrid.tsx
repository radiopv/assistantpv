import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  photos: any[];
  onPhotoClick?: (url: string) => void;
  onPhotoDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, currentStatus: boolean) => void;
}

export const PhotoGrid = ({ 
  photos, 
  onPhotoClick = () => {}, 
  onPhotoDelete,
  onToggleFavorite
}: PhotoGridProps) => {
  if (!photos?.length) {
    return <p className="text-gray-500 text-sm">Aucune photo disponible</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onPhotoClick={onPhotoClick}
          onDelete={onPhotoDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};