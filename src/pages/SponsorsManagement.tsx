import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useToast } from "@/components/ui/use-toast";
import type { SponsorshipRequest } from "@/integrations/supabase/types/sponsorship";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorsManagement = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }

      return (data || []).map(request => ({
        ...request,
        is_long_term: Boolean(request.is_long_term),
        is_one_time: Boolean(request.is_one_time),
        terms_accepted: Boolean(request.terms_accepted),
        status: request.status || 'pending'
      })) as SponsorshipRequest[];
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

  if (requestsLoading) {
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

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">
            {t("pendingRequests")} ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            {t("activeSponsors")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <RequestsList
            requests={pendingRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <Card className="p-4">
            <p className="text-center text-gray-500">
              {t("activeSponsorsComingSoon")}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsManagement;
