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
    <Card className="p-4 sm:p-6 overflow-hidden">
      <h3 className="text-base sm:text-lg font-semibold mb-4">Performance des Assistants</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Assistant</TableHead>
                  <TableHead className="whitespace-nowrap">Dons gérés</TableHead>
                  <TableHead className="whitespace-nowrap">Personnes aidées</TableHead>
                  <TableHead className="whitespace-nowrap">Taux de réussite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.map((stat) => (
                  <TableRow key={stat.assistant_name}>
                    <TableCell className="whitespace-nowrap">{stat.assistant_name}</TableCell>
                    <TableCell className="whitespace-nowrap">{stat.donations_count}</TableCell>
                    <TableCell className="whitespace-nowrap">{stat.people_helped}</TableCell>
                    <TableCell className="whitespace-nowrap">{stat.success_rate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
};