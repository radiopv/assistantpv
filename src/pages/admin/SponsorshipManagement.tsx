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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SponsorshipManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    name: "",
    phone: "",
    city: "",
  });

  const { data: sponsors, isLoading, refetch } = useQuery({
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

  const handleEdit = (sponsor: any) => {
    setEditingSponsorId(sponsor.id);
    setEditForm({
      email: sponsor.email || "",
      name: sponsor.name || "",
      phone: sponsor.phone || "",
      city: sponsor.city || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          email: editForm.email,
          name: editForm.name,
          phone: editForm.phone,
          city: editForm.city,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSponsorId);

      if (error) throw error;

      toast.success("Informations mises à jour avec succès");
      setEditingSponsorId(null);
      refetch();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

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
              <>
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
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sponsor)}
                        >
                          Modifier
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-4 space-y-4 bg-gray-50">
                        <div className="grid gap-4">
                          <div>
                            <label className="text-sm font-medium">Nom</label>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Téléphone</label>
                            <Input
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ville</label>
                            <Input
                              value={editForm.city}
                              onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSponsorId(null)}
                            >
                              Annuler
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleUpdate}
                            >
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}