import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailForm } from "./EmailForm";
import { sendEmail } from "@/api/email";

const EmailManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getSponsorsEmails = async (sponsorType: "all" | "active" | "pending") => {
    let query = supabase.from('sponsors').select('email');
    
    switch (sponsorType) {
      case "active":
        query = query.eq('status', 'active');
        break;
      case "pending":
        query = query.eq('status', 'pending');
        break;
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching sponsors:', error);
      return [];
    }
    return data.map(sponsor => sponsor.email);
  };

  const handleSendEmails = async (subject: string, content: string, sponsorType: "all" | "active" | "pending") => {
    if (!subject || !content) {
      toast({
        title: t("error"),
        description: t("emailFieldsRequired"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const emails = await getSponsorsEmails(sponsorType);
      
      // Send emails in batches of 10
      const batchSize = 10;
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const emailRequests = batch.map(email => 
          sendEmail({
            from: 'noreply@votredomaine.com',
            to: [email],
            subject: subject,
            html: content,
          })
        );

        const results = await Promise.all(emailRequests);
        
        // Check for any errors in the batch
        const errors = results.filter(result => !result.success);
        if (errors.length > 0) {
          console.error('Errors sending emails:', errors);
          throw new Error('Some emails failed to send');
        }
      }

      toast({
        title: t("success"),
        description: t("emailsSentSuccess"),
      });
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: t("error"),
        description: t("errorSendingEmails"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{t("emailManager")}</h2>
      <EmailForm 
        onSend={handleSendEmails}
        loading={loading}
        disabled={false}
      />
    </Card>
  );
};

export { EmailManager };