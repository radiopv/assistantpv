import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const DonationsHeader = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Nos actions sur le terrain",
      subtitle: "Découvrez l'impact de nos actions à Cuba grâce à nos assistants dévoués",
      description: "Chaque don fait une différence directe dans la vie des enfants cubains. Ensemble, nous pouvons créer un avenir meilleur.",
      cta: "Rejoignez nos efforts"
    },
    es: {
      title: "Nuestras acciones en el terreno",
      subtitle: "Descubra el impacto de nuestras acciones en Cuba gracias a nuestros asistentes dedicados",
      description: "Cada donación hace una diferencia directa en la vida de los niños cubanos. Juntos podemos crear un futuro mejor.",
      cta: "Únase a nuestros esfuerzos"
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
        {t.title}
      </h1>
      <p className="text-xl max-w-3xl mx-auto text-white/90">
        {t.subtitle}
      </p>
      <p className="text-lg max-w-2xl mx-auto text-white/80">
        {t.description}
      </p>
      <Button 
        size="lg"
        variant="secondary"
        className="bg-white text-primary hover:bg-white/90 transition-colors mt-4"
      >
        <Heart className="w-5 h-5 mr-2" />
        {t.cta}
      </Button>
    </motion.div>
  );
};