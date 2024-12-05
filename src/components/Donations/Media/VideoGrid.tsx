import { X, Play } from "lucide-react";

interface VideoGridProps {
  videos: any[];
  onVideosUpdate: () => void;
}

export const VideoGrid = ({ videos, onVideosUpdate }: VideoGridProps) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div>
      <p className="text-gray-500 mb-2">Vidéos</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative group aspect-video">
            <div className="w-full h-full relative">
              <video
                src={video.url}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                onClick={() => window.open(video.url, '_blank')}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
            <button
              onClick={() => onVideosUpdate()}
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