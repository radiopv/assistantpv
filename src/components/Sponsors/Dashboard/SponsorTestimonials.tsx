import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SponsorTestimonialsProps {
  sponsorId: string;
  childId: string;
}

export const SponsorTestimonials = ({ sponsorId, childId }: SponsorTestimonialsProps) => {
  const [newTestimonial, setNewTestimonial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: testimonials, refetch } = useQuery({
    queryKey: ["testimonials", sponsorId, childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("temoignage")
        .select("*")
        .eq("sponsor_id", sponsorId)
        .eq("child_id", childId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!newTestimonial.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le témoignage ne peut pas être vide",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("temoignage").insert({
        content: newTestimonial,
        sponsor_id: sponsorId,
        child_id: childId,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre témoignage a été soumis et sera examiné",
      });
      setNewTestimonial("");
      refetch();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de soumettre le témoignage",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Témoignages</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Ajouter un témoignage</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau témoignage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Partagez votre expérience..."
                value={newTestimonial}
                onChange={(e) => setNewTestimonial(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="p-4">
            <p className="text-gray-600">{testimonial.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              {testimonial.is_approved ? (
                <span className="text-green-600">Approuvé</span>
              ) : (
                <span className="text-yellow-600">En attente d'approbation</span>
              )}
            </div>
          </Card>
        ))}
        {testimonials?.length === 0 && (
          <p className="text-gray-500 text-center">
            Aucun témoignage pour le moment
          </p>
        )}
      </div>
    </div>
  );
};