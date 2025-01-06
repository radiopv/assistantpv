import { Card } from "@/components/ui/card";
import { TasksList } from "@/components/Tasks/TasksList";

const Tasks = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tâches</h1>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des tâches</h2>
          <TasksList />
        </div>
      </Card>
    </div>
  );
};

export default Tasks;