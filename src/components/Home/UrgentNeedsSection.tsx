import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertJsonToNeeds } from "@/types/needs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const UrgentNeedsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: children, isLoading } = useQuery({
    queryKey: ['children-with-needs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .not('needs', 'is', null)
        .eq('is_sponsored', false)
        .limit(10);

      if (error) {
        console.error('Error fetching children:', error);
        throw error;
      }

      return data?.filter(child => {
        const needs = convertJsonToNeeds(child.needs);
        return needs.length > 0;
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!children?.length) {
    return null;
  }

  return (
    <Carousel className="max-w-5xl mx-auto">
      <CarouselContent>
        {children?.map((child) => (
          <CarouselItem key={child.id} className="md:basis-1/2 lg:basis-1/3">
            <Card className="p-4">
              <img
                src={child.photo_url || '/placeholder.svg'}
                alt={child.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{child.name}</h3>
              <div className="space-y-2">
                {convertJsonToNeeds(child.needs)
                  .map((need, index) => (
                    <Badge
                      key={index}
                      variant={need.is_urgent ? "destructive" : "secondary"}
                    >
                      {need.category}
                    </Badge>
                  ))}
              </div>
              <Button
                onClick={() => navigate(`/children/${child.id}`)}
                className="w-full mt-4"
              >
                {t('sponsor')}
              </Button>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};