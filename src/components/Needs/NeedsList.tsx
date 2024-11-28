import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface NeedsListProps {
  childId: string;
  childName: string;
  needs: Need[];
  onToggleUrgent: (childId: string, needIndex: number) => Promise<void>;
  onDeleteNeed: (childId: string, needIndex: number) => Promise<void>;
}

export const NeedsList = ({ 
  childId, 
  childName, 
  needs = [], 
  onToggleUrgent, 
  onDeleteNeed 
}: NeedsListProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedNeedIndex, setSelectedNeedIndex] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const allCategories = [
    'education',
    'jouet',
    'vetement',
    'nourriture',
    'medicament',
    'hygiene',
    'autre'
  ];

  const handleCategoryClick = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedNeedIndex(needs.findIndex(need => need.category === category));
      setComment(needs.find(need => need.category === category)?.description || "");
      setShowCommentDialog(true);
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const handleSaveComment = async () => {
    if (selectedNeedIndex !== null) {
      const updatedNeeds = [...needs];
      updatedNeeds[selectedNeedIndex] = {
        ...updatedNeeds[selectedNeedIndex],
        description: comment
      };
      // Here you would update the needs in the database
      toast.success("Commentaire enregistré");
      setShowCommentDialog(false);
      setSelectedNeedIndex(null);
      setComment("");
    }
  };

  const handleToggleUrgent = async (needIndex: number) => {
    try {
      await onToggleUrgent(childId, needIndex);
      toast.success("Statut urgent mis à jour");
    } catch (error) {
      console.error('Error toggling urgent status:', error);
      toast.error("Erreur lors de la mise à jour du statut urgent");
    }
  };

  const handleDeleteNeed = async (needIndex: number) => {
    try {
      await onDeleteNeed(childId, needIndex);
      setSelectedCategories(prev => 
        prev.filter(cat => cat !== needs[needIndex].category)
      );
      toast.success("Besoin supprimé");
    } catch (error) {
      console.error('Error deleting need:', error);
      toast.error("Erreur lors de la suppression du besoin");
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      education: "Éducation",
      jouet: "Jouet",
      vetement: "Vêtement",
      nourriture: "Nourriture",
      medicament: "Médicament",
      hygiene: "Hygiène",
      autre: "Autre"
    };
    return labels[category] || category;
  };

  return (
    <>
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">{childName}</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className={`cursor-pointer transition-colors duration-200 text-sm md:text-base ${
                  selectedCategories.includes(category) 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {getCategoryLabel(category)}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            {needs.map((need, index) => (
              <div 
                key={`${need.category}-${index}`}
                className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500 text-white">
                      {getCategoryLabel(need.category)}
                    </Badge>
                    {need.description && (
                      <span className="text-sm text-gray-600">
                        {need.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`urgent-${need.category}`}
                      checked={need.is_urgent}
                      onCheckedChange={() => handleToggleUrgent(index)}
                    />
                    <label 
                      htmlFor={`urgent-${need.category}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Marquer comme urgent
                    </label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => handleDeleteNeed(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un commentaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Entrez votre commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveComment}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};