import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroSection } from "@/components/Home/HeroSection";
import { UrgentNeedsSection } from "@/components/Home/UrgentNeedsSection";
import { SponsorMemoriesSection } from "@/components/Home/SponsorMemoriesSection";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section avec gradient cubain */}
      <section className="relative bg-cuba-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2 text-white space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold">
                {t("changeALife")}
              </h1>
              <p className="text-xl md:text-2xl">
                {t("sponsorshipDescription")}
              </p>
              <Button 
                onClick={() => navigate("/children")}
                size="lg"
                className="bg-secondary hover:bg-secondary-hover text-white"
              >
                {t("becomeSponsor")}
              </Button>
            </div>
            <div className="w-full md:w-1/2">
              <img 
                src="/placeholder.svg" 
                alt="Children" 
                className="rounded-lg shadow-xl animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Enfants avec Besoins */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("childrenWithNeeds")}</h2>
          <UrgentNeedsSection />
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("testimonials")}</h2>
          <TestimonialsSection />
        </div>
      </section>

      {/* Section Souvenirs des Parrains */}
      <section className="py-16 bg-beach-gradient">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("sponsorMemories")}</h2>
          <SponsorMemoriesSection />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sunset-gradient text-white text-center">
        <div className="container mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">{t("joinUs")}</h2>
          <p className="max-w-2xl mx-auto text-lg">
            {t("joinUsDescription")}
          </p>
          <Button
            onClick={() => navigate("/children")}
            size="lg"
            className="bg-white text-secondary hover:bg-gray-100"
          >
            {t("becomeSponsor")}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;