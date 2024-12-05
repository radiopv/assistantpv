import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  Home,
  Users,
  Gift,
  MessageSquare,
  Settings,
  Shield,
  Heart,
  HelpCircle,
  Map,
  BarChart2,
  Activity,
  Languages,
  LayoutDashboard
} from "lucide-react";

const Sidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isAssistant = user?.role === 'assistant';
  const isSponsor = user?.role === 'sponsor';

  const menuItems = [
    {
      title: t("dashboard"),
      items: [
        { icon: Home, label: t("dashboard"), path: "/dashboard" }
      ]
    },
    {
      title: t("assistant"),
      show: isAssistant || isAdmin,
      items: [
        { icon: Users, label: t("children"), path: "/children" },
        { icon: Gift, label: t("donations"), path: "/donations" },
        { icon: MessageSquare, label: t("messages"), path: "/messages" }
      ]
    },
    {
      title: t("sponsor"),
      show: isSponsor || isAdmin,
      items: [
        { icon: Heart, label: t("sponsorSpace"), path: "/sponsor-space" },
        { icon: Map, label: t("travels"), path: "/sponsor/travels" },
        { icon: MessageSquare, label: t("messages"), path: "/messages" }
      ]
    },
    {
      title: t("administration"),
      show: isAdmin,
      items: [
        { icon: Shield, label: t("permissions"), path: "/admin/permissions" },
        { icon: Languages, label: t("translations"), path: "/admin/translations" },
        { icon: BarChart2, label: t("statistics"), path: "/admin/statistics" },
        { icon: HelpCircle, label: t("faq"), path: "/admin/faq" },
        { icon: Activity, label: t("activityLog"), path: "/admin/activity" },
        { icon: LayoutDashboard, label: t("homeContent"), path: "/admin/home-content" }
      ]
    }
  ];

  return (
    <div className="h-full bg-white border-r p-4">
      <nav className="space-y-8">
        {menuItems.map((section, index) => 
          (!section.show === undefined || section.show) && (
            <div key={index}>
              <h2 className="text-xs uppercase font-semibold text-gray-500 mb-4">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </nav>
    </div>
  );
};

export default Sidebar;