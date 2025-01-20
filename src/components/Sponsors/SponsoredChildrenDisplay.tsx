import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, Plus, Minus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

interface SponsoredChildrenDisplayProps {
  sponsorships: any[];
}

export const SponsoredChildrenDisplay = ({ sponsorships }: SponsoredChildrenDisplayProps) => {
  const navigate = useNavigate();
  const [selectedSponsorship, setSelectedSponsorship] = useState<{id: string, childName: string} | null>(null);
  const [removalReason, setRemovalReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terminationDate, setTerminationDate] = useState<Date>();

  const viewAlbum = (childId: string) => {
    navigate(`/children/${childId}/album`);
  };

  const openTerminationDialog = (sponsorshipId: string, childName: string) => {
    setSelectedSponsorship({ id: sponsorshipId, childName });
  };

  const closeTerminationDialog = () => {
    setSelectedSponsorship(null);
    setRemovalReason("");
    setTerminationDate(undefined);
  };

  const handleTermination = async () => {
    if (!selectedSponsorship || !terminationDate) {
      toast.error("Veuillez sélectionner une date de fin");
      return;
    }
    if (!removalReason.trim()) {
      toast.error("Veuillez indiquer la raison de la fin du parrainage");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('terminate_sponsorship', {
        p_sponsorship_id: selectedSponsorship.id,
        p_termination_date: terminationDate.toISOString().split('T')[0],
        p_termination_reason: removalReason,
        p_termination_comment: removalReason,
        p_performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      toast.success("Demande de fin de parrainage envoyée avec succès");
      closeTerminationDialog();
    } catch (error) {
      console.error("Error terminating sponsorship:", error);
      toast.error("Erreur lors de la demande de fin de parrainage");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestAddChild = async () => {
    try {
      navigate('/children/available');
    } catch (error) {
      console.error("Error navigating to available children:", error);
      toast.error("Erreur lors de la navigation");
    }
  };

  const activeSponshorships = sponsorships?.filter(
    (sponsorship) => 
      sponsorship.status === 'active' && 
      sponsorship.children
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Enfants parrainés</h3>
        <Button
          variant="outline"
          onClick={requestAddChild}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un enfant
        </Button>
      </div>
      <div className="grid gap-4">
        {activeSponshorships?.map((sponsorship: any) => (
          <Card key={sponsorship.id} className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                    <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{sponsorship.children.name}</p>
                    <p className="text-xs text-gray-500">{sponsorship.children.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => viewAlbum(sponsorship.children.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openTerminationDialog(sponsorship.id, sponsorship.children.name)}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Clock className="h-4 w-4" />
                Mettre fin au parrainage
              </Button>
            </div>
          </Card>
        ))}
        {(!activeSponshorships || activeSponshorships.length === 0) && (
          <p className="text-sm text-gray-500">Aucun enfant parrainé</p>
        )}
      </div>

      <Dialog open={!!selectedSponsorship} onOpenChange={() => selectedSponsorship && closeTerminationDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre fin au parrainage</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de mettre fin au parrainage de {selectedSponsorship?.childName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Calendar
                mode="single"
                selected={terminationDate}
                onSelect={setTerminationDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Raison de la fin du parrainage</label>
              <Textarea
                placeholder="Veuillez indiquer la raison..."
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={closeTerminationDialog}>
              Annuler
            </Button>
            <Button 
              onClick={handleTermination}
              disabled={isSubmitting || !removalReason.trim() || !terminationDate}
              variant="destructive"
            >
              {isSubmitting ? "Envoi..." : "Confirmer la fin du parrainage"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};