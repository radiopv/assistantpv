import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle, Heart, Camera, MessageSquare, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { logActivity } from "@/utils/activity-logger";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Need } from "@/types/needs";

export const ContributionStats = ({ sponsorId }: { sponsorId: string }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

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

  // Requête pour obtenir les photos
  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: ['sponsor-photos', sponsorId],
    queryFn: async () => {
      console.log('Fetching photos for sponsor:', sponsorId);
      const { data, error } = await supabase
        .from('album_media')
        .select('*, children(name)')
        .eq('sponsor_id', sponsorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      console.log('Photos found:', data);
      return data || [];
    },
    enabled: !!sponsorId
  });

  // Requête pour obtenir les témoignages
  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
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
    },
    enabled: !!sponsorId
  });

  // Requête pour obtenir les besoins et la durée du parrainage
  const { data: sponsorshipData, isLoading: sponsorshipLoading } = useQuery({
    queryKey: ['sponsorship-data', sponsorId],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
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
        .order('start_date', { ascending: true })
        .single();

      if (error) {
        console.error('Error fetching sponsorship data:', error);
        throw error;
      }

      let totalNeeds = 0;
      let urgentNeeds = 0;
      let sponsorshipDays = 0;

      if (sponsorships?.start_date) {
        const startDate = new Date(sponsorships.start_date);
        sponsorshipDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        if (sponsorships.children?.needs) {
          const needs = Array.isArray(sponsorships.children.needs) 
            ? sponsorships.children.needs 
            : JSON.parse(sponsorships.children.needs as string);
          
          totalNeeds = needs.length;
          urgentNeeds = needs.filter((need: Need) => need.is_urgent).length;
        }
      }

      return {
        totalNeeds,
        urgentNeeds,
        sponsorshipDays,
        startDate: sponsorships?.start_date
      };
    },
    enabled: !!sponsorId
  });

  if (photosLoading || testimonialsLoading || sponsorshipLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

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
          <p className="text-xs text-gray-600 mt-1">
            {t.startDate} {sponsorshipData?.startDate 
              ? new Date(sponsorshipData.startDate).toLocaleDateString()
              : t.none
            }
          </p>
        </div>
      </div>
    </Card>
  );
};