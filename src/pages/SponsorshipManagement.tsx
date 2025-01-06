import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorshipWithDetails {
  id: string;
  sponsor_id: string;
  child_id: string;
  start_date: string;
  status: string;
  sponsor_name: string;
  sponsor_email: string;
  child_name: string;
}

const SponsorshipManagement = () => {
  const { t } = useLanguage();
  
  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          *,
          sponsors:sponsor_id (name, email),
          children:child_id (name)
        `);

      if (error) throw error;

      return data.map((sponsorship: any) => ({
        id: sponsorship.id,
        sponsor_id: sponsorship.sponsor_id,
        child_id: sponsorship.child_id,
        start_date: sponsorship.start_date,
        status: sponsorship.status,
        sponsor_name: sponsorship.sponsors?.name || '',
        sponsor_email: sponsorship.sponsors?.email || '',
        child_name: sponsorship.children?.name || '',
      })) as SponsorshipWithDetails[];
    }
  });

  const columns = [
    {
      accessorKey: "sponsor_name",
      header: t("sponsorName")
    },
    {
      accessorKey: "sponsor_email",
      header: t("sponsorEmail")
    },
    {
      accessorKey: "child_name",
      header: t("childName")
    },
    {
      accessorKey: "start_date",
      header: t("startDate"),
      cell: ({ row }: { row: { original: SponsorshipWithDetails } }) => (
        <span>
          {new Date(row.original.start_date).toLocaleDateString()}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: t("status")
    }
  ];

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t("sponsorshipManagement")}</h1>
      <Card className="p-4">
        <DataTable
          columns={columns}
          data={sponsorships || []}
        />
      </Card>
    </div>
  );
};

export default SponsorshipManagement;