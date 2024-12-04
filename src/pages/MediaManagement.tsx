import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MediaBrowserView } from "@/types/supabase/media";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MediaManagement = () => {
  const { data: mediaItems, isLoading } = useQuery<MediaBrowserView[]>({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unified_media_browser')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Media Management</h1>
      <div className="grid gap-4">
        {mediaItems?.map(item => (
          <Card key={item.id} className="p-4">
            <img src={item.url} alt={item.type} className="w-full h-32 object-cover" />
            <div className="mt-2">
              <h3 className="font-medium">{item.category}</h3>
              <p className="text-sm text-gray-500">{item.created_at}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManagement;
