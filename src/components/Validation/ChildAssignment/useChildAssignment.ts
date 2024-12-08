import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { sendEmail } from "@/api/email";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";

export const useChildAssignment = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['child-assignment-requests'],
    queryFn: async () => {
      console.log('Fetching child assignment requests...');
      const { data, error } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      
      console.log('Fetched requests:', data);
      return data as ChildAssignmentRequest[];
    }
  });

  const handleApprove = async (request: ChildAssignmentRequest) => {
    try {
      console.log('Approving request:', request);
      
      if (!request.requester_email) {
        throw new Error("Email du demandeur manquant");
      }

      // 1. Update request status
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // 2. Handle sponsor creation/lookup
      const { data: existingSponsor, error: sponsorQueryError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('email', request.requester_email)
        .maybeSingle();

      if (sponsorQueryError) throw sponsorQueryError;

      let sponsorId: string;

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
        if (!newSponsor) throw new Error("Échec de la création du parrain");
        
        sponsorId = newSponsor.id;
      } else {
        sponsorId = existingSponsor.id;
      }

      // 3. Update child information
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

      // 4. Create sponsorship record
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: request.child_id,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (sponsorshipError) throw sponsorshipError;

      // Send notification
      await sendEmail({
        to: [request.requester_email],
        subject: t("childRequestApprovedSubject"),
        html: t("childRequestApprovedContent", { name: request.name }),
        from: "noreply@lovable.dev"
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
      console.log('Rejecting request:', request);
      
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      await sendEmail({
        to: [request.requester_email],
        subject: t("childRequestRejectedSubject"),
        html: t("childRequestRejectedContent", { name: request.name }),
        from: "noreply@lovable.dev"
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