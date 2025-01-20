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

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

type ViewMode = "grid" | "table";

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? "grid" : "table");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);

  const uniqueChildren = children.reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const { data: sponsors } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
  });

  const handleAssignSponsor = (childId: string) => {
    setSelectedSponsorId(childId);
    setShowAssignDialog(true);
  };

  const handleRemoveSponsor = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('children')
        .update({ 
          is_sponsored: false,
          sponsor_id: null,
          sponsor_name: null 
        })
        .eq('id', childId);

      if (error) throw error;

      toast.success(t("sponsorRemoved"));
      // Refresh data if needed
    } catch (error) {
      console.error('Error removing sponsor:', error);
      toast.error(t("errorRemovingSponsor"));
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
    <div className="space-y-4 animate-fade-in">
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
          {uniqueChildren.map((child) => (
            <div key={child.id} className="space-y-2">
              <ChildCard
                child={child}
                onViewProfile={onViewProfile}
                onSponsorClick={setSelectedChild}
              />
              {window.location.search.includes('status=incomplete') && (
                <div className="p-3 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Informations manquantes :</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {getMissingFields(child).map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ChildrenTable
          children={uniqueChildren}
          onViewProfile={onViewProfile}
          onSponsorClick={setSelectedChild}
          onAssignSponsor={handleAssignSponsor}
          onRemoveSponsor={handleRemoveSponsor}
        />
      )}

      {selectedChild && sponsors && (
        <SponsorDialog
          child={selectedChild}
          sponsors={sponsors}
          isOpen={!!selectedChild}
          onClose={() => setSelectedChild(null)}
        />
      )}

      <AssignSponsorDialog
        isOpen={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        sponsorId={selectedSponsorId || ""}
      />
    </div>
  );
};