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

const ProtectedRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission?: string }) => {
  const { session, loading, isAssistant, user } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Chargement...</div>
    </div>;
  }
  
  if (!session || !isAssistant) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !user?.permissions?.[requiredPermission]) {
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
              <Route index element={<Dashboard />} />
              <Route path="children" element={<Children />} />
              <Route path="children/needs" element={<ChildrenNeeds />} />
              <Route path="children/add" element={<AddChild />} />
              <Route path="children/:id" element={<ChildProfile />} />
              <Route path="donations" element={<Donations />} />
              <Route path="sponsorships" element={<Sponsorships />} />
              <Route 
                path="admin/permissions" 
                element={
                  <ProtectedRoute requiredPermission="manage_permissions">
                    <AdminPermissions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/media" 
                element={
                  <ProtectedRoute requiredPermission="manage_permissions">
                    <MediaManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/sponsors" 
                element={
                  <ProtectedRoute requiredPermission="manage_permissions">
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