import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { MainLayout } from "@/components/Layout/MainLayout";
import { PublicLayout } from "@/components/Layout/PublicLayout";
import { publicRoutes, protectedRoutes } from "@/routes/routes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            {publicRoutes.map(({ path, element, layout }) => (
              <Route
                key={path}
                path={path}
                element={
                  layout === "public" ? (
                    <PublicLayout>{element}</PublicLayout>
                  ) : (
                    element
                  )
                }
              />
            ))}

            {/* Protected routes */}
            {protectedRoutes.map(({ path, element, layout }) => (
              <Route
                key={path}
                path={path}
                element={
                  layout === "main" ? (
                    <MainLayout>{element}</MainLayout>
                  ) : (
                    element
                  )
                }
              />
            ))}

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;