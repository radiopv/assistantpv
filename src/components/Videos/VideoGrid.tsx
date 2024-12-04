import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
}

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
}

export const VideoGrid = ({ videos, isLoading }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden group">
          <div className="aspect-video relative">
            {video.thumbnail_url ? (
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(video.url, '_blank')}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">Vidéo non disponible</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => window.open(video.url, '_blank')}
                className="bg-white text-black px-4 py-2 rounded-full transform scale-95 group-hover:scale-100 transition-transform"
              >
                Voir la vidéo
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">{video.title}</h3>
            {video.description && (
              <p className="text-gray-600 text-sm">{video.description}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};