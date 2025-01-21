import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Need } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { detectFace, loadFaceDetectionModels } from "@/utils/faceDetection";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onSponsorClick }: AvailableChildrenGridProps) => {
  const navigate = useNavigate();
  const processedImages = useRef<Set<string>>(new Set());
  const [modelsLoaded, setModelsLoaded] = useState(false);

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

  useEffect(() => {
    loadFaceDetectionModels()
      .then(() => {
        setModelsLoaded(true);
        console.log('Face detection models loaded successfully');
      })
      .catch(error => {
        console.error('Failed to load face detection models:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les modèles de détection faciale",
        });
      });
  }, []);

  const handleImageLoad = async (event: React.SyntheticEvent<HTMLImageElement>, photoUrl: string) => {
    const imgElement = event.target as HTMLImageElement;
    
    if (processedImages.current.has(photoUrl) || !modelsLoaded) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const objectPosition = await detectFace(imgElement);
      imgElement.style.objectPosition = objectPosition;
      processedImages.current.add(photoUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      imgElement.style.objectPosition = '50% 20%';
    }
  };

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

  if (!children.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        Aucun enfant disponible
      </div>
    );
  }

  const handleLearnMore = (childId: string) => {
    navigate(`/child-details/${childId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-0 sm:px-4">
      {children.map((child) => (
        <Card 
          key={child.id} 
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-cuba-warmBeige/20 backdrop-blur-sm border border-cuba-warmBeige"
        >
          <div className="aspect-video relative">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover transition-transform duration-300"
              onLoad={(e) => handleImageLoad(e, child.photo_url)}
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <h3 className="text-lg font-title font-bold text-white truncate">{child.name}</h3>
              <div className="flex items-center gap-1 text-sm text-white/90">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatAge(child.birth_date)}</span>
                <MapPin className="w-4 h-4 flex-shrink-0 ml-1" />
                <span className="truncate">{child.city}</span>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-2">
            {/* Album Photos Grid */}
            {photosByChild[child.id]?.length > 0 && (
              <div className="bg-white/80 rounded-lg p-2">
                <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Album photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {photosByChild[child.id].slice(0, 3).map((photo: any) => (
                    <div key={photo.id} className="aspect-square rounded-md overflow-hidden">
                      <img
                        src={photo.url}
                        alt="Photo album"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {child.description && (
              <div className="bg-white/80 rounded-lg p-2">
                <p className="text-sm text-gray-700 line-clamp-2">{child.description}</p>
              </div>
            )}

            {Array.isArray(child.needs) && child.needs.length > 0 && (
              <div className="space-y-1">
                {child.needs.slice(0, 2).map((need: any, index: number) => (
                  <div
                    key={`${need.category}-${index}`}
                    className={`p-2 rounded-lg ${
                      need.is_urgent
                        ? "bg-red-50 border border-red-200 text-red-700"
                        : "bg-orange-50 border border-orange-200 text-orange-700"
                    }`}
                  >
                    <div className="text-sm font-medium truncate">
                      {need.category}
                      {need.is_urgent && " (!)"} 
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={() => handleLearnMore(child.id)}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white group-hover:scale-105 transition-all duration-300"
            >
              <Info className="w-4 h-4 mr-2" />
              En savoir plus
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};