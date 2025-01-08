import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { SidebarNav } from "./Sidebar/SidebarNav";
import { SidebarFooter } from "./Sidebar/SidebarFooter";

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col border-r border-cuba-turquoise/20 bg-cuba-warmBeige">
      <SidebarHeader />
      <div className="flex-1 overflow-auto py-4">
        <SidebarNav />
      </div>
      <SidebarFooter />
    </div>
  );
};