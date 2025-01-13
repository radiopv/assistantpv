import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, differenceInMonths, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { convertJsonToNeeds } from "@/types/needs";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Heart,
  Info
} from "lucide-react";

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { t } = useLanguage();

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

  const formatAge = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;

    if (years === 0) {
      return `${months} ${t('months')}`;
    }
    
    if (months === 0) {
      return `${years} ${t('years')}`;
    }

    return `${years} ${t('years')} ${t('and')} ${months} ${t('months')}`;
  };

  const handleSponsorshipRequest = async () => {
    if (!user) {
      navigate(`/become-sponsor?child=${id}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .insert({
          child_id: id,
          full_name: user.name,
          email: user.email,
          city: user.city,
          status: 'pending',
          sponsor_id: user.id
        });

      if (error) throw error;

      toast({
        title: t("sponsorshipRequestSent"),
        description: t("sponsorshipRequestPending"),
      });
    } catch (error) {
      console.error('Error requesting sponsorship:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRequestingSponsorship"),
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("back")}
        </Button>
        <Card className="p-6 text-center">
          <p className="text-red-500">{t("errorLoadingChildDetails")}</p>
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
        {t("back")}
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
              {t("sponsorThisChild")}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-orange-800">{child?.name}</h1>
            <div className="flex items-center gap-2 text-orange-600">
              <MapPin className="w-4 h-4" />
              <span>{child?.city || t("cityNotAvailable")}</span>
            </div>
          </div>

          <Card className="p-6 space-y-4 bg-white/80 backdrop-blur-sm border-orange-200">
            <h2 className="text-xl font-semibold text-orange-800">{t("generalInfo")}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-600">{t("age")}</p>
                  <p className="font-medium">
                    {child?.birth_date ? formatAge(child.birth_date) : t("ageNotAvailable")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-orange-600">{t("genderLabel")}</p>
                  <p className="font-medium">
                    {child?.gender === "male" ? t("genderMale") : t("genderFemale")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {child?.description && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">{t("description")}</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.description}</p>
            </Card>
          )}

          {child?.story && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">{t("story")}</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.story}</p>
            </Card>
          )}

          {needs.length > 0 && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
              <h2 className="text-xl font-semibold mb-4 text-orange-800">{t("needs")}</h2>
              <div className="grid gap-2">
                {needs.map((need, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                      need.is_urgent 
                        ? "bg-red-100/80 backdrop-blur-sm text-red-800" 
                        : "bg-orange-100/80 backdrop-blur-sm text-orange-800"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${need.is_urgent ? "text-red-500" : "text-orange-500"}`} />
                    <div>
                      <span className="font-medium">{t(need.category)}</span>
                      {need.description && (
                        <p className="text-sm mt-1">{need.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;