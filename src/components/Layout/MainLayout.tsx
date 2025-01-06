import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useLanguage } from "@/contexts/LanguageContext";

const MainLayout = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;