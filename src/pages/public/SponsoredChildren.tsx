import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SponsoredChildren = () => {
  const { data: children = [], isLoading } = useQuery({
    queryKey: ['sponsored-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsored_children_view')
        .select(`
          id,
          name,
          photo_url,
          city,
          needs,
          description,
          story,
          is_sponsored,
          sponsor_name,
          sponsorship_date,
          sponsorship_status,
          age,
          photos
        `)
        .eq('is_sponsored', true)
        .eq('sponsorship_status', 'active');

      if (error) {
        console.error('Erreur lors de la récupération des enfants parrainés:', error);
        return [];
      }

      return data.map(child => ({
        ...child,
        needs: Array.isArray(child.needs) ? child.needs : []
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Chargement des enfants parrainés...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
            Enfants Parrainés
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Découvrez les enfants qui ont trouvé une famille de cœur
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-orange-200">
          <SponsoredChildrenList children={children} />
        </div>
      </div>
    </div>
  );
};

export default SponsoredChildren;