import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Need } from "@/types/needs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NeedsListProps {
  childId: string;
  childName: string;
  needs: Need[];
  onToggleUrgent: (childId: string, needIndex: number) => Promise<void>;
  onDeleteNeed: (childId: string, needIndex: number) => Promise<void>;
}

const notifySponsors = async (childId: string, childName: string, need: Need) => {
  try {
    // Récupérer le parrain de l'enfant avec une jointure correcte
    const { data: sponsorships, error: queryError } = await supabase
      .from('sponsorships')
      .select(`
        sponsor:sponsors (
          id,
          name
        )
      `)
      .eq('child_id', childId)
      .eq('status', 'active')
      .single();

    if (queryError) {
      console.error('Error fetching sponsor:', queryError);
      return;
    }

    if (!sponsorships?.sponsor?.id) {
      console.log('No active sponsor found for child');
      return;
    }

    // Créer le message pour le parrain
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        recipient_id: sponsorships.sponsor.id,
        subject: `Nouveau besoin pour ${childName}`,
        content: `Un nouveau besoin a été ajouté pour ${childName} : ${need.category}${need.description ? ` - ${need.description}` : ''}${need.is_urgent ? ' (URGENT)' : ''}`,
        sender_id: (await supabase.auth.getUser()).data.user?.id,
      });

    if (messageError) {
      console.error('Error sending message:', messageError);
      toast.error("Erreur lors de l'envoi de la notification au parrain");
    } else {
      toast.success("Le parrain a été notifié du nouveau besoin");
    }
  } catch (error) {
    console.error('Error in notifySponsors:', error);
    toast.error("Une erreur est survenue lors de la notification du parrain");
  }
};

export const NeedsList = ({ 
  childId, 
  childName, 
  needs = [], 
  onToggleUrgent, 
  onDeleteNeed 
}: NeedsListProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const handleToggleUrgent = async (index: number) => {
    await onToggleUrgent(childId, index);
    // Notifier le parrain du changement
    const need = needs[index];
    if (need) {
      await notifySponsors(childId, childName, {
        ...need,
        is_urgent: !need.is_urgent
      });
    }
  };

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
      setSelectedCategories(prev => prev.filter(cat => cat !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  return (
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
          {needs.map((need, index) => {
            const categoryLabel = typeof need.category === 'string' ? need.category : '';
            return (
              <div 
                key={`${categoryLabel}-${index}`}
                className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500 text-white">
                      {getCategoryLabel(categoryLabel)}
                    </Badge>
                    <Input
                      value={need.description}
                      onChange={(e) => {
                        // Update description functionality can be added here
                      }}
                      placeholder="Ajouter un commentaire..."
                      className="flex-1"
                    />
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
                  onClick={() => onDeleteNeed(childId, index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};