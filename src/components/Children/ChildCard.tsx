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
  sponsorshipId?: string;
  onAddPhoto?: () => void;
  onViewProfile?: (id: string) => void;
  onSponsorClick?: (child: any) => void;
}

const ChildCard = ({ 
  child, 
  sponsorshipId, 
  onAddPhoto,
  onViewProfile,
  onSponsorClick 
}: ChildCardProps) => {
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
      toast({
        title: t("success"),
        description: t("sponsorshipRequestSent", { name: child.name })
      });
    } catch (error) {
      console.error("Error sending sponsorship request:", error);
      toast({
        title: t("error"),
        description: t("sponsorshipRequestError")
      });
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
      <CardHeader child={child} />
      <ChildInfo description={child.description} needs={child.needs} />
      <PhotoGallery photos={albumPhotos} childName={child.name} />
      {sponsorshipId && onAddPhoto && (
        <ActionButtons
          onAddPhoto={onAddPhoto}
          childId={child.id}
          sponsorshipId={sponsorshipId}
          onShowTermination={() => setShowTermination(true)}
        />
      )}
      {onViewProfile && (
        <button
          onClick={() => onViewProfile(child.id)}
          className="w-full mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          {t("viewProfile")}
        </button>
      )}
      {onSponsorClick && (
        <button
          onClick={() => onSponsorClick(child)}
          className="w-full mt-2 px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
        >
          {t("sponsor")}
        </button>
      )}

      {showTermination && sponsorshipId && (
        <TerminationDialog
          isOpen={showTermination}
          onClose={() => setShowTermination(false)}
          sponsorshipId={sponsorshipId}
          childName={child.name}
          onTerminationComplete={() => window.location.reload()}
        />
      )}
    </Card>
  );
};

export { ChildCard };
export default ChildCard;
export const SponsoredChildCard = ChildCard;