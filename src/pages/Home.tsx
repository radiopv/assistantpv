import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] overflow-hidden bg-cuba-gradient">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
            alt="Hero background"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-fluid-3xl font-bold mb-6 animate-fade-in">
            Donnez de l'espoir à un enfant
          </h1>
          <p className="text-fluid-xl mb-8 max-w-2xl animate-fade-in">
            Ensemble, nous pouvons faire une différence dans la vie des enfants cubains
          </p>
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