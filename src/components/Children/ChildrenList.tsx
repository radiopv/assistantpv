import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildCard } from "./ChildCard";
import { SponsorDialog } from "./SponsorDialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  const [selectedChild, setSelectedChild] = useState<any>(null);

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-4">
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
    <div className="space-y-6">
      {/* Display incomplete profiles warning if we're on the incomplete status page */}
      {window.location.search.includes('status=incomplete') && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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