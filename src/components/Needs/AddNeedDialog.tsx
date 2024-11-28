import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";

interface AddNeedDialogProps {
  children: any[];
  selectedChild: any | null;
  newNeed: Need;
  onChildSelect: (value: string) => void;
  onNeedChange: (need: Partial<Need>) => void;
  onAddNeed: () => Promise<void>;
}

export const AddNeedDialog = ({
  children,
  selectedChild,
  newNeed,
  onChildSelect,
  onNeedChange,
  onAddNeed
}: AddNeedDialogProps) => {
  const sortedChildren = [...children].sort((a, b) => 
    (a.name as string).localeCompare(b.name as string)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un besoin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un besoin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedChild?.id || ""}
            onValueChange={onChildSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent>
              {sortedChildren?.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(newNeed.category || "")}
            onValueChange={(value) => onNeedChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Catégorie du besoin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Éducation</SelectItem>
              <SelectItem value="jouet">Jouet</SelectItem>
              <SelectItem value="vetement">Vêtement</SelectItem>
              <SelectItem value="nourriture">Nourriture</SelectItem>
              <SelectItem value="medicament">Médicament</SelectItem>
              <SelectItem value="hygiene">Hygiène</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Description du besoin"
            value={newNeed.description}
            onChange={(e) => onNeedChange({ description: e.target.value })}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={newNeed.is_urgent}
              onCheckedChange={(checked) => onNeedChange({ is_urgent: checked as boolean })}
            />
            <label htmlFor="urgent" className="text-sm text-gray-600">Besoin urgent</label>
          </div>

          <Button onClick={onAddNeed} disabled={!selectedChild || !newNeed.category || !newNeed.description}>
            Ajouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};