import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import { HomeImages } from "@/components/Home/HomeImages";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: featuredChildren, isLoading } = useQuery({
    queryKey: ['featured-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dynamic Images */}
      <section className="relative h-[80vh] md:h-[70vh] overflow-hidden">
        <HomeImages />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container h-full mx-auto px-4 flex flex-col justify-center items-center text-white text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Changez une vie, <br className="md:hidden" />
              parrainez un enfant
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl animate-fade-in opacity-90">
              Donnez de l'espoir et un avenir meilleur aux enfants cubains grâce à votre parrainage
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/available-children')}
              className="bg-primary hover:bg-primary/90 animate-fade-in delay-100 group"
            >
              Parrainer un enfant
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Children Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Enfants en attente de parrainage</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Découvrez les enfants qui attendent votre soutien pour un avenir meilleur
          </p>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredChildren?.map((child) => (
                <Card 
                  key={child.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={child.photo_url || "/placeholder.svg"}
                      alt={child.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{child.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {child.age} ans • {child.city}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                      onClick={() => navigate(`/children/${child.id}`)}
                    >
                      En savoir plus
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/available-children')}
              className="group"
            >
              Voir tous les enfants
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Comment ça marche ?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Découvrez le processus simple pour devenir parrain et changer la vie d'un enfant
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Choisissez un enfant",
                description: "Parcourez les profils des enfants et choisissez celui que vous souhaitez parrainer"
              },
              {
                step: 2,
                title: "Complétez votre profil",
                description: "Remplissez les informations nécessaires pour devenir parrain"
              },
              {
                step: 3,
                title: "Commencez votre parrainage",
                description: "Recevez des nouvelles régulières et suivez l'évolution de votre filleul"
              }
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Prêt à changer une vie ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Votre parrainage peut faire une réelle différence dans la vie d'un enfant
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/available-children')}
            className="bg-white text-primary hover:bg-white/90 group"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;