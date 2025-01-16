import { Card } from "@/components/ui/card";
import { ChartBar, Heart, Camera, MessageSquare, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInDays } from "date-fns";

interface ContributionStatsProps {
  sponsorId: string;
}

export const ContributionStats = ({ sponsorId }: ContributionStatsProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      contributions: "Vos contributions",
      photos: "Photos",
      testimonials: "Témoignages",
      needsFulfilled: "Besoins comblés",
      sponsorshipDays: "Jours de parrainage"
    },
    es: {
      contributions: "Sus contribuciones",
      photos: "Fotos",
      testimonials: "Testimonios",
      needsFulfilled: "Necesidades cumplidas",
      sponsorshipDays: "Días de apadrinamiento"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: stats } = useQuery({
    queryKey: ['contribution-stats', sponsorId],
    queryFn: async () => {
      // Get total photos
      const { data: photos, error: photosError } = await supabase
        .from('album_media')
        .select('*')
        .eq('sponsor_id', sponsorId);

      if (photosError) throw photosError;

      // Get total testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('temoignage')
        .select('*')
        .eq('sponsor_id', sponsorId);

      if (testimonialsError) throw testimonialsError;

      // Get sponsorship start date to calculate duration
      const { data: sponsorship, error: sponsorshipError } = await supabase
        .from('sponsorships')
        .select('start_date')
        .eq('sponsor_id', sponsorId)
        .eq('status', 'active')
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      if (sponsorshipError && sponsorshipError.code !== 'PGRST116') throw sponsorshipError;

      // Get total fulfilled needs
      const { data: children, error: childrenError } = await supabase
        .from('sponsorships')
        .select(`
          children (
            needs
          )
        `)
        .eq('sponsor_id', sponsorId)
        .eq('status', 'active');

      if (childrenError) throw childrenError;

      let totalNeeds = 0;
      children?.forEach(sponsorship => {
        if (sponsorship.children?.needs) {
          const needs = Array.isArray(sponsorship.children.needs) 
            ? sponsorship.children.needs 
            : JSON.parse(sponsorship.children.needs as string);
          totalNeeds += needs.length;
        }
      });

      // Calculate sponsorship duration
      const sponsorshipDays = sponsorship?.start_date 
        ? differenceInDays(new Date(), new Date(sponsorship.start_date))
        : 0;

      return {
        totalPhotos: photos?.length || 0,
        totalTestimonials: testimonials?.length || 0,
        totalNeeds,
        sponsorshipDays
      };
    }
  });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ChartBar className="w-5 h-5 text-cuba-coral" />
        {t.contributions}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.photos}</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalPhotos || 0}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.testimonials}</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalTestimonials || 0}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.needsFulfilled}</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalNeeds || 0}</p>
        </div>
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.sponsorshipDays}</span>
          </div>
          <p className="text-2xl font-bold">{stats?.sponsorshipDays || 0}</p>
        </div>
      </div>
    </Card>
  );
};