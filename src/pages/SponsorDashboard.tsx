import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { SponsoredChildrenDisplay } from "@/components/Sponsors/SponsoredChildrenDisplay";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";

const SponsorDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ['sponsor-children', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          status,
          start_date,
          children (
            id,
            name,
            photo_url,
            city,
            birth_date,
            needs
          )
        `)
        .eq('sponsor_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching sponsorships:', error);
        toast.error("Erreur lors du chargement des parrainages");
        return [];
      }

      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p>Chargement de votre espace parrain...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Espace Parrain</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mes Parrainages</h2>
        <SponsoredChildrenDisplay sponsorships={sponsorships || []} />
      </Card>

      {(!sponsorships || sponsorships.length === 0) && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            Vous n'avez pas encore d'enfants parrainés. 
            Découvrez les enfants qui attendent un parrain dans la section "Enfants disponibles".
          </p>
        </Card>
      )}
    </div>
  );
};

export default SponsorDashboard;