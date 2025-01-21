import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildCard } from "./ChildCard";
import { ChildrenTable } from "./ChildrenTable";
import { SponsorDialog } from "./SponsorDialog";
import { useState } from "react";
import { AlertTriangle, Grid, HelpCircle, List } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AssignSponsorDialog } from "../AssistantSponsorship/AssignSponsorDialog";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

type ViewMode = "grid" | "table";

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? "grid" : "table");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);

  // Add a query to fetch sponsors
  const { data: sponsors } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*');
      if (error) throw error;
      return data || [];
    }
  });

  const handleSponsorClick = async (child: any) => {
    if (!user) {
      navigate(`/become-sponsor?child=${child.id}`);
      return;
    }

    try {
      // Vérifier si l'enfant est déjà parrainé
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('is_sponsored, name')
        .eq('id', child.id)
        .maybeSingle();

      if (childError) {
        console.error('Erreur lors de la vérification du statut de l\'enfant:', childError);
        toast.error("Une erreur est survenue lors de la vérification du statut de l'enfant");
        return;
      }

      if (!childData) {
        toast.error("Impossible de trouver les informations de l'enfant");
        return;
      }

      if (childData.is_sponsored) {
        toast.error("Cet enfant est déjà parrainé");
        return;
      }

      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: requestError } = await supabase
        .from('sponsorship_requests')
        .select('status')
        .eq('child_id', child.id)
        .eq('sponsor_id', user.id)
        .maybeSingle();

      if (requestError) {
        console.error('Erreur lors de la vérification des demandes existantes:', requestError);
        toast.error("Une erreur est survenue lors de la vérification des demandes existantes");
        return;
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.error("Vous avez déjà une demande de parrainage en cours pour cet enfant");
        } else {
          toast.error("Vous avez déjà parrainé cet enfant");
        }
        return;
      }

      // Créer la demande de parrainage
      const { error: createError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: child.id,
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
        toast.error("Une erreur est survenue lors de la demande de parrainage");
        return;
      }

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  const handleAssignComplete = () => {
    setShowAssignDialog(false);
    setSelectedSponsorId(null);
    // Optionally refresh data here
  };

  const getMissingFields = (child: any) => {
    const missingFields = [];
    if (!child.gender) missingFields.push('Genre');
    if (!child.birth_date) missingFields.push('Date de naissance');
    if (!child.name) missingFields.push('Nom');
    if (!child.photo_url) missingFields.push('Photo');
    if (!child.city) missingFields.push('Ville');
    if (!child.story) missingFields.push('Histoire');
    if (!child.comments) missingFields.push('Commentaires');
    if (!child.description) missingFields.push('Description');
    return missingFields;
  };

  if (isLoading) {
    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden">
            <div className="relative pb-[75%]">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-3 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {!isMobile && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] sm:w-[450px] p-4 text-sm space-y-4">
                <h3 className="font-semibold text-base mb-2">Guide d'utilisation</h3>
                <div className="space-y-3">
                  <p>Cette page affiche la liste des enfants enregistrés dans le système.</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>Consultez les profils des enfants</li>
                    <li>Gérez les besoins urgents</li>
                    <li>Ajoutez des commentaires</li>
                    <li>Assignez des parrains</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2 min-h-[44px] w-full sm:w-auto"
              >
                <Grid className="h-4 w-4" />
                {t("gridView")}
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2 min-h-[44px] w-full sm:w-auto"
              >
                <List className="h-4 w-4" />
                {t("tableView")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {window.location.search.includes('status=incomplete') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Ces profils sont incomplets. Cliquez sur un profil pour compléter les informations manquantes.
              </p>
            </div>
          </div>
        </div>
      )}

      {(viewMode === "grid" || isMobile) ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children.map((child) => (
            <div key={child.id} className="space-y-2">
              <ChildCard
                child={child}
                onViewProfile={onViewProfile}
                onSponsorClick={handleSponsorClick}
              />
            </div>
          ))}
        </div>
      ) : (
        <ChildrenTable
          children={children}
          onViewProfile={onViewProfile}
          onSponsorClick={handleSponsorClick}
        />
      )}

      {selectedChild && (
        <SponsorDialog
          child={selectedChild}
          sponsors={sponsors || []}
          isOpen={!!selectedChild}
          onClose={() => setSelectedChild(null)}
        />
      )}
    </div>
  );
};