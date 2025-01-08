import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface SponsorChildrenListProps {
  sponsorships: any[];
  availableChildren: any[];
  onAddChild: (childId: string) => void;
  onRemoveChild: (sponsorshipId: string) => void;
}

export const SponsorChildrenList = ({
  sponsorships,
  availableChildren,
  onAddChild,
  onRemoveChild
}: SponsorChildrenListProps) => {
  // Créer un Set des IDs des enfants déjà parrainés pour une recherche efficace
  const sponsoredChildrenIds = new Set(
    sponsorships
      ?.filter(s => s.children)
      .map(s => s.children.id)
  );

  // Filtrer les enfants disponibles pour exclure ceux déjà parrainés
  const filteredAvailableChildren = availableChildren
    .filter(child => !sponsoredChildrenIds.has(child.id))
    .sort((a, b) => a.name.localeCompare(b.name)); // Tri alphabétique

  // Trier les parrainages par nom d'enfant
  const sortedSponsorships = [...(sponsorships || [])]
    .filter(s => s.children)
    .sort((a, b) => a.children.name.localeCompare(b.children.name));

  const handleRemoveChild = async (sponsorshipId: string) => {
    try {
      onRemoveChild(sponsorshipId);
      toast.success("L'enfant a été retiré avec succès");
    } catch (error) {
      console.error("Error removing child:", error);
      toast.error("Erreur lors du retrait de l'enfant");
    }
  };

  const handleAddChild = async (childId: string) => {
    try {
      onAddChild(childId);
      toast.success("L'enfant a été ajouté avec succès");
    } catch (error) {
      console.error("Error adding child:", error);
      toast.error("Erreur lors de l'ajout de l'enfant");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Enfants parrainés</h3>
      <div className="space-y-4">
        {/* Liste des enfants parrainés */}
        {sortedSponsorships.map((sponsorship: any) => (
          <Card key={sponsorship.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => handleRemoveChild(sponsorship.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="flex flex-row items-center gap-4 py-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-sm font-semibold">{sponsorship.children.name}</h4>
                <p className="text-sm text-gray-500">{sponsorship.children.city}</p>
              </div>
            </CardHeader>
          </Card>
        ))}

        {/* Section pour ajouter un enfant */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Ajouter un enfant</h4>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-2 gap-2">
              {filteredAvailableChildren.map((child: any) => (
                <Card 
                  key={child.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => handleAddChild(child.id)}
                >
                  <CardContent className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={child.photo_url} alt={child.name} />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{child.name}</p>
                      <p className="text-xs text-gray-500 truncate">{child.city}</p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};