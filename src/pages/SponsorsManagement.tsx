import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

const SponsorsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select(`
          *,
          sponsorships (
            child:children (
              id,
              name
            )
          )
        `)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const filteredSponsors = sponsors?.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Parrains</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un parrain..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <SponsorsList sponsors={filteredSponsors || []} isLoading={isLoading} />
    </div>
  );
};

export default SponsorsManagement;