import { Link } from "react-router-dom";

export const SidebarHeader = () => {
  return (
    <div className="p-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="font-semibold text-xl">Passion Varadero</span>
      </Link>
    </div>
  );
};
