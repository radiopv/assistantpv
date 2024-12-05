import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload } from "lucide-react";

interface AlbumSectionProps {
  childId: string;
  sponsorId: string;
}

export const AlbumSection = ({ childId, sponsorId }: AlbumSectionProps) => {
  const [activeTab, setActiveTab] = useState("photos");

  const { data: media, isLoading } = useQuery({
    queryKey: ['album-media', childId, sponsorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', childId)
        .eq('sponsor_id', sponsorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Album Photos</h3>
        <Button size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
              {media?.filter(item => item.type === 'image').map((item) => (
                <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={item.url}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="videos">
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {media?.filter(item => item.type === 'video').map((item) => (
                <div key={item.id} className="aspect-video relative rounded-lg overflow-hidden">
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};