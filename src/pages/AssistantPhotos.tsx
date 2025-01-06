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

const AssistantPhotos = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Ajout photos et vidéos enfants",
      instructions: "Cette page vous permet d'ajouter des photos et des vidéos à l'album d'un enfant. Ces médias seront visibles par le parrain dans le profil de l'enfant qu'il parraine.",
      photosAdded: "Médias ajoutés avec succès et parrain notifié",
    },
    es: {
      title: "Agregar fotos y videos de niños",
      instructions: "Esta página le permite agregar fotos y videos al álbum de un niño. Estos medios serán visibles para el padrino en el perfil del niño que apadrina.",
      photosAdded: "Medios agregados con éxito y padrino notificado",
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
            <>
              <PhotoUploader
                childId={selectedChild}
                onUploadSuccess={handleUploadSuccess}
              />
              <AlbumMediaGrid childId={selectedChild} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssistantPhotos;