import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipAssociationDialog } from "@/components/Sponsors/SponsorshipAssociationDialog";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function SponsorshipManagement() {
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
              city
            )
          )
        `);

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
      // Update sponsorship status
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .update({ status: 'ended' })
        .eq('sponsor_id', sponsorId)
        .eq('child_id', childId);

      if (sponsorshipError) throw sponsorshipError;

      // Update child status
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

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const activeSponsors = sponsors?.filter(sponsor => 
    sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ) || [];

  const inactiveSponsors = sponsors?.filter(sponsor => 
    !sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ) || [];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{t("sponsorshipManagement")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Sponsors Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("activeSponsors")}</h2>
          <div className="space-y-4">
            {activeSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={sponsor.is_verified}
                      onCheckedChange={(checked) => 
                        handleVerificationChange(sponsor.id, checked as boolean)
                      }
                    />
                    <div>
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <p className="text-sm text-gray-500">{sponsor.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSponsor(sponsor);
                      setIsDialogOpen(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("addChild")}
                  </Button>
                </div>

                <div className="space-y-2">
                  {sponsor.sponsorships
                    ?.filter((s: any) => s.status === 'active')
                    .map((sponsorship: any) => (
                      <div
                        key={sponsorship.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span>{sponsorship.child?.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveChild(sponsor.id, sponsorship.child_id)}
                        >
                          <UserMinus className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                </div>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={sponsor.is_verified}
                      onCheckedChange={(checked) => 
                        handleVerificationChange(sponsor.id, checked as boolean)
                      }
                    />
                    <div>
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <p className="text-sm text-gray-500">{sponsor.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSponsor(sponsor);
                      setIsDialogOpen(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("addChild")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedSponsor && (
        <SponsorshipAssociationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedSponsor(null);
            refetch();
          }}
          sponsor={selectedSponsor}
        />
      )}
    </div>
  );
}