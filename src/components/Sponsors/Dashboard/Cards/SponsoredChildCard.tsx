import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardHeader } from "./CardHeader";
import { ChildInfo } from "./ChildInfo";
import { PhotoGallery } from "./PhotoGallery";
import { ActionButtons } from "./ActionButtons";
import { TerminationDialog } from "../TerminationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url?: string;
    birth_date?: string;
    description?: string;
    needs?: any;
    age?: number;
  };
  sponsorshipId: string;
  onAddPhoto: () => void;
}

export const SponsoredChildCard = ({
  child,
  sponsorshipId,
  onAddPhoto,
}: SponsoredChildCardProps) => {
  const [showTermination, setShowTermination] = useState(false);

  const { data: albumPhotos } = useQuery({
    queryKey: ['album-photos', child.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('child_id', child.id)
        .eq('type', 'image')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
      <CardHeader child={child} />
      <ChildInfo description={child.description} needs={child.needs} />
      <PhotoGallery photos={albumPhotos} childName={child.name} />
      <ActionButtons
        onAddPhoto={onAddPhoto}
        childId={child.id}
        sponsorshipId={sponsorshipId}
        onShowTermination={() => setShowTermination(true)}
      />

      <TerminationDialog
        isOpen={showTermination}
        onClose={() => setShowTermination(false)}
        sponsorshipId={sponsorshipId}
        childName={child.name}
        onTerminationComplete={() => window.location.reload()}
      />
    </Card>
  );
};