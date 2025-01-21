import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { Camera, MessageSquare, Clock } from "lucide-react";
import { TerminationDialog } from "@/components/Sponsors/Dashboard/TerminationDialog";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedSponsorship, setSelectedSponsorship] = useState<{id: string, childName: string} | null>(null);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Terminer le parrainage",
      noChildren: "Vous ne parrainez aucun enfant pour le moment",
      error: "Une erreur est survenue lors du chargement des données"
    },
    es: {
      welcomeMessage: "Bienvenido",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      addPhoto: "Agregar una foto",
      addTestimonial: "Agregar un testimonio",
      endSponsorship: "Terminar el padrinazgo",
      noChildren: "No tienes niños apadrinados actualmente",
      error: "Se produjo un error al cargar los datos"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading, error } = useQuery({
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

  const handleAddPhoto = (childId: string) => {
    setSelectedChild(childId);
  };

  const handleAddTestimonial = (childId: string) => {
    navigate(`/testimonials/new?childId=${childId}`);
  };

  const handleEndSponsorship = (sponsorshipId: string, childName: string) => {
    setSelectedSponsorship({ id: sponsorshipId, childName });
    setShowTerminationDialog(true);
  };

  const handleUploadSuccess = () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
    }
  };

  if (error) {
    return <div className="text-center p-4 text-red-500">{t.error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  if (!sponsoredChildren?.length) {
    return <div className="text-center p-4">{t.noChildren}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <h2 className="text-2xl font-medium text-gray-800">{t.sponsorDashboard}</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsoredChildren.map((sponsorship) => {
            const child = sponsorship.children;
            if (!child) return null;

            return (
              <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square relative">
                  <img
                    src={child.photo_url || "/placeholder.svg"}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{child.name}</h3>
                    <p className="text-sm opacity-90">{child.age} ans</p>
                    <p className="text-sm opacity-90">{child.city}</p>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {child.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{child.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleAddPhoto(child.id)}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {t.addPhoto}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAddTestimonial(child.id)}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t.addTestimonial}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleEndSponsorship(sponsorship.id, child.name)}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Clock className="w-4 h-4" />
                      {t.endSponsorship}
                    </Button>
                  </div>
                </div>

                {selectedChild === child.id && (
                  <div className="p-4 border-t">
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

      {selectedSponsorship && (
        <TerminationDialog
          isOpen={showTerminationDialog}
          onClose={() => {
            setShowTerminationDialog(false);
            setSelectedSponsorship(null);
          }}
          sponsorshipId={selectedSponsorship.id}
          childName={selectedSponsorship.childName}
          onTerminationComplete={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default SponsorDashboard;