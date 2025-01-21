import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/components/Auth/AuthProvider";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";
import { convertJsonToNeeds } from "@/types/needs";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: child, isLoading } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        ...data,
        needs: convertJsonToNeeds(data.needs)
      };
    }
  });

  const handleSponsorshipRequest = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${id}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("sponsorship_requests")
        .insert({
          child_id: id,
          sponsor_id: user.id,
          status: "pending",
          terms_accepted: true
        });

      if (error) throw error;

      toast.success("Votre demande de parrainage a été envoyée avec succès");
      navigate("/sponsor-dashboard");
    } catch (error) {
      console.error("Error submitting sponsorship request:", error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {format(new Date(child.birth_date), "dd/MM/yyyy")}
            </p>
            <p className="text-gray-600">{child.city}</p>
          </div>
          
          <Button
            onClick={handleSponsorshipRequest}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Envoi en cours..." : "Parrainer cet enfant"}
          </Button>
        </div>
      </div>

      {/* Description & Story Section */}
      <Card className="p-6 space-y-6">
        {child.description && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{child.description}</p>
          </div>
        )}

        {child.story && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Histoire</h2>
            <p className="text-gray-700">{child.story}</p>
          </div>
        )}
      </Card>

      {/* Needs Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Besoins</h2>
        <div className="space-y-4">
          {child.needs?.map((need, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <h3 className="font-medium">{need.category}</h3>
                <p className="text-gray-600">{need.description}</p>
              </div>
              {need.is_urgent && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Urgent
                </span>
              )}
            </div>
          ))}
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