import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const useSponsorshipData = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sponsors, isLoading, refetch } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select(`
          *,
          sponsorships (
            id,
            child_id,
            status,
            start_date,
            children:children (
              id,
              name,
              age,
              city,
              photo_url
            )
          )
        `)
        .order('name');

      if (error) {
        console.error("Error fetching sponsors:", error);
        throw error;
      }

      // Ne pas filtrer les parrainages ici, laissons le composant gérer ça
      return data;
    },
  });

  const { data: availableChildren } = useQuery({
    queryKey: ["available-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false)
        .order('name');

      if (error) {
        console.error("Error fetching available children:", error);
        throw error;
      }
      return data;
    },
  });

  const filteredSponsors = sponsors?.filter(sponsor => {
    const sponsorMatch = sponsor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const childrenMatch = sponsor.sponsorships?.some(s => 
      s.children?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sponsorMatch || childrenMatch;
  });

  return {
    sponsors: filteredSponsors,
    availableChildren,
    isLoading,
    searchTerm,
    setSearchTerm,
    refetch
  };
};