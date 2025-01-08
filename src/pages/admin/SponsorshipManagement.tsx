import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

export default function SponsorshipManagement() {
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

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
            child:children (
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

  const handleAddChild = async (sponsorId: string) => {
    try {
      const { data: availableChildren, error: childrenError } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false)
        .order('name');

      if (childrenError) throw childrenError;

      if (!availableChildren?.length) {
        toast.error(t("noAvailableChildren"));
        return;
      }

      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: availableChildren[0].id,
          status: 'active'
        });

      if (sponsorshipError) throw sponsorshipError;

      const { error: childError } = await supabase
        .from('children')
        .update({ 
          is_sponsored: true,
          sponsor_id: sponsorId 
        })
        .eq('id', availableChildren[0].id);

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
      s.child?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return sponsorMatch || childrenMatch;
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const activeSponsors = filteredSponsors?.filter(sponsor => 
    sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = filteredSponsors?.filter(sponsor => 
    !sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("sponsorshipManagement")}</h1>

      {/* Search Bar */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Sponsors Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("activeSponsors")}</h2>
          <div className="space-y-4">
            {activeSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <Collapsible>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={sponsor.is_verified}
                        onCheckedChange={(checked) => 
                          handleVerificationChange(sponsor.id, checked as boolean)
                        }
                      />
                      <CollapsibleTrigger className="hover:underline">
                        <div>
                          <h3 className="font-semibold">{sponsor.name}</h3>
                          <p className="text-sm text-gray-500">{sponsor.email}</p>
                        </div>
                      </CollapsibleTrigger>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleAddChild(sponsor.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>

                  <CollapsibleContent>
                    <div className="space-y-2 mt-2">
                      {sponsor.sponsorships
                        ?.filter((s: any) => s.status === 'active')
                        .sort((a: any, b: any) => a.child?.name.localeCompare(b.child?.name))
                        .map((sponsorship: any) => (
                          <div
                            key={sponsorship.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm">{sponsorship.child?.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleRemoveChild(sponsor.id, sponsorship.child_id)}
                            >
                              <UserMinus className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>

        {/* Inactive Sponsors Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("inactiveSponsors")}</h2>
          <div className="space-y-4">
            {inactiveSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <Collapsible>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={sponsor.is_verified}
                        onCheckedChange={(checked) => 
                          handleVerificationChange(sponsor.id, checked as boolean)
                        }
                      />
                      <CollapsibleTrigger className="hover:underline">
                        <div>
                          <h3 className="font-semibold">{sponsor.name}</h3>
                          <p className="text-sm text-gray-500">{sponsor.email}</p>
                        </div>
                      </CollapsibleTrigger>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleAddChild(sponsor.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}