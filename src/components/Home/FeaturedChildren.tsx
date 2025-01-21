import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Info, Heart } from "lucide-react";

type Child = {
  id: string;
  name: string;
  photo_url: string | null;
  birth_date: string;
  city: string;
  needs: any[];
};

export const FeaturedChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const { t } = useLanguage();
  const navigate = useNavigate();

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

      setChildren(data || []);
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
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {children.map((child) => (
              <CarouselItem key={child.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="overflow-hidden h-full">
                  <div className="aspect-square relative">
                    <img
                      src={child.photo_url || "/placeholder.svg"}
                      alt={child.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{child.name}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>{differenceInYears(new Date(), parseISO(child.birth_date))} ans</p>
                        <p>{child.city}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {Array.isArray(child.needs) && child.needs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {child.needs.slice(0, 2).map((need: any, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                          >
                            {need.category}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSponsor(child.id)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                        variant="default"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Parrainer
                      </Button>
                      <Button 
                        onClick={() => handleLearnMore(child.id)}
                        variant="outline"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};