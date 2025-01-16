import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SponsorListItem } from "@/components/Sponsors/SponsorListItem";
import { BulkOperationsDialog } from "@/components/Sponsors/SponsorshipManagement/BulkOperationsDialog";

export default function SponsorshipManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  const { data: sponsorshipData, isLoading, refetch } = useQuery({
    queryKey: ["sponsorships-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          id,
          name,
          email,
          is_active,
          city,
          phone,
          sponsorships (
            id,
            status,
            child:children (
              id,
              name,
              photo_url,
              is_sponsored,
              city,
              birth_date,
              age
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

  const handleSponsorSelect = (sponsorId: string, selected: boolean) => {
    setSelectedSponsors(prev => 
      selected 
        ? [...prev, sponsorId]
        : prev.filter(id => id !== sponsorId)
    );
  };

  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const activeSponsors = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = sponsorshipData?.filter(sponsor => 
    !sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const sponsoredNoName = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active' && !sponsor.name)
  ) || [];

  return (
    <div className="w-full p-0">
      <div className="space-y-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Gestion des Parrainages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un parrain ou un enfant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="active" className="min-h-[44px]">
              Parrains Actifs ({activeSponsors.length})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="min-h-[44px]">
              Parrains Inactifs ({inactiveSponsors.length})
            </TabsTrigger>
            <TabsTrigger value="unsponsored" className="min-h-[44px]">
              Enfants Sans Parrain ({unsponsored?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="noname" className="min-h-[44px]">
              Parrains Sans Nom ({sponsoredNoName.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filterBySearch(activeSponsors).map((sponsor) => (
                <SponsorListItem
                  key={sponsor.id}
                  sponsor={sponsor}
                  onSelect={handleSponsorSelect}
                  isSelected={selectedSponsors.includes(sponsor.id)}
                  onAddChild={() => {}}
                  onStatusChange={() => {}}
                  onVerificationChange={() => {}}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="mt-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filterBySearch(inactiveSponsors).map((sponsor) => (
                <SponsorListItem
                  key={sponsor.id}
                  sponsor={sponsor}
                  onSelect={handleSponsorSelect}
                  isSelected={selectedSponsors.includes(sponsor.id)}
                  onAddChild={() => {}}
                  onStatusChange={() => {}}
                  onVerificationChange={() => {}}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unsponsored" className="mt-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filterBySearch(unsponsored || []).map((child) => (
                <Card key={child.id} className="p-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {child.name}
                      <AlertCircle className="text-yellow-500" size={20} />
                    </h3>
                    <p className="text-gray-600">{child.city}</p>
                    {child.age && (
                      <p className="text-gray-600">{child.age} ans</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="noname" className="mt-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filterBySearch(sponsoredNoName).map((sponsor) => (
                <Card key={sponsor.id} className="p-4">
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AlertCircle className="text-red-500" size={20} />
                      Parrain sans nom
                    </h3>
                    <p className="text-gray-600 break-all">{sponsor.email}</p>
                    <div className="mt-2">
                      <h4 className="font-medium mb-2">Enfants parrainés :</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {sponsor.sponsorships
                          ?.filter(s => s.status === 'active')
                          .map(s => (
                            <li key={s.id} className="text-gray-600">
                              {s.child.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <BulkOperationsDialog
          isOpen={showBulkOperations}
          onClose={() => setShowBulkOperations(false)}
          selectedSponsors={selectedSponsors}
          onOperationComplete={() => {
            setSelectedSponsors([]);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
