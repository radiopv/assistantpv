import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Download, Upload, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();

  // Ajout de logs pour debug
  console.log("Rendering SponsorsManagement");

  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      console.log("Fetching sponsors data...");
      const { data, error } = await supabase
        .from("sponsors")
        .select(`
          *,
          sponsorships (
            id,
            start_date,
            child:children (
              id,
              name,
              photo_url
            )
          )
        `)
        .order("name");

      if (error) {
        console.error("Error fetching sponsors:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les parrains",
        });
        throw error;
      }

      console.log("Sponsors data received:", data);
      return data;
    },
  });

  // Vérification des données reçues
  if (error) {
    console.error("Query error:", error);
    return (
      <div className="p-4 text-red-500">
        Une erreur est survenue lors du chargement des parrains
      </div>
    );
  }

  const filteredSponsors = sponsors?.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    if (!sponsors?.length) {
      toast({
        variant: "destructive",
        title: "Export impossible",
        description: "Aucune donnée à exporter",
      });
      return;
    }
    console.log("Export sponsors to CSV");
  };

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Fonctionnalité en cours de développement",
    });
    console.log("Import sponsors from CSV");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">{t("sponsorManagement")}</h1>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 md:flex-none md:min-w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t("searchSponsor")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t("export")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                {t("exportToCsv")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                {t("importFromCsv")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <SponsorsList sponsors={filteredSponsors || []} isLoading={isLoading} />
    </div>
  );
};

export default SponsorsManagement;