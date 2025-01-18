import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";
import { AddChildRequestDialog } from "../Dialogs/AddChildRequestDialog";
import { RemoveChildRequestDialog } from "../Dialogs/RemoveChildRequestDialog";
import { useChildAssignmentRequests } from "../../hooks/useChildAssignmentRequests";
import { useAuth } from "@/components/Auth/AuthProvider";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
    city: string | null;
    birth_date: string;
    description: string | null;
    story: string | null;
    needs: any;
    age: number;
  };
  sponsorshipId?: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({
  child,
  sponsorshipId,
  onAddPhoto,
  onAddTestimonial
}: SponsoredChildCardProps) => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { isLoading, requestChildAssignment, requestChildRemoval } = useChildAssignmentRequests(user?.id || "");

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={child.photo_url || ""} alt={child.name} />
              <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{child.name}</h4>
              <p className="text-sm text-gray-500">{child.city}</p>
              {child.age && (
                <p className="text-sm text-gray-500">{child.age} ans</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRemoveDialog(true)}
            >
              Demander le retrait
            </Button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={onAddPhoto}>
            Ajouter une photo
          </Button>
          <Button variant="outline" size="sm" onClick={onAddTestimonial}>
            Ajouter un témoignage
          </Button>
        </div>
      </CardContent>

      <RemoveChildRequestDialog
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onSubmit={async (notes) => {
          await requestChildRemoval(child.id, notes);
        }}
        isLoading={isLoading}
        childName={child.name}
      />
    </Card>
  );
};
