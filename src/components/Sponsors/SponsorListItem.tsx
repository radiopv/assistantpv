import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";

interface SponsorListItemProps {
  sponsor: any;
  onAddChild: (sponsor: any) => void;
  onStatusChange: (sponsorId: string, field: string, value: boolean) => void;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
}

export const SponsorListItem = ({
  sponsor,
  onAddChild,
  onStatusChange,
  onVerificationChange
}: SponsorListItemProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{sponsor.name}</h3>
            <p className="text-sm text-gray-500">{sponsor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Vérifié</span>
            <Checkbox
              checked={sponsor.is_verified}
              onCheckedChange={(checked) => onVerificationChange(sponsor.id, checked as boolean)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Statut</span>
            <Switch
              checked={sponsor.is_active}
              onCheckedChange={(checked) => onStatusChange(sponsor.id, 'is_active', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onAddChild(sponsor)}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un enfant
        </Button>
      </div>
    </Card>
  );
};