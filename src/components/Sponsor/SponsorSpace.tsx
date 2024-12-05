import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sponsoredChildren.map((child) => (
              <Card key={child.id} className="p-4">
                <div className="aspect-square relative mb-4">
                  <img
                    src={child.photo_url || '/placeholder.svg'}
                    alt={child.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-semibold text-lg">{child.name}</h3>
                <p className="text-sm text-gray-600">{child.city}</p>
                <p className="text-sm text-gray-600">{child.age} ans</p>
              </Card>
            ))}
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