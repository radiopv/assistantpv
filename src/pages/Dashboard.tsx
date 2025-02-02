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
import { useEffect } from "react";
import { toast } from "sonner";

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
      childRequests: "Demandes d'enfants",
      pendingApprovals: "Vous avez des éléments en attente d'approbation"
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
      childRequests: "Solicitudes de niños",
      pendingApprovals: "Tiene elementos pendientes de aprobación"
    }
  };

  const t = translations[language as keyof typeof translations];
  const dateLocale = language === 'fr' ? fr : es;

  // Query for pending photos
  const { data: pendingPhotos } = useQuery({
    queryKey: ['pending-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .eq('is_approved', false);
      if (error) throw error;
      return data || [];
    },
    enabled: isAssistant
  });

  // Query for pending testimonials
  const { data: pendingTestimonials } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('is_approved', false);
      if (error) throw error;
      return data || [];
    },
    enabled: isAssistant
  });

  // Query for pending child requests
  const { data: pendingChildRequests } = useQuery({
    queryKey: ['pending-child-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_assignment_requests')
        .select('*')
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    },
    enabled: isAssistant
  });

  // Effect to show notifications for pending items
  useEffect(() => {
    if (isAssistant) {
      const totalPending = (pendingPhotos?.length || 0) + 
                          (pendingTestimonials?.length || 0) + 
                          (pendingChildRequests?.length || 0);
      
      if (totalPending > 0) {
        toast(t.pendingApprovals, {
          description: `Photos: ${pendingPhotos?.length || 0}, Témoignages: ${pendingTestimonials?.length || 0}, Demandes: ${pendingChildRequests?.length || 0}`,
          duration: 5000,
        });
      }
    }
  }, [pendingPhotos, pendingTestimonials, pendingChildRequests, isAssistant, t]);

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
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
        <NotificationBar />
      </div>
      
      {/* Messages récents */}
      <Card className="p-4 sm:p-6">
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
            <TabsList className="w-full flex flex-wrap gap-2">
              <TabsTrigger value="validation">{t.validation}</TabsTrigger>
              <TabsTrigger value="history">{t.history}</TabsTrigger>
            </TabsList>

            <TabsContent value="validation">
              <Card className="p-4 sm:p-6">
                <Tabs defaultValue="sponsorships">
                  <TabsList className="w-full flex flex-wrap gap-2 mb-4">
                    <TabsTrigger value="sponsorships">
                      {t.sponsorships}
                    </TabsTrigger>
                    <TabsTrigger value="photos">
                      {t.photos} {pendingPhotos?.length ? `(${pendingPhotos.length})` : ''}
                    </TabsTrigger>
                    <TabsTrigger value="testimonials">
                      {t.testimonials} {pendingTestimonials?.length ? `(${pendingTestimonials.length})` : ''}
                    </TabsTrigger>
                    <TabsTrigger value="children">
                      {t.childRequests} {pendingChildRequests?.length ? `(${pendingChildRequests.length})` : ''}
                    </TabsTrigger>
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
              <Card className="p-4 sm:p-6">
                <AuditLogsList />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {upcomingBirthdays && upcomingBirthdays.length > 0 && (
        <Card className="p-4 sm:p-6">
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