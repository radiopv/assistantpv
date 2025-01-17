import { PhotoCard } from "./PhotoCard";

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
  if (!photos?.length) {
    return <p className="text-gray-500">Aucune photo disponible</p>;
  }

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
    if (onPhotoDelete) onPhotoDelete(id);
  };

  const handleToggleFeature = (id: string, currentStatus: boolean) => {
    if (onToggleFeature) onToggleFeature(id, currentStatus);
    if (onToggleFavorite) onToggleFavorite(id, currentStatus);
  };

  return (
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
  );
};