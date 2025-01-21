import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlbumMedia } from "@/types/supabase";

interface AlbumMediaGridProps {
  childId: string;
}

export const AlbumMediaGrid = ({ childId }: AlbumMediaGridProps) => {
  const { data: media, isLoading, error } = useQuery<AlbumMedia[]>({
    queryKey: ["album-media", childId],
    queryFn: async () => {
      try {
        console.log("Fetching media for child:", childId);
        const { data, error } = await supabase
          .from("album_media")
          .select(`
            id,
            url,
            type,
            title,
            description,
            is_featured,
            created_at,
            sponsor_id,
            sponsors (
              name,
              role,
              is_anonymous
            )
          `)
          .eq("child_id", childId)
          .eq("is_approved", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching album media:", error);
          toast.error("Erreur lors du chargement des photos");
          throw error;
        }

        return data as AlbumMedia[];
      } catch (err) {
        console.error("Error in album media query:", err);
        toast.error("Erreur lors du chargement des photos");
        throw err;
      }
    },
  });

  if (error) {
    return (
      <Card className="p-4 text-center text-red-500">
        Une erreur est survenue lors du chargement des photos
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!media?.length) {
    return (
      <Card className="p-4 text-center text-gray-500">
        Aucune photo disponible
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={item.url}
              alt={item.title || "Photo d'album"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {item.title && (
            <div className="p-2">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.description && (
                <p className="text-xs text-gray-500 truncate">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};