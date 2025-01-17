import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TerminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
  childName: string;
  onTerminationComplete: () => void;
}

export const TerminationDialog = ({
  isOpen,
  onClose,
  sponsorshipId,
  childName,
  onTerminationComplete
}: TerminationDialogProps) => {
  const [date, setDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Veuillez sélectionner une date de fin");
      return;
    }

    if (!reason.trim()) {
      toast.error("Veuillez indiquer une raison");
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.rpc('terminate_sponsorship', {
        p_sponsorship_id: sponsorshipId,
        p_termination_date: format(date, 'yyyy-MM-dd'),
        p_termination_reason: 'Fin demandée par le parrain',
        p_termination_comment: reason,
        p_performed_by: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      toast.success("Le parrainage a été terminé avec succès");
      onTerminationComplete();
      onClose();
    } catch (error) {
      console.error('Error terminating sponsorship:', error);
      toast.error("Une erreur est survenue lors de la fin du parrainage");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mettre fin au parrainage</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de mettre fin au parrainage de {childName}.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date de fin</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Raison</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Veuillez expliquer la raison de la fin du parrainage..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? "En cours..." : "Confirmer la fin du parrainage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};