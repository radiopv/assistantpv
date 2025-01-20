import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardHeader } from "./CardComponents/CardHeader";
import { ChildInfo } from "./CardComponents/ChildInfo";
import { PhotoGallery } from "./CardComponents/PhotoGallery";
import { ActionButtons } from "./CardComponents/ActionButtons";
import { TerminationDialog } from "./TerminationDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ChildCardProps {
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

// Export both as default and named export for backward compatibility
export const ChildCard = ({ child, sponsorshipId, onAddPhoto }: ChildCardProps) => {
  const [showTermination, setShowTermination] = useState(false);
  const { t } = useLanguage();

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

  const handleSponsorClick = async () => {
    try {
      // Logic to send sponsorship request
      toast.success(t("sponsorshipRequestSent", { name: child.name }));
    } catch (error) {
      console.error("Error sending sponsorship request:", error);
      toast.error(t("sponsorshipRequestError"));
    }
  };

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

// Also export as default for flexibility
export default ChildCard;

// For backward compatibility
export const SponsoredChildCard = ChildCard;