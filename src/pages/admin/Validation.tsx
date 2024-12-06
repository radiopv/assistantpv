import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const ValidationPage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: requests, isLoading: requestsLoading } = useQuery({
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

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', false);
      
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

  const handleApproveTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("testimonialApproved"),
      });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingTestimonial"),
      });
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("testimonialRejected"),
      });
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingTestimonial"),
      });
    }
  };

  const testimonialColumns = [
    {
      accessorKey: "author",
      header: t("author"),
    },
    {
      accessorKey: "content",
      header: t("content"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleApproveTestimonial(row.original.id)}
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRejectTestimonial(row.original.id)}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

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
            {requestsLoading ? (
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
            {testimonialsLoading ? (
              <p className="text-center">{t("loading")}</p>
            ) : (
              <DataTable
                columns={testimonialColumns}
                data={testimonials || []}
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationPage;