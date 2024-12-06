import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { resendClient } from "@/lib/email";
import { EmailForm } from "./EmailForm";

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
        await Promise.all(batch.map(email => 
          resendClient.emails.send({
            from: 'noreply@votredomaine.com',
            to: email,
            subject: subject,
            html: content,
          })
        ));
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