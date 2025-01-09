import { motion, AnimatePresence } from "framer-motion";
import { DonationCard } from "@/components/Donations/DonationCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface DonationsListProps {
  donations: any[];
  viewMode: "grid" | "list";
}

export const DonationsList = ({ donations, viewMode }: DonationsListProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      noDonationsFound: "Aucun don trouvé"
    },
    es: {
      noDonationsFound: "No se encontraron donaciones"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!donations?.length) {
    return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 py-12"
      >
        {t.noDonationsFound}
      </motion.p>
    );
  }

  return (
    <div 
      className={cn(
        "w-full",
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "space-y-8"
      )}
    >
      <AnimatePresence>
        {donations.map((donation) => (
          <motion.div
            key={donation.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DonationCard donation={donation} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};