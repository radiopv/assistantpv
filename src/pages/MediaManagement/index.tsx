import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { MediaCard } from "./MediaCard";
import { MediaDialog } from "./MediaDialog";
import { useState } from "react";

const MediaManagement = () => {
  const { toast } = useToast();
  const [editingMedia, setEditingMedia] = useState<any>(null);
  
  const { data: mediaItems, isLoading, refetch } = useQuery({
    queryKey: ['unified-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_media_browser')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (item: any) => {
    try {
      const { error } = await supabase
        .from(item.source_table)
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

  const categories = [...new Set(mediaItems?.map(item => item.category || 'Non catégorisé'))];

  return (
    <div className="space-y-6">
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
                ?.filter(item => (item.category || 'Non catégorisé') === category)
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