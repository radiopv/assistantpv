import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const TestimonialValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('is_approved', false);
      
      if (error) throw error;
      return data;
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('temoignage')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("testimonialApproved"),
      });

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingTestimonial"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('temoignage')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("testimonialRejected"),
      });

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingTestimonial"),
      });
    }
  };

  const columns = [
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
      header: t("actions"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleApprove(row.original.id)}
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleReject(row.original.id)}
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t("errorLoadingTestimonials")}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  return (
    <DataTable
      columns={columns}
      data={testimonials || []}
    />
  );
};