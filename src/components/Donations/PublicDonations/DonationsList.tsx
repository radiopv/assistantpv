import { motion, AnimatePresence } from "framer-motion";
import { DonationCard } from "@/components/Donations/DonationCard";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <motion.div 
      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <AnimatePresence>
        {donations.map((donation) => (
          <motion.div
            key={donation.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <DonationCard donation={donation} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};