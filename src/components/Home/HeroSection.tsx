import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  heroSection?: {
    title?: string;
    subtitle?: string;
  };
  onImageClick?: () => void;
}

export const HeroSection = ({ heroSection, onImageClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="relative w-full">
      <div className="text-center py-2 bg-cuba-warmBeige/10">
        <p className="text-cuba-coral font-semibold">#TousPourCuba</p>
      </div>
      <div className="w-full py-8 sm:py-16 bg-cuba-coral text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-title">
            {heroSection?.title || t("sponsorCubanChild")}
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            {heroSection?.subtitle || t("helpChangeLife")}
          </p>
          <Button
            onClick={() => navigate("/become-sponsor")}
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            {t("becomeSponsor")}
          </Button>
        </div>
      </div>
    </div>
  );
};