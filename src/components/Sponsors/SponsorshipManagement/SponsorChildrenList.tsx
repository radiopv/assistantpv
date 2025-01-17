import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";
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
  const sponsoredChildrenIds = new Set(
    sponsorships
      ?.filter(s => s.children)
      .map(s => s.children.id)
  );

  const filteredAvailableChildren = availableChildren
    .filter(child => !sponsoredChildrenIds.has(child.id))
    .sort((a, b) => a.name.localeCompare(b.name));

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
    <div className="space-y-4">
      {/* Liste des enfants parrainés */}
      {sortedSponsorships.map((sponsorship: any) => (
        <Card key={sponsorship.id} className="relative">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage 
                    src={sponsorship.children.photo_url} 
                    alt={sponsorship.children.name} 
                  />
                  <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{sponsorship.children.name}</h4>
                  <p className="text-sm text-gray-500">{sponsorship.children.city}</p>
                  {sponsorship.children.age && (
                    <p className="text-sm text-gray-500">{sponsorship.children.age} ans</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveChild(sponsorship.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Section pour ajouter un enfant */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">Ajouter un enfant</h4>
        <ScrollArea className="h-[300px]">
          <div className="grid gap-3">
            {filteredAvailableChildren.map((child: any) => (
              <Card 
                key={child.id} 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleAddChild(child.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={child.photo_url} alt={child.name} />
                        <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-sm text-gray-500">{child.city}</p>
                        {child.age && (
                          <p className="text-sm text-gray-500">{child.age} ans</p>
                        )}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};