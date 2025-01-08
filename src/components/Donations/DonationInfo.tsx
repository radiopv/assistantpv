interface DonationInfoProps {
  donation: {
    assistant_name: string;
    city: string;
    people_helped: number;
    donation_date: string;
  };
}

export const DonationInfo = ({ donation }: DonationInfoProps) => {
  const formattedDate = new Date(donation.donation_date).toLocaleDateString();
  
  return (
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{donation.assistant_name}</h3>
      <p className="text-sm text-gray-500">
        {donation.city} • {formattedDate}
      </p>
      <p className="text-sm">
        {donation.people_helped} personnes aidées
      </p>
    </div>
  );
};