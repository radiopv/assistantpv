import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertJsonToNeeds } from "@/types/needs";

interface HomeContent {
  id: number;
  title: string;
  content: string;
}

interface HomeImage {
  id: string;
  url: string;
  position: string;
  is_mobile: boolean;
}

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: homeContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['home-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('id');
      if (error) throw error;
      return data as HomeContent[];
    }
  });

  const { data: homeImages, isLoading: isLoadingImages } = useQuery({
    queryKey: ['home-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('*');
      if (error) throw error;
      return data as HomeImage[];
    }
  });

  const { data: urgentChildren, isLoading: isLoadingChildren } = useQuery({
    queryKey: ['urgent-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .contains('needs', [{ is_urgent: true }])
        .limit(5);
      if (error) throw error;
      return data;
    }
  });

  const { data: sponsorPhotos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['sponsor-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('is_public', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    }
  });

  if (isLoadingContent || isLoadingImages || isLoadingChildren || isLoadingPhotos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getImage = (position: string) => {
    const isMobile = window.innerWidth < 768;
    return homeImages?.find(img => img.position === position && img.is_mobile === isMobile)?.url;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-between p-4 md:p-8 bg-cuba-gradient text-white">
        <img
          src={getImage('left') || '/placeholder.svg'}
          alt="Left"
          className="w-full md:w-1/4 h-48 md:h-96 object-cover rounded-lg mb-4 md:mb-0"
        />
        <div className="md:w-1/3 text-center space-y-4">
          <h1 className="text-4xl font-bold">{homeContent?.[0]?.title || 'Passion Varadero'}</h1>
          <p className="text-lg">{homeContent?.[0]?.content || t('sponsorshipDescription')}</p>
          <Button 
            onClick={() => navigate('/children')}
            className="bg-secondary hover:bg-secondary-hover text-white"
          >
            {t('becomeSponsor')}
          </Button>
        </div>
        <img
          src={getImage('right') || '/placeholder.svg'}
          alt="Right"
          className="w-full md:w-1/4 h-48 md:h-96 object-cover rounded-lg mt-4 md:mt-0"
        />
      </div>

      {/* Urgent Needs Section */}
      <section className="py-12 px-4 bg-cuba-offwhite">
        <h2 className="text-3xl font-bold text-center mb-8">
          {homeContent?.[1]?.title || t('urgentNeeds')}
        </h2>
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {urgentChildren?.map((child) => (
              <CarouselItem key={child.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-4">
                  <img
                    src={child.photo_url || '/placeholder.svg'}
                    alt={child.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{child.name}</h3>
                  <div className="space-y-2">
                    {convertJsonToNeeds(child.needs).map((need, index) => (
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
      </section>

      {/* Memories Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          {homeContent?.[2]?.title || t('sponsorAlbum')}
        </h2>
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {sponsorPhotos?.map((photo) => (
              <CarouselItem key={photo.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-cuba-gradient text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          {homeContent?.[3]?.title || t('joinUs')}
        </h2>
        <p className="mb-8 max-w-2xl mx-auto">
          {homeContent?.[3]?.content || t('joinUsDescription')}
        </p>
        <Button
          onClick={() => navigate('/become-sponsor')}
          size="lg"
          className="bg-secondary hover:bg-secondary-hover text-white"
        >
          {t('becomeSponsor')}
        </Button>
      </section>
    </div>
  );
};

export default Home;