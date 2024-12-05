import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Quote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const TestimonialsSection = () => {
  const { session, user } = useAuth();
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
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <Quote className="h-8 w-8 text-primary mb-4" />
            <p className="text-gray-600 mb-4">{testimonial.content}</p>
            <div className="flex items-center">
              {testimonial.sponsors?.photo_url && (
                <img
                  src={testimonial.sponsors.photo_url}
                  alt={testimonial.sponsors.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-semibold">{testimonial.sponsors?.name}</p>
                <p className="text-sm text-gray-500">
                  Parrain de {testimonial.children?.name}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {session && sponsoredChildren?.length > 0 && (
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Partager mon témoignage</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Partager mon témoignage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Choisir l'enfant
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedChild || ""}
                    onChange={(e) => setSelectedChild(e.target.value)}
                  >
                    <option value="">Sélectionner un enfant</option>
                    {sponsoredChildren.map((sponsorship) => (
                      <option
                        key={sponsorship.child_id}
                        value={sponsorship.child_id}
                      >
                        {sponsorship.children?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Votre témoignage
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleSubmitTestimonial}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Envoyer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};