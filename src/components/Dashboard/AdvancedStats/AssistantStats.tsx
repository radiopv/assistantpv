import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { AssistantPerformanceStats } from "@/types/statistics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AssistantStats = () => {
  const { data: stats, isLoading } = useQuery<AssistantPerformanceStats[]>({
    queryKey: ['assistant-performance'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_assistant_performance_stats');
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Performance des Assistants</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assistant</TableHead>
              <TableHead>Dons gérés</TableHead>
              <TableHead>Personnes aidées</TableHead>
              <TableHead>Taux de réussite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats?.map((stat) => (
              <TableRow key={stat.assistant_name}>
                <TableCell>{stat.assistant_name}</TableCell>
                <TableCell>{stat.donations_count}</TableCell>
                <TableCell>{stat.people_helped}</TableCell>
                <TableCell>{stat.success_rate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};