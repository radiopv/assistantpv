import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SponsorshipWithDetails } from "@/integrations/supabase/types/sponsorship";

const SponsorshipManagement = () => {
  const { t } = useLanguage();

  const { data: sponsorships, isLoading } = useQuery({
    queryKey: ['sponsorships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorships')
        .select(`
          id,
          start_date,
          status,
          sponsors (
            id,
            name,
            email,
            photo_url
          ),
          children (
            id,
            name,
            photo_url,
            birth_date,
            city
          )
        `)
        .returns<SponsorshipWithDetails[]>();

      if (error) throw error;
      return data || [];
    }
  });

  const handleDeleteSponsorship = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(t("sponsorship.success.deleted"));
    } catch (error) {
      console.error('Error deleting sponsorship:', error);
      toast.error(t("sponsorship.error.delete"));
    }
  };

  const columns = [
    {
      accessorKey: "sponsors.name",
      header: t("sponsor"),
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span>{row.original.sponsors?.name}</span>
          <span className="text-gray-500 text-sm">
            ({row.original.sponsors?.email})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "children.name",
      header: t("child"),
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span>{row.original.children?.name}</span>
          <span className="text-gray-500 text-sm">
            ({row.original.children?.city})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: t("startDate"),
      cell: ({ row }: any) => (
        <span>
          {new Date(row.original.start_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }: any) => (
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
          row.original.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: any) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteSponsorship(row.original.id)}
        >
          {t("delete")}
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">
        {t("sponsorship.management")}
      </h1>

      <DataTable
        columns={columns}
        data={sponsorships || []}
      />
    </div>
  );
};

export default SponsorshipManagement;