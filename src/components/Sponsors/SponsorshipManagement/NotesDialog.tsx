import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
}

export const NotesDialog = ({
  isOpen,
  onClose,
  sponsorshipId,
}: NotesDialogProps) => {
  const [newNote, setNewNote] = useState("");

  const { data: notes, refetch } = useQuery({
    queryKey: ["sponsorship-notes", sponsorshipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_notes")
        .select("*")
        .eq("sponsorship_id", sponsorshipId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("sponsorship_notes").insert({
        sponsorship_id: sponsorshipId,
        content: newNote,
        created_by: user.user?.id,
      });

      if (error) throw error;

      toast.success("Note ajoutée avec succès");
      setNewNote("");
      refetch();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Erreur lors de l'ajout de la note");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes de parrainage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ajouter une nouvelle note..."
            className="min-h-[100px]"
          />
          <Button type="submit">Ajouter</Button>
        </form>
        <div className="space-y-4 mt-4">
          {notes?.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-50 rounded-lg space-y-2"
            >
              <p>{note.content}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(note.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};