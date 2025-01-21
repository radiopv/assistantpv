import { useEffect, useState } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/Home/HeroSection";
import { FeaturedAlbum } from "@/components/Home/FeaturedAlbum";
import { ImpactStats } from "@/components/Home/ImpactStats";
import { CallToAction } from "@/components/Home/CallToAction";
import { JourneySection } from "@/components/Home/JourneySection";
import { toast } from "sonner";
import { Module, ModuleSettings } from "@/components/Admin/HomeContent/types";

interface HomepageModule extends Module {
  settings: ModuleSettings;
}

export default function Home() {
  const [showImageDialog, setShowImageDialog] = useState(false);

  const { data: modules = [], isLoading, error } = useSupabaseQuery<HomepageModule[]>(
    ['homepage_modules'],
    async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching modules:', error);
        toast.error('Error loading page content');
        return [];
      }

      return data.map(module => ({
        ...module,
        content: module.content as HomepageModule['content'],
        settings: module.settings as ModuleSettings
      }));
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading modules:', error);
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xl text-red-600">
          Une erreur est survenue lors du chargement de la page
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Aucun module actif. Veuillez configurer la page d'accueil dans l'interface d'administration.
        </div>
      </div>
    );
  }

  const renderModule = (module: HomepageModule) => {
    if (!module.module_type) {
      console.warn('Module without type:', module);
      return null;
    }

    const moduleWrapper = (content: JSX.Element) => (
      <div key={module.id} className="w-full py-4 sm:py-8 bg-cuba-offwhite">
        <div className="container mx-auto px-4">
          {content}
        </div>
      </div>
    );

    switch (module.module_type) {
      case 'hero':
        return (
          <HeroSection 
            key={module.id} 
            heroSection={module.content}
            onImageClick={() => console.log("Image clicked")}
          />
        );
      case 'impact_stats':
      case 'impact-stats':
        return moduleWrapper(
          <ImpactStats 
            settings={{
              title: module.settings.title || "Notre Impact",
              showTotalSponsors: module.settings.showTotalSponsors || false,
              showTotalChildren: module.settings.showTotalChildren || false,
              showTotalDonations: module.settings.showTotalDonations || false,
              animateNumbers: module.settings.animateNumbers || false,
              backgroundStyle: module.settings.backgroundStyle || "gradient"
            }}
          />
        );
      case 'how_it_works':
      case 'how-it-works':
        return moduleWrapper(
          <HowItWorks />
        );
      case 'featured_children':
      case 'featured-children':
      case 'children-grid':
        return moduleWrapper(
          <FeaturedChildren />
        );
      case 'featured_album':
      case 'featured-album':
        return moduleWrapper(
          <FeaturedAlbum />
        );
      case 'testimonials':
        return moduleWrapper(
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-cuba-coral font-title">
              {module.settings?.title || "Témoignages de nos parrains"}
            </h2>
            <FeaturedTestimonials />
          </div>
        );
      case 'journey':
        if (!module.settings.steps) return null;
        return moduleWrapper(
          <JourneySection 
            settings={{
              title: module.settings.title,
              steps: module.settings.steps,
              showProgressBar: module.settings.showProgressBar
            }} 
          />
        );
      default:
        console.warn('Unknown module type:', module.module_type);
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-offwhite to-white space-y-2 sm:space-y-4">
      {modules.map(renderModule)}
      <div className="py-4 sm:py-8">
        <CallToAction />
      </div>
    </div>
  );
}
