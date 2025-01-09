import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const DonationsHeader = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      donationsTitle: "Nos actions sur le terrain",
      donationsSubtitle: "Découvrez l'impact de nos actions à Cuba grâce à nos assistants dévoués",
    },
    es: {
      donationsTitle: "Nuestras acciones en el terreno",
      donationsSubtitle: "Descubra el impacto de nuestras acciones en Cuba gracias a nuestros asistentes dedicados",
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-title">
        {t.donationsTitle}
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {t.donationsSubtitle}
      </p>
    </motion.div>
  );
};