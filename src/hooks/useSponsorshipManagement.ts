import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SponsorshipWithDetails, GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { useLanguage } from "@/contexts/LanguageContext";

export const useSponsorshipManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          *,
          sponsors (
            id,
            name,
            email,
            photo_url,
            is_active
          ),
          children (
            id,
            name,
            photo_url,
            age
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Grouper les parrainages par parrain
      const groupedData = (data as SponsorshipWithDetails[]).reduce<GroupedSponsorship[]>((acc, curr) => {
        const existingGroup = acc.find(g => g.sponsor.id === curr.sponsors.id);
        
        if (existingGroup) {
          existingGroup.sponsorships.push({
            id: curr.id,
            child: curr.children,
            start_date: curr.start_date,
            status: curr.status
          });
        } else {
          acc.push({
            sponsor: {
              id: curr.sponsors.id,
              name: curr.sponsors.name,
              email: curr.sponsors.email,
              photo_url: curr.sponsors.photo_url,
              is_active: curr.sponsors.is_active
            },
            sponsorships: [{
              id: curr.id,
              child: curr.children,
              start_date: curr.start_date,
              status: curr.status
            }]
          });
        }
        
        return acc;
      }, []);

      return groupedData;
    }
  });

  const { data: allChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ['all-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const createSponsorship = useMutation({
    mutationFn: async ({ childId, sponsorId }: { childId: string; sponsorId: string }) => {
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          child_id: childId,
          sponsor_id: sponsorId,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
      queryClient.invalidateQueries({ queryKey: ['all-children'] });
      toast.success(t("sponsorship.success.created"));
    },
    onError: () => {
      toast.error(t("sponsorship.error.create"));
    }
  });

  const deleteSponsorship = useMutation({
    mutationFn: async (sponsorshipId: string) => {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
      queryClient.invalidateQueries({ queryKey: ['all-children'] });
      toast.success(t("sponsorship.success.deleted"));
    },
    onError: () => {
      toast.error(t("sponsorship.error.delete"));
    }
  });

  return {
    sponsorships,
    allChildren,
    isLoading: sponsorshipsLoading || childrenLoading,
    createSponsorship,
    deleteSponsorship
  };
};