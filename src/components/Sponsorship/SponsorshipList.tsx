import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table } from "@/components/ui/table";
import { translations } from "./translations";

interface SponsorshipListProps {
  language: "fr" | "es";  // Ajout de la propriété language
}

export const SponsorshipList = ({ language }: SponsorshipListProps) => {
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchSponsorships = async () => {
    try {
      const { data, error } = await supabase.from('sponsorships').select('*');
      if (error) throw error;
      setSponsorships(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: translations[language].fetchErrorTitle,
        description: translations[language].fetchErrorMsg,
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">{translations[language].title}</h2>
      <Table>
        <thead>
          <tr>
            <th>{translations[language].columns.name}</th>
            <th>{translations[language].columns.amount}</th>
            <th>{translations[language].columns.date}</th>
          </tr>
        </thead>
        <tbody>
          {sponsorships.map((sponsorship) => (
            <tr key={sponsorship.id}>
              <td>{sponsorship.name}</td>
              <td>{sponsorship.amount}</td>
              <td>{new Date(sponsorship.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};
