import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ChildAssignmentRequest } from "@/integrations/supabase/types/child-assignment-requests";

export const ChildAssignmentValidation = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const translations = {
    fr: {
      loading: "Chargement...",
      success: "Succès",
      error: "Erreur",
      childRequestApproved: "Demande approuvée avec succès",
      childRequestRejected: "Demande rejetée avec succès",
      errorApprovingChildRequest: "Erreur lors de l'approbation de la demande",
      errorRejectingChildRequest: "Erreur lors du rejet de la demande",
      approve: "Approuver",
      reject: "Rejeter",
      noChildRequestsPending: "Aucune demande en attente",
      requestDate: "Date de la demande",
      childName: "Enfant",
      sponsorName: "Parrain potentiel",
      sponsorEmail: "Email",
      city: "Ville",
      requestType: "Type de demande",
      addRequest: "Ajout d'enfant",
      removeRequest: "Retrait d'enfant",
      reason: "Raison"
    },
    es: {
      loading: "Cargando...",
      success: "Éxito",
      error: "Error",
      childRequestApproved: "Solicitud aprobada con éxito",
      childRequestRejected: "Solicitud rechazada con éxito",
      errorApprovingChildRequest: "Error al aprobar la solicitud",
      errorRejectingChildRequest: "Error al rechazar la solicitud",
      approve: "Aprobar",
      reject: "Rechazar",
      noChildRequestsPending: "No hay solicitudes pendientes",
      requestDate: "Fecha de solicitud",
      childName: "Niño",
      sponsorName: "Padrino potencial",
      sponsorEmail: "Correo electrónico",
      city: "Ciudad",
      requestType: "Tipo de solicitud",
      addRequest: "Agregar niño",
      removeRequest: "Retirar niño",
      reason: "Razón"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: requests, isLoading } = useQuery({
    queryKey: ['child-assignment-requests'],
    queryFn: async () => {
      console.log("Fetching requests...");
      const { data, error } = await supabase
        .from('child_assignment_requests')
        .select(`
          *,
          children (
            name
          ),
          sponsors (
            name,
            email,
            city
          )
        `)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      
      console.log("Fetched requests:", data);
      return data;
    }
  });

  const handleApprove = async (request: any) => {
    try {
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: t.success,
        description: t.childRequestApproved
      });

      queryClient.invalidateQueries({ 
        queryKey: ['child-assignment-requests']
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: t.errorApprovingChildRequest
      });
    }
  };

  const handleReject = async (request: any) => {
    try {
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      toast({
        title: t.success,
        description: t.childRequestRejected
      });

      queryClient.invalidateQueries({ 
        queryKey: ['child-assignment-requests']
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t.error,
        description: t.errorRejectingChildRequest
      });
    }
  };

  if (isLoading) {
    return <p className="text-center">{t.loading}</p>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="font-semibold">
                {request.type === 'add' ? t.addRequest : t.removeRequest}
              </h3>
              <p className="text-sm text-gray-500">{t.childName}: {request.children?.name}</p>
              <p className="text-sm text-gray-500">{t.sponsorName}: {request.sponsors?.name}</p>
              <p className="text-sm text-gray-500">{t.sponsorEmail}: {request.sponsors?.email}</p>
              <p className="text-sm text-gray-500">{t.city}: {request.sponsors?.city}</p>
              {request.notes && (
                <p className="text-sm text-gray-500">
                  {t.reason}: {request.notes}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {t.requestDate}: {new Date(request.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleApprove(request)}
              >
                <Check className="w-4 h-4 mr-1" />
                {t.approve}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReject(request)}
              >
                <X className="w-4 h-4 mr-1" />
                {t.reject}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {!requests?.length && (
        <p className="text-center text-gray-500">
          {t.noChildRequestsPending}
        </p>
      )}
    </div>
  );
};