import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandHeart, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { TestimonialCarousel } from "@/components/Testimonials/TestimonialCarousel";
import { GlobalStats } from "@/components/Statistics/GlobalStats";

const Index = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Passion Varadero
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ensemble, changeons la vie des enfants cubains grâce au parrainage
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/become-sponsor">
            <Button size="lg" className="gap-2">
              <Heart className="h-5 w-5" />
              Devenir Parrain
            </Button>
          </Link>
          <Link to="/donations/public">
            <Button size="lg" variant="outline" className="gap-2">
              <HandHeart className="h-5 w-5" />
              Faire un Don
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Notre Impact</h2>
        <GlobalStats />
      </section>

      {/* About Section */}
      <section className="py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
            <p className="text-gray-600">
              Aider les enfants cubains à avoir un meilleur avenir grâce au parrainage
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Le Parrainage</h3>
            <p className="text-gray-600">
              Un soutien direct et personnalisé pour chaque enfant
            </p>
          </Card>
          <Card className="p-6 text-center">
            <HandHeart className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Les Dons</h3>
            <p className="text-gray-600">
              Des actions concrètes pour améliorer leur quotidien
            </p>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Témoignages</h2>
        <TestimonialCarousel />
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-primary/5 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          Envie de faire partie de l'aventure ?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Rejoignez notre communauté de parrains et changez la vie d'un enfant
        </p>
        <Link to="/become-sponsor">
          <Button size="lg" className="animate-pulse">
            Devenir Parrain
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Index;