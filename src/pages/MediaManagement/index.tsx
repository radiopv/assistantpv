import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { MediaCard } from "./MediaCard";
import { MediaDialog } from "./MediaDialog";
import { useState } from "react";

interface UnifiedMedia {
  id: string;
  url: string;
  thumbnail_url?: string;
  source_table: string;
  type: string;
  title?: string;
  description?: string;
  category: string;
  created_at?: string;
}

const MediaManagement = () => {
  const { toast } = useToast();
  const [editingMedia, setEditingMedia] = useState<UnifiedMedia | null>(null);
  
  const { data: mediaItems, isLoading, refetch } = useQuery({
    queryKey: ['unified-media'],
    queryFn: async () => {
      try {
        // Fetch all media from different tables
        const [donationPhotos, donationVideos, albumMedia, sponsorPhotos] = await Promise.all([
          supabase.from('donation_photos').select('*'),
          supabase.from('donation_videos').select('*'),
          supabase.from('album_media').select('*'),
          supabase.from('sponsors').select('id, photo_url').not('photo_url', 'is', null)
        ]);

        console.log('Fetched media:', { donationPhotos, donationVideos, albumMedia, sponsorPhotos });

        const unifiedMedia: UnifiedMedia[] = [
          ...(donationPhotos.data || []).map(photo => ({
            id: String(photo.id), // Convert number to string
            url: photo.url || '',
            source_table: 'donation_photos',
            type: 'image',
            category: 'Donations',
            created_at: photo.created_at
          })),
          ...(donationVideos.data || []).map(video => ({
            id: video.id,
            url: video.url,
            thumbnail_url: video.thumbnail_url,
            source_table: 'donation_videos',
            type: 'video',
            category: 'Donations',
            created_at: video.created_at
          })),
          ...(albumMedia.data || []).map(media => ({
            id: media.id,
            url: media.url,
            source_table: 'album_media',
            type: media.type || 'image',
            category: 'Album',
            created_at: media.created_at
          })),
          ...(sponsorPhotos.data || []).map(sponsor => ({
            id: sponsor.id,
            url: sponsor.photo_url || '',
            source_table: 'sponsors',
            type: 'image',
            category: 'Sponsors',
            created_at: new Date().toISOString() // Default creation date for sponsors
          }))
        ];

        return unifiedMedia;
      } catch (error) {
        console.error('Error fetching media:', error);
        throw error;
      }
    }
  });

  const handleDelete = async (item: UnifiedMedia) => {
    try {
      const { error } = await supabase
        .from(item.source_table as any) // Type assertion needed here
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Media supprimé",
        description: "Le média a été supprimé avec succès",
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  const categories = [...new Set(mediaItems?.map(item => item.category) || [])];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Médias</h1>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaItems
                ?.filter(item => item.category === category)
                .map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    onEdit={() => setEditingMedia(item)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {editingMedia && (
        <MediaDialog
          open={!!editingMedia}
          onClose={() => setEditingMedia(null)}
          media={editingMedia}
          onSave={() => {
            refetch();
            setEditingMedia(null);
          }}
        />
      )}
    </div>
  );
};

export default MediaManagement;