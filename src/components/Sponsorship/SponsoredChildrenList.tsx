import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SponsoredChildrenListProps {
  children: any[];
}

export const SponsoredChildrenList = ({ children }: SponsoredChildrenListProps) => {
  const navigate = useNavigate();

  // Filter out duplicates and keep only sponsored children
  const uniqueChildren = children.filter((child, index, self) =>
    index === self.findIndex((c) => c.id === child.id) && child.status === 'sponsored'
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {uniqueChildren.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <div className="aspect-square relative h-48">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{child.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>{child.age} ans</p>
              <p>{child.city}</p>
              {child.description && (
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {child.description}
                </p>
              )}
              {child.story && (
                <p className="mt-2 text-sm text-gray-700 italic line-clamp-2">
                  {child.story}
                </p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {child.needs?.map((need: any, index: number) => (
                <Badge 
                  key={`${need.category}-${index}`}
                  variant={need.is_urgent ? "destructive" : "secondary"}
                >
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
