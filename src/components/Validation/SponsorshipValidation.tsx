import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
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

export const SponsorshipValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    requestId: string | null;
  }>({ isOpen: false, type: 'approve', requestId: null });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      console.log("Fetching sponsorship requests...");
      const { data: requests, error } = await supabase
        .from('sponsorship_requests')
        .select(`
          *,
          children (
            name,
            photo_url,
            age,
            city,
            needs
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

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
      if (!user?.id) {
        console.error("No admin ID found in auth context");
        throw new Error('No admin ID found');
      }

      // Récupérer d'abord la demande pour vérifier le child_id
      const { data: request, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError || !request) {
        console.error('Error fetching request:', requestError);
        throw new Error('Could not fetch request details');
      }

      if (!request.child_id) {
        console.error('No child_id found in request');
        throw new Error('No child_id associated with this request');
      }

      console.log("Request details:", request);

      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: requestId,
        admin_id: user.id
      });

      if (error) {
        console.error('Error in RPC call:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ['sponsorship-requests'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestApproved"),
      });
    } catch (error: any) {
      console.error('Error in handleApprove:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingRequest"),
      });
    }
    setConfirmDialog({ isOpen: false, type: 'approve', requestId: null });
  };

  const handleReject = async (requestId: string) => {
    try {
      console.log("Starting rejection process for request:", requestId);
      if (!user?.id) {
        console.error("No admin ID found in auth context");
        throw new Error('No admin ID found');
      }

      // Get the sponsor_id from the request before rejecting it
      const { data: request } = await supabase
        .from('sponsorship_requests')
        .select('sponsor_id')
        .eq('id', requestId)
        .single();

      if (!request?.sponsor_id) {
        throw new Error('No sponsor found for this request');
      }

      const { error: rejectionError } = await supabase.rpc('reject_sponsorship_request', {
        request_id: requestId,
        admin_id: user.id,
        rejection_reason: "Rejected by admin"
      });

      if (rejectionError) {
        console.error('RPC Error:', rejectionError);
        throw rejectionError;
      }

      // Create notification for the sponsor
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          recipient_id: request.sponsor_id,
          type: 'sponsorship_rejected',
          title: 'Demande de parrainage refusée',
          content: 'Votre demande de parrainage a été refusée.',
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error('Notification Error:', notificationError);
        throw notificationError;
      }

      await queryClient.invalidateQueries({ queryKey: ['sponsorship-requests'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestRejected"),
      });
    } catch (error: any) {
      console.error('Error in handleReject:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingRequest"),
      });
    }
    setConfirmDialog({ isOpen: false, type: 'reject', requestId: null });
  };

  if (isLoading) {
    return <div className="text-center">{t("loading")}</div>;
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
                {t("requestDate")}: {new Date(request.created_at).toLocaleDateString()}
              </p>
              {request.children && (
                <div className="mt-2">
                  <p className="font-medium">{t("childInfo")}:</p>
                  <p className="text-sm">{request.children.name}, {request.children.age} {t("years")}</p>
                  <p className="text-sm">{request.children.city}</p>
                </div>
              )}
              {request.motivation && (
                <div className="mt-2">
                  <p className="font-medium">{t("motivation")}:</p>
                  <p className="text-sm">{request.motivation}</p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm">
                  {t("accountStatus")}: {request.is_account_created ? t("created") : t("pending")}
                </p>
                <p className="text-sm">
                  {t("approvalStatus")}: {request.is_account_approved ? t("approved") : t("pending")}
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
        <p className="text-center text-gray-500">{t("noRequestsPending")}</p>
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