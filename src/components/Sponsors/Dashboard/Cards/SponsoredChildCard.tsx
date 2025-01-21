import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Eye, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SponsoredChildCardProps } from "@/integrations/supabase/types/sponsorship";

export const SponsoredChildCard = ({ child, sponsorshipId, onAddPhoto }: SponsoredChildCardProps) => {
  const navigate = useNavigate();
  const [selectedSponsorship, setSelectedSponsorship] = useState<{id: string, childName: string} | null>(null);
  const [removalReason, setRemovalReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [availableChildren, setAvailableChildren] = useState<any[]>([]);

  const viewAlbum = () => {
    navigate(`/children/${child.id}/album`);
  };

  const openRemovalDialog = () => {
    if (sponsorshipId) {
      setSelectedSponsorship({ id: sponsorshipId, childName: child.name });
    }
  };

  const closeRemovalDialog = () => {
    setSelectedSponsorship(null);
    setRemovalReason("");
  };

  const requestRemoveChild = async () => {
    if (!selectedSponsorship) return;
    if (!removalReason.trim()) {
      toast.error("Veuillez indiquer la raison du retrait");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsorship_id: selectedSponsorship.id,
          type: 'remove',
          status: 'pending',
          notes: removalReason
        });

      if (error) throw error;
      toast.success("Demande de retrait envoyée avec succès. Un administrateur examinera votre demande.");
      closeRemovalDialog();
    } catch (error) {
      console.error("Error requesting child removal:", error);
      toast.error("Erreur lors de la demande de retrait");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={child.photo_url || ""} alt={child.name} />
            <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{child.name}</p>
            <p className="text-xs text-gray-500">{child.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={viewAlbum}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={openRemovalDialog}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedSponsorship} onOpenChange={() => selectedSponsorship && closeRemovalDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demande de retrait de parrainage</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison pour laquelle vous souhaitez arrêter le parrainage de {selectedSponsorship?.childName}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Raison du retrait..."
            value={removalReason}
            onChange={(e) => setRemovalReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={closeRemovalDialog}>
              Annuler
            </Button>
            <Button 
              onClick={requestRemoveChild}
              disabled={isSubmitting || !removalReason.trim()}
            >
              {isSubmitting ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};