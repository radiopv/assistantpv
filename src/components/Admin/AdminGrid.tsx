import { ReactNode } from "react";

interface AdminGridProps {
  children: ReactNode;
}

export const AdminGrid = ({ children }: AdminGridProps) => {
  return (
    <div className="admin-grid">
      {children}
    </div>
  );
};