import { SponsorshipList } from "@/components/Sponsorship/SponsorshipList";
import { SponsorshipStats } from "@/components/Sponsorship/SponsorshipStats";

const Sponsorships = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Gestion des Parrainages</h2>
      <SponsorshipStats />
      <SponsorshipList />
    </div>
  );
};

export default Sponsorships;