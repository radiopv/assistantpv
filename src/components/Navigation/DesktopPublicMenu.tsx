import { PublicMenuItems } from "./PublicMenuItems";

export const DesktopPublicMenu = () => {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center">
      <PublicMenuItems />
    </div>
  );
};