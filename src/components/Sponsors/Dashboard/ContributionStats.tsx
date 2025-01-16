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
      sponsorshipDays: "Jours de parrainage",
      urgentNeeds: "Besoins urgents",
      lastPhoto: "Dernière photo"
    },
    es: {
      contributions: "Sus contribuciones",
      photos: "Fotos",
      testimonials: "Testimonios",
      needsFulfilled: "Necesidades cumplidas",
      sponsorshipDays: "Días de apadrinamiento",
      urgentNeeds: "Necesidades urgentes",
      lastPhoto: "Última foto"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: stats } = useQuery({
    queryKey: ['contribution-stats', sponsorId],
    queryFn: async () => {
      try {
        // Get photos with details
        const { data: photos, error: photosError } = await supabase
          .from('album_media')
          .select('*')
          .eq('sponsor_id', sponsorId)
          .order('created_at', { ascending: false });

        if (photosError) throw photosError;

        // Get testimonials
        const { data: testimonials, error: testimonialsError } = await supabase
          .from('temoignage')
          .select('*')
          .eq('sponsor_id', sponsorId);

        if (testimonialsError) throw testimonialsError;

        // Get sponsorship and children details
        const { data: sponsorships, error: sponsorshipsError } = await supabase
          .from('sponsorships')
          .select(`
            id,
            start_date,
            children (
              id,
              needs
            )
          `)
          .eq('sponsor_id', sponsorId)
          .eq('status', 'active');

        if (sponsorshipsError) throw sponsorshipsError;

        // Calculate needs statistics
        let totalNeeds = 0;
        let urgentNeeds = 0;
        
        sponsorships?.forEach(sponsorship => {
          if (sponsorship.children?.needs) {
            const needs = Array.isArray(sponsorship.children.needs) 
              ? sponsorship.children.needs 
              : JSON.parse(sponsorship.children.needs as string);
            
            totalNeeds += needs.length;
            urgentNeeds += needs.filter((need: any) => need.is_urgent).length;
          }
        });

        // Get earliest sponsorship start date
        const earliestSponsorship = sponsorships?.reduce((earliest, current) => {
          if (!earliest || (current.start_date && current.start_date < earliest.start_date)) {
            return current;
          }
          return earliest;
        }, null);

        // Calculate sponsorship duration
        const sponsorshipDays = earliestSponsorship?.start_date 
          ? differenceInDays(new Date(), new Date(earliestSponsorship.start_date))
          : 0;

        // Get latest photo date
        const latestPhoto = photos && photos.length > 0 ? photos[0] : null;

        return {
          totalPhotos: photos?.length || 0,
          totalTestimonials: testimonials?.length || 0,
          totalNeeds,
          urgentNeeds,
          sponsorshipDays,
          latestPhotoDate: latestPhoto?.created_at || null
        };
      } catch (error) {
        console.error('Error fetching contribution stats:', error);
        return {
          totalPhotos: 0,
          totalTestimonials: 0,
          totalNeeds: 0,
          urgentNeeds: 0,
          sponsorshipDays: 0,
          latestPhotoDate: null
        };
      }
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
          {stats?.latestPhotoDate && (
            <p className="text-xs text-gray-600 mt-1">
              {new Date(stats.latestPhotoDate).toLocaleDateString()}
            </p>
          )}
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
          {stats?.urgentNeeds > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {stats.urgentNeeds} {t.urgentNeeds}
            </p>
          )}
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