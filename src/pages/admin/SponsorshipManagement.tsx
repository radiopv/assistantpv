import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, UserPlus, Edit, Trash2, UserMinus, ArrowRightLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SponsorshipManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch all sponsors and their sponsorships
  const { data: sponsorshipData, isLoading, refetch } = useQuery({
    queryKey: ["sponsorships-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select(`
          id,
          name,
          email,
          is_active,
          city,
          phone,
          sponsorships (
            id,
            status,
            child:children (
              id,
              name,
              photo_url,
              is_sponsored,
              city,
              birth_date,
              age
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

  // Fetch children without sponsors
  const { data: unsponsored } = useQuery({
    queryKey: ["unsponsored-children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .is('sponsor_id', null)
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const handleDeleteSponsor = async (sponsorId: string) => {
    try {
      // First end all active sponsorships
      const { error: sponsorshipError } = await supabase
        .from('sponsorships')
        .update({ status: 'ended', end_date: new Date().toISOString() })
        .eq('sponsor_id', sponsorId);

      if (sponsorshipError) throw sponsorshipError;

      // Then delete the sponsor
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', sponsorId);

      if (error) throw error;

      toast.success("Parrain supprimé avec succès");
      refetch();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error("Erreur lors de la suppression du parrain");
    }
  };

  const handleTransferChild = async (childId: string, newSponsorId: string) => {
    try {
      // End current sponsorship
      const { error: endError } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'ended',
          end_date: new Date().toISOString(),
          termination_reason: 'transfer'
        })
        .eq('child_id', childId)
        .eq('status', 'active');

      if (endError) throw endError;

      // Create new sponsorship
      const { error: newError } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: newSponsorId,
          child_id: childId,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (newError) throw newError;

      toast.success("Enfant transféré avec succès");
      setIsTransferDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error transferring child:', error);
      toast.error("Erreur lors du transfert de l'enfant");
    }
  };

  const handleEditChild = async (childId: string, updatedData: any) => {
    try {
      const { error } = await supabase
        .from('children')
        .update(updatedData)
        .eq('id', childId);

      if (error) throw error;

      toast.success("Informations de l'enfant mises à jour");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error("Erreur lors de la mise à jour des informations");
    }
  };

  const handleAddChild = async (sponsorId: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsorId,
          child_id: selectedChild.id,
          status: 'active',
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Enfant ajouté avec succès");
      refetch();
    } catch (error) {
      console.error('Error adding child:', error);
      toast.error("Erreur lors de l'ajout de l'enfant");
    }
  };

  // Filter and organize data
  const activeSponsors = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const inactiveSponsors = sponsorshipData?.filter(sponsor => 
    !sponsor.sponsorships?.some(s => s.status === 'active')
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

  const sponsoredNoName = sponsorshipData?.filter(sponsor => 
    sponsor.sponsorships?.some(s => s.status === 'active' && !sponsor.name)
  ) || [];

  // Search functionality
  const filterBySearch = (items: any[]) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Gestion des Parrainages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un parrain ou un enfant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Parrains Actifs ({activeSponsors.length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Parrains Inactifs ({inactiveSponsors.length})
          </TabsTrigger>
          <TabsTrigger value="unsponsored">
            Enfants Sans Parrain ({unsponsored?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="noname">
            Parrains Sans Nom ({sponsoredNoName.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(activeSponsors).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {sponsor.name}
                      {sponsor.is_active && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Actif
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600">{sponsor.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDeleteSponsor(sponsor.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer le parrain
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedSponsor(sponsor)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Ajouter un enfant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2">
                  <h4 className="font-medium">Enfants parrainés :</h4>
                  <div className="space-y-2 mt-2">
                    {sponsor.sponsorships
                      ?.filter(s => s.status === 'active')
                      .map(s => (
                        <div key={s.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{s.child.name}</span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChild(s.child);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedChild(s.child);
                                setIsTransferDialogOpen(true);
                              }}
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(inactiveSponsors).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                <p className="text-gray-600">{sponsor.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDeleteSponsor(sponsor.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unsponsored">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(unsponsored || []).map((child) => (
              <Card key={child.id} className="p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {child.name}
                  <AlertCircle className="text-yellow-500" size={20} />
                </h3>
                <p className="text-gray-600">{child.city}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedChild(child);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="noname">
          <div className="grid md:grid-cols-2 gap-4">
            {filterBySearch(sponsoredNoName).map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  Parrain sans nom
                </h3>
                <p className="text-gray-600">{sponsor.email}</p>
                <div className="mt-2">
                  <h4 className="font-medium">Enfants parrainés :</h4>
                  <ul className="list-disc list-inside">
                    {sponsor.sponsorships
                      ?.filter(s => s.status === 'active')
                      .map(s => (
                        <li key={s.id}>
                          {s.child.name}
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transférer {selectedChild?.name}</DialogTitle>
            <DialogDescription>
              Choisissez un nouveau parrain pour cet enfant
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {activeSponsors.map((sponsor) => (
              <Button
                key={sponsor.id}
                variant="outline"
                onClick={() => handleTransferChild(selectedChild?.id, sponsor.id)}
              >
                {sponsor.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les informations de {selectedChild?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
              placeholder="Nom"
              value={selectedChild?.name || ''}
              onChange={(e) => setSelectedChild({ ...selectedChild, name: e.target.value })}
            />
            <Input
              placeholder="Ville"
              value={selectedChild?.city || ''}
              onChange={(e) => setSelectedChild({ ...selectedChild, city: e.target.value })}
            />
            <Button onClick={() => handleEditChild(selectedChild?.id, selectedChild)}>
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}