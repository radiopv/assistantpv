import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/components/Translation/TranslationContext";

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export const NewMessageDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const loadRecipients = async () => {
    const { data: userData } = await supabase
      .from("sponsors")
      .select("role")
      .eq("id", user?.id)
      .single();

    let query = supabase.from("sponsors").select("id, name, role");

    // Filtrer les destinataires en fonction du rôle de l'utilisateur
    if (userData?.role === "sponsor") {
      query = query.in("role", ["admin", "assistant"]);
    } else if (userData?.role === "assistant") {
      query = query.in("role", ["admin", "sponsor"]);
    } else if (userData?.role === "admin") {
      query = query.in("role", ["admin", "assistant", "sponsor"]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading recipients:", error);
      return;
    }

    setRecipients(data || []);
  };

  const handleSubmit = async () => {
    if (!selectedRecipient || !subject || !content) {
      toast({
        variant: "destructive",
        title: t("messages.error"),
        description: t("messages.fill_all_fields"),
      });
      return;
    }

    setLoading(true);

    try {
      const { error: messageError } = await supabase.from("messages").insert({
        recipient_id: selectedRecipient,
        subject,
        content,
        sender_id: user?.id,
      });

      if (messageError) throw messageError;

      toast({
        title: t("messages.success"),
        description: t("messages.sent_success"),
      });

      setOpen(false);
      setSelectedRecipient("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: t("messages.error"),
        description: t("messages.send_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) loadRecipients();
    }}>
      <DialogTrigger asChild>
        <Button>{t("messages.new")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("messages.new_message")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("messages.recipient")}</label>
            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger>
                <SelectValue placeholder={t("messages.select_recipient")} />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    {recipient.name} ({t(`roles.${recipient.role}`)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("messages.subject")}</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("messages.subject_placeholder")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("messages.message")}</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("messages.message_placeholder")}
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("messages.send")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};