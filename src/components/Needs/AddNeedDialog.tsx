import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/components/Translation/TranslationContext";

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
  const { t } = useTranslation();
  
  const sortedChildren = [...children].sort((a, b) => 
    (a.name as string).localeCompare(b.name as string)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t("needs.add_need")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("needs.add_need")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedChild?.id || ""}
            onValueChange={onChildSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("needs.select_child")} />
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
              <SelectValue placeholder={t("needs.category_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">{t("needs.categories.education")}</SelectItem>
              <SelectItem value="jouet">{t("needs.categories.toy")}</SelectItem>
              <SelectItem value="vetement">{t("needs.categories.clothing")}</SelectItem>
              <SelectItem value="nourriture">{t("needs.categories.food")}</SelectItem>
              <SelectItem value="medicament">{t("needs.categories.medicine")}</SelectItem>
              <SelectItem value="hygiene">{t("needs.categories.hygiene")}</SelectItem>
              <SelectItem value="autre">{t("needs.categories.other")}</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder={t("needs.description_placeholder")}
            value={newNeed.description}
            onChange={(e) => onNeedChange({ description: e.target.value })}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="urgent"
              checked={newNeed.is_urgent}
              onCheckedChange={(checked) => onNeedChange({ is_urgent: checked as boolean })}
            />
            <label htmlFor="urgent" className="text-sm text-gray-600">{t("needs.urgent")}</label>
          </div>

          <Button onClick={onAddNeed} disabled={!selectedChild || !newNeed.category || !newNeed.description}>
            {t("needs.add")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};