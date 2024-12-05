import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { AlbumSection } from "./AlbumSection";
import { SponsoredChildrenList } from "./SponsoredChildrenList";
import type { SponsoredChild, Child, Sponsorship } from "@/types/sponsorship";
import { useToast } from "@/components/ui/use-toast";

export const SponsorSpace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [sponsoredChildren, setSponsoredChildren] = useState<SponsoredChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsoredChildren = async () => {
      try {
        if (!user?.id) return;
        
        const { data: sponsorships, error } = await supabase
          .from('sponsorships')
          .select<'sponsorships', Sponsorship & { children: Child }>(`
            child_id,
            children (
              id,
              name,
              photo_url,
              city,
              birth_date,
              status
            )
          `)
          .eq('sponsor_id', user.id)
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching sponsorships:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer vos filleuls"
          });
          return;
        }

        console.log("Sponsorships data:", sponsorships);

        const children = sponsorships
          .map(sponsorship => {
            if (!sponsorship.children) return null;
            
            // Calculate age from birth_date
            const birthDate = new Date(sponsorship.children.birth_date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return {
              id: sponsorship.children.id,
              name: sponsorship.children.name,
              photo_url: sponsorship.children.photo_url,
              city: sponsorship.children.city || '',
              age: age,
              status: sponsorship.children.status
            };
          })
          .filter((child): child is SponsoredChild => child !== null);

        console.log("Processed children:", children);

        setSponsoredChildren(children);
        if (children.length > 0) {
          setSelectedChild(children[0].id);
        }
      } catch (error) {
        console.error('Error in fetchSponsoredChildren:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération de vos filleuls"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSponsoredChildren();
    }
  }, [user?.id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Espace Parrain</h1>

      <Tabs defaultValue="children" className="w-full">
        <TabsList>
          <TabsTrigger value="children">Mes Filleuls ({sponsoredChildren.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <SponsoredChildrenList
                children={sponsoredChildren}
                selectedChild={selectedChild}
                onSelectChild={setSelectedChild}
              />
            </div>

            <div>
              {selectedChild && user?.id && (
                <AlbumSection 
                  childId={selectedChild} 
                  sponsorId={user.id} 
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <p>Section messages en développement</p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <p>Section documents en développement</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};