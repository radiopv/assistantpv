import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./DonationCategorySelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DonationItem {
  category_id: string;
  quantity: number;
}

interface Donor {
  name: string;
  is_anonymous: boolean;
}

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
    photos: string[] | null;
    comments: string | null;
    items?: DonationItem[];
    donors?: Donor[];
  };
}

export const DonationCard = ({ donation }: DonationCardProps) => {
  const { data: donationPhotos } = useQuery({
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

  const { data: donationVideos } = useQuery({
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

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : `Catégorie ${categoryId}`;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Ville</p>
            <p className="font-medium">{donation.city}</p>
          </div>
          <div>
            <p className="text-gray-500">Personnes aidées</p>
            <p className="font-medium">{donation.people_helped}</p>
          </div>
          <div>
            <p className="text-gray-500">Articles</p>
            <div className="font-medium">
              {donation.items?.map((item: DonationItem, index: number) => (
                <span key={index} className="block">
                  {item.quantity}x {getCategoryName(item.category_id)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-500">Donateurs</p>
            <div className="font-medium">
              {donation.donors?.map((donor: Donor, index: number) => (
                <span key={index} className="block">
                  {donor.is_anonymous ? "Donateur anonyme" : donor.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photos from donation_photos table */}
        {donationPhotos && donationPhotos.length > 0 && (
          <div>
            <p className="text-gray-500 mb-2">Photos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {donationPhotos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.title || `Photo ${photo.id}`}
                  className="h-24 w-full object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Videos from donation_videos table */}
        {donationVideos && donationVideos.length > 0 && (
          <div>
            <p className="text-gray-500 mb-2">Vidéos</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {donationVideos.map((video) => (
                <div key={video.id} className="relative">
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
      </div>
    </Card>
  );
};