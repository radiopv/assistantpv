import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SponsoredChildrenDisplayProps {
  sponsorships: any[];
}

export const SponsoredChildrenDisplay = ({ sponsorships }: SponsoredChildrenDisplayProps) => {
  const navigate = useNavigate();

  const viewAlbum = (childId: string) => {
    navigate(`/children/${childId}/album`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Enfants parrainés</h3>
      <div className="grid gap-4">
        {sponsorships?.map((sponsorship: any) => (
          sponsorship.children && (
            <Card key={sponsorship.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                    <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{sponsorship.children.name}</p>
                    <p className="text-xs text-gray-500">{sponsorship.children.city}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => viewAlbum(sponsorship.children.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        ))}
        {(!sponsorships || sponsorships.length === 0) && (
          <p className="text-sm text-gray-500">Aucun enfant parrainé</p>
        )}
      </div>
    </div>
  );
};