import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const DonationsHeader = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      donationsTitle: "Nos actions sur le terrain",
      donationsSubtitle: "Découvrez l'impact de nos actions à Cuba grâce à nos assistants dévoués",
      donationsDescription: "Chaque don fait une différence directe dans la vie des enfants cubains. Ensemble, nous pouvons créer un avenir meilleur."
    },
    es: {
      donationsTitle: "Nuestras acciones en el terreno",
      donationsSubtitle: "Descubra el impacto de nuestras acciones en Cuba gracias a nuestros asistentes dedicados",
      donationsDescription: "Cada donación hace una diferencia directa en la vida de los niños cubanos. Juntos podemos crear un futuro mejor."
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 bg-cuba-gradient p-8 md:p-12 rounded-xl shadow-lg text-white max-w-4xl mx-auto mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold font-title">
        {t.donationsTitle}
      </h1>
      <p className="text-xl max-w-3xl mx-auto text-white/90">
        {t.donationsSubtitle}
      </p>
      <p className="text-lg max-w-2xl mx-auto text-white/80">
        {t.donationsDescription}
      </p>
    </motion.div>
  );
};