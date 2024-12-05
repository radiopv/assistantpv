import { Play } from "lucide-react";

interface DonationMediaProps {
  photos: any[];
  videos: any[];
  onPhotoDelete: (id: number) => void;
  onVideoDelete: (id: string) => void;
}

export const DonationMedia = ({ photos, videos, onPhotoDelete, onVideoDelete }: DonationMediaProps) => {
  if (!photos?.length && !videos?.length) return null;

  return (
    <div className="space-y-4">
      {photos && photos.length > 0 && (
        <div>
          <p className="text-gray-500 mb-2">Photos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.title || `Photo ${photo.id}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <button
                  onClick={() => onPhotoDelete(photo.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {videos && videos.length > 0 && (
        <div>
          <p className="text-gray-500 mb-2">Vidéos</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {videos.map((video) => (
              <div key={video.id} className="relative group">
                <div className="relative h-24 w-full">
                  <video
                    src={video.url}
                    className="h-full w-full object-cover rounded-md cursor-pointer"
                    onClick={() => window.open(video.url, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <button
                  onClick={() => onVideoDelete(video.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};