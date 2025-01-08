import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipAssociationDialog } from "@/components/Sponsors/SponsorshipAssociationDialog";

export default function SponsorshipManagement() {
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useLanguage();

  const { data: sponsors, isLoading } = useQuery({
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

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("sponsorshipManagement")}</h1>
      </div>

      <div className="grid gap-6">
        {sponsors?.map((sponsor) => (
          <Card key={sponsor.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{sponsor.name}</h2>
                <p className="text-gray-500">{sponsor.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSponsor(sponsor);
                  setIsDialogOpen(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                {t("addChild")}
              </button>
            </div>

            <div className="grid gap-4">
              {sponsor.sponsorships?.map((sponsorship: any) => (
                <div
                  key={sponsorship.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {sponsorship.child?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sponsorship.child?.age} {t("yearsOld")} - {sponsorship.child?.city}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
                      {sponsorship.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedSponsor && (
        <SponsorshipAssociationDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedSponsor(null);
          }}
          sponsor={selectedSponsor}
        />
      )}
    </div>
  );
}
