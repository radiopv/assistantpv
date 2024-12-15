import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ChildSelector } from "@/components/AssistantPhotos/ChildSelector";
import { toast } from "sonner";
import { logActivity } from "@/utils/activity-logger";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChildPhotoAlbum } from "@/components/AssistantPhotos/ChildPhotoAlbum";

const AssistantPhotos = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Gestion des photos et vidéos",
      instructions: "Cette page vous permet de gérer les photos et vidéos des enfants. Sélectionnez un enfant pour voir son album ou ajouter de nouveaux médias.",
      photosAdded: "Médias ajoutés avec succès et parrain notifié",
      allAlbums: "Tous les albums",
      upload: "Ajouter des médias",
    },
    es: {
      title: "Gestión de fotos y videos",
      instructions: "Esta página le permite gestionar las fotos y videos de los niños. Seleccione un niño para ver su álbum o agregar nuevos medios.",
      photosAdded: "Medios agregados con éxito y padrino notificado",
      allAlbums: "Todos los álbumes",
      upload: "Agregar medios",
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
        subject: `Nouvelles photos/vidéos de ${child.name}`,
        content: `De nouveaux médias ont été ajoutés à l'album de ${child.name}. Vous pouvez les consulter dans son profil.`,
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
      <h1 className="text-2xl font-bold">{t.title}</h1>
      
      <p className="text-gray-600 mb-6">
        {t.instructions}
      </p>

      <Card className="p-6">
        <div className="space-y-6">
          <ChildSelector
            children={children || []}
            selectedChild={selectedChild}
            onSelect={setSelectedChild}
          />

          {selectedChild && (
            <Tabs defaultValue="album" className="w-full">
              <TabsList>
                <TabsTrigger value="album">{t.allAlbums}</TabsTrigger>
                <TabsTrigger value="upload">{t.upload}</TabsTrigger>
              </TabsList>

              <TabsContent value="album">
                <ChildPhotoAlbum childId={selectedChild} />
              </TabsContent>

              <TabsContent value="upload">
                <PhotoUploader
                  childId={selectedChild}
                  onUploadSuccess={handleUploadSuccess}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssistantPhotos;