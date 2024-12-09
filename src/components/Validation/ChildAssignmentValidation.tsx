import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { sendEmail } from "@/api/email";
import { ChildAssignmentRequest } from "./ChildAssignment/types";

export const ChildAssignmentValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
      if (!request.requester_email) {
        throw new Error("Email du demandeur manquant");
      }

      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'approved' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      await sendEmail({
        from: 'noreply@lovable.dev',
        to: [request.requester_email],
        subject: t("childRequestApprovedSubject"),
        html: t("childRequestApprovedContent", { name: request.name })
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
      const { error: updateError } = await supabase
        .from('child_assignment_requests')
        .update({ status: 'rejected' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      await sendEmail({
        from: 'noreply@lovable.dev',
        to: [request.requester_email],
        subject: t("childRequestRejectedSubject"),
        html: t("childRequestRejectedContent", { name: request.name })
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

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{request.name}</h3>
              <p className="text-sm text-gray-500">{request.requester_email}</p>
              <p className="text-sm text-gray-500">
                {new Date(request.created_at || '').toLocaleDateString()}
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
                {t("approve")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReject(request)}
              >
                <X className="w-4 h-4 mr-1" />
                {t("reject")}
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {!requests?.length && (
        <p className="text-center text-gray-500">
          {t("noChildRequestsPending")}
        </p>
      )}
    </div>
  );
};