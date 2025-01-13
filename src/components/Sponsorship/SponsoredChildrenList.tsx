import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NeedCategoryIcon } from "@/components/Dashboard/ChildrenNeeds/NeedCategoryIcon";
import { convertJsonToNeeds } from "@/types/needs";

interface SponsoredChildrenListProps {
  children: any[];
}

export const SponsoredChildrenList = ({ children }: SponsoredChildrenListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => {
        const childNeeds = convertJsonToNeeds(child.needs);
        const hasUrgentNeeds = childNeeds.some(need => need.is_urgent);

        return (
          <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-square relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
              {hasUrgentNeeds && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">
                    Besoins urgents
                  </Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{child.name}</h3>
              
              {child.sponsor_name && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={child.sponsor_photo_url} />
                    <AvatarFallback>
                      {child.sponsor_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Parrainé par {child.sponsor_name}</p>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {childNeeds.map((need, index) => (
                  <Badge 
                    key={`${need.category}-${index}`}
                    variant={need.is_urgent ? "destructive" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <NeedCategoryIcon category={need.category} className="w-3 h-3" />
                    {need.category}
                  </Badge>
                ))}
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={() => navigate(`/children/${child.id}`)}
              >
                Voir le profil
              </Button>
            </div>
          </Card>
        ))}
    </div>
  );
};