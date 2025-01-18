import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChildrenList } from "./ChildrenList";

interface AssignSponsorDialogProps {
  sponsorId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignSponsorDialog = ({
  sponsorId,
  isOpen,
  onClose
}: AssignSponsorDialogProps) => {
  const { data: children = [], isLoading } = useQuery({
    queryKey: ["available-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("is_sponsored", false)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleSelectChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: "active",
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update child status
      const { error: updateError } = await supabase
        .from("children")
        .update({ is_sponsored: true })
        .eq("id", childId);

      if (updateError) throw updateError;

      toast.success("Enfant ajouté avec succès");
      onClose();
    } catch (error) {
      console.error("Error assigning child:", error);
      toast.error("Erreur lors de l'ajout de l'enfant");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sélectionner un enfant</DialogTitle>
        </DialogHeader>
        <ChildrenList
          children={children}
          searchTerm=""
          onSearchChange={() => {}}
          onSelectChild={handleSelectChild}
        />
      </DialogContent>
    </Dialog>
  );
}