import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthProvider";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import AddChild from "./pages/AddChild";
import ChildProfile from "./pages/ChildProfile";
import ChildrenNeeds from "./pages/ChildrenNeeds";
import Donations from "./pages/Donations";
import Sponsorships from "./pages/Sponsorships";
import MediaManagement from "./pages/MediaManagement";
import SponsorsManagement from "./pages/SponsorsManagement";
import Login from "./pages/auth/Login";
import { AdminPermissions } from "./components/Admin/AdminPermissions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requireAdmin 
}: { 
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<ProtectedRoute requiredPermission="dashboard"><Dashboard /></ProtectedRoute>} />
              <Route path="children" element={<ProtectedRoute requiredPermission="children"><Children /></ProtectedRoute>} />
              <Route path="children/needs" element={<ProtectedRoute requiredPermission="children"><ChildrenNeeds /></ProtectedRoute>} />
              <Route path="children/add" element={<ProtectedRoute requiredPermission="edit_children"><AddChild /></ProtectedRoute>} />
              <Route path="children/:id" element={<ProtectedRoute requiredPermission="children"><ChildProfile /></ProtectedRoute>} />
              <Route path="donations" element={<ProtectedRoute requiredPermission="donations"><Donations /></ProtectedRoute>} />
              <Route path="sponsorships" element={<ProtectedRoute requiredPermission="sponsorships"><Sponsorships /></ProtectedRoute>} />
              <Route 
                path="admin/permissions" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPermissions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/media" 
                element={
                  <ProtectedRoute requiredPermission="media">
                    <MediaManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/sponsors" 
                element={
                  <ProtectedRoute requireAdmin>
                    <SponsorsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;