import { DonationForm } from "@/components/Donations/DonationForm";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const AddDonation = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Ajouter un don",
      subtitle: "Enregistrez un nouveau don avec tous les détails nécessaires"
    },
    es: {
      title: "Agregar donación",
      subtitle: "Registre una nueva donación con todos los detalles necesarios"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-gray-600 mt-2">{t.subtitle}</p>
      </div>

      <Card className="p-6">
        <DonationForm onDonationComplete={() => {
          window.location.href = '/donations';
        }} />
      </Card>
    </div>
  );
};

export default AddDonation;