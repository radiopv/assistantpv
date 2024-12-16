import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { Trash2, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SponsorshipCardProps {
  group: GroupedSponsorship;
  onAddChild: (sponsorId: string) => void;
  onDeleteSponsorship: (sponsorshipId: string) => void;
}

export const SponsorshipCard = ({
  group,
  onAddChild,
  onDeleteSponsorship,
}: SponsorshipCardProps) => {
  return (
    <Card key={group.sponsor.email}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={group.sponsor.photo_url || ""}
                alt={group.sponsor.name}
              />
              <AvatarFallback>
                {group.sponsor.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {group.sponsor.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {group.sponsor.email}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddChild(group.sponsor.id)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un enfant
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="font-medium text-sm text-muted-foreground">
            Enfants parrainés ({group.sponsorships.length})
          </div>
          <div className="grid gap-2">
            {group.sponsorships.map((sponsorship) => (
              <div
                key={sponsorship.id}
                className="flex items-center justify-between bg-muted/50 p-2 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={sponsorship.child.photo_url || ""}
                      alt={sponsorship.child.name}
                    />
                    <AvatarFallback>
                      {sponsorship.child.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {sponsorship.child.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sponsorship.child.age} ans
                    </p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Supprimer le parrainage
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce parrainage ? Cette
                        action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteSponsorship(sponsorship.id)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};