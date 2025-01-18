import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, differenceInMonths, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { convertJsonToNeeds } from "@/types/needs";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  User,
  Calendar,
  MapPin,
  ArrowLeft,
  Heart,
  Info,
  GraduationCap,
  Shirt,
  Apple,
  Stethoscope,
  Sparkles,
  Book
} from "lucide-react";

const NEED_CATEGORIES = {
  education: {
    icon: GraduationCap,
    color: "text-yellow-500"
  },
  jouet: {
    icon: Sparkles,
    color: "text-purple-500"
  },
  vetement: {
    icon: Shirt,
    color: "text-blue-500"
  },
  nourriture: {
    icon: Apple,
    color: "text-green-500"
  },
  medicament: {
    icon: Stethoscope,
    color: "text-red-500"
  },
  hygiene: {
    icon: Book,
    color: "text-cyan-500"
  },
  autre: {
    icon: Info,
    color: "text-gray-500"
  }
};

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      return data;
    }
  });

  const handleSponsorshipRequest = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${id}`);
      return;
    }

    try {
      // Vérifier si l'utilisateur est déjà un parrain
      const { data: existingSponsorship, error: sponsorshipError } = await supabase
        .from('sponsorships')
        .select('*')
        .eq('sponsor_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (sponsorshipError) throw sponsorshipError;

      if (!existingSponsorship) {
        // L'utilisateur n'est pas encore parrain
        navigate(`/become-sponsor?child=${id}`);
        return;
      }

      // Créer une demande de parrainage
      const { error: requestError } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: id,
          full_name: user.name,
          email: user.email,
          city: user.city,
          status: 'pending',
          sponsor_id: user.id
        });

      if (requestError) throw requestError;

      toast.success("Votre demande de parrainage a été envoyée avec succès");
    } catch (error) {
      console.error('Erreur lors de la demande de parrainage:', error);
      toast.error("Une erreur est survenue lors de la demande de parrainage");
    }
  };

  const formatAge = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;

    if (years === 0) {
      return `${months} mois`;
    }
    
    if (months === 0) {
      return `${years} ans`;
    }

    return `${years} ans et ${months} mois`;
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Card className="p-6 text-center">
          <p className="text-red-500">Erreur lors du chargement des détails de l'enfant</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const needs = child?.needs ? convertJsonToNeeds(child.needs) : [];

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            {child?.photo_url ? (
              <img
                src={child.photo_url}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>
          
          {!child?.is_sponsored && (
            <Button 
              onClick={handleSponsorshipRequest}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Heart className="w-5 h-5" />
              Parrainer cet enfant
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-orange-800">{child?.name}</h1>
            <div className="flex items-center gap-2 text-orange-600">
              <MapPin className="w-4 h-4" />
              <span>{child?.city || "Ville non renseignée"}</span>
            </div>
          </div>

          <Card className="p-6 space-y-4 bg-white/80 backdrop-blur-sm border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800">Informations générales</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-600">Âge</p>
                  <p className="font-medium">
                    {child?.birth_date ? formatAge(child.birth_date) : "Âge non renseigné"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-600">Genre</p>
                  <p className="font-medium">
                    {child?.gender === "male" ? "Masculin" : "Féminin"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {child?.description && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.description}</p>
            </Card>
          )}

          {child?.story && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">Histoire</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.story}</p>
            </Card>
          )}

          {needs.length > 0 && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">Besoins</h2>
              <div className="grid gap-2">
                {needs.map((need, index) => {
                  const NeedIcon = NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]?.icon || Info;
                  const iconColor = NEED_CATEGORIES[need.category as keyof typeof NEED_CATEGORIES]?.color || "text-gray-500";
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        need.is_urgent 
                          ? "bg-red-100/80 backdrop-blur-sm text-red-800" 
                          : "bg-orange-100/80 backdrop-blur-sm text-orange-800"
                      }`}
                    >
                      <NeedIcon className={`w-4 h-4 ${iconColor}`} />
                      <div>
                        <span className="font-medium">{need.category}</span>
                        {need.description && (
                          <p className="text-sm mt-1">{need.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;
