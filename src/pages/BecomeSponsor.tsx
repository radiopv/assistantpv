import { SponsorshipRequestForm } from "@/components/Sponsorship/SponsorshipRequestForm";
import { useLanguage } from "@/contexts/LanguageContext";

const BecomeSponsor = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{t("becomeSponsor")}</h1>
          <p className="text-gray-600">{t("sponsorshipDescription")}</p>
        </div>

        <SponsorshipRequestForm />
      </div>
    </div>
  );
};

export default BecomeSponsor;