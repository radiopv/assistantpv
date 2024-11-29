import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PublicMediaToggle } from "./PublicMediaToggle";
import { useAuth } from "@/components/Auth/AuthProvider";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: media, isLoading, refetch } = useQuery({
    queryKey: ['album-media', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId);

      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_approved: true })
        .eq('id', mediaId);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error approving media:', error);
    }
  };

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
        No media available
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
          <div className="p-3 space-y-2">
            <PublicMediaToggle
              mediaId={item.id}
              isPublic={item.is_public}
              onToggle={refetch}
            />
            {isAdmin && item.is_public && !item.is_approved && (
              <button
                onClick={() => handleApprove(item.id)}
                className="w-full px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Approve
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};