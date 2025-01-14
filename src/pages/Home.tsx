import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { HeroSection } from "@/components/Home/HeroSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <HeroSection onImageClick={() => {}} />

      <div className="container mx-auto px-4 py-12 space-y-24">
        <CallToAction />
        
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-title">
            Enfants en attente de parrainage
          </h2>
          <FeaturedChildren />
        </section>

        <HowItWorks />

        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-title">
            Nos derniers souvenirs
          </h2>
          <FeaturedAlbum />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-title">
            Témoignages de nos parrains
          </h2>
          <FeaturedTestimonials />
        </section>
      </div>
    </div>
  );
};

export default Home;