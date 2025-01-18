import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssignSponsorDialog } from "@/components/AssistantSponsorship/AssignSponsorDialog";

export default function SponsorshipManagementNew() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleAddChild = (childId: string) => {
    setSelectedChildId(childId);
    setIsDialogOpen(true);
  };

  const columns = [
    {
      header: "Parrain",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Enfants parrainés",
      cell: ({ row }: { row: { original: any } }) => {
        const sponsorships = row.original.sponsorships || [];
        return (
          <div className="space-y-1">
            {sponsorships.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between gap-2">
                <span>{s.children?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChild(s.id);
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  <UserMinus className="h-4 w-4" />
                  <span className="ml-2">Retirer</span>
                </Button>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }: { row: { original: any } }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddChild(row.original.id)}
            className="h-8 px-2 lg:px-3"
          >
            <UserPlus className="h-4 w-4" />
            <span className="ml-2">Ajouter un enfant</span>
          </Button>
        );
      },
    },
  ];

  return (
    <Card className="w-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>
      
      <DataTable
        columns={columns}
        data={sponsorsData || []}
      />

      {selectedChildId && (
        <AssignSponsorDialog
          childId={selectedChildId}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedChildId(null);
            refetch();
          }}
        />
      )}
    </Card>
  );
}