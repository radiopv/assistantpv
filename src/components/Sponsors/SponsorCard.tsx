import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Eye } from "lucide-react";

interface SponsorCardProps {
  sponsor: any;
  onEdit: (sponsor: any) => void;
  onViewAlbum: (childId: string) => void;
  onStatusChange: (sponsorId: string, field: string, value: boolean) => void;
}

export const SponsorCard = ({ 
  sponsor, 
  onEdit, 
  onViewAlbum,
  onStatusChange 
}: SponsorCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
          <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{sponsor.name}</h3>
          <p className="text-sm text-gray-500">{sponsor.email}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onEdit(sponsor)}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Statut</span>
          <Switch
            checked={sponsor.is_active}
            onCheckedChange={(checked) => onStatusChange(sponsor.id, 'is_active', checked)}
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Enfants parrainés</h4>
          {sponsor.sponsorships?.length > 0 ? (
            <div className="grid gap-2">
              {sponsor.sponsorships.map((sponsorship: any) => (
                sponsorship.children && (
                  <div key={sponsorship.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
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
                      size="icon"
                      onClick={() => onViewAlbum(sponsorship.children.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun enfant parrainé</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">Ville</p>
            <p className="text-gray-500">{sponsor.city || 'Non spécifié'}</p>
          </div>
          <div>
            <p className="font-medium">Téléphone</p>
            <p className="text-gray-500">{sponsor.phone || 'Non spécifié'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};