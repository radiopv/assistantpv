import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewTestimonial = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sponsoredChildren } = useQuery({
    queryKey: ["sponsored-children", user?.id],
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

  const handleSubmit = async () => {
    if (!content.trim() || !selectedChild) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("temoignage").insert({
        content,
        sponsor_id: user?.id,
        child_id: selectedChild,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre témoignage a été soumis et sera examiné",
      });
      navigate("/sponsor-dashboard");
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nouveau Témoignage</h1>
      
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enfant</label>
            <Select
              value={selectedChild}
              onValueChange={setSelectedChild}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un enfant" />
              </SelectTrigger>
              <SelectContent>
                {sponsoredChildren?.map((sponsorship) => (
                  <SelectItem 
                    key={sponsorship.children.id} 
                    value={sponsorship.children.id}
                  >
                    {sponsorship.children.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Votre témoignage</label>
            <Textarea
              placeholder="Partagez votre expérience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewTestimonial;