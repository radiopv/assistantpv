import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { convertJsonToNeeds } from "@/types/needs";
import { translateNeedCategory } from "@/utils/needsTranslation";
import { differenceInYears, parseISO } from "date-fns";

interface ChildProfileDetailsProps {
  child: {
    id: string;
    name: string;
    birth_date: string;
    city: string;
    photo_url: string | null;
    description: string | null;
    story: string | null;
    needs: any;
    is_sponsored: boolean;
  };
}

export const ChildProfileDetails = ({ child }: ChildProfileDetailsProps) => {
  const navigate = useNavigate();
  const age = child.birth_date ? differenceInYears(new Date(), parseISO(child.birth_date)) : null;
  const childNeeds = convertJsonToNeeds(child.needs);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="overflow-hidden">
        <div className="md:flex">
          {/* Photo Section */}
          <div className="md:w-1/2">
            <div className="aspect-square relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Information Section */}
          <div className="p-6 md:w-1/2">
            <h1 className="text-2xl font-bold mb-4">{child.name}</h1>
            
            <div className="space-y-4">
              {age && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span>{age} ans</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span>{child.city}</span>
              </div>

              {!child.is_sponsored && (
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate('/become-sponsor', { state: { childId: child.id } })}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Parrainer cet enfant
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Description Section */}
      {child.description && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700">{child.description}</p>
        </Card>
      )}

      {/* Story Section */}
      {child.story && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Histoire</h2>
          <p className="text-gray-700 italic">{child.story}</p>
        </Card>
      )}

      {/* Needs Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Besoins</h2>
        <div className="grid gap-3">
          {childNeeds.map((need: any, index: number) => (
            <div
              key={`${need.category}-${index}`}
              className={`p-4 rounded-lg ${
                need.is_urgent
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Info className={`h-5 w-5 ${need.is_urgent ? "text-red-500" : "text-gray-500"}`} />
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {translateNeedCategory(need.category)}
                    {need.is_urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  {need.description && (
                    <p className="mt-1 text-sm text-gray-600">{need.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!Array.isArray(childNeeds) || childNeeds.length === 0) && (
            <p className="text-gray-500">Aucun besoin enregistré</p>
          )}
        </div>
      </Card>
    </div>
  );
}