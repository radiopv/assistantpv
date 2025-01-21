import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroSectionProps {
  heroSection?: {
    title?: string;
    subtitle?: string;
  };
  onImageClick: () => void;
}

export const HeroSection = ({ heroSection, onImageClick }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] bg-cuba-gradient overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-golden-shimmer animate-golden-light"
      />
      <div className="container mx-auto h-full relative z-10 py-4 sm:py-8">
        <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-8 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-xl sm:max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-title mb-2 sm:mb-4">
              {heroSection?.title || "Parrainez un enfant cubain"}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-4 sm:mb-6">
              {heroSection?.subtitle || "Aidez-nous à changer des vies en parrainant un enfant cubain dans le besoin"}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                onClick={() => navigate("/become-sponsor")}
                size="lg"
                className="bg-cuba-gold text-black hover:bg-cuba-gold/90 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Devenir parrain
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto relative"
          >
            <img 
              src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
              alt="Enfant cubain"
              className="w-full h-auto object-contain cursor-pointer rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105"
              onClick={onImageClick}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};