import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Split Layout */}
      <section className="relative min-h-[90vh] bg-cuba-gradient">
        <div className="container mx-auto h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Hero Image */}
            <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-full">
              <div className="absolute inset-0">
                <img 
                  src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
                  alt="Hero background"
                  className="w-full h-full object-cover object-center"
                  style={{ maxHeight: '90vh' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-white/90 backdrop-blur-sm">
              <div className="max-w-xl mx-auto space-y-8">
                {/* Hero Content */}
                <div className="text-center lg:text-left animate-fade-in">
                  <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                    {t('heroTitle') || "Changez une vie aujourd'hui"}
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    {t('heroSubtitle') || "Faites une différence dans la vie d'un enfant cubain"}
                  </p>
                  <Button 
                    onClick={() => navigate("/become-sponsor")}
                    size="lg"
                    className="bg-primary hover:bg-primary-hover text-white transform transition-all duration-300 hover:scale-105"
                  >
                    {t('becomeSponsor') || "Devenir parrain"}
                  </Button>
                </div>

                {/* Featured Testimonials */}
                <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <h2 className="text-2xl font-bold mb-4">{t('testimonials') || "Témoignages"}</h2>
                  <FeaturedTestimonials />
                </div>

                {/* Featured Album */}
                <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <h2 className="text-2xl font-bold mb-4">{t('featuredPhotos') || "Photos"}</h2>
                  <FeaturedAlbum />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Children Section */}
      <FeaturedChildren />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
};

export default Home;