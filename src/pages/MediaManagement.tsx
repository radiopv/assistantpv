import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Pencil, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MediaItem {
  id: string;
  url: string;
  thumbnail_url?: string;
  source_table: string;
  type: string;
  title?: string;
  description?: string;
  category: string;
}

const MediaManagement = () => {
  const { toast } = useToast();
  
  const { data: mediaItems, isLoading, refetch } = useQuery({
    queryKey: ['unified-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_media_browser')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MediaItem[];
    }
  });

  const handleDelete = async (item: MediaItem) => {
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

  const categories = mediaItems ? [...new Set(mediaItems.map(item => item.category))] : [];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600">Chargement...</div>
    </div>;
  }

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
              {mediaItems?.filter(item => item.category === category).map((item) => (
                <Card key={item.id} className="p-4 space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                    {item.type === 'video' ? (
                      <video 
                        src={item.url} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.title || 'Media'} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {item.title && (
                      <h3 className="font-medium">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MediaManagement;