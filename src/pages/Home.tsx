import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png)' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Donnez de l'espoir à un enfant</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
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