import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorProfile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["sponsor-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("profile")}</h1>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.photo_url} />
            <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-semibold">{profile?.name}</h2>
            <p className="text-gray-600">{profile?.email}</p>
            {profile?.city && (
              <p className="text-sm text-gray-500">{profile.city}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SponsorProfile;