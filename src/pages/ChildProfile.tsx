import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { convertJsonToNeeds } from "@/types/needs";
import { Badge } from "@/components/ui/badge";
import { SponsorshipButton } from "@/components/Children/Details/SponsorshipButton";

const NEED_CATEGORIES = {
  education: "Éducation",
  jouet: "Jouets",
  vetement: "Vêtements",
  nourriture: "Nourriture",
  medicament: "Médicaments",
  hygiene: "Hygiène",
  autre: "Autre"
};

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: child, isLoading, error } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Enfant non trouvé");

      return {
        ...data,
        needs: convertJsonToNeeds(data.needs)
      };
    }
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-gray-500">Une erreur est survenue lors du chargement des informations</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Retour
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-gray-500">Enfant non trouvé</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Retour
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="overflow-hidden w-full md:w-1/3">
          <img
            src={child.photo_url || "/placeholder.svg"}
            alt={child.name}
            className="w-full aspect-square object-cover"
          />
        </Card>
        
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{child.name}</h1>
          <div className="space-y-2">
            <p className="text-lg">
              {format(new Date(child.birth_date), "dd MMMM yyyy", { locale: fr })} ({child.age} ans)
            </p>
            <p className="text-gray-600">{child.city}</p>
          </div>
          
          <SponsorshipButton childId={child.id} userId={user?.id} />
        </div>
      </div>

      {/* Description & Story Section */}
      <Card className="p-6 space-y-6">
        {child.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{child.description}</p>
          </div>
        )}

        {child.story && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Histoire</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{child.story}</p>
          </div>
        )}
      </Card>

      {/* Needs Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Besoins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {child.needs?.map((need, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${need.is_urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">
                    {NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]}
                  </h3>
                  {need.description && (
                    <p className="text-sm text-gray-600 mt-1">{need.description}</p>
                  )}
                </div>
                {need.is_urgent && (
                  <Badge variant="destructive" className="ml-2">
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {(!child.needs || child.needs.length === 0) && (
            <p className="text-gray-500">Aucun besoin enregistré</p>
          )}
        </div>
      </Card>

      {/* Photo Album Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Album Photos</h2>
        <AlbumMediaGrid childId={id!} />
      </Card>
    </div>
  );
};

export default ChildProfile;