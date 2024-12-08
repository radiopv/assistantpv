import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendEmail } from "@/api/email";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";
import { Database } from "@/integrations/supabase/types/database";

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
        .eq('status', 'pending');
      
      if (error) throw error;
      return data as ChildAssignmentRequest[];
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

      await sendEmail({
        from: 'noreply@lovable.dev',
        to: [request.requester_email],
        subject: t("childRequestApprovedSubject"),
        html: t("childRequestApprovedContent", { name: request.name })
      });

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

      await sendEmail({
        from: 'noreply@lovable.dev',
        to: [request.requester_email],
        subject: t("childRequestRejectedSubject"),
        html: t("childRequestRejectedContent", { name: request.name })
      });

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