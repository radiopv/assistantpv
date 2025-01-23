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
import { convertJsonToNeeds } from "@/types/needs";

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
  const [selectedChildForAssignment, setSelectedChildForAssignment] = useState<string | null>(null);

  // Sort children by urgent needs and waiting time
  const sortedChildren = [...children].sort((a, b) => {
    // First, check for urgent needs
    const aHasUrgentNeeds = convertJsonToNeeds(a.needs).some((need: any) => need.is_urgent);
    const bHasUrgentNeeds = convertJsonToNeeds(b.needs).some((need: any) => need.is_urgent);
    
    if (aHasUrgentNeeds && !bHasUrgentNeeds) return -1;
    if (!aHasUrgentNeeds && bHasUrgentNeeds) return 1;
    
    // If both have or don't have urgent needs, sort by creation date (waiting time)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

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

  const handleAssignSponsor = (childId: string) => {
    setSelectedChildForAssignment(childId);
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
    } catch (error) {
      console.error('Error removing sponsor:', error);
      toast.error(t("errorRemovingSponsor"));
    }
  };

  const handleAssignComplete = () => {
    setShowAssignDialog(false);
    setSelectedChildForAssignment(null);
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
                  <li>Les enfants avec des besoins urgents apparaissent en premier</li>
                  <li>Suivis des enfants qui attendent un parrain depuis le plus longtemps</li>
                  <li>Les besoins urgents sont marqués en rouge</li>
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

      {(viewMode === "grid" || isMobile) ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedChildren.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onViewProfile={onViewProfile}
              onSponsorClick={setSelectedChild}
            />
          ))}
        </div>
      ) : (
        <ChildrenTable
          children={sortedChildren}
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
        childId={selectedChildForAssignment || ""}
        onAssignComplete={handleAssignComplete}
      />
    </div>
  );
};