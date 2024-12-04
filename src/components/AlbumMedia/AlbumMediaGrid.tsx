import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { data: media, isLoading, error } = useQuery({
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

  if (error) {
    return (
      <Alert variant="warning" className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span>L'album photo n'est pas encore disponible.</span>
      </Alert>
    );
  }

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
        <Card key={item.id} className="overflow-hidden">
          <img
            src={item.url}
            alt="Album media"
            className="w-full h-full object-cover aspect-square"
          />
        </Card>
      ))}
    </div>
  );
};