import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthProvider";
import MainLayout from "./components/Layout/MainLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import Home from "./pages/Home";
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
import Rewards from "./pages/Rewards";
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
  requireAdmin, 
  requireAssistant 
}: { 
  children: React.ReactNode, 
  requiredPermission?: string,
  requireAdmin?: boolean,
  requireAssistant?: boolean
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

  if (requireAssistant && !['admin', 'assistant'].includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !user?.permissions?.[requiredPermission] && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const ConditionalLayout = () => {
  const { user } = useAuth();
  const isStaff = ['admin', 'assistant'].includes(user?.role || '');

  if (isStaff) {
    return <MainLayout><Outlet /></MainLayout>;
  }

  return <PublicLayout><Outlet /></PublicLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<ProtectedRoute requireAssistant><Dashboard /></ProtectedRoute>} />
              <Route path="/children/needs" element={<ProtectedRoute requiredPermission="children"><ChildrenNeeds /></ProtectedRoute>} />
              <Route path="/children/add" element={<ProtectedRoute requiredPermission="edit_children"><AddChild /></ProtectedRoute>} />
              <Route path="/donations" element={<ProtectedRoute requiredPermission="donations"><Donations /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
              <Route path="/admin/permissions" element={<ProtectedRoute requireAdmin><AdminPermissions /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute requiredPermission="media"><MediaManagement /></ProtectedRoute>} />
              <Route path="/admin/sponsors" element={<ProtectedRoute requireAdmin><SponsorsManagement /></ProtectedRoute>} />
            </Route>

            {/* Public/Conditional Routes */}
            <Route element={<ConditionalLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/children" element={<Children />} />
              <Route path="/children/:id" element={<ChildProfile />} />
              <Route path="/sponsorships" element={<Sponsorships />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;