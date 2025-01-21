import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/Auth/AuthProvider";

interface ChildCardProps {
  child: any;
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

export const ChildCard = ({ child, onViewProfile, onSponsorClick }: ChildCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSponsorClick = () => {
    if (!user) {
      navigate(`/become-sponsor?child=${child.id}`);
      return;
    }
    onSponsorClick(child);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative pb-[75%]">
        {child.photo_url && (
          <img
            src={child.photo_url}
            alt={child.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {child.needs?.some((need: any) => need.is_urgent) && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 right-2"
          >
            BESOIN URGENT
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p className="text-sm text-gray-500">
              {child.age} ans {child.birth_date && "• "}{child.city}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        <p className="line-clamp-2">{child.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleSponsorClick}
          className="w-full bg-cuba-warmBeige hover:bg-cuba-warmBeige/90 text-white font-semibold py-3 text-base shadow-md transition-all duration-200"
        >
          Parrainer cet enfant
        </Button>
      </CardFooter>
    </Card>
  );
};