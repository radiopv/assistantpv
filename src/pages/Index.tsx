import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandHeart, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Placeholder components until they are properly implemented
const TestimonialCarousel = () => (
  <div className="text-center p-8 bg-gray-50 rounded-lg">
    <p className="text-lg text-gray-600 italic">"Grâce à ce programme, j'ai pu faire une réelle différence dans la vie d'un enfant."</p>
    <p className="mt-4 font-semibold">- Un parrain engagé</p>
  </div>
);

const GlobalStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
    <div className="text-center">
      <h3 className="text-3xl font-bold text-primary">100+</h3>
      <p className="text-gray-600">Enfants Aidés</p>
    </div>
    <div className="text-center">
      <h3 className="text-3xl font-bold text-primary">50+</h3>
      <p className="text-gray-600">Parrains Actifs</p>
    </div>
    <div className="text-center">
      <h3 className="text-3xl font-bold text-primary">5+</h3>
      <p className="text-gray-600">Villes Couvertes</p>
    </div>
  </div>
);

const Index = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Passion Varadero
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ensemble, changeons la vie des enfants cubains grâce au parrainage
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/become-sponsor">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                <Heart className="h-6 w-6" />
                Devenir Parrain
              </Button>
            </Link>
            <Link to="/donations/public">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg px-8 py-6 hover:bg-primary/5">
                <HandHeart className="h-6 w-6" />
                Faire un Don
              </Button>
            </Link>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-white rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold mb-8 text-center">Notre Impact</h2>
          <GlobalStats />
        </section>

        {/* About Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary">
              <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">Notre Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Aider les enfants cubains à avoir un meilleur avenir grâce au parrainage
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary">
              <Heart className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">Le Parrainage</h3>
              <p className="text-gray-600 leading-relaxed">
                Un soutien direct et personnalisé pour chaque enfant
              </p>
            </Card>
            <Card className="p-8 text-center hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary">
              <HandHeart className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">Les Dons</h3>
              <p className="text-gray-600 leading-relaxed">
                Des actions concrètes pour améliorer leur quotidien
              </p>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 bg-white rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold mb-8 text-center">Témoignages</h2>
          <TestimonialCarousel />
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Envie de faire partie de l'aventure ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de parrains et changez la vie d'un enfant
          </p>
          <Link to="/become-sponsor">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
              Devenir Parrain
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Index;