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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cuba-warm mb-2">Enfants Parrainés</h1>
        <p className="text-gray-600">Découvrez les enfants qui ont trouvé un parrain</p>
      </div>
      <SponsoredChildrenList children={children} />
    </div>
  );
};

export default SponsoredChildren;