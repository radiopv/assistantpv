import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSection } from "@/components/Home/HeroSection";
import { UrgentNeedsSection } from "@/components/Home/UrgentNeedsSection";
import { SponsorMemoriesSection } from "@/components/Home/SponsorMemoriesSection";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <UrgentNeedsSection />
      <SponsorMemoriesSection />
      
      {/* Call to Action */}
      <section className="py-12 px-4 bg-cuba-gradient text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t('joinUs')}</h2>
        <p className="mb-8 max-w-2xl mx-auto">{t('joinUsDescription')}</p>
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