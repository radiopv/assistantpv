import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/Auth/AuthProvider";
import { 
  LayoutDashboard, 
  Users, 
  Gift, 
  Baby,
  UserPlus,
  ChartBar,
  HelpCircle,
  Languages,
  Image,
  CheckCircle2,
  Edit,
  Heart
} from "lucide-react";
import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { SidebarSection } from "./Sidebar/SidebarSection";
import { SidebarFooter } from "./Sidebar/SidebarFooter";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobile, onClose }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const assistantLinks = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
      show: user?.permissions?.dashboard || isAdmin,
    },
    {
      href: "/children",
      label: t("children"),
      icon: Baby,
      show: user?.permissions?.children || isAdmin,
      subItems: [
        {
          href: "/children/add",
          label: t("addChild"),
          icon: UserPlus,
          show: user?.permissions?.edit_children || isAdmin,
        },
        {
          href: "/assistant/photos",
          label: t("childPhotos"),
          icon: Image,
          show: true,
        },
        {
          href: "/sponsorship-management",
          label: t("sponsorshipManagement"),
          icon: Heart,
          show: true,
        }
      ]
    },
    {
      href: "/donations",
      label: t("donations"),
      icon: Gift,
      show: user?.permissions?.donations || isAdmin,
      subItems: [
        {
          href: "/donations/add",
          label: t("addDonation"),
          icon: Gift,
          show: user?.permissions?.donations || isAdmin,
        }
      ]
    },
  ];

  const adminLinks = [
    {
      href: "/admin/translations",
      label: t("translationManager"),
      icon: Languages,
      show: isAdmin,
    },
    {
      href: "/admin/validation",
      label: t("validation"),
      icon: CheckCircle2,
      show: isAdmin,
    },
    {
      href: "/admin/statistics",
      label: t("statistics"),
      icon: ChartBar,
      show: isAdmin,
    },
    {
      href: "/admin/faq",
      label: t("faq"),
      icon: HelpCircle,
      show: isAdmin,
    },
  ];

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-white",
      isMobile && "relative"
    )}>
      <SidebarHeader isMobile={isMobile} onClose={onClose} />
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <SidebarSection
            title="Assistant"
            links={assistantLinks}
            currentPath={location.pathname}
            onClose={onClose}
          />
          
          {isAdmin && (
            <SidebarSection
              title="Administration"
              links={adminLinks}
              currentPath={location.pathname}
              onClose={onClose}
            />
          )}
        </div>
      </ScrollArea>

      <SidebarFooter onSignOut={signOut} onClose={onClose} />
    </div>
  );
};

export default Sidebar;