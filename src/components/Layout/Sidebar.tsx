import { SidebarNav } from "./Sidebar/SidebarNav";
import { SidebarHeader } from "./Sidebar/SidebarHeader";

const Sidebar = () => {
  return (
    <div className="h-full bg-white border-r flex flex-col">
      <SidebarHeader />
      <SidebarNav />
    </div>
  );
};

export default Sidebar;