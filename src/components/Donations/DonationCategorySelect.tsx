import { Button } from "@/components/ui/button";
import { DollarSign, Shirt, Utensils, BookOpen, HeartPulse, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  icon: any;
}

export const CATEGORIES = [
  { id: "1", name: 'Monétaire', icon: DollarSign },
  { id: "2", name: 'Vêtements', icon: Shirt },
  { id: "3", name: 'Nourriture', icon: Utensils },
  { id: "4", name: 'Éducation', icon: BookOpen },
  { id: "5", name: 'Médical', icon: HeartPulse },
  { id: "6", name: 'Autre', icon: Package },
];

interface DonationCategorySelectProps {
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
}

export const DonationCategorySelect = ({ selectedCategories, onSelectCategory }: DonationCategorySelectProps) => {
  const { data: categories } = useQuery({
    queryKey: ['aid_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aid_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const getIcon = (categoryName: string) => {
    const defaultCategory = CATEGORIES.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    ) || CATEGORIES[CATEGORIES.length - 1];
    return defaultCategory.icon;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
      {categories?.map((category) => {
        const Icon = getIcon(category.name);
        const isSelected = selectedCategories.includes(category.id);
        return (
          <Button
            key={category.id}
            type="button"
            variant={isSelected ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onSelectCategory(category.id)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm text-center">{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
};