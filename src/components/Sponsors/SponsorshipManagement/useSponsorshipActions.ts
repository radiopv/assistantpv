import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export const useSponsorshipActions = (refetch: () => void) => {
  const { t } = useLanguage();

  const handleVerificationChange = async (sponsorId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_verified: checked })
        .eq('id', sponsorId);

      if (error) throw error;
      toast.success(t("sponsorVerificationUpdated"));
      refetch();
    } catch (error) {
      console.error('Error updating sponsor verification:', error);
      toast.error(t("errorUpdatingVerification"));
    }
  };

  const handleRemoveChild = async (sponsorId: string, childId: string) => {
    try {
      // First update the sponsorship status
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'ended',
          end_date: new Date().toISOString()
        })
        .eq('sponsor_id', sponsorId)
        .eq('child_id', childId);

      if (sponsorshipError) throw sponsorshipError;

      // Then update the child status
      const { error: childError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: false,
          status: 'available',
          sponsor_id: null 
        })
        .eq('id', childId);

      if (childError) throw childError;

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          recipient_id: sponsorId,
          type: 'sponsorship_ended',
          title: 'Fin de parrainage',
          content: 'Le parrainage a été terminé.',
          created_at: new Date().toISOString()
        });

      if (notificationError) throw notificationError;

      refetch();
    } catch (error) {
      console.error('Error removing child:', error);
      throw error;
    }
  };

  const handleAddChild = async (sponsorId: string, childId: string) => {
    try {
      // Create new sponsorship
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (sponsorshipError) throw sponsorshipError;

      // Update child status
      const { error: childError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: true,
          sponsor_id: sponsorId,
          status: 'sponsored'
        })
        .eq('id', childId);

      if (childError) throw childError;

      toast.success(t("childAdded"));
      refetch();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error(t("errorAddingChild"));
    }
  };

  return {
    handleVerificationChange,
    handleRemoveChild,
    handleAddChild
  };
};