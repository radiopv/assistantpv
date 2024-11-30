import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditSponsorDialog } from "./EditSponsorDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors, isLoading }: SponsorsListProps) => {
  const [editingSponsor, setEditingSponsor] = useState<any>(null);

  const handleRemoveSponsorship = async (sponsorshipId: string, childName: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'ended',
          termination_date: new Date().toISOString(),
          termination_reason: 'Parrain inactif',
          termination_comment: 'Parrainage terminé par un administrateur'
        })
        .eq('id', sponsorshipId);

      if (error) throw error;

      toast.success(`Le parrainage de ${childName} a été terminé`);
    } catch (error) {
      console.error('Erreur lors de la suppression du parrainage:', error);
      toast.error("Une erreur est survenue lors de la suppression du parrainage");
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
                  <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{sponsor.name}</h3>
                  <p className="text-sm text-gray-600">{sponsor.email}</p>
                  <p className="text-sm text-gray-600">{sponsor.city}</p>
                  {sponsor.phone && (
                    <p className="text-sm text-gray-600">{sponsor.phone}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingSponsor(sponsor)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                  {sponsor.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Badge variant="outline">{sponsor.role}</Badge>
                {sponsor.is_anonymous && (
                  <Badge variant="secondary">Anonyme</Badge>
                )}
              </div>
            </div>

            {sponsor.sponsorships?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Enfants parrainés:</p>
                <div className="mt-1">
                  {sponsor.sponsorships.map((sponsorship: any) => (
                    sponsorship.child && (
                      <div key={sponsorship.child.id} className="flex items-center justify-between text-sm text-gray-600">
                        <span>{sponsorship.child.name}</span>
                        {!sponsor.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleRemoveSponsorship(sponsorship.id, sponsorship.child.name)}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <EditSponsorDialog
        sponsor={editingSponsor}
        open={!!editingSponsor}
        onClose={() => setEditingSponsor(null)}
      />
    </>
  );
};