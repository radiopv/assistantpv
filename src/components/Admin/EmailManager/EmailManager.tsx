import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmailForm } from "./EmailForm";
import { sendEmail } from "@/api/email";

const EmailManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getSponsorsEmails = async (sponsorType: "all" | "active" | "pending") => {
    try {
      const { data: sponsors, error } = await supabase
        .from('sponsors')
        .select('email')
        .eq('is_active', true)
        .eq(sponsorType === 'pending' ? 'status' : 'is_verified', sponsorType === 'pending' ? 'pending' : true);

      if (error) throw error;
      return sponsors.map(sponsor => sponsor.email);
    } catch (error) {
      console.error('Error fetching sponsor emails:', error);
      throw new Error('Failed to fetch sponsor emails');
    }
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
      console.log('Sending emails to:', emails);

      await sendEmail({
        to: emails,
        subject,
        html: content,
      });

      toast({
        title: t("success"),
        description: t("emailsSentSuccess"),
      });
    } catch (error: any) {
      console.error('Error sending emails:', error);
      toast({
        title: t("error"),
        description: error.message || t("errorSendingEmails"),
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