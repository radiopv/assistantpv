import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertJsonToNeeds } from "@/types/needs";

interface Child {
  id: string;
  name: string;
  photo_url: string | null;
  birth_date: string;
  city: string;
  needs: any[];
  age: number;
  is_sponsored: boolean;
}

export const FeaturedChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAvailableChildren = async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("is_sponsored", false)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Erreur lors de la récupération des enfants:", error);
        return;
      }

      // Convert the needs from JSON to array
      const childrenWithParsedNeeds = data.map(child => ({
        ...child,
        needs: convertJsonToNeeds(child.needs)
      }));

      setChildren(childrenWithParsedNeeds);
    };

    fetchAvailableChildren();
  }, []);

  const handleSponsor = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  const handleLearnMore = (childId: string) => {
    navigate(`/child/${childId}`);
  };

  if (children.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Enfants en attente de parrainage
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative pb-[75%] bg-gray-100">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-semibold line-clamp-1">{child.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 line-clamp-1">{child.age} ans</p>
                    <p className="text-sm text-gray-600 line-clamp-1">{child.city}</p>
                  </div>
                  {child.needs && (
                    <div className="flex flex-wrap gap-1.5">
                      {child.needs.map((need: any, index: number) => (
                        <span
                          key={`${need.category}-${index}`}
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            need.is_urgent 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {need.category}
                          {need.is_urgent && " (!)"} 
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2 mt-3">
                  <Button 
                    onClick={() => handleSponsor(child.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                    variant="default"
                  >
                    Parrainer
                  </Button>
                  <Button 
                    onClick={() => handleLearnMore(child.id)}
                    variant="outline"
                    className="w-full"
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};