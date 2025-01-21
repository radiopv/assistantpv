import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  content?: {
    title?: string;
    subtitle?: string;
  };
}

export const Hero = ({ content }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[70vh] bg-cuba-gradient overflow-hidden">
      <div className="container mx-auto h-full relative z-10 py-8">
        <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white font-title mb-4">
              {content?.title || "Parrainez un enfant cubain"}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {content?.subtitle || "Aidez-nous à changer des vies en parrainant un enfant cubain dans le besoin"}
            </p>
            <Button 
              onClick={() => navigate("/become-sponsor")}
              size="lg"
              className="bg-cuba-gold text-black hover:bg-cuba-gold/90"
            >
              Devenir parrain
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};