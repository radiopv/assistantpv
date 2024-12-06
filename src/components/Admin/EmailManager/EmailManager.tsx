import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Resend } from 'resend';

const EmailManager = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSponsors, setSelectedSponsors] = useState<"all" | "active" | "pending">("all");
  const [resendClient, setResendClient] = useState<Resend | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      console.error('Missing Resend API key. Please add VITE_RESEND_API_KEY to your .env file');
      toast({
        title: t("error"),
        description: "Missing Resend API key configuration",
        variant: "destructive",
      });
      return;
    }
    setResendClient(new Resend(apiKey));
  }, []);

  const emailTemplates = {
    welcome: {
      subject: t("welcomeEmailSubject"),
      content: t("welcomeEmailContent"),
    },
    update: {
      subject: t("updateEmailSubject"),
      content: t("updateEmailContent"),
    },
    reminder: {
      subject: t("reminderEmailSubject"),
      content: t("reminderEmailContent"),
    },
  };

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    if (value in emailTemplates) {
      const selectedTemplate = emailTemplates[value as keyof typeof emailTemplates];
      setSubject(selectedTemplate.subject);
      setContent(selectedTemplate.content);
    }
  };

  const getSponsorsEmails = async () => {
    let query = supabase.from('sponsors').select('email');
    
    switch (selectedSponsors) {
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

  const handleSendEmails = async () => {
    if (!resendClient) {
      toast({
        title: t("error"),
        description: "Email service not configured",
        variant: "destructive",
      });
      return;
    }

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
      const emails = await getSponsorsEmails();
      
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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("selectTemplate")}
          </label>
          <Select onValueChange={handleTemplateChange} value={template}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectTemplate")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">{t("welcomeTemplate")}</SelectItem>
              <SelectItem value="update">{t("updateTemplate")}</SelectItem>
              <SelectItem value="reminder">{t("reminderTemplate")}</SelectItem>
              <SelectItem value="custom">{t("customTemplate")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("selectRecipients")}
          </label>
          <Select onValueChange={(value: "all" | "active" | "pending") => setSelectedSponsors(value)} value={selectedSponsors}>
            <SelectTrigger>
              <SelectValue placeholder={t("selectRecipients")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSponsors")}</SelectItem>
              <SelectItem value="active">{t("activeSponsors")}</SelectItem>
              <SelectItem value="pending">{t("pendingSponsors")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("emailSubject")}
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("enterEmailSubject")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("emailContent")}
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("enterEmailContent")}
            className="min-h-[200px]"
          />
        </div>

        <Button 
          onClick={handleSendEmails} 
          disabled={loading || !resendClient}
          className="w-full"
        >
          {loading ? t("sendingEmails") : t("sendEmails")}
        </Button>
      </div>
    </Card>
  );
};

export { EmailManager };