import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { FeaturedTestimonials } from "./FeaturedTestimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HeroSectionProps {
  heroSection?: {
    title?: string;
    subtitle?: string;
  };
  onImageClick: () => void;
}

export const HeroSection = ({ heroSection, onImageClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative h-[90vh] bg-cuba-gradient">
      <div className="container mx-auto h-full">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative">
            <img 
              src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              onClick={onImageClick}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
          </div>

          <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-white/90 backdrop-blur-sm">
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center lg:text-left animate-fade-in">
                <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                  {heroSection?.title || t('heroTitle')}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {heroSection?.subtitle || t('heroSubtitle')}
                </p>
                <Button 
                  onClick={() => navigate("/become-sponsor")}
                  size="lg"
                  className="bg-primary hover:bg-primary-hover text-white transform transition-all duration-300 hover:scale-105"
                >
                  {t('becomeSponsor')}
                </Button>

                {/* Testimonials Carousel */}
                <div className="mt-8 bg-white/80 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    {t('testimonials')}
                  </h3>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      <CarouselItem className="md:basis-full">
                        <FeaturedTestimonials />
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};