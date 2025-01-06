import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Task } from "@/integrations/supabase/types/tasks";

export const TasksList = () => {
  const navigate = useNavigate();

  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Task[], error: any };
      
      if (error) throw error;
      return data;
    }
  });

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success("Tâche marquée comme terminée");
      refetch();
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  };

  const handleNavigateToProfile = (childId: string) => {
    navigate(`/children/${childId}`);
  };

  if (isLoading) {
    return <div>Chargement des tâches...</div>;
  }

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                {task.child_id && (
                  <Button 
                    variant="link" 
                    className="px-0 text-blue-600"
                    onClick={() => handleNavigateToProfile(task.child_id!)}
                  >
                    Voir le profil
                  </Button>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleCompleteTask(task.id)}
            >
              <CheckCircle className="w-4 h-4" />
              Terminer
            </Button>
          </div>
        </Card>
      ))}
      
      {(!tasks || tasks.length === 0) && (
        <Card className="p-6 text-center text-gray-500">
          Aucune tâche en attente
        </Card>
      )}
    </div>
  );
};