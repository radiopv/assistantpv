import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { convertJsonToNeeds } from "@/types/needs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChildrenListProps {
  children: any[];
  isLoading: boolean;
  onViewProfile: (id: string) => void;
}

const formatAge = (birthDate: string) => {
  const today = new Date();
  const birth = parseISO(birthDate);
  const years = differenceInYears(today, birth);
  
  if (years === 0) {
    const months = differenceInMonths(today, birth);
    return `${months} mois`;
  }
  
  return `${years} ans`;
};

export const ChildrenList = ({ children, isLoading, onViewProfile }: ChildrenListProps) => {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string>("");

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

  const handleSponsorUpdate = async (childId: string, sponsorId: string | null) => {
    try {
      const updates = {
        is_sponsored: !!sponsorId,
        sponsor_name: sponsors?.find(s => s.id === sponsorId)?.name || null,
        sponsor_email: sponsors?.find(s => s.id === sponsorId)?.email || null,
      };

      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId);

      if (error) throw error;

      toast.success(sponsorId ? "Parrain ajouté avec succès" : "Parrain retiré avec succès");
      setSelectedChild(null);
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du parrain");
    }
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

  const NEED_CATEGORIES = {
    education: "Éducation",
    jouet: "Jouet",
    vetement: "Vêtement",
    nourriture: "Nourriture",
    medicament: "Médicament",
    hygiene: "Hygiène",
    autre: "Autre"
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{child.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>{formatAge(child.birth_date)}</p>
              <p>{child.city}</p>
              {child.is_sponsored && child.sponsor_name && (
                <p className="font-medium text-blue-600">
                  Parrainé par: {child.sponsor_name}
                </p>
              )}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs ${
                  !child.is_sponsored
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {child.is_sponsored ? "Parrainé" : "Disponible"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {convertJsonToNeeds(child.needs).map((need, index) => (
                <Badge 
                  key={`${need.category}-${index}`}
                  variant={need.is_urgent ? "destructive" : "secondary"}
                >
                  {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => onViewProfile(child.id)}
              >
                Voir le profil
              </Button>

              <Dialog open={selectedChild?.id === child.id} onOpenChange={(open) => !open && setSelectedChild(null)}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedChild(child);
                      setSelectedSponsor(child.sponsor_id || "");
                    }}
                  >
                    {child.is_sponsored ? "Modifier parrain" : "Ajouter parrain"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {child.is_sponsored ? "Modifier le parrain" : "Ajouter un parrain"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select
                      value={selectedSponsor}
                      onValueChange={setSelectedSponsor}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un parrain" />
                      </SelectTrigger>
                      <SelectContent>
                        {child.is_sponsored && (
                          <SelectItem value="">Retirer le parrain</SelectItem>
                        )}
                        {sponsors?.map((sponsor) => (
                          <SelectItem key={sponsor.id} value={sponsor.id}>
                            {sponsor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedChild(null)}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={() => handleSponsorUpdate(child.id, selectedSponsor || null)}
                      >
                        Confirmer
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};