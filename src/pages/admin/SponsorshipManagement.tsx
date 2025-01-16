import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SponsorshipManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sponsors, isLoading } = useQuery({
    queryKey: ["sponsors-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          id,
          name,
          email,
          last_login,
          city,
          phone,
          sponsorships (
            id,
            status,
            start_date,
            child:children (
              id,
              name,
              photo_url,
              city
            )
          )
        `)
        .order('name');

      if (error) {
        toast.error("Erreur lors du chargement des données");
        throw error;
      }
      return data;
    }
  });

  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="w-full p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Parrains</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un parrain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Ville</TableHead>
              <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
              <TableHead className="hidden md:table-cell">Enfants parrainés</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterBySearch(sponsors || []).map((sponsor) => (
              <TableRow key={sponsor.id}>
                <TableCell className="font-medium">{sponsor.name}</TableCell>
                <TableCell>{sponsor.email}</TableCell>
                <TableCell className="hidden md:table-cell">{sponsor.city}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {sponsor.last_login 
                    ? format(new Date(sponsor.last_login), "dd MMMM yyyy à HH:mm", { locale: fr })
                    : "Jamais connecté"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {sponsor.sponsorships
                    ?.filter((s: any) => s.status === 'active')
                    .map((s: any) => s.child.name)
                    .join(", ") || "Aucun"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast.info("Fonctionnalité à venir");
                    }}
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
