import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, Shirt, Utensils, BookOpen, HeartPulse, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { id: 1, name: 'Monétaire', icon: DollarSign },
  { id: 2, name: 'Vêtements', icon: Shirt },
  { id: 3, name: 'Nourriture', icon: Utensils },
  { id: 4, name: 'Éducation', icon: BookOpen },
  { id: 5, name: 'Médical', icon: HeartPulse },
  { id: 6, name: 'Autre', icon: Package },
];

interface DonationFormProps {
  onDonationComplete?: () => void;
}

export const DonationForm = ({ onDonationComplete }: DonationFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('donations')
        .insert({
          assistant_name: "Assistant", // You might want to get this from the current user
          city: "Ville", // You might want to make this dynamic
          people_helped: parseInt(quantity),
          donation_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Don enregistré",
        description: "Le don a été enregistré avec succès.",
      });

      setSelectedCategory(null);
      setQuantity("");
      onDonationComplete?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du don.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Catégorie</Label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
        </div>

        <Button type="submit" disabled={!selectedCategory || !quantity || loading}>
          {loading ? "Enregistrement..." : "Enregistrer le don"}
        </Button>
      </form>
    </Card>
  );
};