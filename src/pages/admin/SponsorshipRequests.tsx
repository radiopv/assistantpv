import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { Loader2 } from "lucide-react";

const SponsorshipRequests = () => {
  const { toast } = useToast();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select(`
          *,
          child:children (
            name,
            photo_url,
            age,
            city
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (requestId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not found');

      // Check if profile exists, create if it doesn't
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, role: 'admin' }]);

        if (profileError) throw profileError;
      }

      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: requestId,
        admin_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande de parrainage a été approuvée",
      });

      refetch();
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not found');

      // Check if profile exists, create if it doesn't
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, role: 'admin' }]);

        if (profileError) throw profileError;
      }

      const { error } = await supabase.rpc('reject_sponsorship_request', {
        request_id: requestId,
        admin_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La demande de parrainage a été rejetée",
      });

      refetch();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Demandes de parrainage</h1>
      <RequestsList
        requests={requests || []}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default SponsorshipRequests;