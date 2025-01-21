import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Camera, FileEdit } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
    city: string | null;
    birth_date: string;
    description: string | null;
    story: string | null;
    needs: any;
    age: number;
  };
  sponsorshipId: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({ 
  child, 
  sponsorshipId,
  onAddPhoto,
  onAddTestimonial 
}: SponsoredChildCardProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { data: albumPhotos = [], isLoading } = useQuery({
    queryKey: ['album-photos', child.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', child.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleToggleFeature = async (photoId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('album_media')
        .update({ is_featured: !currentStatus })
        .eq('id', photoId);

      if (error) throw error;

      toast.success(currentStatus ? "Photo retirée des favoris" : "Photo ajoutée aux favoris");
    } catch (error) {
      console.error('Error toggling feature status:', error);
      toast.error("Erreur lors de la modification du statut de la photo");
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Main photo - reduced to 50% */}
        <div className="w-1/2 mx-auto aspect-video relative rounded-lg overflow-hidden">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{child.name}</h3>
              <p className="text-sm text-gray-600">{child.age} ans</p>
              {child.city && <p className="text-sm text-gray-600">{child.city}</p>}
            </div>
          </div>

          {child.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{child.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Album photos ({isLoading ? "..." : albumPhotos.length})</h4>
            <div className="grid grid-cols-3 gap-2">
              {albumPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={`Photo de ${child.name}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleToggleFeature(photo.id, photo.is_featured)}
                          className={`absolute top-2 right-2 p-1 rounded-full transition-opacity 
                            ${photo.is_featured ? 'bg-yellow-400 text-black' : 'bg-white/80 text-gray-600'} 
                            opacity-0 group-hover:opacity-100`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cliquez pour {photo.is_featured ? "retirer des" : "ajouter aux"} favoris</p>
                        <p className="text-xs text-gray-500">Les photos favorites apparaîtront sur la page d'accueil</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={onAddPhoto}
            >
              <Camera className="w-4 h-4" />
              Ajouter une photo
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={onAddTestimonial}
            >
              <FileEdit className="w-4 h-4" />
              Ajouter un témoignage
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};