import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DonationListProps {
  donations: any[];
  isLoading: boolean;
}

export const DonationList = ({ donations, isLoading }: DonationListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <Card key={donation.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Don à {donation.city}</h3>
              <p className="text-sm text-gray-600">
                {format(new Date(donation.donation_date), 'PPP', { locale: fr })}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {donation.people_helped} personnes aidées
              </p>
            </div>
            {donation.photos && donation.photos[0] && (
              <img 
                src={donation.photos[0]} 
                alt="Photo du don"
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
          {donation.comments && (
            <p className="mt-2 text-gray-700">{donation.comments}</p>
          )}
        </Card>
      ))}
    </div>
  );
};