import { X } from "lucide-react";

interface PhotoGridProps {
  photos: any[];
  onDeletePhoto: (photoId: number) => void;
}

export const PhotoGrid = ({ photos, onDeletePhoto }: PhotoGridProps) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div>
      <p className="text-gray-500 mb-2">Photos</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square">
            <img
              src={photo.url}
              alt="Photo du don"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => onDeletePhoto(photo.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};