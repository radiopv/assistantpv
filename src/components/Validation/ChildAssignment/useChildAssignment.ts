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

      const { data: existingSponsor, error: sponsorQueryError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('email', request.requester_email)
        .single();

      if (sponsorQueryError && sponsorQueryError.code !== 'PGRST116') throw sponsorQueryError;

      let sponsorId = existingSponsor?.id;

      if (!existingSponsor) {
        const { data: newSponsor, error: sponsorError } = await supabase
          .from('sponsors')
          .insert({
            email: request.requester_email,
            name: request.name,
            role: 'sponsor'
          })
          .select('id')
          .single();

        if (sponsorError) throw sponsorError;
        if (!newSponsor) throw new Error("Failed to create sponsor");
        
        sponsorId = newSponsor.id;
      }

      const { error: childError } = await supabase
        .from('children')
        .update({
          is_sponsored: true,
          sponsor_id: sponsorId,
          sponsor_name: request.name,
          sponsor_email: request.requester_email
        })
        .eq('id', request.child_id);

      if (childError) throw childError;

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