import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  photos: any[];
  onPhotoClick?: (url: string) => void;
  onToggleFeature?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
  onPhotoDelete?: (id: string) => void;
}

export const PhotoGrid = ({ 
  photos, 
  onPhotoClick, 
  onToggleFeature, 
  onDelete,
  onPhotoDelete 
}: PhotoGridProps) => {
  if (!photos?.length) {
    return <p>Aucune photo disponible pour le moment.</p>;
  }

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
    if (onPhotoDelete) onPhotoDelete(id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onPhotoClick={onPhotoClick}
          onToggleFeature={onToggleFeature}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};