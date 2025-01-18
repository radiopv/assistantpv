import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SponsoredChildCard } from "./Cards/SponsoredChildCard";
import { AddChildRequestDialog } from "./Dialogs/AddChildRequestDialog";
import { useChildAssignmentRequests } from "../hooks/useChildAssignmentRequests";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SponsoredChildrenGridProps {
  children: any[];
  onAddPhoto: (childId: string) => void;
  onAddTestimonial: (childId: string) => void;
}

export const SponsoredChildrenGrid = ({
  children,
  onAddPhoto,
  onAddTestimonial
}: SponsoredChildrenGridProps) => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { isLoading, requestChildAssignment } = useChildAssignmentRequests(user?.id || "");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mes enfants parrainés</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un enfant
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {children.map((child) => (
          <SponsoredChildCard
            key={child.id}
            child={child}
            onAddPhoto={() => onAddPhoto(child.id)}
            onAddTestimonial={() => onAddTestimonial(child.id)}
          />
        ))}
      </div>

      <AddChildRequestDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={requestChildAssignment}
        isLoading={isLoading}
      />
    </div>
  );
};