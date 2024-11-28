import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { cn } from "@/lib/utils";
import { DonationForm } from "@/components/Donations/DonationForm";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Donation {
  id: string;
  assistant_name: string;
  city: string;
  people_helped: number;
  donation_date: string;
  status: string;
  photos: string[] | null;
  comments: string | null;
}

interface DonationItem {
  category_id: string;
  quantity: number;
}

interface Donor {
  name: string;
  is_anonymous: boolean;
}

const Donations = () => {
  const [showForm, setShowForm] = useState(false);
  
  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('donation_date', { ascending: false });
      
      if (donationsError) throw donationsError;

      // Fetch donation items for each donation
      const donationsWithItems = await Promise.all(
        donationsData.map(async (donation) => {
          const { data: items } = await supabase
            .from('donation_items')
            .select('category_id, quantity')
            .eq('donation_id', donation.id);

          const { data: donors } = await supabase
            .from('donors')
            .select('name, is_anonymous')
            .eq('donation_id', donation.id);

          return {
            ...donation,
            items: items || [],
            donors: donors || []
          };
        })
      );
      
      return donationsWithItems;
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
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Fermer" : "Ajouter un don"}
        </Button>
      </div>

      {showForm && (
        <DonationForm onDonationComplete={() => {
          setShowForm(false);
          refetch();
        }} />
      )}

      <Card className="p-6">
        {donations && donations.length > 0 ? (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id} className="p-4">
                <div className="space-y-4">
                  {/* Header with status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Don par {donation.assistant_name}</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(donation.donation_date), 'dd MMMM yyyy', { locale: fr })}
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

                  {/* Details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Ville</p>
                      <p className="font-medium">{donation.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Personnes aidées</p>
                      <p className="font-medium">{donation.people_helped}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Articles</p>
                      <div className="font-medium">
                        {donation.items?.map((item: DonationItem, index: number) => (
                          <span key={index} className="block">
                            {item.quantity}x Catégorie {item.category_id}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Donateurs</p>
                      <div className="font-medium">
                        {donation.donors?.map((donor: Donor, index: number) => (
                          <span key={index} className="block">
                            {donor.is_anonymous ? "Donateur anonyme" : donor.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Photos grid */}
                  {donation.photos && donation.photos.length > 0 && (
                    <div>
                      <p className="text-gray-500 mb-2">Photos</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {donation.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {donation.comments && (
                    <div>
                      <p className="text-gray-500">Commentaires</p>
                      <p className="text-sm">{donation.comments}</p>
                    </div>
                  )}
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