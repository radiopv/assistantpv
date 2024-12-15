import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Badge } from "@/components/ui/badge";

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
                  <Card key={child.id} className="cursor-pointer hover:bg-accent">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={child.photo_url || ""} />
                        <AvatarFallback>{child.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{child.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {child.age} ans
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sponsorships?.map((group) => (
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Ajouter un enfant
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un enfant au parrainage</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                      <div className="grid gap-2">
                        {availableChildren?.map((child) => (
                          <Card key={child.id} className="p-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={child.photo_url || ""} />
                                  <AvatarFallback>{child.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{child.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {child.age} ans
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  createSponsorship.mutate({
                                    sponsor_id: group.sponsor.id,
                                    child_id: child.id,
                                  })
                                }
                              >
                                Ajouter
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
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
                              onClick={() => deleteSponsorship.mutate(sponsorship.id)}
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
        ))}
      </div>
    </div>
  );
};

export default SponsorshipManagement;