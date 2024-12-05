import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useToast } from "@/components/ui/use-toast";
import type { SponsorshipRequest } from "@/integrations/supabase/types/sponsorship";

const SponsorsManagement = () => {
  const { toast } = useToast();

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      return data as SponsorshipRequest[];
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'approved' })
        .eq('id', id);

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

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

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

  if (requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const pendingRequests = requests || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            Demandes en attente ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Parrainages actifs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <RequestsList
            requests={pendingRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <Card className="p-4">
            <p className="text-center text-gray-500">
              La gestion des parrainages actifs sera développée prochainement.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsManagement;