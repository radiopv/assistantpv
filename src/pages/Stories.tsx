import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestimonialCarousel } from "@/components/Testimonials/TestimonialCarousel";
import { GlobalStats } from "@/components/Statistics/GlobalStats";
import { useNavigate } from "react-router-dom";

const Stories = () => {
  const navigate = useNavigate();

  const { data: stories } = useQuery({
    queryKey: ["sponsorship-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsor_memories")
        .select(`
          *,
          child:children!fk_child(
            name,
            age,
            city
          )
        `)
        .eq("type", "story")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Histoires de Parrainage</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez l'impact positif de nos parrains sur la vie des enfants à
          travers leurs histoires inspirantes
        </p>
      </section>

      {/* Global Statistics */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Notre Impact</h2>
        <GlobalStats />
      </section>

      {/* Featured Testimonials */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Témoignages</h2>
        <TestimonialCarousel />
      </section>

      {/* Sponsorship Stories */}
      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-6">Histoires Récentes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories?.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              {story.url && (
                <img
                  src={story.url}
                  alt="Story"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Histoire de parrainage avec {story.child?.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {story.child?.age} ans • {story.child?.city}
                </p>
                <p className="text-gray-700 mb-4">{story.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-primary/5 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          Envie de faire partie de l'aventure ?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Rejoignez notre communauté de parrains et changez la vie d'un enfant
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/children")}
          className="animate-pulse"
        >
          Devenir Parrain
        </Button>
      </section>
    </div>
  );
};

export default Stories;