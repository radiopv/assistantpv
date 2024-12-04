import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";

export const SponsorshipRequests = () => {
  const { user } = useAuth();

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ["sponsorship-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_requests")
        .select(`
          *,
          children (
            name,
            age,
            city
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc("approve_sponsorship_request", {
        request_id: requestId,
        admin_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Demande approuvée",
        description: "Le parrainage a été validé avec succès.",
      });

      refetch();
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc("reject_sponsorship_request", {
        request_id: requestId,
        admin_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Demande rejetée",
        description: "La demande a été rejetée avec succès.",
      });

      refetch();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Demandes de parrainage</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Enfant choisi</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                {format(new Date(request.created_at), "Pp", { locale: fr })}
              </TableCell>
              <TableCell>{request.full_name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.phone || "-"}</TableCell>
              <TableCell>
                {request.children
                  ? `${request.children.name} (${request.children.age} ans)`
                  : "Non spécifié"}
              </TableCell>
              <TableCell>
                {request.status === "pending" && "En attente"}
                {request.status === "approved" && "Approuvé"}
                {request.status === "rejected" && "Rejeté"}
              </TableCell>
              <TableCell>
                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(request.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};