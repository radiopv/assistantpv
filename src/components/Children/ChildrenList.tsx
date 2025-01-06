import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildCard } from "./ChildCard";
import { ChildrenTable } from "./ChildrenTable";
import { SponsorDialog } from "./SponsorDialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Grid, HelpCircle, List } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const { data: sponsors } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

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
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative pb-[75%]">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {!isMobile && (
          <div className="flex items-center gap-4">
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

            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2 min-h-[44px]"
              >
                <Grid className="h-4 w-4" />
                {t("gridView")}
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="gap-2 min-h-[44px]"
              >
                <List className="h-4 w-4" />
                {t("tableView")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {window.location.search.includes('status=incomplete') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
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
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <div key={child.id} className="space-y-2">
              <ChildCard
                child={child}
                onViewProfile={onViewProfile}
                onSponsorClick={setSelectedChild}
              />
              {window.location.search.includes('status=incomplete') && (
                <div className="p-4 bg-gray-50 rounded-lg">
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
          children={children}
          onViewProfile={onViewProfile}
          onSponsorClick={setSelectedChild}
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
    </div>
  );
};
