import { NotificationBar } from "@/components/Dashboard/NotificationBar";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <NotificationBar />
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages récents</h2>
          <p className="text-gray-600">
            Consultez vos messages et notifications dans l'onglet Messages.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;