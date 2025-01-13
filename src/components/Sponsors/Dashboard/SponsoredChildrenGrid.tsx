import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { convertJsonToNeeds } from "@/types/needs";
import { differenceInDays, parseISO, differenceInYears, differenceInMonths } from "date-fns";

interface SponsoredChildrenGridProps {
  userId: string;
}

export const SponsoredChildrenGrid = ({ userId }: SponsoredChildrenGridProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    fr: {
      welcomeMessage: "Bienvenue",
      inviteFriends: "Inviter des amis",
      viewAlbum: "Voir l'album",
      birthdayIn: "Anniversaire dans",
      days: "jours",
      years: "ans",
      months: "mois",
      needs: "Besoins",
      urgent: "URGENT",
      noChildren: "Vous ne parrainez aucun enfant actuellement"
    },
    es: {
      welcomeMessage: "Bienvenido",
      inviteFriends: "Invitar amigos",
      viewAlbum: "Ver álbum",
      birthdayIn: "Cumpleaños en",
      days: "días",
      years: "años",
      months: "meses",
      needs: "Necesidades",
      urgent: "URGENTE",
      noChildren: "No tienes niños apadrinados actualmente"
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: sponsoredChildren, isLoading } = useQuery({
    queryKey: ['sponsored-children', userId],
    queryFn: async () => {
      const { data: sponsorships, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          children (
            id,
            name,
            photo_url,
            city,
            needs,
            birth_date,
            description,
            story
          ),
          album_media (
            id,
            url,
            is_featured
          )
        `)
        .eq('sponsor_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching sponsored children:', error);
        return [];
      }

      return sponsorships.map(sponsorship => ({
        ...sponsorship.children,
        photos: sponsorship.album_media || []
      }));
    },
    enabled: !!userId
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    const months = differenceInMonths(today, birth) % 12;
    
    return {
      years,
      months
    };
  };

  const getBirthdayCountdown = (birthDate: string) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = parseISO(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return differenceInDays(nextBirthday, today);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!sponsoredChildren?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">{t.noChildren}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sponsoredChildren.map((child) => {
        const childNeeds = convertJsonToNeeds(child.needs);
        const hasUrgentNeeds = childNeeds.some(need => need.is_urgent);
        const daysUntilBirthday = getBirthdayCountdown(child.birth_date);
        const age = calculateAge(child.birth_date);
        const featuredPhotos = child.photos?.filter(photo => photo.is_featured) || [];

        return (
          <Card 
            key={child.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-cuba-offwhite to-cuba-warmBeige"
          >
            <div className="aspect-square relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{child.name}</h3>
                <p className="text-cuba-coral">
                  {age.years} {t.years} {age.months > 0 && `${age.months} ${t.months}`}
                </p>
                {daysUntilBirthday && (
                  <p className="text-cuba-coral">
                    {t.birthdayIn} {daysUntilBirthday} {t.days}
                  </p>
                )}
                <p className="text-gray-600">{child.city}</p>
              </div>

              {child.description && (
                <p className="text-sm text-gray-700">{child.description}</p>
              )}

              {childNeeds.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t.needs}:</p>
                  <div className="flex flex-wrap gap-2">
                    {childNeeds.map((need, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          need.is_urgent 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {need.category}
                        {need.is_urgent && ` (${t.urgent})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {featuredPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {featuredPhotos.slice(0, 3).map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={`Photo de ${child.name}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <Button 
                variant="outline" 
                size="sm"
                className="w-full flex items-center gap-2"
                onClick={() => navigate(`/children/${child.id}/album`)}
              >
                <Star className="w-4 h-4" />
                {t.viewAlbum}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};