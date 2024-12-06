import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ChildSelector } from "@/components/AssistantPhotos/ChildSelector";
import { PhotoGrid } from "@/components/AssistantPhotos/PhotoGrid";
import { toast } from "sonner";
import { logActivity } from "@/utils/activity-logger";

const AssistantPhotos = () => {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

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
      await logActivity(selectedChild, 'photos_added', { child_id: selectedChild });
      toast.success("Photos ajoutées avec succès et parrain notifié");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Photos</h1>
      
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
              <PhotoGrid childId={selectedChild} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssistantPhotos;