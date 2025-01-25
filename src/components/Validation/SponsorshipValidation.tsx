import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Check, X } from "lucide-react";

export const SponsorshipValidation = () => {
  const { t } = useLanguage();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    requestId: string | null;
  }>({ isOpen: false, type: 'approve', requestId: null });

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      console.log("Fetching sponsorship requests...");
      const { data: requests, error } = await supabase
        .from('sponsorship_requests')
        .select(`
          *,
          child_id,
          children (
            id,
            name,
            photo_url,
            city
          )
        `)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      console.log("Fetched requests:", requests);
      return requests;
    }
  });

  const handleApprove = async (requestId: string) => {
    try {
      console.log("Starting approval process for request:", requestId);
      
      // Get the request details first
      const { data: request, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select(`
          *,
          child_id,
          children (
            id,
            name
          )
        `)
        .eq('id', requestId)
        .single();

      if (requestError || !request) {
        console.error('Error fetching request details:', requestError);
        toast.error("Erreur lors de la récupération des détails de la demande");
        return;
      }

      console.log("Request details:", request);

      if (!request.child_id) {
        console.error('No child_id found in request');
        toast.error("Erreur: Aucun enfant associé à cette demande");
        return;
      }

      // Call the RPC function to approve the request
      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: requestId,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) {
        console.error('Error in approve_sponsorship_request:', error);
        toast.error("Erreur lors de l'approbation de la demande");
        return;
      }

      console.log("Sponsorship request approved successfully");
      toast.success("Demande approuvée avec succès");
      refetch();
    } catch (error) {
      console.error('Error in handleApprove:', error);
      toast.error("Une erreur est survenue lors de l'approbation");
    }
    setConfirmDialog({ isOpen: false, type: 'approve', requestId: null });
  };

  const handleReject = async (requestId: string) => {
    try {
      console.log("Starting rejection process for request:", requestId);
      
      const { error } = await supabase.rpc('reject_sponsorship_request', {
        request_id: requestId,
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        rejection_reason: "Rejected by admin"
      });

      if (error) {
        console.error('Error in reject_sponsorship_request:', error);
        toast.error("Erreur lors du rejet de la demande");
        return;
      }

      console.log("Sponsorship request rejected successfully");
      toast.success("Demande rejetée avec succès");
      refetch();
    } catch (error) {
      console.error('Error in handleReject:', error);
      toast.error("Une erreur est survenue lors du rejet");
    }
    setConfirmDialog({ isOpen: false, type: 'reject', requestId: null });
  };

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{request.full_name}</h3>
              <p className="text-sm text-gray-500">{request.email}</p>
              <p className="text-sm text-gray-500">{request.city}</p>
              <p className="text-sm text-gray-500">
                Date de la demande: {new Date(request.created_at).toLocaleDateString()}
              </p>
              {request.children && (
                <div className="mt-2">
                  <p className="font-medium">Information sur l'enfant:</p>
                  <p className="text-sm">{request.children.name}</p>
                  <p className="text-sm">{request.children.city}</p>
                </div>
              )}
              {request.motivation && (
                <div className="mt-2">
                  <p className="font-medium">Motivation:</p>
                  <p className="text-sm">{request.motivation}</p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm">
                  Compte créé: {request.is_account_created ? "Oui" : "Non"}
                </p>
                <p className="text-sm">
                  Compte approuvé: {request.is_account_approved ? "Oui" : "Non"}
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => setConfirmDialog({
                  isOpen: true,
                  type: 'approve',
                  requestId: request.id
                })}
              >
                <Check className="w-4 h-4 mr-1" />
                {t("approve")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => setConfirmDialog({
                  isOpen: true,
                  type: 'reject',
                  requestId: request.id
                })}
              >
                <X className="w-4 h-4 mr-1" />
                {t("reject")}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {!requests?.length && (
        <p className="text-center text-gray-500">Aucune demande en attente</p>
      )}

      <AlertDialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(isOpen) => !isOpen && setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'approve' ? t("confirmApproval") : t("confirmRejection")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'approve' 
                ? t("approvalConfirmationMessage")
                : t("rejectionConfirmationMessage")
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirmDialog.requestId) return;
                if (confirmDialog.type === 'approve') {
                  handleApprove(confirmDialog.requestId);
                } else {
                  handleReject(confirmDialog.requestId);
                }
              }}
            >
              {confirmDialog.type === 'approve' ? t("approve") : t("reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};