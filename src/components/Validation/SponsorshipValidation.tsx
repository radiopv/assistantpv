import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useAuth } from "@/components/Auth/AuthProvider";

export const SponsorshipValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorships-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['sponsorships-pending'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestApproved"),
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingRequest"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['sponsorships-pending'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestRejected"),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingRequest"),
      });
    }
  };

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  return (
    <RequestsList
      requests={requests || []}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};