import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Video } from "lucide-react";
import { PhotoUpload } from "./PhotoUpload";
import { useState } from "react";

interface DonationPhoto {
  id: number;
  url: string;
  title?: string;
}

interface DonationVideo {
  id: string;
  url: string;
  title?: string;
  thumbnail_url?: string;
}

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
      return data as DonationPhoto[];
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
      return data as DonationVideo[];
    }
  });

  const handlePhotoDelete = async (photoId: number) => {
    const { error } = await supabase
      .from('donation_photos')
      .delete()
      .eq('id', photoId);
    
    if (!error) {
      refetchPhotos();
    }
  };

  const handleVideoDelete = async (videoId: string) => {
    const { error } = await supabase
      .from('donation_videos')
      .delete()
      .eq('id', videoId);
    
    if (!error) {
      refetchVideos();
    }
  };

  return (
    <Card key={donation.id} className="p-4">
      <div className="space-y-4">
        {/* En-tête avec statut */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Don par {donation.assistant_name}</h3>
            <p className="text-sm text-gray-600">
              {format(new Date(donation.donation_date), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs",
              donation.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            )}
          >
            {donation.status === "completed" ? "Complété" : "En cours"}
          </span>
        </div>

        {/* Grille des détails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Ville</p>
            <p className="font-medium">{donation.city}</p>
          </div>
          <div>
            <p className="text-gray-500">Personnes aidées</p>
            <p className="font-medium">{donation.people_helped}</p>
          </div>
        </div>

        {/* Photos */}
        {donationPhotos && donationPhotos.length > 0 && (
          <div>
            <p className="text-gray-500 mb-2">Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {donationPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title || `Photo ${photo.id}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handlePhotoDelete(photo.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {donationVideos && donationVideos.length > 0 && (
          <div>
            <p className="text-gray-500 mb-2">Vidéos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {donationVideos.map((video) => (
                <div key={video.id} className="relative group">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title || `Vidéo ${video.id}`}
                      className="h-24 w-full object-cover rounded-md cursor-pointer"
                      onClick={() => window.open(video.url, '_blank')}
                    />
                  ) : (
                    <div 
                      className="h-24 w-full bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                      onClick={() => window.open(video.url, '_blank')}
                    >
                      <span className="text-sm text-gray-600">Voir la vidéo</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleVideoDelete(video.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commentaires */}
        {donation.comments && (
          <div>
            <p className="text-gray-500">Commentaires</p>
            <p className="text-sm">{donation.comments}</p>
          </div>
        )}

        {/* Boutons d'ajout de média */}
        <div className="flex gap-2 mt-4">
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

        {/* Formulaires d'upload */}
        {showPhotoUpload && (
          <PhotoUpload
            donationId={donation.id}
            onUploadComplete={() => {
              refetchPhotos();
              setShowPhotoUpload(false);
            }}
          />
        )}
      </div>
    </Card>
  );
};