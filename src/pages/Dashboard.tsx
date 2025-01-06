import { useAuth } from "@/components/Auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <DashboardHeader stats={{
        children: {
          total: 0,
          sponsored: 0,
          available: 0,
          urgent_needs: 0
        },
        sponsors: 0,
        donations: {
          total: 0,
          people_helped: 0
        },
        cities: 0
      }} />
    </div>
  );
};

export default Dashboard;