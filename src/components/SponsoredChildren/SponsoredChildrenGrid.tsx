import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart, Calendar } from "lucide-react";

interface SponsoredChild {
  id: string;
  name: string;
  photo_url: string | null;
  city: string | null;
  needs: any[];
  sponsor_name: string | null;
  sponsorship_date: string;
  album_photos: Array<{
    id: string;
    url: string;
    type: string;
  }>;
}

export const SponsoredChildrenGrid = () => {
  const { t, language } = useLanguage();

  const { data: children, isLoading } = useQuery({
    queryKey: ['sponsored-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsored_children_view')
        .select('*')
        .order('sponsorship_date', { ascending: false });

      if (error) {
        console.error('Error fetching sponsored children:', error);
        return [];
      }

      return data as SponsoredChild[];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    );
  }

  if (!children?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">{t('noSponsoredChildren')}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => (
        <Card 
          key={child.id} 
          className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange"
        >
          <div className="aspect-square relative">
            {child.photo_url ? (
              <img
                src={child.photo_url}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{child.name}</h3>
                {child.sponsor_name && (
                  <p className="text-sm text-gray-600">
                    {t('sponsoredBy')} {child.sponsor_name}
                  </p>
                )}
              </div>
            </div>

            {child.sponsorship_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {format(new Date(child.sponsorship_date), 'PP', {
                  locale: language === 'fr' ? fr : undefined
                })}
              </div>
            )}

            {child.album_photos?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {child.album_photos.slice(0, 3).map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                ))}
                {child.album_photos.length > 3 && (
                  <div className="w-16 h-16 bg-black/50 rounded-md flex items-center justify-center text-white">
                    +{child.album_photos.length - 3}
                  </div>
                )}
              </div>
            )}

            {child.needs?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {child.needs.slice(0, 2).map((need: any, index: number) => (
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
                {child.needs.length > 2 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    +{child.needs.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};