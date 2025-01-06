import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const filteredAvailableChildren = availableChildren.filter(
    child => !sponsoredChildrenIds.has(child.id)
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Enfants parrainés</h3>
      <div className="space-y-4">
        {/* N'afficher que les parrainages uniques basés sur l'ID de l'enfant */}
        {sponsorships
          ?.filter((sponsorship, index, self) => 
            sponsorship.children && 
            index === self.findIndex(s => s.children?.id === sponsorship.children?.id)
          )
          .map((sponsorship: any) => (
            sponsorship.children && (
              <Card key={sponsorship.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => onRemoveChild(sponsorship.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                    <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold">{sponsorship.children.name}</h4>
                    <p className="text-sm text-gray-500">{sponsorship.children.city}</p>
                  </div>
                </CardHeader>
              </Card>
            )
          ))}

        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Ajouter un enfant</h4>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-2 gap-2">
              {filteredAvailableChildren.map((child: any) => (
                <Card 
                  key={child.id} 
                  className="cursor-pointer hover:bg-gray-50" 
                  onClick={() => onAddChild(child.id)}
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