import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChildrenList } from "./ChildrenList";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";

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
      const { data: childrenData, error } = await supabase
        .from("children")
        .select(`
          id,
          name,
          age,
          birth_date,
          city,
          comments,
          created_at,
          description,
          end_date,
          gender,
          photo_url,
          sponsorships:sponsorships(
            id,
            sponsor:sponsors(
              id,
              name
            )
          )
        `)
        .eq("is_sponsored", false)
        .order("name");

      if (error) throw error;
      return childrenData;
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
    <Card className="w-full mb-6">
      <Collapsible open={isOpen} onOpenChange={onClose}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between p-4"
          >
            <span>Ajouter un enfant</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4">
          <ChildrenList
            children={children}
            searchTerm=""
            onSearchChange={() => {}}
            onSelectChild={handleSelectChild}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};