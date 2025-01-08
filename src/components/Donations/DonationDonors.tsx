interface DonationDonorsProps {
  donors: {
    name: string;
    is_anonymous: boolean;
  }[];
}

export const DonationDonors = ({ donors }: DonationDonorsProps) => {
  if (!donors?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Donateurs:</h4>
      <div className="flex flex-wrap gap-2">
        {donors.map((donor, index) => (
          <span key={index} className="text-sm text-gray-600">
            {donor.is_anonymous ? 'Donateur anonyme' : donor.name}
            {index < donors.length - 1 && ', '}
          </span>
        ))}
      </div>
    </div>
  );
};