import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PublicMediaGridProps {
  childId: string;
}

export const PublicMediaGrid = ({ childId }: PublicMediaGridProps) => {
  const { data: media, isLoading } = useQuery({
    queryKey: ['public-media', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
        .eq('is_public', true)
        .eq('is_approved', true);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!media?.length) {
    return (
      <div className="text-center text-gray-500 p-4">
        No public media available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt="Memory"
              className="w-full h-48 object-cover"
            />
          ) : (
            <video
              src={item.url}
              controls
              className="w-full h-48 object-cover"
            />
          )}
        </Card>
      ))}
    </div>
  );
};