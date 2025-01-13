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

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading, onSponsorClick }: AvailableChildrenGridProps) => {
  const { t } = useLanguage();
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
        {t("noChildren")}
      </div>
    );
  }

  const handleLearnMore = (childId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/child/${childId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => (
        <Card 
          key={child.id} 
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border border-cuba-warmBeige"
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
                <span>{child.age} {t("years")}</span>
                <MapPin className="w-4 h-4 ml-2" />
                <span>{child.city}</span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {Array.isArray(child.needs) && child.needs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">{t("needs")}:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {child.needs.map((need: any, index: number) => (
                    <div
                      key={`${need.category}-${index}`}
                      className={`px-3 py-2 rounded-lg ${
                        need.is_urgent
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-orange-50 text-orange-800 border border-orange-200"
                      }`}
                    >
                      <div className="font-medium">
                        {need.category}
                        {need.is_urgent && (
                          <span className="ml-1 text-red-600">(!)</span>
                        )}
                      </div>
                      {need.description && (
                        <p className="text-xs mt-1 text-gray-600 italic line-clamp-2">
                          {need.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={(e) => handleLearnMore(child.id, e)}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white group-hover:scale-105 transition-all duration-300"
            >
              <Info className="w-4 h-4 mr-2" />
              {t("learnMore")}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};