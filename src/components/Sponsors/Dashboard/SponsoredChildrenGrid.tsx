import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { convertJsonToNeeds } from "@/types/needs";
import { differenceInDays } from "date-fns";

interface SponsoredChildrenGridProps {
  userId: string;
}

export const SponsoredChildrenGrid = ({ userId }: SponsoredChildrenGridProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

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
            birth_date
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
        id: sponsorship.children.id,
        name: sponsorship.children.name,
        photo_url: sponsorship.children.photo_url,
        city: sponsorship.children.city,
        needs: sponsorship.children.needs,
        birth_date: sponsorship.children.birth_date,
        photos: sponsorship.album_media || []
      }));
    }
  });

  const translations = {
    fr: {
      noChildren: "Vous ne parrainez aucun enfant actuellement",
      viewAlbum: "Voir l'album",
      birthdayIn: "Anniversaire dans",
      days: "jours",
      needs: "Besoins",
      urgent: "Urgent"
    },
    es: {
      noChildren: "No tienes niños apadrinados actualmente",
      viewAlbum: "Ver álbum",
      birthdayIn: "Cumpleaños en",
      days: "días",
      needs: "Necesidades",
      urgent: "Urgente"
    }
  };

  const t = translations[language as keyof typeof translations];

  const getBirthdayCountdown = (birthDate: string) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    return differenceInDays(nextBirthday, today);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
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
        const featuredPhotos = child.photos?.filter(photo => photo.is_featured) || [];

        return (
          <Card 
            key={child.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange"
          >
            <div className="aspect-square relative">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
              {hasUrgentNeeds && (
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {t.urgent}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-4">
              <h3 className="text-xl font-semibold">{child.name}</h3>
              
              {daysUntilBirthday && (
                <p className="text-cuba-coral">
                  {t.birthdayIn} {daysUntilBirthday} {t.days}
                </p>
              )}
              
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
                    </span>
                  ))}
                </div>
              </div>

              {featuredPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
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