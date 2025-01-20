import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AuditLog {
  id: string;
  child_id: string;
  action: string;
  changes: any;
  performed_by: string;
  created_at: string;
}

export const AuditLogsList = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children_audit_logs")
        .select(`
          *,
          children(name),
          sponsors(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const columns = [
    {
      header: "Date",
      cell: ({ row }) => (
        <span>
          {format(new Date(row.original.created_at), "dd MMMM yyyy HH:mm", {
            locale: fr,
          })}
        </span>
      ),
    },
    {
      header: "Enfant",
      cell: ({ row }) => <span>{row.original.children?.name || "N/A"}</span>,
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action;
        return (
          <span>
            {action === "sponsorship_approved"
              ? "Parrainage approuvé"
              : action === "sponsorship_rejected"
              ? "Parrainage refusé"
              : action === "UPDATE"
              ? "Modification"
              : action === "photo_added"
              ? "Photo ajoutée"
              : action === "media_added"
              ? "Photo ajoutée à l'album"
              : action}
          </span>
        );
      },
    },
    {
      header: "Effectué par",
      cell: ({ row }) => <span>{row.original.sponsors?.name || "Système"}</span>,
    },
    {
      header: "Détails",
      cell: ({ row }) => {
        const changes = row.original.changes;
        if (!changes) return null;

        if (row.original.action === "photo_added" || row.original.action === "media_added") {
          return (
            <div className="max-w-md">
              <p>Une nouvelle photo a été ajoutée à l'album</p>
              {changes.url && (
                <img 
                  src={changes.url} 
                  alt="Photo ajoutée" 
                  className="w-20 h-20 object-cover mt-2 rounded"
                />
              )}
            </div>
          );
        }

        return (
          <div className="max-w-md">
            {changes.changed_fields ? (
              <ul className="list-disc pl-4">
                {Object.entries(changes.changed_fields).map(([key, value]) => (
                  <li key={key}>
                    {key}: {JSON.stringify(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <span>{JSON.stringify(changes)}</span>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Chargement des logs...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des modifications</h2>
      <DataTable columns={columns} data={logs || []} />
    </div>
  );
};