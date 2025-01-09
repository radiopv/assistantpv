import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SponsorCardProps {
  sponsor: any;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
  onRemoveChild: (sponsorId: string, childId: string) => void;
  onAddChild: (childId: string) => void;
  availableChildren: any[];
}

export const SponsorCard = ({
  sponsor,
  onVerificationChange,
  onRemoveChild,
  onAddChild,
  availableChildren
}: SponsorCardProps) => {
  const [showAvailableChildren, setShowAvailableChildren] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveChild = async (sponsorId: string, childId: string) => {
    try {
      setIsRemoving(true);
      await onRemoveChild(sponsorId, childId);
      toast.success("Enfant retiré avec succès");
    } catch (error) {
      console.error("Error removing child:", error);
      toast.error("Erreur lors de la suppression de l'enfant");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{sponsor.name}</h3>
            <p className="text-sm text-gray-500">{sponsor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Vérifié</span>
          <Checkbox
            checked={sponsor.is_verified}
            onCheckedChange={(checked) => onVerificationChange(sponsor.id, checked as boolean)}
          />
        </div>
      </div>

      {/* Liste des enfants parrainés */}
      {sponsor.sponsorships?.map((sponsorship: any) => (
        <Card key={sponsorship.id} className="p-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{sponsorship.children.name}</p>
                <p className="text-xs text-gray-500">{sponsorship.children.city}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveChild(sponsor.id, sponsorship.children.id)}
              disabled={isRemoving}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      {/* Bouton pour afficher/masquer la liste des enfants disponibles */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAvailableChildren(!showAvailableChildren)}
        className="mt-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        {showAvailableChildren ? "Masquer les enfants disponibles" : "Ajouter un enfant"}
      </Button>

      {/* Liste des enfants disponibles */}
      {showAvailableChildren && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {availableChildren.map((child) => (
            <Card
              key={child.id}
              className="p-2 cursor-pointer hover:bg-gray-50"
              onClick={() => {
                onAddChild(child.id);
                setShowAvailableChildren(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={child.photo_url} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{child.name}</p>
                    <p className="text-xs text-gray-500">{child.city}</p>
                  </div>
                </div>
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};