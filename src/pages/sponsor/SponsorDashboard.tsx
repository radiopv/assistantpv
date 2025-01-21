import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SponsoredChildCard } from "@/components/Sponsors/Dashboard/Cards/SponsoredChildCard";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { PhotoUploader } from "@/components/AssistantPhotos/PhotoUploader";
import { ContributionStats } from "@/components/Sponsors/Dashboard/ContributionStats";
import { SponsorshipTimeline } from "@/components/Sponsors/Dashboard/SponsorshipTimeline";
import { VisitsSection } from "@/components/Sponsors/Dashboard/VisitsSection";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";
import { PlannedVisitForm } from "@/components/Sponsors/Dashboard/PlannedVisitForm";
import { AssignSponsorDialog } from "@/components/AssistantSponsorship/AssignSponsorDialog";
import { Plus, Camera, MessageSquare, Clock } from "lucide-react";
import { TerminationDialog } from "@/components/Sponsors/Dashboard/TerminationDialog";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTerminationDialog, setShowTerminationDialog] = useState(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState<{id: string, childName: string} | null>(null);

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      loading: "Chargement...",
      sponsorDashboard: "Mon Espace Parrain",
      uploadSuccess: "Photo ajoutée avec succès",
      uploadError: "Erreur lors de l'ajout de la photo",
      plannedVisits: "Visites Planifiées",
      noAccess: "Accès non autorisé",
      addChild: "Ajouter un enfant",
      addPhoto: "Ajouter une photo",
      addTestimonial: "Ajouter un témoignage",
      endSponsorship: "Terminer le parrainage"
    },
    es: {
      welcomeMessage: "Bienvenido",
      loading: "Cargando...",
      sponsorDashboard: "Mi Panel de Padrino",
      uploadSuccess: "Foto agregada con éxito",
      uploadError: "Error al agregar la foto",
      plannedVisits: "Visitas Planificadas",
      noAccess: "Acceso no autorizado",
      addChild: "Agregar un niño",
      addPhoto: "Agregar una foto",
      addTestimonial: "Agregar un testimonio",
      endSponsorship: "Terminar el padrinazgo"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (!user?.id) {
    return <div className="text-center p-4">{t.noAccess}</div>;
  }

  const { data: sponsoredChildren, isLoading: childrenLoading } = useQuery({
    queryKey: ["sponsored-children", user.id],
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
        .eq('sponsor_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      return sponsorships || [];
    },
    enabled: !!user.id
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

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
    }
  };

  if (childrenLoading) {
    return <div className="text-center p-4">{t.loading}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite p-4">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-medium text-gray-800">{t.sponsorDashboard}</h2>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-cuba-warmBeige hover:bg-cuba-warmBeige/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.addChild}
          </Button>
        </div>

        <div className="grid gap-6">
          {user?.id && <ContributionStats sponsorId={user.id} />}

          {sponsoredChildren?.map((sponsorship) => {
            const child = sponsorship.children;
            if (!child) return null;

            return (
              <div key={child.id} className="space-y-6">
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img
                        src={child.photo_url || "/placeholder.svg"}
                        alt={child.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{child.name}</h3>
                        <p className="text-gray-600">{child.city}</p>
                      </div>
                      {child.description && (
                        <p className="text-gray-700">{child.description}</p>
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
                  </div>
                </Card>

                {selectedChild === child.id && (
                  <Card className="p-4">
                    <PhotoUploader
                      childId={selectedChild}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </Card>
                )}
              </div>
            );
          })}

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t.plannedVisits}
            </h3>
            <div className="space-y-6">
              <PlannedVisitForm 
                sponsorId={user.id} 
                onVisitPlanned={() => {}} 
              />
              <VisitsSection visits={[]} onVisitDeleted={() => {}} />
            </div>
          </Card>

          <SponsorshipTimeline events={[]} />
        </div>
      </div>

      <AssignSponsorDialog
        sponsorId={user.id}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />

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