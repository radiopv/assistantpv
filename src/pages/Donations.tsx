import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";

interface Donation {
  id: string;
  assistant_name: string;
  city: string;
  people_helped: number;
  donation_date: string;
  status: string;
}

const Donations = () => {
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (error) throw error;
      return data as Donation[];
    }
  });

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des dons" 
          retry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dons</h1>
          <p className="text-gray-600 mt-2">Gérez les dons et leur distribution</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un don
        </Button>
      </div>

      <Card className="p-6">
        {donations && donations.length > 0 ? (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Don par {donation.assistant_name}</h3>
                    <p className="text-sm text-gray-600">
                      {donation.city} - {new Date(donation.donation_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {donation.people_helped} personnes aidées
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      donation.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {donation.status === "completed" ? "Complété" : "En cours"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Aucun don enregistré pour le moment
          </p>
        )}
      </Card>
    </div>
  );
};

export default Donations;
