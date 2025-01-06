import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ChildSelector } from "@/components/AssistantPhotos/ChildSelector";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { toast } from "sonner";
import { logActivity } from "@/utils/activity-logger";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const AssistantPhotos = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Album photo des enfants",
      subtitle: "Ajoutez et gérez les photos des enfants pour les parrains",
      instructions: "Sélectionnez un enfant pour voir son album et ajouter des photos. Les photos seront visibles par le parrain dans le profil de l'enfant.",
      photosAdded: "Photos ajoutées avec succès et parrain notifié",
    },
    es: {
      title: "Álbum de fotos de los niños",
      subtitle: "Agregue y administre las fotos de los niños para los padrinos",
      instructions: "Seleccione un niño para ver su álbum y agregar fotos. Las fotos serán visibles por el padrino en el perfil del niño.",
      photosAdded: "Fotos agregadas con éxito y padrino notificado",
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: children } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const notifySponsor = async (childId: string) => {
    const { data: child } = await supabase
      .from('children')
      .select('name, sponsorships(sponsor_id)')
      .eq('id', childId)
      .single();

    if (child?.sponsorships?.[0]?.sponsor_id) {
      await supabase.from('messages').insert({
        recipient_id: child.sponsorships[0].sponsor_id,
        subject: `Nouvelles photos de ${child.name}`,
        content: `De nouvelles photos ont été ajoutées à l'album de ${child.name}. Vous pouvez les consulter dans son profil.`,
        is_read: false
      });
    }
  };

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      await notifySponsor(selectedChild);
      await logActivity(selectedChild, 'media_added', { child_id: selectedChild });
      toast.success(t.photosAdded);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>
      
      <Card className="p-6">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6">
            <ChildSelector
              children={children || []}
              selectedChild={selectedChild}
              onSelect={setSelectedChild}
            />

            {selectedChild && (
              <div className="space-y-8">
                <PhotoUploader
                  childId={selectedChild}
                  onUploadSuccess={handleUploadSuccess}
                />
                <AlbumMediaGrid childId={selectedChild} />
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default AssistantPhotos;