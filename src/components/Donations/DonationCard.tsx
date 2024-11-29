import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Video } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { VideoUpload } from "./VideoUpload";
import { DonationHeader } from "./DonationHeader";
import { DonationDetails } from "./DonationDetails";
import { DonationMedia } from "./DonationMedia";
import { useState } from "react";

interface DonationCardProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    status: string;
    comments: string | null;
  };
}

export const DonationCard = ({ donation }: DonationCardProps) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const { data: donationPhotos, refetch: refetchPhotos } = useQuery({
    queryKey: ['donation-photos', donation.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_photos')
        .select('*')
        .eq('donation_id', donation.id);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: donationVideos, refetch: refetchVideos } = useQuery({
    queryKey: ['donation-videos', donation.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donation_videos')
        .select('*')
        .eq('donation_id', donation.id);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <DonationHeader donation={donation} />
        <DonationDetails donation={donation} />
        <DonationMedia 
          photos={donationPhotos} 
          videos={donationVideos}
          onPhotoDelete={async (photoId) => {
            await supabase.from('donation_photos').delete().eq('id', photoId);
            refetchPhotos();
          }}
          onVideoDelete={async (videoId) => {
            await supabase.from('donation_videos').delete().eq('id', videoId);
            refetchVideos();
          }}
        />

        {donation.comments && (
          <div>
            <p className="text-gray-500">Commentaires</p>
            <p className="text-sm">{donation.comments}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {showPhotoUpload ? "Fermer" : "Ajouter des photos"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideoUpload(!showVideoUpload)}
            className="flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            {showVideoUpload ? "Fermer" : "Ajouter des vidéos"}
          </Button>
        </div>

        {showPhotoUpload && (
          <PhotoUpload
            donationId={donation.id}
            onUploadComplete={() => {
              refetchPhotos();
              setShowPhotoUpload(false);
            }}
          />
        )}

        {showVideoUpload && (
          <VideoUpload
            donationId={donation.id}
            onUploadComplete={() => {
              refetchVideos();
              setShowVideoUpload(false);
            }}
          />
        )}
      </div>
    </Card>
  );
};