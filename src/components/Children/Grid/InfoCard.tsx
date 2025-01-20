import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const InfoCard = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "À propos du parrainage",
      content: "Le parrainage n'est pas un engagement à long terme. Vous pouvez y mettre fin à tout moment depuis votre espace parrain, sans justification nécessaire. Les enfants affichés en premier sont ceux qui ont les besoins les plus urgents ou qui attendent un parrain depuis le plus longtemps."
    },
    es: {
      title: "Sobre el patrocinio",
      content: "El patrocinio no es un compromiso a largo plazo. Puede terminarlo en cualquier momento desde su espacio de padrino, sin necesidad de justificación. Los niños que se muestran primero son aquellos con necesidades más urgentes o que han estado esperando un padrino durante más tiempo."
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card className="p-4 bg-orange-50 border-orange-200">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h3 className="font-semibold text-orange-800">{t.title}</h3>
          <p className="text-orange-700 text-sm">{t.content}</p>
        </div>
      </div>
    </Card>
  );
};