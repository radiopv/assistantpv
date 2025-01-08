import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorAlbum = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["sponsor-photos", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("album_media")
        .select("*")
        .eq("sponsor_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("photoAlbum")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <img 
              src={photo.url} 
              alt={photo.title || "Photo"} 
              className="w-full h-48 object-cover"
            />
            {photo.title && (
              <div className="p-4">
                <h3 className="font-medium">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-gray-600">{photo.description}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsorAlbum;