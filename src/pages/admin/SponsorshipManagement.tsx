import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SponsorshipManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all sponsors and their sponsorships
  const { data: sponsorshipData, isLoading } = useQuery({
    queryKey: ["sponsorships-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          id,
          name,
          email,
          is_active,
          sponsorships (
            id,
            status,
            child:children (
              id,
              name,
              photo_url,
              is_sponsored
            )
          )
        `)
        .order('name');

      if (error) {
        toast.error("Erreur lors du chargement des données");
        throw error;
      }
      return data;
    }
  });

  // Fetch children without sponsors
  const { data: unsponsored } = useQuery({
    queryKey: ["unsponsored-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .is('sponsor_id', null)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  // Filter and organize data
  const activeSponsors = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = sponsorshipData?.filter(sponsor => 
    !sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const sponsoredNoName = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active' && !sponsor.name)
  ) || [];

  // Search functionality
  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestion des Parrainages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un parrain ou un enfant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Parrains Actifs ({activeSponsors.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Parrains Inactifs ({inactiveSponsors.length})
          </TabsTrigger>
          <TabsTrigger value="unsponsored">
            Enfants Sans Parrain ({unsponsored?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="noname">
            Parrains Sans Nom ({sponsoredNoName.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(activeSponsors).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {sponsor.name}
                  {sponsor.is_active && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Actif
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{sponsor.email}</p>
                <div className="mt-2">
                  <h4 className="font-medium">Enfants parrainés :</h4>
                  <ul className="list-disc list-inside">
                    {sponsor.sponsorships
                      ?.filter(s => s.status === 'active')
                      .map(s => (
                        <li key={s.id}>
                          {s.child.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(inactiveSponsors).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                <p className="text-gray-600">{sponsor.email}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unsponsored">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(unsponsored || []).map((child) => (
              <Card key={child.id} className="p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {child.name}
                  <AlertCircle className="text-yellow-500" size={20} />
                </h3>
                <p className="text-gray-600">{child.city}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="noname">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(sponsoredNoName).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  Parrain sans nom
                </h3>
                <p className="text-gray-600">{sponsor.email}</p>
                <div className="mt-2">
                  <h4 className="font-medium">Enfants parrainés :</h4>
                  <ul className="list-disc list-inside">
                    {sponsor.sponsorships
                      ?.filter(s => s.status === 'active')
                      .map(s => (
                        <li key={s.id}>
                          {s.child.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}