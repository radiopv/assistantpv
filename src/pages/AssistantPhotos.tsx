import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { toast } from "sonner";
import { logActivity } from "@/utils/activity-logger";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { notifyActiveSponsor } from "@/utils/sponsor-notifications";

const AssistantPhotos = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Album photo des enfants",
      subtitle: "Ajoutez et gérez les photos des enfants pour les parrains",
      instructions: "Cliquez sur une carte pour voir et ajouter des photos",
      photosAdded: "Photos ajoutées avec succès et parrain notifié",
      noPhotos: "Aucune photo",
      viewAlbum: "Voir l'album"
    },
    es: {
      title: "Álbum de fotos de los niños",
      subtitle: "Agregue y administre las fotos de los niños para los padrinos",
      instructions: "Haga clic en una tarjeta para ver y agregar fotos",
      photosAdded: "Fotos agregadas con éxito y padrino notificado",
      noPhotos: "Sin fotos",
      viewAlbum: "Ver álbum"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: children, isLoading } = useQuery({
    queryKey: ['children-with-photos'],
    queryFn: async () => {
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select('id, name');
      
      if (childrenError) throw childrenError;

      const photosPromises = childrenData?.map(async (child) => {
        const { data: photos } = await supabase
          .from('album_media')
          .select('url')
          .eq('child_id', child.id)
          .order('created_at', { ascending: false })
          .limit(4);
        
        return {
          ...child,
          photos: photos || []
        };
      });

      const childrenWithPhotos = await Promise.all(photosPromises || []);
      return childrenWithPhotos;
    }
  });

  const notifySponsor = async (childId: string) => {
    const { data: child } = await supabase
      .from('children')
      .select('name')
      .eq('id', childId)
      .single();

    if (child) {
      await notifyActiveSponsor(
        childId,
        `Nouvelles photos de ${child.name}`,
        `De nouvelles photos ont été ajoutées à l'album de ${child.name}. Vous pouvez les consulter dans son profil.`
      );
    }
  };

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      await notifySponsor(selectedChild);
      await logActivity(selectedChild, 'media_added', { child_id: selectedChild });
      toast.success(t.photosAdded);
      setSelectedChild(null); // Ferme l'album après l'upload
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="aspect-square animate-pulse bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
        <p className="text-sm text-gray-500">{t.instructions}</p>
      </div>

      {selectedChild ? (
        <Card className="p-6">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-6">
              <PhotoUploader
                childId={selectedChild}
                onUploadSuccess={handleUploadSuccess}
              />
              <AlbumMediaGrid childId={selectedChild} />
            </div>
          </ScrollArea>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {children?.map((child) => (
            <Card 
              key={child.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedChild(child.id)}
            >
              <div className="aspect-square relative">
                <div className="grid grid-cols-2 h-full">
                  {child.photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo.url}
                        alt={`Photo de ${child.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {child.photos.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500 text-sm">{t.noPhotos}</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-semibold truncate">{child.name}</h3>
                  <p className="text-white/80 text-sm">{t.viewAlbum}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantPhotos;
