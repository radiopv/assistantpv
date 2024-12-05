import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TestimonialsList } from "./Testimonials/TestimonialsList";
import { TestimonialForm } from "./Testimonials/TestimonialForm";

export const TestimonialsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          id,
          content,
          sponsor_id,
          child_id,
          sponsors (
            name,
            photo_url
          ),
          children (
            name
          )
        `)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: sponsoredChildren } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          child_id,
          children (
            id,
            name
          )
        `)
        .eq("sponsor_id", user?.id)
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmitTestimonial = async () => {
    if (!content || !selectedChild) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      content,
      sponsor_id: user?.id,
      child_id: selectedChild,
      is_approved: false,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du témoignage",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Votre témoignage a été envoyé et sera examiné par nos équipes",
    });
    setContent("");
    setSelectedChild(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <TestimonialsList testimonials={testimonials || []} />

      {user && sponsoredChildren?.length > 0 && (
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Partager mon témoignage</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Partager mon témoignage</DialogTitle>
              </DialogHeader>
              <TestimonialForm
                sponsoredChildren={sponsoredChildren}
                selectedChild={selectedChild}
                setSelectedChild={setSelectedChild}
                content={content}
                setContent={setContent}
                handleSubmitTestimonial={handleSubmitTestimonial}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};