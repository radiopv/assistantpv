import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthProvider";
import PublicLayout from "./components/Layout/PublicLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import AddChild from "./pages/AddChild";
import ChildProfile from "./pages/ChildProfile";
import ChildrenNeeds from "./pages/ChildrenNeeds";
import Donations from "./pages/Donations";
import Sponsorships from "./pages/Sponsorships";
import MediaManagement from "./pages/MediaManagement";
import SponsorsManagement from "./pages/SponsorsManagement";
import Messages from "./pages/Messages";
import Login from "./pages/auth/Login";
import { AdminPermissions } from "./components/Admin/AdminPermissions";

const ProtectedRoute = ({ children, requiredPermission, requireAdmin }: { 
  children: React.ReactNode, 
  requiredPermission?: string,
  requireAdmin?: boolean 
}) => {
  const { session, loading, isAssistant, user } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Chargement...</div>
    </div>;
  }
  
  if (!session || !isAssistant) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !user?.permissions?.[requiredPermission] && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        meta: {
          errorMessage: "Une erreur est survenue",
        }
      },
    },
  }));

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Public/Sponsor Routes */}
                <Route element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
                  <Route index element={<ProtectedRoute requiredPermission="dashboard"><Dashboard /></ProtectedRoute>} />
                  <Route path="children" element={<ProtectedRoute requiredPermission="children"><Children /></ProtectedRoute>} />
                  <Route path="children/needs" element={<ProtectedRoute requiredPermission="children"><ChildrenNeeds /></ProtectedRoute>} />
                  <Route path="children/:id" element={<ProtectedRoute requiredPermission="children"><ChildProfile /></ProtectedRoute>} />
                  <Route path="sponsorships" element={<ProtectedRoute requiredPermission="sponsorships"><Sponsorships /></ProtectedRoute>} />
                  <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                </Route>

                {/* Admin/Assistant Routes */}
                <Route element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                  <Route path="admin/permissions" element={<AdminPermissions />} />
                  <Route path="admin/media" element={<MediaManagement />} />
                  <Route path="admin/sponsors" element={<SponsorsManagement />} />
                  <Route path="admin/donations" element={<Donations />} />
                  <Route path="children/add" element={<AddChild />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;