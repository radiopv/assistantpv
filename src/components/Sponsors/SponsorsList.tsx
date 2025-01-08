import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorshipAccordion } from "./SponsorshipAccordion";
import { SearchInput } from "@/components/ui/search-input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors: initialSponsors, isLoading }: SponsorsListProps) => {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const { t } = useLanguage();

  const handleVerificationChange = async (sponsorId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_verified: checked })
        .eq('id', sponsorId);

      if (error) throw error;
      
      setSponsors(prevSponsors =>
        prevSponsors.map(s =>
          s.id === sponsorId
            ? { ...s, is_verified: checked }
            : s
        )
      );
    } catch (error) {
      console.error('Error updating sponsor verification:', error);
    }
  };

  const handleStatusChange = async (sponsorId: string, field: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ [field]: value })
        .eq('id', sponsorId);

      if (error) throw error;
      
      setSponsors(prevSponsors =>
        prevSponsors.map(s =>
          s.id === sponsorId
            ? { ...s, [field]: value }
            : s
        )
      );
    } catch (error) {
      console.error('Error updating sponsor status:', error);
    }
  };

  const filterAndSortSponsors = (sponsors: any[], isActive: boolean) => {
    let filtered = sponsors.filter(sponsor => {
      const searchString = `${sponsor.name} ${sponsor.email} ${sponsor.city}`.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      const hasChildren = sponsor.sponsorships?.length > 0;
      return searchString.includes(searchTermLower) && 
             (isActive ? hasChildren : !hasChildren);
    });

    return filtered.sort((a, b) => {
      if (sortOrder === "recent") {
        const latestA = Math.max(...(a.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        const latestB = Math.max(...(b.sponsorships?.map((s: any) => new Date(s.start_date).getTime()) || [0]));
        return latestB - latestA;
      } else if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="active">{t("activeSponsors")}</TabsTrigger>
        <TabsTrigger value="inactive">{t("inactiveSponsors")}</TabsTrigger>
      </TabsList>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder={t("searchByNameEmailCity")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">{t("mostRecent")}</SelectItem>
            <SelectItem value="name">{t("name")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="active">
        <div className="space-y-6">
          {filterAndSortSponsors(sponsors, true).map((sponsor) => (
            <Card key={sponsor.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
                    <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                    <p className="text-sm text-gray-500">{sponsor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Vérifié</span>
                    <Checkbox
                      checked={sponsor.is_verified}
                      onCheckedChange={(checked) => handleVerificationChange(sponsor.id, checked as boolean)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Statut</span>
                    <Switch
                      checked={sponsor.is_active}
                      onCheckedChange={(checked) => handleStatusChange(sponsor.id, 'is_active', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Ville</p>
                    <p className="text-gray-500">{sponsor.city || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-500">{sponsor.phone || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>

              <SponsorshipAccordion
                sponsor={sponsor}
                onUpdate={() => {
                  setSponsors(prevSponsors =>
                    prevSponsors.map(s =>
                      s.id === sponsor.id
                        ? { ...s, ...sponsor }
                        : s
                    )
                  );
                }}
              />
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="inactive">
        <div className="space-y-6">
          {filterAndSortSponsors(sponsors, false).map((sponsor) => (
            <Card key={sponsor.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
                    <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                    <p className="text-sm text-gray-500">{sponsor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Vérifié</span>
                    <Checkbox
                      checked={sponsor.is_verified}
                      onCheckedChange={(checked) => handleVerificationChange(sponsor.id, checked as boolean)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Statut</span>
                    <Switch
                      checked={sponsor.is_active}
                      onCheckedChange={(checked) => handleStatusChange(sponsor.id, 'is_active', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Ville</p>
                    <p className="text-gray-500">{sponsor.city || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-gray-500">{sponsor.phone || 'Non spécifié'}</p>
                  </div>
                </div>
              </div>

              <SponsorshipAccordion
                sponsor={sponsor}
                onUpdate={() => {
                  setSponsors(prevSponsors =>
                    prevSponsors.map(s =>
                      s.id === sponsor.id
                        ? { ...s, ...sponsor }
                        : s
                    )
                  );
                }}
              />
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};