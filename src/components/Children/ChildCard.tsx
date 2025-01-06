import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/integrations/supabase/types/tasks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ChildCardProps {
  childId: string;
}

export const ChildCard = ({ childId }: ChildCardProps) => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', childId],
    queryFn: () => fetchTasks(childId),
  });

  const fetchTasks = async (childId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Task[];
  };

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tâche marquée comme terminée");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  });

  const handleCompleteTask = (taskId: string) => {
    completeTaskMutation.mutate(taskId);
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleCompleteTask(task.id)}
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </Button>
          </div>
        </Card>
      ))}
      
      {(!tasks || tasks.length === 0) && (
        <Card className="p-6 text-center text-gray-500">
          No tasks pending
        </Card>
      )}
    </div>
  );
};