import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoGridProps {
  videos: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }[];
  className?: string;
}

export const VideoGrid = ({ videos, className = "" }: VideoGridProps) => {
  if (!videos?.length) return null;

  return (
    <div className={`grid ${className}`}>
      {videos.map((video) => (
        <Card key={video.id} className="relative group overflow-hidden aspect-video">
          <video
            src={video.url}
            className="h-full w-full object-cover cursor-pointer"
            onClick={() => window.open(video.url, '_blank')}
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-12 h-12 text-white" />
          </div>
        </Card>
      ))}
    </div>
  );
};