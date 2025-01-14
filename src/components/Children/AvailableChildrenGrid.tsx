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

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onSponsorClick }: AvailableChildrenGridProps) => {
  const navigate = useNavigate();
  const processedImages = useRef<Set<string>>(new Set());
  const [modelsLoaded, setModelsLoaded] = useState(false);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="p-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (!children.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun enfant disponible
      </div>
    );
  }

  const handleLearnMore = (childId: string) => {
    navigate(`/child-details/${childId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-2xl font-title font-bold">{child.name}</h3>
              <div className="flex items-center gap-2 text-sm mt-1">
                <Calendar className="w-4 h-4" />
                <span>{formatAge(child.birth_date)}</span>
                <MapPin className="w-4 h-4 ml-2" />
                <span>{child.city}</span>
              </div>
              {child.is_sponsored && child.sponsor_name && (
                <div className="mt-2 text-sm bg-orange-500/80 px-2 py-1 rounded-full inline-block">
                  Parrainé par : {child.sponsor_name}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {child.description && (
              <div className="space-y-2 bg-white/80 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-600">Description :</h4>
                <ScrollArea className="h-20">
                  <p className="text-sm text-gray-600">{child.description}</p>
                </ScrollArea>
              </div>
            )}

            {child.story && (
              <div className="space-y-2 bg-white/80 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-600">Histoire :</h4>
                <ScrollArea className="h-20">
                  <p className="text-sm text-gray-600">{child.story}</p>
                </ScrollArea>
              </div>
            )}

            {Array.isArray(child.needs) && child.needs.length > 0 && (
              <div className="space-y-2 bg-white/80 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-600">Besoins :</h4>
                <div className="space-y-2">
                  {child.needs.map((need: any, index: number) => (
                    <div
                      key={`${need.category}-${index}`}
                      className={`p-3 rounded-lg ${
                        need.is_urgent
                          ? "bg-red-50 border border-red-200"
                          : "bg-orange-50 border border-orange-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${need.is_urgent ? "text-red-800" : "text-orange-800"}`}>
                          {need.category}
                        </span>
                        {need.is_urgent && (
                          <span className="text-red-600 font-bold text-sm">
                            URGENT
                          </span>
                        )}
                      </div>
                      {need.description && (
                        <p className={`mt-1 text-sm ${need.is_urgent ? "text-red-700" : "text-orange-700"}`}>
                          {need.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
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