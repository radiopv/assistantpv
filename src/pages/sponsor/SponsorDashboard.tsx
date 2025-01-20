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
import { Plus, Minus, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);

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
      removeChild: "Retirer un enfant"
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
      removeChild: "Retirar un niño"
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

  const handleUploadSuccess = async () => {
    if (selectedChild) {
      toast.success(t.uploadSuccess);
      setSelectedChild(null);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('child_assignment_requests')
        .insert({
          sponsor_id: user.id,
          child_id: childId,
          status: 'pending',
          type: 'remove'
        });

      if (error) throw error;
      toast.success("Demande de retrait envoyée");
    } catch (error) {
      console.error('Error requesting child removal:', error);
      toast.error("Erreur lors de la demande de retrait");
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
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-cuba-warmBeige hover:bg-cuba-warmBeige/90 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Demande d'ajout d'enfant à mon espace parrain
                    <HelpCircle className="w-4 h-4 ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Cette option vous permet d'ajouter un enfant que vous parrainez déjà mais qui n'apparaît pas dans votre espace parrain.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid gap-6">
          {user?.id && <ContributionStats sponsorId={user.id} />}

          {sponsoredChildren?.map((sponsorship) => {
            const child = sponsorship.children;
            if (!child) return null;

            return (
              <div key={child.id} className="space-y-6">
                <div className="relative">
                  <SponsoredChildCard
                    child={child}
                    sponsorshipId={sponsorship.id}
                    onAddPhoto={() => handleAddPhoto(child.id)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveChild(child.id)}
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    {t.removeChild}
                  </Button>
                </div>

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
    </div>
  );
};

export default SponsorDashboard;
