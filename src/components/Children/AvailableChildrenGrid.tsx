import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";
import { ChildCard } from "./ChildCard/ChildCard";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onViewProfile }: AvailableChildrenGridProps) => {
  // Fetch album photos for all children
  const { data: albumPhotos } = useQuery({
    queryKey: ['album-photos', children.map(child => child.id)],
    queryFn: async () => {
      if (!children.length) return [];
      
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .in('child_id', children.map(child => child.id))
        .eq('type', 'image')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching album photos:', error);
        return [];
      }

      return data || [];
    },
    enabled: children.length > 0
  });

  // Group photos by child
  const photosByChild = albumPhotos?.reduce((acc, photo) => {
    if (!acc[photo.child_id]) {
      acc[photo.child_id] = [];
    }
    acc[photo.child_id].push(photo);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Calculer le score de priorité d'un enfant
  const calculatePriorityScore = (child: any) => {
    const needs = convertJsonToNeeds(child.needs);
    const urgentNeedsCount = needs.filter(need => need.is_urgent).length;
    const totalNeedsCount = needs.length;
    const daysSinceCreation = differenceInDays(new Date(), parseISO(child.created_at));
    
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
            <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-white/50 rounded-lg overflow-hidden">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="h-full w-auto object-contain"
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