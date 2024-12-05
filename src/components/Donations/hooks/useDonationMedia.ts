import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDonationMedia = (donationId: string) => {
  const { 
    data: donationPhotos, 
    refetch: refetchPhotos 
  } = useQuery({
    queryKey: ['donation-photos', donationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_photos')
        .select('*')
        .eq('donation_id', donationId);
      
      if (error) throw error;
      return data;
    }
  });

  const { 
    data: donationVideos, 
    refetch: refetchVideos 
  } = useQuery({
    queryKey: ['donation-videos', donationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_videos')
        .select('*')
        .eq('donation_id', donationId);
      
      if (error) throw error;
      return data;
    }
  });

  return {
    photos: donationPhotos || [],
    videos: donationVideos || [],
    refetchPhotos,
    refetchVideos
  };
};