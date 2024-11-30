import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Palmtree, Heart, Sun } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { HomeImageManager } from "@/components/Home/HomeImageManager";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAssistant } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-b from-cuban-white to-cuban-sand">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center bg-fixed" 
        style={{ 
          backgroundImage: 'url(/lovable-uploads/273527d2-9b86-4f3f-b670-d45789cfcc89.png)',
          backgroundPosition: 'center 20%', // Adjust to focus more on the face
          backgroundSize: '100% auto'  // This will ensure the image covers the width while maintaining aspect ratio
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/30" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Changez une vie, parrainez un enfant
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in delay-100">
            Donnez de l'espoir et un avenir meilleur aux enfants cubains grâce à votre parrainage
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/children')}
            className="bg-cuban-red hover:bg-cuban-red/90 text-white animate-fade-in delay-200"
          >
            Parrainer un enfant
          </Button>
        </div>
      </section>

      {/* Admin Section for Image Management */}
      {user?.role === 'admin' && (
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-cuban-blue">Gestion des images</h2>
            <HomeImageManager />
          </div>
        </section>
      )}

      <section className="py-16 bg-white/80">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-cuban-blue">Enfants en attente de parrainage</h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-cuban-blue" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredChildren?.map((child) => (
                <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white/90 backdrop-blur">
                  <img
                    src={child.photo_url || "/placeholder.svg"}
                    alt={child.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-cuban-blue">{child.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {child.age} ans • {child.city}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-cuban-blue text-cuban-blue hover:bg-cuban-blue hover:text-white"
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
              className="border-cuban-blue text-cuban-blue hover:bg-cuban-blue hover:text-white"
            >
              Voir tous les enfants
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cuban-pattern bg-opacity-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-cuban-blue">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-cuban-red/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wave">
                <Heart className="w-8 h-8 text-cuban-red" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cuban-blue">Choisissez un enfant</h3>
              <p className="text-gray-600">Parcourez les profils des enfants et choisissez celui que vous souhaitez parrainer</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-cuban-palm/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wave">
                <Palmtree className="w-8 h-8 text-cuban-palm" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cuban-blue">Complétez votre profil</h3>
              <p className="text-gray-600">Remplissez les informations nécessaires pour devenir parrain</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-cuban-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-wave">
                <Sun className="w-8 h-8 text-cuban-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cuban-blue">Commencez votre parrainage</h3>
              <p className="text-gray-600">Recevez des nouvelles régulières et suivez l'évolution de votre filleul</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-cuban-blue to-cuban-blue/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à changer une vie ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Votre parrainage peut faire une réelle différence dans la vie d'un enfant
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/children')}
            className="bg-white text-cuban-blue hover:bg-cuban-gold hover:text-cuban-blue"
          >
            Commencer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;