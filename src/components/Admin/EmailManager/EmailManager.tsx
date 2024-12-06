import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmailForm } from "./EmailForm";
import emailjs from '@emailjs/browser';

const EmailManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getSponsorsEmails = async (sponsorType: "all" | "active" | "pending") => {
    // Simulation des emails pour test
    return ["test@example.com"];
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
      
      // Configuration EmailJS
      const templateParams = {
        to_email: emails.join(', '),
        subject: subject,
        message: content,
        from_name: 'Your Organization'
      };

      console.log('EmailJS params:', templateParams);
      
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS response:', response);

      if (response.status === 200) {
        toast({
          title: t("success"),
          description: t("emailsSentSuccess"),
        });
      } else {
        throw new Error('Failed to send email');
      }
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