import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/Auth/AuthProvider";

interface Memory {
  id: string;
  url: string;
  type: string;
  comment?: string;
  created_at: string;
}

export const MemoriesList = () => {
  const { user } = useAuth();

  const { data: memories, isLoading } = useQuery({
    queryKey: ["memories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Memory[];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {memories?.map((memory) => (
        <Card key={memory.id} className="p-4">
          {memory.type === "image" ? (
            <img
              src={memory.url}
              alt={memory.comment || "Souvenir"}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          ) : (
            <video
              src={memory.url}
              controls
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          )}
          {memory.comment && (
            <p className="text-sm text-gray-600">{memory.comment}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(memory.created_at).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
};