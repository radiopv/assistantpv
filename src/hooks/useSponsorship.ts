import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSponsorship = () => {
  const { toast } = useToast();

  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ['children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsors (
            name,
            email,
            photo_url
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande de parrainage a été approuvée",
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande de parrainage a été rejetée",
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
      });
    }
  };

  const sponsoredChildren = children?.filter(child => child.is_sponsored) || [];
  const availableChildren = children?.filter(child => !child.is_sponsored) || [];
  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];

  return {
    sponsoredChildren,
    availableChildren,
    pendingRequests,
    isLoading: childrenLoading || requestsLoading,
    handleApprove,
    handleReject
  };
};