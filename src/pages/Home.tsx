import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-cuba-gradient overflow-hidden">
        <div className="absolute inset-0 bg-golden-shimmer animate-golden-light" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-title">
              Changez une vie aujourd'hui
            </h1>
            <div className="relative mb-8">
              <img 
                src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
                alt="Enfants cubains souriants"
                className="rounded-lg shadow-xl mx-auto max-w-full h-auto mb-8"
              />
            </div>
            <p className="text-xl mb-8">
              Rejoignez notre communauté de parrains et faites une différence dans la vie d'un enfant cubain
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
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