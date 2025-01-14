import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestimonialValidation } from "@/components/Validation/TestimonialValidation";
import { SponsorshipValidation } from "@/components/Validation/SponsorshipValidation";
import { PhotoValidation } from "@/components/Validation/PhotoValidation";
import { ChildAssignmentValidation } from "@/components/Validation/ChildAssignmentValidation";
import { MessageList } from "@/components/Messages/MessageList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboard = () => {
  const { data: unreadCount } = useQuery({
    queryKey: ['unread-validations'],
    queryFn: async () => {
      console.log("Fetching unread counts...");
      const [sponsorshipCount, photoCount, testimonialCount, childRequestCount] = await Promise.all([
        supabase.from('sponsorship_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('album_media').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('temoignage').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('child_assignment_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      console.log("Counts fetched:", { sponsorshipCount, photoCount, testimonialCount, childRequestCount });

      return {
        sponsorships: sponsorshipCount.count || 0,
        photos: photoCount.count || 0,
        testimonials: testimonialCount.count || 0,
        childRequests: childRequestCount.count || 0
      };
    }
  });

  const { data: upcomingBirthdays } = useQuery({
    queryKey: ['upcoming-birthdays'],
    queryFn: async () => {
      const { data: children } = await supabase
        .from('children')
        .select('name, birth_date')
        .eq('status', 'sponsored')
        .order('birth_date');
      
      return children || [];
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700">Parrainages en attente</h3>
          <p className="text-2xl font-bold text-cuba-coral">{unreadCount?.sponsorships || 0}</p>
        </Card>
        <Card className="p-4 bg-white shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700">Photos à valider</h3>
          <p className="text-2xl font-bold text-cuba-coral">{unreadCount?.photos || 0}</p>
        </Card>
        <Card className="p-4 bg-white shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700">Témoignages à valider</h3>
          <p className="text-2xl font-bold text-cuba-coral">{unreadCount?.testimonials || 0}</p>
        </Card>
        <Card className="p-4 bg-white shadow hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-700">Demandes d'enfants</h3>
          <p className="text-2xl font-bold text-cuba-coral">{unreadCount?.childRequests || 0}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-4">Messages récents</h3>
          <p className="text-gray-600">
            Consultez vos messages et notifications dans l'onglet Messages.
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-4">Anniversaires à venir</h3>
          {upcomingBirthdays && upcomingBirthdays.length > 0 ? (
            <ul className="space-y-2">
              {upcomingBirthdays.map((child) => {
                const birthDate = new Date(child.birth_date);
                const today = new Date();
                const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBirthday < today) {
                  nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
                }
                const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const age = today.getFullYear() - birthDate.getFullYear();
                
                return (
                  <li key={child.name} className="flex justify-between items-center">
                    <span>{child.name} - {new Date(child.birth_date).toLocaleDateString('fr-FR')}</span>
                    <span className="text-gray-600">
                      Fêtera ses {age + 1} ans ({daysUntil} jours)
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">Aucun anniversaire à venir</p>
          )}
        </Card>
      </div>

      <Tabs defaultValue="sponsorships" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="sponsorships" className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white">
            Parrainages
            {unreadCount?.sponsorships ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.sponsorships}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white">
            Photos
            {unreadCount?.photos ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.photos}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white">
            Témoignages
            {unreadCount?.testimonials ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.testimonials}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="child-requests" className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white">
            Demandes d'enfants
            {unreadCount?.childRequests ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.childRequests}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-cuba-coral data-[state=active]:text-white">
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sponsorships" className="space-y-4">
          <Card className="p-4">
            <SponsorshipValidation />
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card className="p-4">
            <PhotoValidation />
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <Card className="p-4">
            <TestimonialValidation />
          </Card>
        </TabsContent>

        <TabsContent value="child-requests" className="space-y-4">
          <Card className="p-4">
            <ChildAssignmentValidation />
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="p-4">
            <MessageList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;