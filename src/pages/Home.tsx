import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Home/Hero";
import { Impact } from "@/components/Home/Impact";
import { Journey } from "@/components/Home/Journey";
import { Featured } from "@/components/Home/Featured";
import { CTA } from "@/components/Home/CTA";
import { Module, ModuleContent, ModuleSettings } from "@/components/Admin/HomeContent/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['homepage-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      return data?.map(module => ({
        ...module,
        content: module.content as ModuleContent,
        settings: module.settings as ModuleSettings
      })) as Module[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-4">
        <Skeleton className="h-[600px] w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const renderModule = (module: Module) => {
    switch (module.module_type) {
      case 'hero':
        return (
          <Hero
            key={module.id}
            title={module.content?.title || ''}
            subtitle={module.content?.subtitle || ''}
            settings={module.settings}
          />
        );
      case 'impact':
        return (
          <Impact
            key={module.id}
            settings={module.settings}
          />
        );
      case 'journey':
        return (
          <Journey
            key={module.id}
            settings={module.settings}
          />
        );
      case 'featured':
        return (
          <Featured
            key={module.id}
            settings={module.settings}
          />
        );
      case 'cta':
        return (
          <CTA
            key={module.id}
            settings={module.settings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main>
      {modules.map(module => renderModule(module))}
    </main>
  );
}