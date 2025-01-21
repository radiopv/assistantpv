import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Need, convertJsonToNeeds } from "@/types/needs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { detectFace, loadFaceDetectionModels } from "@/utils/faceDetection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
}

export const AvailableChildrenGrid = ({ children, isLoading }: AvailableChildrenGridProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const processedImages = useRef<Set<string>>(new Set());
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => {
      const aUrgentNeeds = convertJsonToNeeds(a.needs).filter(need => need.is_urgent).length;
      const bUrgentNeeds = convertJsonToNeeds(b.needs).filter(need => need.is_urgent).length;
      
      if (aUrgentNeeds !== bUrgentNeeds) {
        return bUrgentNeeds - aUrgentNeeds;
      }
      
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
        toast("Impossible de charger les modèles de détection faciale", {
          description: "Une erreur s'est produite lors du chargement"
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

  const handleSponsorClick = async (childId: string) => {
    if (!user) {
      navigate(`/become-sponsor?child=${childId}`);
      return;
    }

    try {
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('is_sponsored, name')
        .eq('id', childId)
        .maybeSingle();

      if (childError) {
        console.error('Erreur lors de la vérification du statut de l\'enfant:', childError);
        toast("Une erreur est survenue lors de la vérification du statut de l'enfant", {
          description: "Veuillez réessayer plus tard"
        });
        return;
      }

      if (!childData) {
        toast("Impossible de trouver les informations de l'enfant", {
          description: "L'enfant n'existe plus dans la base de données"
        });
        return;
      }

      if (childData.is_sponsored) {
        toast("Cet enfant est déjà parrainé", {
          description: "Veuillez choisir un autre enfant"
        });
        return;
      }

      const { data: existingRequests, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('status')
        .eq('child_id', childId)
        .eq('sponsor_id', user.id);

      if (requestError) {
        console.error('Erreur lors de la vérification des demandes existantes:', requestError);
        toast("Une erreur est survenue lors de la vérification des demandes existantes", {
          description: "Veuillez réessayer plus tard"
        });
        return;
      }

      const pendingRequest = existingRequests?.find(req => req.status === 'pending');
      if (pendingRequest) {
        toast("Vous avez déjà une demande de parrainage en cours pour cet enfant", {
          description: "Veuillez attendre la réponse à votre demande"
        });
        return;
      }

      const approvedRequest = existingRequests?.find(req => req.status === 'approved');
      if (approvedRequest) {
        toast("Vous avez déjà parrainé cet enfant", {
          description: "Vous ne pouvez pas parrainer le même enfant deux fois"
        });
        return;
      }

      const { error: createError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: user.id,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true,
          full_name: user.name,
          email: user.email,
          city: user.city
        });

      if (createError) {
        console.error('Erreur lors de la création de la demande:', createError);
        toast("Une erreur est survenue lors de la demande de parrainage", {
          description: "Veuillez réessayer plus tard"
        });
        return;
      }

      toast("Votre demande de parrainage a été envoyée avec succès", {
        description: "Nous vous contacterons dès que possible"
      });
      
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast("Une erreur est survenue lors de la demande de parrainage", {
        description: "Une erreur inattendue s'est produite"
      });
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

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-orange-800">À propos du parrainage</h3>
            <p className="text-orange-700 text-sm">
              Le parrainage n'est pas un engagement à long terme. Vous pouvez y mettre fin à tout moment depuis votre espace parrain, 
              sans justification nécessaire. Les enfants affichés en premier sont ceux qui ont les besoins les plus urgents 
              ou qui attendent un parrain depuis le plus longtemps.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-0 sm:px-4">
        {sortedChildren.map((child) => {
          const childNeeds = convertJsonToNeeds(child.needs);
          const hasUrgentNeeds = Array.isArray(childNeeds) && childNeeds.some(need => need.is_urgent);

          return (
            <Card 
              key={child.id} 
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-cuba-warmBeige/20 backdrop-blur-sm border border-cuba-warmBeige"
            >
              <div className="aspect-square relative">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  onLoad={(e) => handleImageLoad(e, child.photo_url)}
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
                {hasUrgentNeeds && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold animate-pulse">
                    BESOIN URGENT
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <h3 className="text-lg font-title font-bold text-white truncate">{child.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-white/90">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{child.age} ans</span>
                    <MapPin className="w-4 h-4 flex-shrink-0 ml-1" />
                    <span className="truncate">{child.city}</span>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-2">
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

                {Array.isArray(childNeeds) && childNeeds.length > 0 && (
                  <div className="space-y-1">
                    {childNeeds.map((need: Need, index: number) => (
                      <div
                        key={`${need.category}-${index}`}
                        className={`p-2 rounded-lg ${
                          need.is_urgent
                            ? "bg-[#ea384c] text-white font-medium"
                            : "bg-orange-50 border border-orange-200 text-orange-700"
                        }`}
                      >
                        <div className="text-sm font-medium truncate">
                          {need.category}
                          {need.is_urgent && " (!)"} 
                        </div>
                        {need.description && (
                          <p className="text-sm opacity-90 mt-1">{need.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={() => handleSponsorClick(child.id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 text-lg shadow-md transition-all duration-200"
                >
                  Parrainer cet enfant
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};