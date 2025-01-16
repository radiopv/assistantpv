import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorsListProps {
  sponsors: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectSponsor: (sponsorId: string) => void;
  isLoading?: boolean;
}

export const SponsorsList = ({
  sponsors,
  searchTerm,
  onSearchChange,
  onSelectSponsor,
  isLoading = false
}: SponsorsListProps) => {
  const { t } = useLanguage();

  const filteredSponsors = sponsors.filter(sponsor =>
    sponsor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder={t("searchSponsors")}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredSponsors.length === 0 ? (
          <p className="text-center text-gray-500 py-4">{t("noSponsorsFound")}</p>
        ) : (
          filteredSponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{sponsor.name}</p>
                <p className="text-sm text-gray-500">{sponsor.email}</p>
              </div>
              <Button
                onClick={() => {
                  console.log('Select button clicked for sponsor:', sponsor.id);
                  onSelectSponsor(sponsor.id);
                }}
                size="sm"
                disabled={isLoading}
              >
                {t("select")}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};