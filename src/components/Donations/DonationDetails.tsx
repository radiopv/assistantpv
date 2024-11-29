interface DonationDetailsProps {
  donation: {
    city: string;
    people_helped: number;
  };
}

export const DonationDetails = ({ donation }: DonationDetailsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Ville</p>
        <p className="font-medium">{donation.city}</p>
      </div>
      <div>
        <p className="text-gray-500">Personnes aidées</p>
        <p className="font-medium">{donation.people_helped}</p>
      </div>
    </div>
  );
};