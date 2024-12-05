import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { differenceInYears, parseISO } from "date-fns";

interface ChildCardProps {
  child: {
    id: string;
    name: string;
    birth_date: string;
    city: string;
    photo_url: string;
    description?: string;
    needs?: any[];
    gender: string;
  };
}

export const ChildCard = ({ child }: ChildCardProps) => {
  const navigate = useNavigate();
  const age = differenceInYears(new Date(), parseISO(child.birth_date));

  return (
    <Card className="overflow-hidden group">
      <div className="aspect-square relative">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{child.name}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>{age} ans</p>
          <p>{child.city}</p>
          <p>{child.gender === 'male' ? 'Garçon' : 'Fille'}</p>
        </div>
        
        {child.needs && child.needs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {child.needs.map((need: any, index: number) => (
              <Badge 
                key={`${need.category}-${index}`}
                variant={need.is_urgent ? "destructive" : "secondary"}
              >
                {need.category}
              </Badge>
            ))}
          </div>
        )}
        
        <Button 
          className="w-full mt-4" 
          onClick={() => navigate(`/become-sponsor/${child.id}`)}
        >
          Parrainer cet enfant
        </Button>
      </div>
    </Card>
  );
};