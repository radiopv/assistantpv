import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, UserPlus } from "lucide-react";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/search-input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SponsorshipAssociationDialog } from "@/components/Sponsors/SponsorshipAssociationDialog";

const SponsorshipManagement = () => {
  const { t } = useLanguage();
  const [childSearchTerm, setChildSearchTerm] = useState("");
  const [selectedChild, setSelectedChild] = useState<any>(null);
  
  const { data: sponsors, isLoading: sponsorsLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          *,
          sponsorships (
            id,
            child_id,
            start_date,
            end_date,
            status,
            children (
              id,
              name,
              age,
              city,
              photo_url,
              needs
            )
          )
        `)
        .order('name');

      if (error) {
        console.error("Error fetching sponsors:", error);
        throw error;
      }
      return data;
    }
  });

  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ['all-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsorships (
            id,
            sponsor_id,
            start_date,
            status,
            sponsors (
              id,
              name,
              email
            )
          )
        `)
        .order('name');

      if (error) {
        console.error("Error fetching children:", error);
        throw error;
      }
      return data;
    }
  });

  const filteredChildren = children?.filter(child => {
    const searchString = `${child.name} ${child.city}`.toLowerCase();
    return searchString.includes(childSearchTerm.toLowerCase());
  });

  if (sponsorsLoading || childrenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{t("sponsorshipManagement")}</h1>
      
      <Tabs defaultValue="sponsors" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="sponsors">{t("sponsors")}</TabsTrigger>
          <TabsTrigger value="children">TOUS LES ENFANTS</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsors">
          <Card className="p-6">
            <SponsorsList sponsors={sponsors || []} isLoading={sponsorsLoading} />
          </Card>
        </TabsContent>

        <TabsContent value="children">
          <Card className="p-6">
            <div className="mb-6">
              <SearchInput
                placeholder={t("searchChildren")}
                value={childSearchTerm}
                onChange={(e) => setChildSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="grid gap-4">
              {filteredChildren?.map((child) => (
                <Card key={child.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                        {child.photo_url ? (
                          <img 
                            src={child.photo_url} 
                            alt={child.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {child.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{child.name}</h3>
                        <p className="text-sm text-gray-500">
                          {child.age} {t("years")} - {child.city}
                        </p>
                        {child.sponsorships?.[0]?.sponsors && (
                          <p className="text-sm text-blue-600">
                            Parrainé par: {child.sponsorships[0].sponsors.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedChild(child)}
                      className="flex-shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              {filteredChildren?.length === 0 && (
                <p className="text-center text-gray-500">{t("noChildrenFound")}</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <SponsorshipAssociationDialog
        child={selectedChild}
        sponsors={sponsors || []}
        isOpen={!!selectedChild}
        onClose={() => setSelectedChild(null)}
      />
    </div>
  );
};

export default SponsorshipManagement;