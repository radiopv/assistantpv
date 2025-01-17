import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import BecomeSponsor from "@/pages/BecomeSponsor";
import EmailsPage from "@/pages/admin/Emails";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Navigate } from "react-router-dom";

const AppRoutes = () => {
  const { isAssistant } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/become-sponsor" element={<BecomeSponsor />} />
      <Route
        path="/emails"
        element={
          <ProtectedRoute>
            {isAssistant ? <EmailsPage /> : <Navigate to="/login" />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
