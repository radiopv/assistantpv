import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/api/email";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/tables/child-assignment-requests";
import { EmailRequest } from "@/integrations/supabase/types/email";

export const useChildAssignment = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['child-assignment-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('status', 'pending') as { data: ChildAssignmentRequest[] | null, error: any };
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleApprove = async (request: ChildAssignmentRequest) => {
    try {
      if (!request.requester_email) {
        throw new Error("Email du demandeur manquant");
      }

      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      const emailRequest: EmailRequest = {
        from: "noreply@example.com",
        to: [request.requester_email],
        subject: t("childRequestApprovedSubject"),
        html: t("childRequestApprovedContent", { name: request.name })
      };

      await sendEmail(emailRequest);

      toast({
        title: t("success"),
        description: t("childRequestApproved")
      });

      queryClient.invalidateQueries({ queryKey: ['child-assignment-requests'] });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingChildRequest")
      });
    }
  };

  const handleReject = async (request: ChildAssignmentRequest) => {
    try {
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      const emailRequest: EmailRequest = {
        from: "noreply@example.com",
        to: [request.requester_email],
        subject: t("childRequestRejectedSubject"),
        html: t("childRequestRejectedContent", { name: request.name })
      };

      await sendEmail(emailRequest);

      toast({
        title: t("success"),
        description: t("childRequestRejected")
      });

      queryClient.invalidateQueries({ queryKey: ['child-assignment-requests'] });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingChildRequest")
      });
    }
  };

  return {
    requests,
    isLoading,
    handleApprove,
    handleReject
  };
};