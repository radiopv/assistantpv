import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X, Check, Edit2, Save } from "lucide-react";
import { toast } from "sonner";

interface SponsorListItemProps {
  sponsor: any;
  onAddChild: (sponsor: any) => void;
  onStatusChange: (sponsorId: string, field: string, value: boolean) => void;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
  onPauseSponsorship?: (sponsorshipId: string) => void;
  onResumeSponsorship?: (sponsorshipId: string) => void;
  onSelect: (sponsorId: string, selected: boolean) => void;
  isSelected: boolean;
  onUpdate: (sponsorId: string, updatedData: any) => void;
}

export const SponsorListItem = ({
  sponsor,
  onAddChild,
  onStatusChange,
  onVerificationChange,
  onPauseSponsorship,
  onResumeSponsorship,
  onSelect,
  isSelected,
  onUpdate
}: SponsorListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSponsor, setEditedSponsor] = useState(sponsor);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedSponsor(sponsor);
  };

  const handleSave = async () => {
    try {
      await onUpdate(sponsor.id, {
        name: editedSponsor.name,
        email: editedSponsor.email,
        phone: editedSponsor.phone,
        city: editedSponsor.city,
        facebook_url: editedSponsor.facebook_url
      });
      setIsEditing(false);
      toast.success("Informations du parrain mises à jour");
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Erreur lors de la mise à jour des informations");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedSponsor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(sponsor.id, checked as boolean)}
          />
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <>
                <Input
                  value={editedSponsor.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nom"
                  className="font-semibold"
                />
                <Input
                  value={editedSponsor.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                  className="text-sm"
                />
                <Input
                  value={editedSponsor.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Téléphone"
                  className="text-sm"
                />
                <Input
                  value={editedSponsor.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Ville"
                  className="text-sm"
                />
                <Input
                  value={editedSponsor.facebook_url}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  placeholder="URL Facebook"
                  className="text-sm"
                />
              </>
            ) : (
              <>
                <h3 className="font-semibold">{sponsor.name}</h3>
                <p className="text-sm text-gray-500">{sponsor.email}</p>
                <p className="text-sm text-gray-500">{sponsor.phone}</p>
                <p className="text-sm text-gray-500">{sponsor.city}</p>
                <p className="text-sm text-gray-500">{sponsor.facebook_url}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-1"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddChild(sponsor)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Ajouter un enfant
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        {sponsor.sponsorships?.map((sponsorship: any) => (
          <div key={sponsorship.id} className="flex justify-between items-center">
            <span>{sponsorship.child?.name}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPauseSponsorship?.(sponsorship.id)}
              >
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResumeSponsorship?.(sponsorship.id)}
              >
                Reprendre
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};