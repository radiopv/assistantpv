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
    <section className="relative min-h-[90vh] bg-cuba-gradient overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-golden-shimmer animate-golden-light"
      />
      <div className="container mx-auto h-full relative z-10">
        <div className="flex flex-col lg:flex-row h-full items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 h-[80vh] lg:h-full relative"
          >
            <div className="flex items-center gap-8 mb-8">
              <img 
                src="/lovable-uploads/12731338-4f41-46ca-ad4a-79242dd36658.png"
                alt="Enfant cubain avec un ours en peluche"
                className="w-48 h-48 object-cover rounded-lg shadow-xl"
              />
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl lg:text-5xl font-bold text-white font-title"
              >
                {heroSection?.title || "Parrainez un enfant cubain"}
              </motion.h1>
            </div>

            <div className="relative h-full w-full max-w-md mx-auto">
              <img 
                src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
                alt="Image d'arrière-plan"
                className="absolute inset-0 w-full h-full object-cover cursor-pointer rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-105"
                style={{ objectPosition: 'center' }}
                onClick={onImageClick}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20 rounded-lg" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/2 p-6 lg:p-12"
          >
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center lg:text-left">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-xl text-white/90 mb-8"
                >
                  {heroSection?.subtitle || "Aidez-nous à changer des vies en parrainant un enfant cubain dans le besoin"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button 
                    onClick={() => navigate("/become-sponsor")}
                    size="lg"
                    className="bg-cuba-gold text-black hover:bg-cuba-gold/90 transform transition-all duration-300 hover:scale-105"
                  >
                    Devenir parrain
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};