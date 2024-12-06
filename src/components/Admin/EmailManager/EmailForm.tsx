import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EmailFormProps {
  onSend: (subject: string, content: string, sponsorType: "all" | "active" | "pending") => Promise<void>;
  loading: boolean;
  disabled: boolean;
}

const EmailForm = ({ onSend, loading, disabled }: EmailFormProps) => {
  const { t } = useLanguage();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [template, setTemplate] = useState("");
  const [selectedSponsors, setSelectedSponsors] = useState<"all" | "active" | "pending">("all");

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

  const handleSubmit = async () => {
    await onSend(subject, content, selectedSponsors);
  };

  return (
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
        <Select 
          onValueChange={(value: "all" | "active" | "pending") => setSelectedSponsors(value)} 
          value={selectedSponsors}
        >
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
        onClick={handleSubmit} 
        disabled={disabled || loading}
        className="w-full"
      >
        {loading ? t("sendingEmails") : t("sendEmails")}
      </Button>
    </div>
  );
};

export { EmailForm };