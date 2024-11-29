import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditSponsorDialog } from "./EditSponsorDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors, isLoading }: SponsorsListProps) => {
  const [editingSponsor, setEditingSponsor] = useState<any>(null);

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
                      <span key={sponsorship.child.id} className="text-sm text-gray-600 block">
                        {sponsorship.child.name}
                      </span>
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