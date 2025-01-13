import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsoredChildren = () => {
  const { language } = useLanguage();

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
          age,
          description,
          story,
          is_sponsored,
          sponsor_name,
          sponsorship_date,
          sponsorship_status
        `)
        .eq('sponsorship_status', 'active');

      if (error) {
        console.error('Error fetching sponsored children:', error);
        return [];
      }

      return data;
    }
  });

  const translations = {
    fr: {
      title: "Enfants Parrainés",
      subtitle: "Découvrez les enfants qui ont trouvé un parrain",
      loading: "Chargement des enfants parrainés..."
    },
    es: {
      title: "Niños Apadrinados",
      subtitle: "Descubre los niños que han encontrado un padrino",
      loading: "Cargando niños apadrinados..."
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cuba-warm mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>
      <SponsoredChildrenList children={children} />
    </div>
  );
};

export default SponsoredChildren;