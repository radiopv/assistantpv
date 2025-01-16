import { ReactNode } from "react";

interface AdminPageLayoutProps {
  children: ReactNode;
}

export const AdminPageLayout = ({ children }: AdminPageLayoutProps) => {
  return (
    <div className="admin-page-container">
      {children}
    </div>
  );
};