import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { detectFace, loadFaceDetectionModels } from "@/utils/faceDetection";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { convertJsonToNeeds } from "@/types/needs";
import { ChildCard } from "./ChildCard";
import { InfoCard } from "./InfoCard";

interface AvailableChildrenGridProps {
  children: any[];
  isLoading: boolean;
  onSponsorClick: (childId: string) => void;
}

export const AvailableChildrenGrid = ({ children, isLoading }: AvailableChildrenGridProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const processedImages = useRef<Set<string>>(new Set());
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Sort children by needs urgency and waiting time
  const sortedChildren = useMemo(() => {
    return [...children].sort((a, b) => {
      const aUrgentNeeds = convertJsonToNeeds(a.needs).filter(need => need.is_urgent).length;
      const bUrgentNeeds = convertJsonToNeeds(b.needs).filter(need => need.is_urgent).length;
      
      if (aUrgentNeeds !== bUrgentNeeds) {
        return bUrgentNeeds - aUrgentNeeds;
      }
      
      const aCreatedAt = new Date(a.created_at);
      const bCreatedAt = new Date(b.created_at);
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

  useEffect(() => {
    loadFaceDetectionModels()
      .then(() => {
        setModelsLoaded(true);
        console.log('Face detection models loaded successfully');
      })
      .catch(error => {
        console.error('Failed to load face detection models:', error);
        toast.error("Impossible de charger les modèles de détection faciale");
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
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: childId,
          sponsor_id: user.id,
          status: 'pending',
          is_long_term: true,
          terms_accepted: true,
          email: user.email,
          full_name: user.name
        });

      if (error) throw error;

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      navigate('/sponsor-dashboard');
    } catch (error) {
      console.error('Error creating sponsorship request:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-0 sm:px-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
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
      <InfoCard />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-0 sm:px-4">
        {sortedChildren.map((child) => {
          const childNeeds = convertJsonToNeeds(child.needs);
          const hasUrgentNeeds = Array.isArray(childNeeds) && childNeeds.some(need => need.is_urgent);

          return (
            <ChildCard
              key={child.id}
              child={child}
              photosByChild={photosByChild}
              hasUrgentNeeds={hasUrgentNeeds}
              onImageLoad={handleImageLoad}
              onSponsorClick={handleSponsorClick}
            />
          );
        })}
      </div>
    </div>
  );
};