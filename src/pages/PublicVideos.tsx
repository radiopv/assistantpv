import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Film } from "lucide-react";
import { VideoGrid } from "@/components/Videos/VideoGrid";

const PublicVideos = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['public-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_videos_with_details')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Film className="h-8 w-8 text-primary" />
          Nos Actions en Vidéo
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez nos actions sur le terrain à travers nos vidéos. Voyez l'impact direct de votre soutien sur la vie des enfants cubains.
        </p>
      </div>

      <VideoGrid videos={videos || []} isLoading={isLoading} />
    </div>
  );
};

export default PublicVideos;