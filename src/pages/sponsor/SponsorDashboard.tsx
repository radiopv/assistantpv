import React, { useState } from 'react';
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardActions } from "@/components/Sponsors/Dashboard/DashboardActions";
import { SponsoredChildSection } from "@/components/Sponsors/Dashboard/SponsoredChildSection";
import { toast } from "@/components/ui/use-toast";
import { ImportantDatesCard } from "@/components/Sponsors/Dashboard/ImportantDatesCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, MessageSquare, Calendar, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  fr: {
    loginRequired: "Veuillez vous connecter pour accéder à votre tableau de bord.",
    login: "Se connecter",
    loading: "Chargement...",
    sponsorDashboard: "Mon Espace Parrain",
    noSponsorships: "Vous ne parrainez pas encore d'enfant.",
    becomeASponsor: "Devenir parrain",
    welcomeMessage: "Bienvenue",
    inviteFriends: "Inviter des amis",
    photoAlbum: "Album Photos",
    managePhotos: "Gérez vos photos",
    messages: "Messages",
    communicateWithAssistant: "Communiquez avec l'assistant",
    plannedVisits: "Visites Prévues",
    sponsoredChildren: "Mes Filleuls",
    importantDates: "Dates Importantes",
    quickActions: "Actions Rapides"
  },
  es: {
    loginRequired: "Por favor, inicie sesión para acceder a su panel.",
    login: "Iniciar sesión",
    loading: "Cargando...",
    sponsorDashboard: "Mi Panel de Padrino",
    noSponsorships: "Aún no apadrina a ningún niño.",
    becomeASponsor: "Convertirse en padrino",
    welcomeMessage: "Bienvenido",
    inviteFriends: "Invitar amigos",
    photoAlbum: "Álbum de Fotos",
    managePhotos: "Gestione sus fotos",
    messages: "Mensajes",
    communicateWithAssistant: "Comuníquese con el asistente",
    plannedVisits: "Visitas Planificadas",
    sponsoredChildren: "Mis Ahijados",
    importantDates: "Fechas Importantes",
    quickActions: "Acciones Rápidas"
  }
};

const SponsorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = translations[language as keyof typeof translations] || translations.fr;

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useQuery({
    queryKey: ["sponsorships", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("sponsorships")
        .select(`
          id,
          sponsor_id,
          child_id,
          status,
          start_date,
          end_date,
          children (
            id,
            name,
            birth_date,
            photo_url,
            city,
            needs,
            description,
            story,
            comments,
            age,
            gender
          )
        `)
        .eq("sponsor_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching sponsorships:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos parrainages"
        });
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <p className="text-center text-gray-700">{t.loginRequired}</p>
          <Button 
            onClick={() => navigate("/login")} 
            className="mt-4 mx-auto block bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white"
          >
            {t.login}
          </Button>
        </Card>
      </div>
    );
  }

  if (sponsorshipsLoading) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-700">{t.loading}</p>
      </div>
    );
  }

  if (!sponsorships?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">{t.sponsorDashboard}</h1>
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
          <p className="text-gray-700 mb-4">{t.noSponsorships}</p>
          <Button 
            onClick={() => navigate("/become-sponsor")} 
            className="bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white"
          >
            {t.becomeASponsor}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-cuba-warmBeige">
      <div 
        className="relative h-[300px] bg-cover bg-center mb-8"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/cuba-beach.jpg')"
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-5xl font-title text-white mb-6 animate-fade-in">
            {t.welcomeMessage}, {user.email}
          </h1>
          <Button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: t.inviteFriends,
                  text: t.becomeASponsor,
                  url: window.location.origin + '/become-sponsor'
                });
              }
            }}
            className="bg-cuba-turquoise hover:bg-cuba-turquoise/90 text-white flex items-center gap-2 animate-fade-in"
          >
            <Share2 className="w-4 h-4" />
            {t.inviteFriends}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-warmBeige to-cuba-softOrange border-none transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Image className="w-6 h-6 text-cuba-turquoise" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.photoAlbum}</h3>
                  <p className="text-sm text-gray-700">{t.managePhotos}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-softYellow to-cuba-sand border-none transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6 text-cuba-turquoise" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.messages}</h3>
                  <p className="text-sm text-gray-700">{t.communicateWithAssistant}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-cuba-pink to-cuba-coral border-none transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Calendar className="w-6 h-6 text-cuba-turquoise" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{t.plannedVisits}</h3>
                  <p className="text-sm text-gray-700">{t.plannedVisits}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
                <h2 className="text-xl font-title mb-4 text-gray-800">{t.sponsoredChildren}</h2>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {sponsorships.map((sponsorship) => (
                      <SponsoredChildSection
                        key={sponsorship.id}
                        sponsorship={sponsorship}
                        userId={user.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
                <h2 className="text-xl font-title mb-4 text-gray-800">{t.importantDates}</h2>
                <ImportantDatesCard 
                  plannedVisits={[]}
                  birthDates={sponsorships.map(s => ({
                    childName: s.children.name,
                    birthDate: s.children.birth_date
                  }))}
                />
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
                <h2 className="text-xl font-title mb-4 text-gray-800">{t.quickActions}</h2>
                <DashboardActions />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;