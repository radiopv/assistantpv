import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { data: media, isLoading } = useQuery({
    queryKey: ['album-media', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media?.map((item) => (
        <Card key={item.id} className="overflow-hidden relative group">
          {item.type === 'video' ? (
            <div className="relative aspect-square">
              <video
                src={item.url}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : (
            <img
              src={item.url}
              alt="Album media"
              className="w-full h-full object-cover aspect-square"
            />
          )}
        </Card>
      ))}
    </div>
  );
};