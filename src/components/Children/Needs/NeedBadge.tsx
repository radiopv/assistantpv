import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface NeedBadgeProps {
  category: string;
  isUrgent?: boolean;
  isSelected?: boolean;
  description?: string;
  comment?: string;
  onNeedClick?: () => void;
  onCommentChange?: (comment: string) => void;
  onSubmit?: (isUrgent: boolean) => void;
  onClose?: () => void;
}

const CATEGORY_STYLES = {
  education: "bg-yellow-400 hover:bg-yellow-500 text-black",
  jouet: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  vetement: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  nourriture: "bg-blue-500 hover:bg-blue-600 text-white",
  medicament: "bg-blue-600 hover:bg-blue-700 text-white",
  hygiene: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  autre: "bg-gray-100 hover:bg-gray-200 text-gray-900"
};

export const NeedBadge = ({
  category,
  isUrgent = false,
  isSelected = false,
  description = "",
  comment = "",
  onNeedClick,
  onCommentChange,
  onSubmit,
  onClose,
}: NeedBadgeProps) => {
  const { t } = useLanguage();
  const [isUrgentLocal, setIsUrgentLocal] = useState(isUrgent);
  const [showDialog, setShowDialog] = useState(false);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'education':
        return 'Educación';
      case 'jouet':
        return 'Juguetes';
      case 'vetement':
        return 'Ropa';
      case 'nourriture':
        return 'Alimentación';
      case 'medicament':
        return 'Medicamentos';
      case 'hygiene':
        return 'Higiene';
      case 'autre':
        return 'Otros';
      default:
        return category;
    }
  };

  const handleClick = () => {
    setShowDialog(true);
    if (onNeedClick) onNeedClick();
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(isUrgentLocal);
    setShowDialog(false);
  };

  const handleUrgentToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent button click when clicking checkbox
    setIsUrgentLocal(!isUrgentLocal);
    if (onSubmit) onSubmit(!isUrgentLocal);
  };

  return (
    <>
      <Button 
        variant="ghost"
        className={`w-full flex items-center justify-between px-4 py-2 rounded-md transition-colors ${CATEGORY_STYLES[category as keyof typeof CATEGORY_STYLES]}`}
        onClick={handleClick}
      >
        <span>{getCategoryLabel(category)}</span>
        <div className="flex items-center gap-2" onClick={handleUrgentToggle}>
          <Checkbox 
            checked={isUrgentLocal}
            className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          {isUrgentLocal && <span className="text-red-600 font-bold">(!)</span>}
        </div>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getCategoryLabel(category)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Commentaire</label>
              <Textarea
                value={comment}
                onChange={(e) => onCommentChange?.(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};