import { Need } from "@/types/needs";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shirt, Apple, Stethoscope, Sparkles, Book, HelpCircle, Plus, Minus } from "lucide-react";

interface NeedItemProps {
  need: Need;
  onToggleUrgent: () => void;
  language: 'fr' | 'es';
}

const NEED_CATEGORIES = {
  education: {
    fr: "Éducation",
    es: "Educación",
    icon: GraduationCap,
    color: "text-yellow-500"
  },
  jouet: {
    fr: "Jouet",
    es: "Juguetes",
    icon: Sparkles,
    color: "text-purple-500"
  },
  vetement: {
    fr: "Vêtement",
    es: "Ropa",
    icon: Shirt,
    color: "text-blue-500"
  },
  nourriture: {
    fr: "Nourriture",
    es: "Alimentación",
    icon: Apple,
    color: "text-green-500"
  },
  medicament: {
    fr: "Médicament",
    es: "Medicamentos",
    icon: Stethoscope,
    color: "text-red-500"
  },
  hygiene: {
    fr: "Hygiène",
    es: "Higiene",
    icon: Book,
    color: "text-cyan-500"
  },
  // Ajout des catégories en espagnol pour la correspondance
  "Educación": {
    fr: "Éducation",
    es: "Educación",
    icon: GraduationCap,
    color: "text-yellow-500"
  },
  "Juguetes": {
    fr: "Jouet",
    es: "Juguetes",
    icon: Sparkles,
    color: "text-purple-500"
  },
  "Ropa": {
    fr: "Vêtement",
    es: "Ropa",
    icon: Shirt,
    color: "text-blue-500"
  },
  "Alimentación": {
    fr: "Nourriture",
    es: "Alimentación",
    icon: Apple,
    color: "text-green-500"
  },
  "Medicamentos": {
    fr: "Médicament",
    es: "Medicamentos",
    icon: Stethoscope,
    color: "text-red-500"
  },
  "Higiene": {
    fr: "Hygiène",
    es: "Higiene",
    icon: Book,
    color: "text-cyan-500"
  }
};

export const NeedItem = ({ need, onToggleUrgent, language }: NeedItemProps) => {
  console.log('Need category:', need.category); // Pour déboguer
  
  const category = NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES];
  const Icon = category?.icon || HelpCircle;
  const categoryName = category ? category[language] : (language === 'fr' ? 'Autre' : 'Otro');
  const iconColor = category?.color || "text-gray-500";

  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg ${
        need.is_urgent 
          ? 'bg-red-50 border border-red-200' 
          : 'bg-green-50 border border-green-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {categoryName}
          </span>
          {need.description && (
            <span className="text-sm text-gray-600">
              {need.description}
            </span>
          )}
        </div>
      </div>
      <Button
        variant={need.is_urgent ? "destructive" : "default"}
        size="sm"
        onClick={onToggleUrgent}
        className="min-w-[140px]"
      >
        {need.is_urgent ? (
          <>
            <Minus className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Retirer urgent' : 'Quitar urgente'}
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Marquer urgent' : 'Marcar urgente'}
          </>
        )}
      </Button>
    </div>
  );
};