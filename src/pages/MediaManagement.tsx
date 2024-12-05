import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MediaBrowserView } from "@/types/supabase/views/media";

const MediaManagement = () => {
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["media-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unified_media_browser")
        .select("*");

      if (error) throw error;
      return data as unknown as MediaBrowserView[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Media Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems?.map((item) => (
          <Card key={item.id} className="p-4">
            <img src={item.url} alt={item.title || ""} className="w-full h-auto rounded" />
            <h2 className="mt-2 font-semibold">{item.title}</h2>
            <p className="text-sm">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MediaManagement;