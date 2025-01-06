import { Card } from "@/components/ui/card";

const Tasks = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tâches</h1>
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Liste des tâches</h2>
          <p className="text-gray-600">
            Aucune tâche pour le moment.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Tasks;