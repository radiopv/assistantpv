import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SponsorshipManagementNew() {
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);
  const [expandedSponsors, setExpandedSponsors] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const isMobile = useIsMobile();

  const { data: sponsorsData, refetch } = useQuery({
    queryKey: ["sponsors-with-children"],
    queryFn: async () => {
      const { data: sponsors, error } = await supabase
        .from("sponsors")
        .select(`
          id,
          name,
          email,
          sponsorships (
            id,
            child_id,
            children (
              id,
              name
            )
          )
        `)
        .eq("sponsorships.status", "active");

      if (error) throw error;
      return sponsors;
    },
  });

  const { data: availableChildren = [], isLoading: isLoadingChildren } = useQuery({
    queryKey: ["available-children"],
    queryFn: async () => {
      const { data: childrenData, error } = await supabase
        .from("children")
        .select(`
          id,
          name,
          age,
          birth_date,
          city,
          comments,
          created_at,
          description,
          end_date,
          gender
        `)
        .eq("is_sponsored", false)
        .order("name");

      if (error) throw error;
      return childrenData;
    },
  });

  const handleRemoveChild = async (sponsorshipId: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({ 
          status: "ended",
          end_date: new Date().toISOString()
        })
        .eq("id", sponsorshipId);

      if (error) throw error;

      toast.success("Parrainage terminé avec succès");
      refetch();
    } catch (error) {
      console.error("Error removing child:", error);
      toast.error("Erreur lors de la suppression du parrainage");
    }
  };

  const handleAddChild = async (sponsorId: string, childId: string) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .insert({
          sponsor_id: sponsorId,
          child_id: childId,
          status: "active",
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      // Update child status
      const { error: updateError } = await supabase
        .from("children")
        .update({ is_sponsored: true })
        .eq("id", childId);

      if (updateError) throw updateError;

      toast.success("Enfant ajouté avec succès");
      refetch();
    } catch (error) {
      console.error("Error adding child:", error);
      toast.error("Erreur lors de l'ajout de l'enfant");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleSponsorExpanded = (sponsorId: string) => {
    setExpandedSponsors(prev => 
      prev.includes(sponsorId) 
        ? prev.filter(id => id !== sponsorId)
        : [...prev, sponsorId]
    );
  };

  const sortedSponsors = sponsorsData ? [...sponsorsData].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    return sortOrder === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  }) : [];

  const columns = [
    {
      header: () => (
        <Button 
          variant="ghost" 
          onClick={toggleSortOrder}
          className="flex items-center gap-2 text-left"
        >
          Parrain {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      ),
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: isMobile ? undefined : ({ row }: { row: { original: any } }) => row.original.email,
    },
    {
      header: "Enfants parrainés",
      cell: ({ row }: { row: { original: any } }) => {
        const sponsorId = row.original.id;
        const sponsorships = row.original.sponsorships || [];
        const isExpanded = expandedSponsors.includes(sponsorId);

        return (
          <div className="space-y-2">
            {sponsorships.map((s: any) => (
              <div key={s.id} className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-2`}>
                <span className="text-sm">{s.children?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChild(s.id);
                  }}
                  className={`h-8 ${isMobile ? 'w-full mt-1' : 'px-2 lg:px-3'}`}
                >
                  <UserMinus className="h-4 w-4" />
                  <span className="ml-2">Retirer</span>
                </Button>
              </div>
            ))}
            <Collapsible
              open={isExpanded}
              onOpenChange={() => toggleSponsorExpanded(sponsorId)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full flex items-center justify-between ${isMobile ? 'mt-2' : ''}`}
                >
                  <span className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un enfant
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ScrollArea className="h-[300px] mt-4">
                  <div className="space-y-2">
                    {availableChildren.map((child: any) => (
                      <Card 
                        key={child.id} 
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleAddChild(sponsorId, child.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-gray-500">{child.city}</p>
                            {child.age && (
                              <p className="text-sm text-gray-500">{child.age} ans</p>
                            )}
                          </div>
                          <UserPlus className="h-4 w-4 text-gray-400" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      },
    },
  ];

  if (isMobile) {
    columns.splice(1, 1);
  }

  return (
    <Card className="w-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>
      
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={sortedSponsors}
        />
      </div>
    </Card>
  );
}