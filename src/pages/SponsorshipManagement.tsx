import { useLanguage } from "@/contexts/LanguageContext";

const SponsorshipManagement = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('sponsorship_management')}</h1>
      {/* Sponsorship management content will be implemented later */}
    </div>
  );
};

export default SponsorshipManagement;