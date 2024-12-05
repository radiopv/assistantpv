import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { useToast } from "@/components/ui/use-toast";
import type { SponsorshipRequest } from "@/integrations/supabase/types/sponsorship";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorsManagement = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: sponsors, isLoading: sponsorsLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          *,
          sponsorships (
            child (
              id,
              name,
              photo_url
            )
          )
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("sponsorshipRequestApproved"),
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("sponsorshipRequestApprovalError"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("sponsorshipRequestRejected"),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("sponsorshipRequestRejectionError"),
      });
    }
  };

  if (sponsorsLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const pendingRequests = requests || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("sponsorshipManagement")}</h1>

      <Tabs defaultValue="sponsors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sponsors">
            {t("sponsors")}
          </TabsTrigger>
          <TabsTrigger value="requests">
            {t("pendingRequests")} ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="become-sponsor">
            {t("becomeSponsorRequests")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sponsors" className="mt-6">
          <SponsorsList 
            sponsors={sponsors || []} 
            isLoading={sponsorsLoading} 
          />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <RequestsList
            requests={pendingRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="become-sponsor" className="mt-6">
          <Card className="p-4">
            <p className="text-center text-gray-500">
              {t("becomeSponsorRequestsComingSoon")}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsManagement;