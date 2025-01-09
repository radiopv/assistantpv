import { useLanguage } from "@/contexts/LanguageContext";
import { SearchBar } from "@/components/Sponsors/SponsorshipManagement/SearchBar";
import { SponsorshipList } from "@/components/Sponsors/SponsorshipManagement/SponsorshipList";
import { SponsorshipHeader } from "@/components/Sponsors/SponsorshipManagement/SponsorshipHeader";
import { useSponsorshipData } from "@/components/Sponsors/SponsorshipManagement/useSponsorshipData";
import { useSponsorshipActions } from "@/components/Sponsors/SponsorshipManagement/useSponsorshipActions";

export default function SponsorshipManagement() {
  const { t, language, setLanguage } = useLanguage();
  const { 
    sponsors, 
    availableChildren, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    refetch 
  } = useSponsorshipData();

  const {
    handleVerificationChange,
    handleRemoveChild,
    handleAddChild
  } = useSponsorshipActions(refetch);

  if (isLoading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  const activeSponsors = sponsors?.filter(sponsor => 
    sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = sponsors?.filter(sponsor => 
    !sponsor.sponsorships?.some((s: any) => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <div className="container mx-auto p-4">
      <SponsorshipHeader 
        title={t("sponsorshipManagement")}
        onLanguageChange={() => setLanguage(language === 'fr' ? 'es' : 'fr')}
      />

      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder={t("searchSponsorOrChild")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SponsorshipList
          sponsors={activeSponsors}
          title={t("activeSponsors")}
          onVerificationChange={handleVerificationChange}
          onRemoveChild={handleRemoveChild}
          onAddChild={handleAddChild}
          availableChildren={availableChildren || []}
        />

        <SponsorshipList
          sponsors={inactiveSponsors}
          title={t("inactiveSponsors")}
          onVerificationChange={handleVerificationChange}
          onRemoveChild={handleRemoveChild}
          onAddChild={handleAddChild}
          availableChildren={availableChildren || []}
        />
      </div>
    </div>
  );
}