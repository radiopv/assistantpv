import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { AlbumSection } from "./AlbumSection";

interface SponsoredChild {
  id: string;
  name: string;
  photo_url: string;
  city: string;
  age: number;
  status: string;
}

export const SponsorSpace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sponsoredChildren, setSponsoredChildren] = useState<SponsoredChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsoredChildren = async () => {
      try {
        const { data, error } = await supabase
          .from('sponsorships')
          .select(`
            child_id,
            children (
              id,
              name,
              photo_url,
              city,
              age,
              status
            )
          `)
          .eq('sponsor_id', user?.id)
          .eq('status', 'active');

        if (error) throw error;

        const children = data.map(item => item.children);
        setSponsoredChildren(children);
        if (children.length > 0) {
          setSelectedChild(children[0].id);
        }
      } catch (error) {
        console.error('Error fetching sponsored children:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchSponsoredChildren();
    }
  }, [user?.id]);

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
              <div className="grid gap-6">
                {sponsoredChildren.map((child) => (
                  <Card 
                    key={child.id} 
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedChild === child.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedChild(child.id)}
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24">
                        <img
                          src={child.photo_url || '/placeholder.svg'}
                          alt={child.name}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{child.name}</h3>
                        <p className="text-sm text-gray-600">{child.city}</p>
                        <p className="text-sm text-gray-600">{child.age} ans</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
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
          <Card className="p-4">
            <p>Section messages en développement</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card className="p-4">
            <p>Section documents en développement</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};