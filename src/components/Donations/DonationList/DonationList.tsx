import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DonationListItem } from "./DonationListItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DonationListProps {
  onEdit: (donationId: string) => void;
  onDelete: (donationId: string) => void;
}

export const DonationList = ({ onEdit, onDelete }: DonationListProps) => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ["donations-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("donation_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="date">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="city">Ville</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {donations?.map((donation) => (
          <DonationListItem
            key={donation.id}
            donation={donation}
            onEdit={() => onEdit(donation.id)}
            onDelete={() => onDelete(donation.id)}
          />
        ))}
      </div>
    </div>
  );
};