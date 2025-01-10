import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const SponsorAlbum = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["sponsor-photos", user?.id],
    queryFn: async () => {
      // First get all active sponsorships for the sponsor
      const { data: sponsorships, error: sponsorshipsError } = await supabase
        .from("sponsorships")
        .select("child_id")
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (sponsorshipsError) {
        console.error("Error fetching sponsorships:", sponsorshipsError);
        throw sponsorshipsError;
      }

      if (!sponsorships?.length) {
        return [];
      }

      const childIds = sponsorships.map(s => s.child_id);

      // Then get all photos for these children
      const { data: albumPhotos, error: photosError } = await supabase
        .from("album_media")
        .select(`
          id,
          url,
          title,
          description,
          created_at,
          child_id,
          children (
            name
          )
        `)
        .in("child_id", childIds)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (photosError) {
        console.error("Error fetching photos:", photosError);
        throw photosError;
      }

      return albumPhotos || [];
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!photos?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Album Photo</h1>
        <p>Aucune photo disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Album Photo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card 
            key={photo.id} 
            className="overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(photo.url)}
          >
            <img 
              src={photo.url} 
              alt={photo.title || "Photo"} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium">{photo.title || `Photo de ${photo.children?.name}`}</h3>
              {photo.description && (
                <p className="text-sm text-gray-600">{photo.description}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Photo en plein écran" 
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorAlbum;