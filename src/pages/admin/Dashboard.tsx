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
      const [sponsorshipCount, photoCount, testimonialCount, childRequestCount] = await Promise.all([
        supabase.from('sponsorship_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('album_media').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('temoignage').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('child_assignment_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      return {
        sponsorships: sponsorshipCount.count || 0,
        photos: photoCount.count || 0,
        testimonials: testimonialCount.count || 0,
        childRequests: childRequestCount.count || 0
      };
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold">Parrainages en attente</h3>
          <p className="text-2xl">{unreadCount?.sponsorships || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Photos à valider</h3>
          <p className="text-2xl">{unreadCount?.photos || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Témoignages à valider</h3>
          <p className="text-2xl">{unreadCount?.testimonials || 0}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Demandes d'enfants</h3>
          <p className="text-2xl">{unreadCount?.childRequests || 0}</p>
        </Card>
      </div>

      <Tabs defaultValue="sponsorships" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sponsorships">
            Parrainages
            {unreadCount?.sponsorships ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.sponsorships}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="photos">
            Photos
            {unreadCount?.photos ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.photos}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="testimonials">
            Témoignages
            {unreadCount?.testimonials ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.testimonials}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="child-requests">
            Demandes d'enfants
            {unreadCount?.childRequests ? (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {unreadCount.childRequests}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
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