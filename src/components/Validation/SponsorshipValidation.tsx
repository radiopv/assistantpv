import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";

export const SponsorshipValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: id,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

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
      const { error } = await supabase.rpc('reject_sponsorship_request', {
        request_id: id,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

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