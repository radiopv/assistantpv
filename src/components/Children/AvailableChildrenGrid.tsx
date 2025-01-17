import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { differenceInYears, parseISO } from "date-fns";
import { convertJsonToNeeds } from "@/types/needs";
import { ChildCard } from "./ChildCard/ChildCard";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

const formatAge = (birthDate: string) => {
  if (!birthDate) return '';
  const years = differenceInYears(new Date(), parseISO(birthDate));
  return `${years} ans`;
};

export const AvailableChildrenGrid = ({ children, isLoading, onViewProfile }: AvailableChildrenGridProps) => {
  // Calculer le score de priorité d'un enfant
  const calculatePriorityScore = (child: any) => {
    const needs = convertJsonToNeeds(child.needs);
    const urgentNeedsCount = needs.filter(need => need.is_urgent).length;
    const totalNeedsCount = needs.length;
    const daysSinceCreation = differenceInYears(new Date(), parseISO(child.created_at));
    
    return (urgentNeedsCount * 3) + (totalNeedsCount * 2) + (daysSinceCreation * 0.1);
  };

  // Trier les enfants par score de priorité
  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));
  }, [children]);

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedChildren.map((child) => (
        <Card 
          key={child.id} 
          className="overflow-hidden rounded-none md:rounded-lg break-words group bg-gradient-to-br from-white to-cuba-warmBeige border-cuba-softOrange/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-3/4 aspect-square flex items-center justify-center bg-white/50 rounded-lg overflow-hidden">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 space-y-2">
              <h3 className="font-title text-xl text-cuba-deepOrange">{child.name}</h3>
              <p className="text-sm text-gray-600">{formatAge(child.birth_date)}</p>
              <p className="text-sm text-gray-600">{child.city}</p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <ChildCard 
              child={child}
              photosByChild={photosByChild}
              onLearnMore={onViewProfile}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};