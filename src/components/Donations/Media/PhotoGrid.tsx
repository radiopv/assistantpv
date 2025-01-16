import { PhotoCard } from "./PhotoCard";

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
  if (!photos?.length) {
    return <p className="text-gray-500 text-sm text-center">Aucune photo disponible</p>;
  }

  const handleDelete = async (id: string) => {
    console.log("Handling delete for photo ID:", id);
    if (onPhotoDelete) {
      onPhotoDelete(id);
    }
  };

  return (
    <div className={`grid ${className}`}>
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onPhotoClick={onPhotoClick}
          onDelete={handleDelete}
          onToggleFavorite={onToggleFavorite}
          isReadOnly={!onPhotoDelete && !onToggleFavorite}
        />
      ))}
    </div>
  );
};