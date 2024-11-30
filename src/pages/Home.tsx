import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const { data: heroImage } = useQuery({
    queryKey: ['home-hero-image'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_images')
        .select('url')
        .eq('position', 'hero')
        .single();
      
      if (error) throw error;
      return data?.url || 'https://images.unsplash.com/photo-1501286353178-1ec881214838';
    }
  });

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
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Changez une vie, parrainez un enfant</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Donnez de l'espoir et un avenir meilleur aux enfants cubains grâce à votre parrainage
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/children')}
            className="bg-primary hover:bg-primary/90"
          >
            Parrainer un enfant
          </Button>
        </div>
      </section>

      {/* Featured Children Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Enfants en attente de parrainage</h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredChildren?.map((child) => (
                <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={child.photo_url || "/placeholder.svg"}
                    alt={child.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{child.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {child.age} ans • {child.city}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/children/${child.id}`)}
                    >
                      En savoir plus
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/children')}
            >
              Voir tous les enfants
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choisissez un enfant</h3>
              <p className="text-gray-600">Parcourez les profils des enfants et choisissez celui que vous souhaitez parrainer</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complétez votre profil</h3>
              <p className="text-gray-600">Remplissez les informations nécessaires pour devenir parrain</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Commencez votre parrainage</h3>
              <p className="text-gray-600">Recevez des nouvelles régulières et suivez l'évolution de votre filleul</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à changer une vie ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Votre parrainage peut faire une réelle différence dans la vie d'un enfant
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/children')}
          >
            Commencer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;