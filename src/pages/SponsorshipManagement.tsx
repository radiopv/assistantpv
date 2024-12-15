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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSponsorshipManagement } from "@/hooks/useSponsorshipManagement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, Trash2 } from "lucide-react";
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

const SponsorshipManagement = () => {
  const {
    sponsorships,
    availableChildren,
    isLoading,
    createSponsorship,
    deleteSponsorship,
  } = useSponsorshipManagement();

  const [selectedSponsorship, setSelectedSponsorship] = useState<string | null>(
    null
  );

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
            </DialogHeader>
            <div className="grid gap-4">
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
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {sponsorships?.map((sponsorship) => (
          <Card key={sponsorship.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={sponsorship.sponsors?.photo_url || ""}
                      alt={sponsorship.sponsors?.name}
                    />
                    <AvatarFallback>
                      {sponsorship.sponsors?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {sponsorship.sponsors?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {sponsorship.sponsors?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
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
                          onClick={() => {
                            if (sponsorship.id) {
                              deleteSponsorship.mutate(sponsorship.id);
                            }
                          }}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Enfant parrainé :</h4>
                {sponsorship.children && (
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={sponsorship.children.photo_url || ""}
                        alt={sponsorship.children.name}
                      />
                      <AvatarFallback>
                        {sponsorship.children.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {sponsorship.children.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sponsorship.children.age} ans
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SponsorshipManagement;