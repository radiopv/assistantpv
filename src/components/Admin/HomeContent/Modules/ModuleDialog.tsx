import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Module } from "../types";

interface ModuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: Module | null;
  isNew?: boolean;
  onSave: () => void;
  onChange: (field: string, value: any) => void;
}

export const ModuleDialog = ({
  open,
  onOpenChange,
  module,
  isNew = false,
  onSave,
  onChange,
}: ModuleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Nouveau module" : "Paramètres du module"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isNew && (
            <>
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={module?.name || ""}
                  onChange={(e) => onChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={module?.module_type || ""}
                  onChange={(e) => onChange("module_type", e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="settings">Paramètres (JSON)</Label>
            <Textarea
              id="settings"
              value={JSON.stringify(module?.settings || {}, null, 2)}
              onChange={(e) => {
                try {
                  const settings = JSON.parse(e.target.value);
                  onChange("settings", settings);
                } catch (error) {
                  console.error('Invalid JSON:', error);
                }
              }}
              className="font-mono"
            />
          </div>
          <Button onClick={onSave}>{isNew ? "Créer" : "Enregistrer"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};