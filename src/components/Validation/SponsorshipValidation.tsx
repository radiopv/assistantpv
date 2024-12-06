import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Resend } from 'resend';

const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
let resend: Resend | null = null;

// Only initialize Resend if we have an API key
if (resendApiKey) {
  resend = new Resend(resendApiKey);
} else {
  console.error('Missing Resend API key. Please add VITE_RESEND_API_KEY to your .env file');
}

export const SponsorshipValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    }
  });

  const sendEmail = async (recipientEmail: string, isApproved: boolean) => {
    if (!resend) {
      console.error('Resend client not initialized - missing API key');
      throw new Error('Email service not configured');
    }

    try {
      const subject = isApproved ? 
        "Votre demande de parrainage a été approuvée" : 
        "Votre demande de parrainage a été refusée";
      
      const content = isApproved ?
        "Nous sommes heureux de vous informer que votre demande de parrainage a été approuvée. Vous pouvez maintenant accéder à votre espace parrain." :
        "Nous sommes désolés de vous informer que votre demande de parrainage a été refusée. N'hésitez pas à nous contacter pour plus d'informations.";

      const data = await resend.emails.send({
        from: 'Lovable <onboarding@resend.dev>',
        to: recipientEmail,
        subject: subject,
        html: `<p>${content}</p>`
      });

      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const sendNotificationMessage = async (recipientEmail: string, isApproved: boolean) => {
    try {
      // First, get the recipient's ID from their email
      const { data: recipientData, error: recipientError } = await supabase
        .from('sponsors')
        .select('id')
        .eq('email', recipientEmail)
        .single();

      if (recipientError) throw recipientError;

      // Send the notification message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: recipientData.id,
          subject: isApproved ? 
            "Votre demande de parrainage a été approuvée" : 
            "Votre demande de parrainage a été refusée",
          content: isApproved ?
            "Nous sommes heureux de vous informer que votre demande de parrainage a été approuvée. Vous pouvez maintenant accéder à votre espace parrain." :
            "Nous sommes désolés de vous informer que votre demande de parrainage a été refusée. N'hésitez pas à nous contacter pour plus d'informations.",
          is_read: false
        });

      if (messageError) throw messageError;
    } catch (error) {
      console.error('Error sending notification message:', error);
      throw error;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // Get the request details to get the sponsor's email
      const { data: request, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('email')
        .eq('id', id)
        .single();

      if (requestError) throw requestError;

      // Update the request status
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      try {
        // Send notification message and email
        await Promise.all([
          sendNotificationMessage(request.email, true),
          sendEmail(request.email, true)
        ]);
      } catch (emailError) {
        console.error('Error sending notifications:', emailError);
        // Continue with the approval process even if notifications fail
      }

      // Invalidate the query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['sponsorship-requests'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestApproved"),
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingRequest"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Get the request details to get the sponsor's email
      const { data: request, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('email')
        .eq('id', id)
        .single();

      if (requestError) throw requestError;

      // Update the request status
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      try {
        // Send notification message and email
        await Promise.all([
          sendNotificationMessage(request.email, false),
          sendEmail(request.email, false)
        ]);
      } catch (emailError) {
        console.error('Error sending notifications:', emailError);
        // Continue with the rejection process even if notifications fail
      }

      // Invalidate the query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['sponsorship-requests'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestRejected"),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingRequest"),
      });
    }
  };

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  return (
    <RequestsList
      requests={requests || []}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};