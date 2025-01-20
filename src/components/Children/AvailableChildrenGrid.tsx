import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Camera, FileEdit, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onSponsorClick }: AvailableChildrenGridProps) => {
  const navigate = useNavigate();
  const [processedImages, setProcessedImages] = useState<Set<string>>(new Set());

  // Sort children by needs urgency and waiting time
  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => {
      // Count urgent needs
      const aUrgentNeeds = convertJsonToNeeds(a.needs).filter(need => need.is_urgent).length;
      const bUrgentNeeds = convertJsonToNeeds(b.needs).filter(need => need.is_urgent).length;
      
      // Compare urgent needs first
      if (aUrgentNeeds !== bUrgentNeeds) {
        return bUrgentNeeds - aUrgentNeeds;
      }
      
      // If urgent needs are equal, compare waiting time
      const aCreatedAt = parseISO(a.created_at);
      const bCreatedAt = parseISO(b.created_at);
      return aCreatedAt.getTime() - bCreatedAt.getTime();
    });
  }, [children]);

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

  const formatAge = (birthDate: string) => {
    if (!birthDate) return "Âge non disponible";
    
    try {
      const today = new Date();
      const birth = parseISO(birthDate);
      const years = differenceInYears(today, birth);
      const months = differenceInMonths(today, birth) % 12;
      
      if (years === 0) {
        return `${months} mois`;
      }
      
      if (months === 0) {
        return `${years} ans`;
      }
      
      return `${years} ans ${months} mois`;
    } catch (error) {
      console.error('Error calculating age:', error);
      return "Âge non disponible";
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>, photoUrl: string) => {
    const imgElement = event.target as HTMLImageElement;
    
    if (processedImages.has(photoUrl)) return;
    
    // Set default face-focused positioning
    imgElement.style.objectPosition = '50% 20%';
    setProcessedImages(prev => new Set([...prev, photoUrl]));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-0 sm:px-4">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="p-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-2/3 mt-3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedChildren.map((child) => (
        <div key={child.id} className="relative group">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full aspect-square object-cover rounded-lg"
            onLoad={(e) => handleImageLoad(e, child.photo_url)}
            crossOrigin="anonymous"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onSponsorClick(child.id)}
          >
            <Clock className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
