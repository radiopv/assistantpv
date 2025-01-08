import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ComposeMessage = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          subject,
          content,
          sender_id: user.id,
          recipient_id: null, // À remplacer par le destinataire sélectionné
          message_type: 'direct'
        });

      if (error) throw error;

      toast.success("Message envoyé avec succès");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Sujet"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Votre message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
        />
      </div>
      <Button type="submit" disabled={isSending}>
        {isSending ? "Envoi en cours..." : "Envoyer"}
      </Button>
    </form>
  );
};