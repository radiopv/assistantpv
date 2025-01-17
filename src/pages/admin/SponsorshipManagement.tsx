import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { PasswordFields } from "@/components/Sponsor/SponsorshipForm/PasswordFields";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SponsorshipManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [editForm, setEditForm] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
          phone,
          password_hash,
          sponsorships (
            id,
            status,
            child:children (
              id,
              name
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
      password: "",
      confirmPassword: "",
    });
  };

  const handleUpdate = async () => {
    try {
      if (editForm.password && editForm.password !== editForm.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      const updateData: any = {
        email: editForm.email,
        name: editForm.name,
        phone: editForm.phone,
        updated_at: new Date().toISOString(),
      };

      if (editForm.password) {
        updateData.password_hash = editForm.password;
      }

      const { error } = await supabase
        .from('sponsors')
        .update(updateData)
        .eq('id', editingSponsorId);

      if (error) throw error;

      toast.success("Informations mises à jour avec succès");
      setEditingSponsorId(null);
      setEditForm({
        email: "",
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      refetch();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortData = (data: any[]) => {
    if (!data) return [];
    
    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Gestion spéciale pour last_login
      if (sortConfig.key === 'last_login') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const renderSortButton = (key: string, label: string) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(key)}
      className="h-8 flex items-center gap-1 p-0 hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

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

      <Card className="w-full overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">{renderSortButton('name', 'Nom')}</TableHead>
                  <TableHead className="min-w-[200px]">{renderSortButton('email', 'Email')}</TableHead>
                  <TableHead className="min-w-[150px]">Mot de passe actuel</TableHead>
                  <TableHead className="min-w-[200px]">{renderSortButton('last_login', 'Dernière connexion')}</TableHead>
                  <TableHead className="min-w-[200px]">Enfants parrainés</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortData(filterBySearch(sponsors || [])).map((sponsor) => (
                  <React.Fragment key={sponsor.id}>
                    <TableRow>
                      <TableCell className="font-medium">{sponsor.name}</TableCell>
                      <TableCell className="break-all">{sponsor.email}</TableCell>
                      <TableCell>{sponsor.password_hash || "Non défini"}</TableCell>
                      <TableCell>
                        {sponsor.last_login 
                          ? format(new Date(sponsor.last_login), "dd MMMM yyyy à HH:mm", { locale: fr })
                          : "Jamais connecté"}
                      </TableCell>
                      <TableCell className="break-words">
                        {sponsor.sponsorships
                          ?.filter((s: any) => s.status === 'active')
                          .map((s: any) => s.child.name)
                          .join(", ") || "Aucun"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sponsor)}
                          className="w-full md:w-auto"
                        >
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                    {editingSponsorId === sponsor.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-gray-50 border-t p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Nom</Label>
                                <Input
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <Input
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Téléphone</Label>
                                <Input
                                  value={editForm.phone}
                                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            
                            <PasswordFields
                              password={editForm.password}
                              confirmPassword={editForm.confirmPassword}
                              onChange={(e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })}
                            />

                            <div className="flex flex-col md:flex-row justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSponsorId(null)}
                                className="w-full md:w-auto"
                              >
                                Annuler
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleUpdate}
                                className="w-full md:w-auto"
                              >
                                Sauvegarder
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}