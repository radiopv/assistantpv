import { Button } from "@/components/ui/button";
import { DollarSign, Shirt, Utensils, BookOpen, HeartPulse, Package } from "lucide-react";

export const CATEGORIES = [
  { id: 1, name: 'Monétaire', icon: DollarSign },
  { id: 2, name: 'Vêtements', icon: Shirt },
  { id: 3, name: 'Nourriture', icon: Utensils },
  { id: 4, name: 'Éducation', icon: BookOpen },
  { id: 5, name: 'Médical', icon: HeartPulse },
  { id: 6, name: 'Autre', icon: Package },
];

interface DonationCategorySelectProps {
  selectedCategory: number | null;
  onSelectCategory: (id: number) => void;
}

export const DonationCategorySelect = ({ selectedCategory, onSelectCategory }: DonationCategorySelectProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            type="button"
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => onSelectCategory(category.id)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm">{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
};