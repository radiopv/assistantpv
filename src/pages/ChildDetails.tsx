import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInYears, parseISO } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { convertJsonToNeeds } from "@/types/needs";
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Heart
} from "lucide-react";

const ChildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: child, isLoading, error } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    toast.error(t("errorLoadingChildDetails"));
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

  const age = child?.birth_date 
    ? differenceInYears(new Date(), parseISO(child.birth_date))
    : null;

  const needs = child?.needs ? convertJsonToNeeds(child.needs) : [];

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fade-in">
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
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{child?.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{child?.city || t("cityNotAvailable")}</span>
            </div>
          </div>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t("generalInfo")}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("age")}</p>
                  <p className="font-medium">{age ? `${age} ${t("years")}` : t("ageNotAvailable")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">{t("gender")}</p>
                  <p className="font-medium">
                    {child?.gender === "M" ? t("male") : t("female")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {child?.description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("description")}</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.description}</p>
            </Card>
          )}

          {child?.story && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("story")}</h2>
              <p className="text-gray-600 whitespace-pre-line">{child.story}</p>
            </Card>
          )}

          {needs.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">{t("needs")}</h2>
              <div className="grid gap-2">
                {needs.map((need, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                      need.is_urgent ? "bg-red-100 text-red-800" : "bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${need.is_urgent ? "text-red-500" : "text-gray-500"}`} />
                    <span>{need.category}</span>
                    {need.description && (
                      <span className="text-sm ml-2">- {need.description}</span>
                    )}
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