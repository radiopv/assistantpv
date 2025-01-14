import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Album } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SponsoredChildrenGridProps {
  userId: string;
}

export const SponsoredChildrenGrid = ({ userId }: SponsoredChildrenGridProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      viewAlbum: "Voir l'album",
      noPhotos: "Aucune photo disponible",
      loading: "Chargement...",
      error: "Erreur lors du chargement des photos"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      viewAlbum: "Ver álbum",
      noPhotos: "No hay fotos disponibles",
      loading: "Cargando...",
      error: "Error al cargar las fotos"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading: isLoadingChildren } = useQuery({
    queryKey: ['sponsored-children', userId],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
          children (
            id,
            name,
            photo_url,
            city,
            birth_date,
            description,
            story,
            needs
          )
        `)
        .eq('sponsor_id', userId)
        .eq('status', 'active');

      if (error) throw error;
      return sponsorships;
    }
  });

  const { data: childPhotos } = useQuery({
    queryKey: ['child-photos', sponsoredChildren?.map(s => s.child_id)],
    enabled: !!sponsoredChildren?.length,
    queryFn: async () => {
      const childIds = sponsoredChildren.map(s => s.child_id);
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .in('child_id', childIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleShare = async () => {
    const shareData = {
      title: t.inviteFriends,
      text: t.inviteFriends,
      url: window.location.origin + '/become-sponsor'
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Lien copié !");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    }
  };

  if (isLoadingChildren) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sponsoredChildren?.map((sponsorship) => {
        const child = sponsorship.children;
        const childPhotos = childPhotos?.filter(photo => photo.child_id === child.id) || [];

        return (
          <div key={child.id} className="space-y-4">
            <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-square relative mb-4">
                <img
                  src={child.photo_url || "/placeholder.svg"}
                  alt={child.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{child.name}</h3>
                <p className="text-gray-600">{child.city}</p>
                {child.description && (
                  <p className="text-sm text-gray-700">{child.description}</p>
                )}
              </div>
            </Card>

            {/* Photos de l'album */}
            <div className="space-y-2">
              <h4 className="font-medium text-lg">Album photos</h4>
              {childPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {childPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-square">
                      <img
                        src={photo.url}
                        alt={`Photo de ${child.name}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">{t.noPhotos}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};