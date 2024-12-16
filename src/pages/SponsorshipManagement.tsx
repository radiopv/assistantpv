import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSponsorshipManagement } from "@/hooks/useSponsorshipManagement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { SponsorshipCard } from "@/components/Sponsorship/SponsorshipCard";

const SponsorshipManagement = () => {
  const {
    sponsorships,
    availableChildren,
    isLoading,
    createSponsorship,
    deleteSponsorship,
  } = useSponsorshipManagement();

  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Parrainage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau parrainage</DialogTitle>
              <DialogDescription>
                Sélectionnez un enfant à parrainer
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-4 p-4">
                {availableChildren?.map((child) => (
                  <Card key={child.id} className="cursor-pointer hover:bg-accent p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={child.photo_url || ""} />
                        <AvatarFallback>{child.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {child.age} ans
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sponsorships?.map((group) => (
          <SponsorshipCard
            key={group.sponsor.email}
            group={group}
            onAddChild={(sponsorId) => setSelectedSponsor(sponsorId)}
            onDeleteSponsorship={(sponsorshipId) => 
              deleteSponsorship.mutate(sponsorshipId)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SponsorshipManagement;