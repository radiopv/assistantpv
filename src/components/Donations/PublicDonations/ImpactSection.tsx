import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DonationStats } from "@/components/Donations/DonationStats";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImpactSectionProps {
  donations: any[];
}

export const ImpactSection = ({ donations }: ImpactSectionProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      impactTitle: "Notre Impact",
      impactSubtitle: "Ensemble, nous faisons la différence"
    },
    es: {
      impactTitle: "Nuestro Impacto",
      impactSubtitle: "Juntos hacemos la diferencia"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="bg-primary text-white p-8 rounded-xl shadow-lg border-none">
        <h2 className="text-2xl font-bold mb-4 font-title">{t.impactTitle}</h2>
        <p className="mb-6 text-white/90">{t.impactSubtitle}</p>
        {donations && <DonationStats donations={donations} />}
      </Card>
    </motion.div>
  );
};