import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export const FeaturedAlbum = () => {
  const { data: photos, isLoading } = useQuery({
    queryKey: ['featured-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select(`
          *,
          children:child_id (name),
          sponsors:sponsor_id (name, is_anonymous)
        `)
        .eq('is_featured', true)
        .eq('is_approved', true)
        .eq('type', 'image')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!photos?.length) {
    return <p className="text-gray-500">Aucune photo pour le moment</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="relative group overflow-hidden">
          <img
            src={photo.url}
            alt={photo.title || "Photo d'album"}
            className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          {photo.title && (
            <div className="absolute inset-x-0 bottom-0 bg-black/50 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {photo.title}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};