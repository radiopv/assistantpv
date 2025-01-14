import { useQuery } from "@tanstack/react-query";
import { NotificationBar } from "@/components/Dashboard/NotificationBar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, addYears, differenceInDays } from "date-fns";
import { fr, es } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import { TestimonialValidation } from "@/components/Validation/TestimonialValidation";
import { SponsorshipValidation } from "@/components/Validation/SponsorshipValidation";
import { PhotoValidation } from "@/components/Validation/PhotoValidation";
import { ChildAssignmentValidation } from "@/components/Validation/ChildAssignmentValidation";
import { AuditLogsList } from "@/components/Admin/AuditLogs/AuditLogsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { language } = useLanguage();
  const { user, isAssistant } = useAuth();
  
  const translations = {
    fr: {
      dashboard: "Tableau de bord",
      recentMessages: "Messages récents",
      checkMessages: "Consultez vos messages et notifications dans l'onglet Messages.",
      upcomingBirthdays: "Anniversaires à venir",
      today: "Aujourd'hui !",
      days: "jours",
      willCelebrate: "Fêtera ses",
      years: "ans",
      validation: "Validation",
      history: "Historique",
      sponsorships: "Parrainages",
      photos: "Photos",
      testimonials: "Témoignages",
      childRequests: "Demandes d'enfants"
    },
    es: {
      dashboard: "Panel de control",
      recentMessages: "Mensajes recientes",
      checkMessages: "Consulte sus mensajes y notificaciones en la pestaña Mensajes.",
      upcomingBirthdays: "Próximos cumpleaños",
      today: "¡Hoy!",
      days: "días",
      willCelebrate: "Cumplirá",
      years: "años",
      validation: "Validación",
      history: "Historial",
      sponsorships: "Patrocinios",
      photos: "Fotos",
      testimonials: "Testimonios",
      childRequests: "Solicitudes de niños"
    }
  };

  const t = translations[language as keyof typeof translations];
  const dateLocale = language === 'fr' ? fr : es;

  const { data: upcomingBirthdays } = useQuery({
    queryKey: ['upcoming-birthdays'],
    queryFn: async () => {
      const { data: children } = await supabase
        .from('children')
        .select('id, name, birth_date, age')
        .not('birth_date', 'is', null)
        .order('birth_date');

      if (!children) return [];

      const today = new Date();
      const nextBirthdays = children
        .map(child => {
          const birthDate = new Date(child.birth_date);
          const nextBirthday = addYears(birthDate, child.age + 1);
          const daysUntil = differenceInDays(nextBirthday, today);
          return {
            ...child,
            nextBirthday,
            daysUntil,
          };
        })
        .filter(child => child.daysUntil >= 0 && child.daysUntil <= 30)
        .sort((a, b) => a.daysUntil - b.daysUntil);

      return nextBirthdays;
    }
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
        <NotificationBar />
      </div>
      
      {/* Messages récents */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">{t.recentMessages}</h2>
          <p className="text-gray-600">
            {t.checkMessages}
          </p>
        </div>
      </Card>

      {/* Section Validation et Historique */}
      {isAssistant && (
        <div className="grid gap-6">
          <Tabs defaultValue="validation" className="w-full">
            <TabsList>
              <TabsTrigger value="validation">{t.validation}</TabsTrigger>
              <TabsTrigger value="history">{t.history}</TabsTrigger>
            </TabsList>

            <TabsContent value="validation">
              <Card className="p-6">
                <Tabs defaultValue="sponsorships">
                  <TabsList>
                    <TabsTrigger value="sponsorships">{t.sponsorships}</TabsTrigger>
                    <TabsTrigger value="photos">{t.photos}</TabsTrigger>
                    <TabsTrigger value="testimonials">{t.testimonials}</TabsTrigger>
                    <TabsTrigger value="children">{t.childRequests}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sponsorships">
                    <SponsorshipValidation />
                  </TabsContent>

                  <TabsContent value="photos">
                    <PhotoValidation />
                  </TabsContent>

                  <TabsContent value="testimonials">
                    <TestimonialValidation />
                  </TabsContent>

                  <TabsContent value="children">
                    <ChildAssignmentValidation />
                  </TabsContent>
                </Tabs>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6">
                <AuditLogsList />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Anniversaires à venir */}
      {upcomingBirthdays && upcomingBirthdays.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">{t.upcomingBirthdays}</h2>
            <div className="divide-y">
              {upcomingBirthdays.map((child) => (
                <div key={child.id} className="py-3">
                  <p className="text-gray-800">
                    <span className="font-medium">{child.name}</span> - {child.daysUntil === 0 ? (
                      <span className="text-green-600 font-semibold">{t.today}</span>
                    ) : (
                      <span>
                        {format(child.nextBirthday, "d MMMM", { locale: dateLocale })} ({child.daysUntil} {t.days})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.willCelebrate} {child.age + 1} {t.years}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;