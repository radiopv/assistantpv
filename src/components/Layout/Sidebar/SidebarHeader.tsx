import { Link } from "react-router-dom";

export const SidebarHeader = () => {
  return (
    <div className="p-6">
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-8 h-8"
          loading="lazy"
        />
        <span className="font-semibold text-xl">Passion Varadero</span>
      </Link>
    </div>
  );
};