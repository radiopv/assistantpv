import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  fr: {
    welcomeMessage: "Bienvenue",
    loading: "Chargement...",
    sponsorDashboard: "Mon Espace Parrain"
  },
  es: {
    welcomeMessage: "Bienvenido",
    loading: "Cargando...",
    sponsorDashboard: "Mi Panel de Padrino"
  }
};

export const DashboardHeader = () => {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];

  return (
    <h2 className="text-2xl font-medium text-gray-800">
      {t.sponsorDashboard}
    </h2>
  );
};