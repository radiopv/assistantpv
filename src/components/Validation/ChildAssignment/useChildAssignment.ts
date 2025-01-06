import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";
import { Database } from "@/integrations/supabase/types";

export const useChildAssignment = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['child-assignment-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('status', 'pending')
        .returns<ChildAssignmentRequest[]>();

      if (error) throw error;
      return data || [];
    }
  });

  const handleApprove = async (request: ChildAssignmentRequest) => {
    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['child-assignment-requests'] });
      toast.success(t("requestApproved"));
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error(t("errorApprovingRequest"));
    }
  };

  const handleReject = async (request: ChildAssignmentRequest) => {
    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['child-assignment-requests'] });
      toast.success(t("requestRejected"));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(t("errorRejectingRequest"));
    }
  };

  return {
    requests,
    isLoading,
    handleApprove,
    handleReject
  };
};