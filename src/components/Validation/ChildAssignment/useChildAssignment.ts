import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TableNames } from "@/integrations/supabase/types/database-tables";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";

export const useChildAssignment = () => {
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
      const { error } = await supabase
        .from('child_assignment_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['child-assignment-requests'] });
      toast.success("Request approved successfully");
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error("Error approving request");
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
      toast.success("Request rejected successfully");
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error("Error rejecting request");
    }
  };

  return {
    requests,
    isLoading,
    handleApprove,
    handleReject
  };
};