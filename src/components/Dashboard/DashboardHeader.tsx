import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/types/dashboard";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  stats: DashboardStats;
}

export const DashboardHeader = ({ stats }: DashboardHeaderProps) => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue sur votre tableau de bord",
      totalChildren: "Enfants",
      sponsoredChildren: "Parrainés",
      availableChildren: "Disponibles",
      urgentNeeds: "Besoins urgents",
      sponsors: "Parrains",
      donations: "Dons",
      peopleHelped: "Personnes aidées"
    },
    es: {
      welcomeMessage: "Bienvenido a su panel de control",
      totalChildren: "Niños",
      sponsoredChildren: "Apadrinados",
      availableChildren: "Disponibles",
      urgentNeeds: "Necesidades urgentes",
      sponsors: "Padrinos",
      donations: "Donaciones",
      peopleHelped: "Personas ayudadas"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.welcomeMessage}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.totalChildren}</p>
          <p className="text-2xl font-bold">{stats.children.total}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.sponsoredChildren}</p>
          <p className="text-2xl font-bold">{stats.children.sponsored}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.availableChildren}</p>
          <p className="text-2xl font-bold">{stats.children.available}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.urgentNeeds}</p>
          <p className="text-2xl font-bold">{stats.children.urgent_needs}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.sponsors}</p>
          <p className="text-2xl font-bold">{stats.sponsors}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.donations}</p>
          <p className="text-2xl font-bold">{stats.donations.total}</p>
        </Card>

        <Card className="p-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">{t.peopleHelped}</p>
          <p className="text-2xl font-bold">{stats.donations.people_helped}</p>
        </Card>
      </div>
    </div>
  );
};