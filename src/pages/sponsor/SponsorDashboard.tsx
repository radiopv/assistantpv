import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { Camera, FileEdit, Clock } from "lucide-react";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showTermination, setShowTermination] = useState(false);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord",
      login: "Se connecter",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      photos: "Photos",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Mettre fin au parrainage"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      loginRequired: "Por favor, inicie sesión para acceder a su panel",
      login: "Iniciar sesión",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      photos: "Fotos",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      addPhoto: "Agregar foto",
      addTestimonial: "Agregar testimonio",
      endSponsorship: "Finalizar apadrinamiento"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading } = useQuery({
    queryKey: ["sponsored-children", user?.id],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          child_id,
          start_date,
          children (
            id,
            name,
            photo_url,
            city,
            birth_date,
            description,
            story,
            needs,
            age
          )
        `)
        .eq('sponsor_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      return sponsorships || [];
    },
    enabled: !!user?.id
  });

  const { data: childrenPhotos = [], refetch: refetchPhotos } = useQuery({
    queryKey: ["children-photos", sponsoredChildren?.map(s => s.child_id)],
    queryFn: async () => {
      if (!sponsoredChildren?.length) return [];
      
      console.log("Fetching photos for children:", sponsoredChildren.map(s => s.child_id));
      
      const { data, error } = await supabase
        .from('album_media')
        .select('*')
        .in('child_id', sponsoredChildren.map(s => s.children?.id))
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
        throw error;
      }

      console.log('Fetched photos:', data);
      return data || [];
    },
    enabled: !!sponsoredChildren?.length
  });

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
      refetchPhotos();
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <h2 className="text-2xl font-medium text-gray-800">{t.sponsorDashboard}</h2>

        <div className="grid gap-6">
          {sponsoredChildren?.map((sponsorship) => {
            const child = sponsorship.children;
            if (!child) return null;
            
            // Filter photos for this specific child
            const childPhotos = childrenPhotos.filter(photo => photo.child_id === child.id);
            console.log(`Photos for child ${child.id}:`, childPhotos);

            return (
              <Card key={child.id} className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
                <SponsoredChildCard
                  child={child}
                  sponsorshipId={sponsorship.id}
                  onAddPhoto={() => handleAddPhoto(child.id)}
                  onAddTestimonial={() => navigate('/testimonials/new', { state: { childId: child.id } })}
                />

                {/* Album Photos Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Album Photos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {childPhotos.map((photo) => (
                      <div 
                        key={photo.id} 
                        className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title || `Photo de ${child.name}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Upload Section */}
                {selectedChild === child.id && (
                  <div className="mt-6">
                    <PhotoUploader
                      childId={selectedChild}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;