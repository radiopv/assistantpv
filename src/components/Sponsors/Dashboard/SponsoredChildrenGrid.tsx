import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface SponsoredChildrenGridProps {
  userId: string;
}

export const SponsoredChildrenGrid = ({ userId }: SponsoredChildrenGridProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const { data: sponsoredChildren, isLoading } = useQuery({
    queryKey: ['sponsored-children', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsored_children_view')
        .select('*')
        .eq('sponsorship_status', 'active');

      if (error) {
        console.error('Error fetching sponsored children:', error);
        return [];
      }

      return data;
    }
  });

  const translations = {
    fr: {
      noChildren: "Vous ne parrainez aucun enfant actuellement",
      viewAlbum: "Voir l'album",
      sendMessage: "Envoyer un message",
      needs: "Besoins",
      urgent: "Urgent"
    },
    es: {
      noChildren: "No tienes niños apadrinados actualmente",
      viewAlbum: "Ver álbum",
      sendMessage: "Enviar mensaje",
      needs: "Necesidades",
      urgent: "Urgente"
    }
  };

  const t = translations[language as keyof typeof translations];

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
      {sponsoredChildren.map((child) => (
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
            {child.needs?.some((need: any) => need.is_urgent) && (
              <div className="absolute top-2 right-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {t.urgent}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-4">
            <h3 className="text-xl font-semibold">{child.name}</h3>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{t.needs}:</p>
              <div className="flex flex-wrap gap-2">
                {child.needs?.map((need: any, index: number) => (
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

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 flex items-center gap-2"
                onClick={() => navigate(`/children/${child.id}/album`)}
              >
                <Star className="w-4 h-4" />
                {t.viewAlbum}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 flex items-center gap-2"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="w-4 h-4" />
                {t.sendMessage}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};