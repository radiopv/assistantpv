import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Camera, MessageSquare, Clock } from "lucide-react";

interface ContributionStatsProps {
  sponsorId: string;
}

export const ContributionStats = ({ sponsorId }: ContributionStatsProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      photos: "Photos",
      testimonials: "Témoignages",
      needsFulfilled: "Besoins",
      totalNeeds: "Total besoins:",
      urgentNeeds: "Besoins urgents:",
      sponsorshipDays: "Jours de parrainage",
      lastPhoto: "Dernière photo",
      none: "Aucune",
      startDate: "Date de début:"
    },
    es: {
      photos: "Fotos",
      testimonials: "Testimonios",
      needsFulfilled: "Necesidades",
      totalNeeds: "Total necesidades:",
      urgentNeeds: "Necesidades urgentes:",
      sponsorshipDays: "Días de apadrinamiento",
      lastPhoto: "Última foto",
      none: "Ninguna",
      startDate: "Fecha de inicio:"
    }
  };

  const t = translations[language as keyof typeof translations];

  // Query for photos
  const { data: photos = [] } = useQuery({
    queryKey: ['sponsor-photos', sponsorId],
    queryFn: async () => {
      console.log('Fetching photos for sponsor:', sponsorId);
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('sponsor_id', sponsorId);

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      console.log('Photos found:', data);
      return data || [];
    }
  });

  // Query for testimonials
  const { data: testimonials = [] } = useQuery({
    queryKey: ['sponsor-testimonials', sponsorId],
    queryFn: async () => {
      console.log('Fetching testimonials for sponsor:', sponsorId);
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('sponsor_id', sponsorId);

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      console.log('Testimonials found:', data);
      return data || [];
    }
  });

  // Query for sponsorship data and needs
  const { data: sponsorshipData } = useQuery({
    queryKey: ['sponsorship-data', sponsorId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
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
          .eq('status', 'active')
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Error fetching sponsorship data:', error);
          throw error;
        }

        // Calculate total needs and urgent needs from all sponsored children
        let totalNeeds = 0;
        let urgentNeeds = 0;
        let sponsorshipDays = 0;

        if (data && data.length > 0) {
          data.forEach(sponsorship => {
            if (sponsorship.children?.needs) {
              const needs = Array.isArray(sponsorship.children.needs) 
                ? sponsorship.children.needs 
                : [];
              
              totalNeeds += needs.length;
              urgentNeeds += needs.filter((need: any) => need.is_urgent).length;
            }

            if (sponsorship.start_date) {
              const startDate = new Date(sponsorship.start_date);
              const days = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
              sponsorshipDays = Math.max(sponsorshipDays, days);
            }
          });
        }

        return {
          totalNeeds,
          urgentNeeds,
          sponsorshipDays
        };
      } catch (error) {
        console.error('Error fetching sponsorship data:', error);
        throw error;
      }
    }
  });

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.photos}</span>
          </div>
          <p className="text-2xl font-bold">{photos.length}</p>
          <p className="text-xs text-gray-600 mt-1">
            {photos[0]?.created_at 
              ? new Date(photos[0].created_at).toLocaleDateString()
              : t.none
            }
          </p>
        </div>

        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.needsFulfilled}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              {t.totalNeeds} <span className="font-bold">{sponsorshipData?.totalNeeds || 0}</span>
            </p>
            <p className="text-sm">
              {t.urgentNeeds} <span className="font-bold text-red-600">{sponsorshipData?.urgentNeeds || 0}</span>
            </p>
          </div>
        </div>

        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.testimonials}</span>
          </div>
          <p className="text-2xl font-bold">{testimonials.length}</p>
        </div>

        <div className="p-3 bg-cuba-warmBeige/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cuba-coral" />
            <span className="font-medium">{t.sponsorshipDays}</span>
          </div>
          <p className="text-2xl font-bold">{sponsorshipData?.sponsorshipDays || 0}</p>
        </div>
      </div>
    </Card>
  );
};