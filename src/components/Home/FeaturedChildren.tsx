import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { differenceInYears, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Child = Database["public"]["Tables"]["children"]["Row"];

const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return null;
  return differenceInYears(new Date(), parseISO(birthDate));
};

export const FeaturedChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const { t } = useLanguage();

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

  if (children.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Enfants en attente de parrainage</h2>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {children.map((child) => (
              <CarouselItem key={child.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden mx-2">
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
                      <p>{calculateAge(child.birth_date)} ans</p>
                      <p>{child.city}</p>
                    </div>
                    {Array.isArray(child.needs) && child.needs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
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
