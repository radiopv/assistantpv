import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AvailableChildrenList } from "@/components/Sponsorship/AvailableChildrenList";
import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { Loader2, Check, X } from "lucide-react";

interface SponsorshipRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  motivation: string | null;
  facebook_url: string | null;
  status: string;
  created_at: string | null;
  child_id: string | null;
  terms_accepted: boolean;
  updated_at: string | null;
  city?: string | null;
  is_long_term?: boolean | null;
}

const SponsorshipManagement = () => {
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
      return data as SponsorshipRequest[];
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

  if (childrenLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const sponsoredChildren = children?.filter(child => child.is_sponsored) || [];
  const availableChildren = children?.filter(child => !child.is_sponsored) || [];
  const pendingRequests = requests?.filter(req => req.status === 'pending') || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">
            Demandes en attente ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Enfants Disponibles ({availableChildren.length})
          </TabsTrigger>
          <TabsTrigger value="sponsored">
            Enfants Parrainés ({sponsoredChildren.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <Card className="p-4">
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.full_name}</h3>
                      <p className="text-sm text-gray-600">{request.email}</p>
                      <p className="text-sm text-gray-600">{request.city || 'Ville non spécifiée'}</p>
                      <p className="text-sm text-gray-600">
                        {request.is_long_term ? "Parrainage à long terme" : "Parrainage unique"}
                      </p>
                      {request.motivation && (
                        <p className="mt-2 text-gray-700">{request.motivation}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-center text-gray-500">
                  Aucune demande en attente
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <Card className="p-4">
            <AvailableChildrenList children={availableChildren} />
          </Card>
        </TabsContent>

        <TabsContent value="sponsored" className="mt-6">
          <Card className="p-4">
            <SponsoredChildrenList children={sponsoredChildren} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorshipManagement;