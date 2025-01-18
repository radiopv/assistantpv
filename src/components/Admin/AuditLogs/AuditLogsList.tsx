import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AuditLog {
  id: string;
  child_id: string | null;
  action: string;
  changes: any;
  performed_by: string | null;
  created_at: string;
  children?: {
    name: string;
  } | null;
  sponsors?: {
    name: string;
  } | null;
}

export const AuditLogsList = () => {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children_audit_logs")
        .select(`
          id,
          child_id,
          action,
          changes,
          performed_by,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching audit logs:", error);
        throw error;
      }

      // Get child names and sponsor names in separate queries
      const childIds = data.map(log => log.child_id).filter(Boolean);
      const sponsorIds = data.map(log => log.performed_by).filter(Boolean);

      const [childrenResponse, sponsorsResponse] = await Promise.all([
        supabase
          .from("children")
          .select("id, name")
          .in("id", childIds),
        supabase
          .from("sponsors")
          .select("id, name")
          .in("id", sponsorIds)
      ]);

      // Create lookup maps
      const childrenMap = new Map(childrenResponse.data?.map(child => [child.id, child]) || []);
      const sponsorsMap = new Map(sponsorsResponse.data?.map(sponsor => [sponsor.id, sponsor]) || []);

      // Combine the data
      return data.map(log => ({
        ...log,
        children: log.child_id ? { name: childrenMap.get(log.child_id)?.name || "Enfant supprimé" } : null,
        sponsors: log.performed_by ? { name: sponsorsMap.get(log.performed_by)?.name || "Utilisateur inconnu" } : null
      })) as AuditLog[];
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
      cell: ({ row }) => (
        <span>
          {row.original.children?.name || "Enfant supprimé"}
        </span>
      ),
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
      cell: ({ row }) => (
        <span>
          {row.original.sponsors?.name || "Système"}
        </span>
      ),
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

  if (error) {
    return <div>Erreur lors du chargement des logs: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique des modifications</h2>
      <DataTable columns={columns} data={logs || []} />
    </div>
  );
};