import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
}

export const NotesDialog = ({ isOpen, onClose, sponsorshipId }: NotesDialogProps) => {
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
    enabled: isOpen && !!sponsorshipId,
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase
        .from("sponsorship_notes")
        .insert([
          {
            sponsorship_id: sponsorshipId,
            content: newNote,
            created_by: (await supabase.auth.getUser()).data.user?.id,
          },
        ]);

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
          <DialogTitle>Notes du parrainage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ajouter une nouvelle note..."
              className="min-h-[100px]"
            />
            <Button onClick={handleAddNote} className="mt-2">
              Ajouter
            </Button>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {notes?.map((note) => (
              <div key={note.id} className="border-b pb-2">
                <p className="whitespace-pre-wrap">{note.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(note.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};