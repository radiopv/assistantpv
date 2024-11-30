import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Home, Users, Gift, PiggyBank, MessageSquare, Medal, Settings, FileText, BarChart3, Map, FileImage, UserCog, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <NavLink to="/dashboard" className={({ isActive }) => cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
              isActive && "text-primary bg-primary/10"
            )}>
              <Home className="h-5 w-5 mr-3" />
              Tableau de bord
            </NavLink>
            {(user?.permissions?.children || user?.role === 'admin') && (
              <NavLink to="/children" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <Users className="h-5 w-5 mr-3" />
                Enfants
              </NavLink>
            )}
            {(user?.permissions?.sponsorships || user?.role === 'admin') && (
              <NavLink to="/sponsorships" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <Heart className="h-5 w-5 mr-3" />
                Parrainages
              </NavLink>
            )}
            {(user?.permissions?.donations || user?.role === 'admin') && (
              <NavLink to="/donations" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <PiggyBank className="h-5 w-5 mr-3" />
                Dons
              </NavLink>
            )}
            <NavLink to="/messages" className={({ isActive }) => cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
              isActive && "text-primary bg-primary/10"
            )}>
              <MessageSquare className="h-5 w-5 mr-3" />
              Messages
            </NavLink>
            <NavLink to="/rewards" className={({ isActive }) => cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
              isActive && "text-primary bg-primary/10"
            )}>
              <Medal className="h-5 w-5 mr-3" />
              Récompenses
            </NavLink>
          </div>
        </div>
        {user?.role === 'admin' && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Administration
            </h2>
            <div className="space-y-1">
              <NavLink to="/admin/permissions" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <UserCog className="h-5 w-5 mr-3" />
                Permissions
              </NavLink>
              {(user?.permissions?.media || user?.role === 'admin') && (
                <NavLink to="/admin/media" className={({ isActive }) => cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  isActive && "text-primary bg-primary/10"
                )}>
                  <FileImage className="h-5 w-5 mr-3" />
                  Médias
                </NavLink>
              )}
              <NavLink to="/admin/sponsors" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <Users className="h-5 w-5 mr-3" />
                Parrains
              </NavLink>
              <NavLink to="/admin/reports" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <FileText className="h-5 w-5 mr-3" />
                Rapports
              </NavLink>
              <NavLink to="/admin/faq" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <ChevronRight className="h-5 w-5 mr-3" />
                FAQ
              </NavLink>
              <NavLink to="/admin/statistics" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <BarChart3 className="h-5 w-5 mr-3" />
                Statistiques
              </NavLink>
              <NavLink to="/admin/site-config" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <Settings className="h-5 w-5 mr-3" />
                Configuration
              </NavLink>
              <NavLink to="/admin/travels" className={({ isActive }) => cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                isActive && "text-primary bg-primary/10"
              )}>
                <Map className="h-5 w-5 mr-3" />
                Voyages
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;