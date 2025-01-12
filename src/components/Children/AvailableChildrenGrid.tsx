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

const formatAge = (birthDate: string | undefined | null) => {
  const { t } = useLanguage();
  
  if (!birthDate) {
    return t("ageNotAvailable");
  }

  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} ${t("months")}`;
  }
  
  return `${years} ${t("years")}`;
};

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
      // Add a small delay to ensure image is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const objectPosition = await detectFace(imgElement);
      imgElement.style.objectPosition = objectPosition;
      processedImages.current.add(photoUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      // Set default position if face detection fails
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => {
        const childNeeds = Array.isArray(child.needs) ? child.needs : [];
        
        return (
          <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover transition-transform duration-300"
                onLoad={(e) => handleImageLoad(e, child.photo_url)}
                crossOrigin="anonymous"
              />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{child.name}</h3>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatAge(child.birth_date)}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{child.city}</span>
              </div>

              {childNeeds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{t("needs")}:</p>
                  <div className="flex flex-wrap gap-2">
                    {childNeeds.map((need: Need, index: number) => (
                      <Badge 
                        key={`${need.category}-${index}`}
                        variant={need.is_urgent ? "destructive" : "secondary"}
                      >
                        {need.category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => navigate(`/child-details/${child.id}`)}
              >
                <Info className="w-4 h-4" />
                {t("learnMore")}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};