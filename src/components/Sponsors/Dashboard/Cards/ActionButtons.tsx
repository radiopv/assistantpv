import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Camera, FileEdit, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ActionButtonsProps {
  onAddPhoto: () => void;
  childId: string;
  sponsorshipId: string;
  onShowTermination: () => void;
}

export const ActionButtons = ({ 
  onAddPhoto, 
  childId,
  onShowTermination 
}: ActionButtonsProps) => {
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTestimonial = async () => {
    if (!newTestimonial.trim()) {
      toast("Le témoignage ne peut pas être vide", {
        description: "Veuillez écrire votre témoignage avant de l'envoyer"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("temoignage").insert({
        content: newTestimonial,
        child_id: childId,
      });

      if (error) throw error;

      toast("Témoignage soumis", {
        description: "Votre témoignage a été soumis et sera examiné"
      });
      setNewTestimonial("");
      setIsTestimonialOpen(false);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast("Erreur", {
        description: "Impossible de soumettre le témoignage"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 mt-6">
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
        onClick={onAddPhoto}
      >
        <Camera className="h-4 w-4" />
        <span>Ajouter une photo</span>
      </Button>

      <Collapsible
        open={isTestimonialOpen}
        onOpenChange={setIsTestimonialOpen}
        className="space-y-2"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
          >
            <FileEdit className="h-4 w-4" />
            <span>Ajouter un témoignage</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <Textarea
            placeholder="Partagez votre expérience..."
            value={newTestimonial}
            onChange={(e) => setNewTestimonial(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmitTestimonial}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </CollapsibleContent>
      </Collapsible>

      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 bg-white hover:bg-cuba-warmBeige/10 transition-colors"
        onClick={onShowTermination}
      >
        <Clock className="h-4 w-4" />
        <span>Mettre fin au parrainage</span>
      </Button>
    </div>
  );
};