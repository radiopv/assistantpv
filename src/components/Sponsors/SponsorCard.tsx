import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Pencil, 
  Album, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Users,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface SponsorCardProps {
  sponsor: any;
  onEdit: (sponsor: any) => void;
  onViewAlbum: (childId: string) => void;
  onStatusChange: (sponsorId: string, field: string, value: boolean) => void;
}

export const SponsorCard = ({ sponsor, onEdit, onViewAlbum, onStatusChange }: SponsorCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const toggleStatus = async (field: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const newValue = !sponsor[field];
      const { error } = await supabase
        .from('sponsors')
        .update({ [field]: newValue })
        .eq('id', sponsor.id);

      if (error) throw error;

      // Call the onStatusChange prop to update the UI immediately
      onStatusChange(sponsor.id, field, newValue);

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    } catch (error) {
      console.error('Error updating sponsor status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{sponsor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4" />
              <span>{sponsor.total_points || 0} points</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(sponsor)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        {sponsor.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{sponsor.email}</span>
          </div>
        )}
        {sponsor.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{sponsor.phone}</span>
          </div>
        )}
        {sponsor.city && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{sponsor.city}</span>
          </div>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="justify-start gap-2" 
          onClick={() => toggleStatus('is_active')}
          disabled={isUpdating}
        >
          {sponsor.is_active ? (
            <ToggleRight className="h-4 w-4 text-green-500" />
          ) : (
            <ToggleLeft className="h-4 w-4 text-gray-500" />
          )}
          {sponsor.is_active ? "Actif" : "Inactif"}
        </Button>

        <Button 
          variant="ghost" 
          className="justify-start gap-2" 
          onClick={() => toggleStatus('is_anonymous')}
          disabled={isUpdating}
        >
          {sponsor.is_anonymous ? (
            <ToggleLeft className="h-4 w-4 text-gray-500" />
          ) : (
            <ToggleRight className="h-4 w-4 text-green-500" />
          )}
          {sponsor.is_anonymous ? "Anonyme" : "Public"}
        </Button>
      </div>

      {/* Sponsorships Section */}
      {sponsor.sponsorships?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Users className="h-4 w-4" />
            <span>Enfants parrainés</span>
          </div>
          <div className="grid gap-2">
            {sponsor.sponsorships.map((sponsorship: any) => (
              sponsorship.child && (
                <div key={sponsorship.child.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sponsorship.child.photo_url} alt={sponsorship.child.name} />
                      <AvatarFallback>{sponsorship.child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{sponsorship.child.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewAlbum(sponsorship.child.id)}
                  >
                    <Album className="h-4 w-4 mr-1" />
                    Album
                  </Button>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="secondary">
          {sponsor.role || "sponsor"}
        </Badge>
      </div>
    </Card>
  );
};