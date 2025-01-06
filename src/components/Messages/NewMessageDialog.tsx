import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Users } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  role: string;
}

export const NewMessageDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRecipients = async () => {
    try {
      const { data: userData } = await supabase
        .from("sponsors")
        .select("id, name, role")
        .eq("id", user?.id)
        .single();

      let query = supabase.from("sponsors").select("id, name, role");

      // Si c'est un parrain, il ne peut envoyer qu'à Vitia
      if (userData?.role === "sponsor") {
        query = query.eq("name", "Vitia");
      } 
      // Si c'est Vitia, elle ne peut voir que les parrains qui lui ont écrit
      else if (userData?.name === "Vitia") {
        const { data: senderIds } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("recipient_id", user?.id);

        const uniqueSenderIds = [...new Set(senderIds?.map(msg => msg.sender_id))];
        
        if (uniqueSenderIds.length > 0) {
          query = query.in("id", uniqueSenderIds).eq("role", "sponsor");
        } else {
          setRecipients([]);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading recipients:", error);
        return;
      }

      setRecipients(data || []);
    } catch (error) {
      console.error("Error in loadRecipients:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les destinataires",
      });
    }
  };

  const handleSubmit = async () => {
    if (!recipients[0]?.id || !subject || !content) {
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
        recipient_id: recipients[0].id,
        subject,
        content,
        sender_id: user?.id,
      });

      if (messageError) throw messageError;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });

      setOpen(false);
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
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Nouveau message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {recipients.length > 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Destinataire
              </label>
              <div className="p-2 border rounded">
                {recipients[0].name}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Aucun destinataire disponible
            </div>
          )}
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
            <Button onClick={handleSubmit} disabled={loading || recipients.length === 0} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};