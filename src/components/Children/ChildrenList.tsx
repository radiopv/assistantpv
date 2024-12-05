import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChildCard } from "./ChildCard";
import { SponsorDialog } from "./SponsorDialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
      <div className="flex justify-between items-center mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[450px] p-4 text-sm space-y-4">
            <h3 className="font-semibold text-base mb-2">Guía de uso de la página</h3>
            <div className="space-y-3">
              <p>
                Esta página muestra la lista de niños registrados en el sistema. Aquí puedes:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Ver los perfiles de los niños y su información básica</li>
                <li>Gestionar las necesidades de cada niño marcándolas como urgentes</li>
                <li>Agregar comentarios a las necesidades específicas</li>
                <li>Asignar padrinos a los niños</li>
                <li>Identificar perfiles incompletos que necesitan más información</li>
              </ul>
              <p className="font-medium mt-4">Funciones principales:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Haz clic en un niño para ver su perfil completo</li>
                <li>El botón "Apadrinar" abre el diálogo para asignar un padrino</li>
                <li>Las necesidades se pueden marcar como urgentes usando la casilla de verificación</li>
                <li>Los perfiles incompletos muestran una lista de campos faltantes</li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>

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