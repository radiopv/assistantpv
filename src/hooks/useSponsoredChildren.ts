import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { SponsoredChild, Child, Sponsorship } from "@/types/sponsorship";

export const useSponsoredChildren = (userId: string | undefined) => {
  const [sponsoredChildren, setSponsoredChildren] = useState<SponsoredChild[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSponsoredChildren = async () => {
      try {
        if (!userId) return;
        
        const { data: sponsorships, error } = await supabase
          .from('sponsorships')
          .select('*, children(*)')
          .eq('sponsor_id', userId)
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching sponsorships:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer vos filleuls"
          });
          return;
        }

        console.log("Sponsorships data:", sponsorships);

        const children = sponsorships
          .map(sponsorship => {
            const child = sponsorship.children as Child;
            if (!child) return null;
            
            const birthDate = new Date(child.birth_date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return {
              id: child.id,
              name: child.name,
              photo_url: child.photo_url,
              city: child.city || '',
              age: age,
              status: child.status
            };
          })
          .filter((child): child is SponsoredChild => child !== null);

        console.log("Processed children:", children);
        setSponsoredChildren(children);
      } catch (error) {
        console.error('Error in fetchSponsoredChildren:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de vos filleuls"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSponsoredChildren();
  }, [userId, toast]);

  return { sponsoredChildren, loading };
};