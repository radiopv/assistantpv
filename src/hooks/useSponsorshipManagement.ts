import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SponsorshipWithDetails, GroupedSponsorship } from "@/integrations/supabase/types/sponsorship";
import { TableNames } from "@/integrations/supabase/types/database-tables";

export const useSponsorshipManagement = () => {
  const queryClient = useQueryClient();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .select(`
          *,
          sponsors (
            id,
            name,
            email,
            photo_url
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

      // Group sponsorships by sponsor
      const groupedData = (data as SponsorshipWithDetails[]).reduce<GroupedSponsorship[]>((acc, curr) => {
        const existingGroup = acc.find(g => g.sponsor.id === curr.sponsors.id);
        
        if (existingGroup) {
          existingGroup.sponsorships.push({
            id: curr.id,
            child: curr.children
          });
        } else {
          acc.push({
            sponsor: curr.sponsors,
            sponsorships: [{
              id: curr.id,
              child: curr.children
            }]
          });
        }
        
        return acc;
      }, []);

      return groupedData;
    }
  });

  const createSponsorship = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .insert({
          child_id: childId,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
    }
  });

  const deleteSponsorship = useMutation({
    mutationFn: async (sponsorshipId: string) => {
      const { error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
    }
  });

  const reassignChild = useMutation({
    mutationFn: async ({ childId, newSponsorId }: { childId: string; newSponsorId: string }) => {
      const { error } = await supabase
        .from(TableNames.SPONSORSHIPS)
        .update({ 
          sponsor_id: newSponsorId,
          updated_at: new Date().toISOString(),
          start_date: new Date().toISOString(),
          status: 'active'
        })
        .eq('child_id', childId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsorships'] });
    }
  });

  return {
    sponsorships,
    isLoading: sponsorshipsLoading,
    createSponsorship,
    deleteSponsorship,
    reassignChild
  };
};
