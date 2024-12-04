import { Star, StarOff } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PhotoGridProps {
  photos: any[];
  onDeletePhoto?: (photoId: number) => void;
}

export const PhotoGrid = ({ photos, onDeletePhoto }: PhotoGridProps) => {
  const { toast } = useToast();
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>(
    photos.filter(p => p.is_featured).map(p => p.id)
  );

  const handleStarClick = async (photoId: number) => {
    try {
      const isSelected = selectedPhotos.includes(photoId);
      
      const { error } = await supabase
        .from('donation_photos')
        .update({ is_featured: !isSelected })
        .eq('id', photoId);

      if (error) throw error;

      if (isSelected) {
        setSelectedPhotos(prev => prev.filter(id => id !== photoId));
      } else {
        setSelectedPhotos(prev => [...prev, photoId]);
      }

      toast({
        title: isSelected ? "Photo retirée des favoris" : "Photo ajoutée aux favoris",
        description: "La modification a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Error updating photo featured status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut de la photo.",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.url}
            alt="Donation"
            className="w-full h-48 object-cover rounded-lg"
          />
          
          {/* Star Button */}
          <button
            onClick={() => handleStarClick(photo.id)}
            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            {selectedPhotos.includes(photo.id) ? (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Delete Button (if onDeletePhoto is provided) */}
          {onDeletePhoto && (
            <button
              onClick={() => onDeletePhoto(photo.id)}
              className="absolute top-2 left-2 p-1 bg-white/80 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <span className="text-red-500">×</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};