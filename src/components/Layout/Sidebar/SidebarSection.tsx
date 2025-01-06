import { BarChart, CheckSquare, Languages, Mail, HelpCircle, Users, Settings } from "lucide-react";
import { SidebarLink } from "@/components/Layout/Sidebar/SidebarLink";

export const AdminSection = () => {
  return (
    <div className="space-y-1">
      <SidebarLink to="/admin/statistics" icon={BarChart}>
        Statistiques
      </SidebarLink>
      <SidebarLink to="/admin/validation" icon={CheckSquare}>
        Validation
      </SidebarLink>
      <SidebarLink to="/admin/translations" icon={Languages}>
        Traductions
      </SidebarLink>
      <SidebarLink to="/admin/emails" icon={Mail}>
        Emails
      </SidebarLink>
      <SidebarLink to="/admin/faq" icon={HelpCircle}>
        FAQ
      </SidebarLink>
      <SidebarLink to="/admin/sponsorships" icon={Users}>
        Parrainages
      </SidebarLink>
      <SidebarLink to="/admin/cities" icon={Settings}>
        Gestion des villes
      </SidebarLink>
    </div>
  );
};
