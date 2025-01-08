import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Globe } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SponsorCard } from "@/components/Sponsors/SponsorshipManagement/SponsorCard";

export default function SponsorshipManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t, language, setLanguage } = useLanguage();

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

      if (error) throw error;
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

      if (error) throw error;
      return data;
    },
  });

  const handleVerificationChange = async (sponsorId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_verified: checked })
        .eq('id', sponsorId);

      if (error) throw error;
      toast.success(t("sponsorVerificationUpdated"));
      refetch();
    } catch (error) {
      console.error('Error updating sponsor verification:', error);
      toast.error(t("errorUpdatingVerification"));
    }
  };

  const handleRemoveChild = async (sponsorId: string, childId: string) => {
    try {
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .update({ status: 'ended' })
        .eq('sponsor_id', sponsorId)
        .eq('child_id', childId);

      if (sponsorshipError) throw sponsorshipError;

      const { error: childError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: false,
          status: 'available',
          sponsor_id: null 
        })
        .eq('id', childId);

      if (childError) throw childError;

      toast.success(t("childRemoved"));
      refetch();
    } catch (error) {
      console.error('Error removing child:', error);
      toast.error(t("errorRemovingChild"));
    }
  };

  const handleAddChild = async (sponsorId: string, childId: string) => {
    try {
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: 'active'
        });

      if (sponsorshipError) throw sponsorshipError;

      const { error: childError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: true,
          sponsor_id: sponsorId 
        })
        .eq('id', childId);

      if (childError) throw childError;

      toast.success(t("childAdded"));
      refetch();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error(t("errorAddingChild"));
    }
  };

  const filteredSponsors = sponsors?.filter(sponsor => {
    const sponsorMatch = sponsor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const childrenMatch = sponsor.sponsorships?.some(s => 
      s.children?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sponsorMatch || childrenMatch;
  });

  if (isLoading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  const activeSponsors = filteredSponsors?.filter(sponsor => 
    sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = filteredSponsors?.filter(sponsor => 
    !sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("sponsorshipManagement")}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === 'fr' ? 'es' : 'fr')}
          className="w-9 px-0"
        >
          <Globe className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchSponsorOrChild")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("activeSponsors")}</h2>
          <div className="space-y-4">
            {activeSponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                onVerificationChange={handleVerificationChange}
                onRemoveChild={handleRemoveChild}
                onAddChild={(childId) => handleAddChild(sponsor.id, childId)}
                availableChildren={availableChildren || []}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t("inactiveSponsors")}</h2>
          <div className="space-y-4">
            {inactiveSponsors.map((sponsor) => (
              <SponsorCard
                key={sponsor.id}
                sponsor={sponsor}
                onVerificationChange={handleVerificationChange}
                onRemoveChild={handleRemoveChild}
                onAddChild={(childId) => handleAddChild(sponsor.id, childId)}
                availableChildren={availableChildren || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}