import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Testimonial } from "@/types/testimonial";

export const TestimonialValidation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('temoignage')
        .select('*')
        .eq('is_approved', false);
      
      if (error) throw error;
      return data as Testimonial[];
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
        title: "Témoignage approuvé",
        description: "Le témoignage a été approuvé avec succès.",
      });

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du témoignage.",
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
        title: "Témoignage rejeté",
        description: "Le témoignage a été rejeté avec succès.",
      });

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet du témoignage.",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (!testimonials?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Aucun témoignage en attente de validation
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="p-4">
          <div className="space-y-4">
            <div>
              <p className="font-medium">{testimonial.author}</p>
              <p className="text-gray-600 mt-1">{testimonial.content}</p>
              {testimonial.rating && (
                <p className="text-sm text-gray-500 mt-2">
                  Note : {testimonial.rating}/5
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleApprove(testimonial.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Approuver
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReject(testimonial.id)}
              >
                <X className="w-4 h-4 mr-1" />
                Rejeter
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};