import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertJsonToNeeds } from "@/types/needs";
import { Camera, FileEdit, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
    city: string | null;
    birth_date: string;
    description: string | null;
    story: string | null;
    needs: any;
    age: number;
  };
  sponsorshipId: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export const SponsoredChildCard = ({ child, sponsorshipId, onAddPhoto }: SponsoredChildCardProps) => {
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [testimonialContent, setTestimonialContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTestimonial = async () => {
    if (!testimonialContent.trim()) {
      toast.error("Le témoignage ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('temoignage')
        .insert({
          content: testimonialContent,
          child_id: child.id,
          is_approved: false
        });

      if (error) throw error;

      toast.success("Témoignage envoyé avec succès");
      setShowTestimonialDialog(false);
      setTestimonialContent("");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Erreur lors de l'envoi du témoignage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative rounded-lg overflow-hidden">
        <img
          src={child.photo_url || "/placeholder.svg"}
          alt={child.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{child.name}</h3>
            <p className="text-sm text-gray-600">{child.age} ans</p>
            {child.city && <p className="text-sm text-gray-600">{child.city}</p>}
          </div>
        </div>

        {child.description && (
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-600">{child.description}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Besoins</h4>
          <ScrollArea className="h-[100px]">
            <div className="space-y-2">
              {convertJsonToNeeds(child.needs).map((need: any, index: number) => (
                <div
                  key={`${need.category}-${index}`}
                  className={`p-2 rounded-lg ${
                    need.is_urgent
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={need.is_urgent ? "destructive" : "secondary"}
                    >
                      {need.category}
                      {need.is_urgent && " (!)"} 
                    </Badge>
                  </div>
                  {need.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {need.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={onAddPhoto}
          >
            <Camera className="w-4 h-4" />
            Ajouter une photo
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowTestimonialDialog(true)}
          >
            <FileEdit className="w-4 h-4" />
            Ajouter un témoignage
          </Button>
        </div>
      </div>

      <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau témoignage pour {child.name}</DialogTitle>
            <DialogDescription>
              Partagez votre expérience et vos sentiments
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Écrivez votre témoignage ici..."
            value={testimonialContent}
            onChange={(e) => setTestimonialContent(e.target.value)}
            className="min-h-[150px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTestimonialDialog(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitTestimonial}
              disabled={isSubmitting || !testimonialContent.trim()}
            >
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};