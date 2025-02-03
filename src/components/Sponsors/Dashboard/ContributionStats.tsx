import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContributionStats = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const translations = {
    fr: {
      totalPhotos: "Total des photos",
      totalTestimonials: "Total des témoignages",
      totalChildren: "Enfants parrainés",
      loading: "Chargement...",
      error: "Erreur de chargement"
    },
    es: {
      totalPhotos: "Total de fotos",
      totalTestimonials: "Total de testimonios",
      totalChildren: "Niños apadrinados",
      loading: "Cargando...",
      error: "Error al cargar"
    }
  };

  const t = translations[language as keyof typeof translations];

  // Fetch sponsored children to get their IDs
  const { data: sponsorships } = useQuery({
    queryKey: ['sponsored-children', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
          children (
            id,
            name
          )
        `)
        .eq('sponsor_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    },
  });

  // Get all photos for sponsored children
  const { data: photos, isLoading: photosLoading } = useQuery({
    queryKey: ['sponsor-photos-count', sponsorships?.map(s => s.child_id)],
    enabled: !!sponsorships?.length,
    queryFn: async () => {
      const childIds = sponsorships.map(s => s.child_id);
      
      const { data, error } = await supabase
        .from('album_media')
        .select('*', { count: 'exact' })
        .in('child_id', childIds);

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      console.log('Photos found:', data); // Debug log
      return data || [];
    }
  });

  // Get testimonials count
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['sponsor-testimonials', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('sponsor_id', user?.id);

      if (error) throw error;
      console.log('Testimonials found:', data); // Debug log
      return data || [];
    }
  });

  if (photosLoading || testimonialsLoading) {
    return <div>{t.loading}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
        <h3 className="text-lg font-semibold text-cuba-warmGray mb-1">
          {t.totalPhotos}
        </h3>
        <p className="text-2xl font-bold text-cuba-deepOrange">
          {photos?.length || 0}
        </p>
      </div>

      <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
        <h3 className="text-lg font-semibold text-cuba-warmGray mb-1">
          {t.totalTestimonials}
        </h3>
        <p className="text-2xl font-bold text-cuba-deepOrange">
          {testimonials?.length || 0}
        </p>
      </div>

      <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
        <h3 className="text-lg font-semibold text-cuba-warmGray mb-1">
          {t.totalChildren}
        </h3>
        <p className="text-2xl font-bold text-cuba-deepOrange">
          {sponsorships?.length || 0}
        </p>
      </div>
    </div>
  );
};