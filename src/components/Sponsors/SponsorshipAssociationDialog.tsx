import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SponsorChildrenList } from "./SponsorshipManagement/SponsorChildrenList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SponsorshipAssociationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorId: string;
}

export const SponsorshipAssociationDialog = ({
  isOpen,
  onClose,
  sponsorId
}: SponsorshipAssociationDialogProps) => {
  const { data: sponsorships = [] } = useQuery({
    queryKey: ["sponsorships", sponsorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          *,
          children (
            id,
            name,
            photo_url,
            city,
            age
          )
        `)
        .eq("sponsor_id", sponsorId)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const { data: availableChildren = [] } = useQuery({
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

  const handleAddChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: "active",
        });

      if (error) throw error;

      // Refresh queries
      await Promise.all([
        supabase.from("children").update({ is_sponsored: true }).eq("id", childId),
      ]);
    } catch (error) {
      console.error("Error adding child:", error);
      throw error;
    }
  };

  const handleRemoveChild = async (sponsorshipId: string) => {
    try {
      const sponsorship = sponsorships.find(s => s.id === sponsorshipId);
      if (!sponsorship) return;

      const { error } = await supabase
        .from("sponsorships")
        .delete()
        .eq("id", sponsorshipId);

      if (error) throw error;

      // Update child status
      await supabase
        .from("children")
        .update({ is_sponsored: false })
        .eq("id", sponsorship.child_id);
    } catch (error) {
      console.error("Error removing child:", error);
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gérer les parrainages</DialogTitle>
        </DialogHeader>
        <SponsorChildrenList
          sponsorships={sponsorships}
          availableChildren={availableChildren}
          onAddChild={handleAddChild}
          onRemoveChild={handleRemoveChild}
        />
      </DialogContent>
    </Dialog>
  );
};