import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "./DonationCategorySelect";

interface DonationItem {
  category_id: string;
  quantity: number;
}

interface Donor {
  name: string;
  is_anonymous: boolean;
}

interface DonationCardProps {
  donation: {
    id: string;
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
    status: string;
    photos: string[] | null;
    comments: string | null;
    items?: DonationItem[];
    donors?: Donor[];
  };
}

export const DonationCard = ({ donation }: DonationCardProps) => {
  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : `Catégorie ${categoryId}`;
  };

  return (
    <Card key={donation.id} className="p-4">
      <div className="space-y-4">
        {/* En-tête avec statut */}
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

        {/* Grille des détails */}
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
                  {item.quantity}x {getCategoryName(item.category_id)}
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

        {/* Grille des photos */}
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

        {/* Commentaires */}
        {donation.comments && (
          <div>
            <p className="text-gray-500">Commentaires</p>
            <p className="text-sm">{donation.comments}</p>
          </div>
        )}
      </div>
    </Card>
  );
};