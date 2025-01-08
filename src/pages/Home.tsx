import { FeaturedChildren } from "@/components/Home/FeaturedChildren";
import { HowItWorks } from "@/components/Home/HowItWorks";
import { CallToAction } from "@/components/Home/CallToAction";
import { FeaturedTestimonials } from "@/components/Home/FeaturedTestimonials";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Split Layout */}
      <section className="relative min-h-[90vh] bg-cuba-gradient">
        <div className="container mx-auto h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left Side - Hero Image */}
            <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-full">
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="/lovable-uploads/c0c5a7da-df66-4f94-91c4-b5428f6fcc0d.png"
                  alt="Hero background"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/20" />
              </div>
            </div>

            {/* Right Side - Testimonials and Featured Photos */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 bg-white/90 backdrop-blur-sm">
              <div className="space-y-8">
                {/* Featured Testimonials */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Témoignages des Parrains</h2>
                  <FeaturedTestimonials />
                </div>

                {/* Featured Album */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Album Photo</h2>
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