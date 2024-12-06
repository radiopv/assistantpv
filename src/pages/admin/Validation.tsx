import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const ValidationPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorship-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: id,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

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
        description: t("errorApprovingRequest"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase.rpc('reject_sponsorship_request', {
        request_id: id,
        admin_id: (await supabase.auth.getUser()).data.user?.id
      });

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
        description: t("errorRejectingRequest"),
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">{t("validationPage")}</h1>
      
      <Tabs defaultValue="sponsorship" className="w-full">
        <TabsList>
          <TabsTrigger value="sponsorship">{t("sponsorshipRequests")}</TabsTrigger>
          <TabsTrigger value="photos">{t("photoValidation")}</TabsTrigger>
          <TabsTrigger value="testimonials">{t("testimonialValidation")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsorship">
          <Card className="p-4">
            {isLoading ? (
              <p className="text-center">{t("loading")}</p>
            ) : (
              <RequestsList
                requests={requests || []}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card className="p-4">
            <p className="text-center text-gray-500">{t("comingSoon")}</p>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card className="p-4">
            <p className="text-center text-gray-500">{t("comingSoon")}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationPage;