import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddFAQDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newQuestion: string;
  setNewQuestion: (question: string) => void;
  newAnswer: string;
  setNewAnswer: (answer: string) => void;
  onAdd: () => void;
}

export const AddFAQDialog = ({
  isOpen,
  onOpenChange,
  newQuestion,
  setNewQuestion,
  newAnswer,
  setNewAnswer,
  onAdd,
}: AddFAQDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <Textarea
            placeholder="Réponse"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <Button onClick={onAdd}>Ajouter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};