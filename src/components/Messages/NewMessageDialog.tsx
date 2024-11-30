import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Templates } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  role: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export const NewMessageDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRecipients = async () => {
    const { data: userData } = await supabase
      .from("sponsors")
      .select("role")
      .eq("id", user?.id)
      .single();

    let query = supabase.from("sponsors").select("id, name, role");

    if (userData?.role === "sponsor") {
      query = query.in("role", ["admin", "assistant"]);
    } else if (userData?.role === "assistant") {
      query = query.in("role", ["admin", "sponsor"]);
    } else if (userData?.role === "admin") {
      query = query.in("role", ["admin", "assistant", "sponsor"]);
    }

    const { data } = await query;
    setRecipients(data || []);

    // Load message templates
    const { data: templateData } = await supabase
      .from("message_templates")
      .select("*")
      .or(`is_global.eq.true,created_by.eq.${user?.id}`);
    
    setTemplates(templateData || []);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRecipient || !subject || !content) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
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
        is_read: false,
        is_starred: false,
        is_archived: false,
      });

      if (messageError) throw messageError;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });

      setOpen(false);
      setSelectedRecipient("");
      setSelectedTemplate("");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
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
        <Button>Nouveau message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destinataire</label>
            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un destinataire" />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    {recipient.name} ({recipient.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modèle de message</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sujet</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet du message"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Votre message"
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};