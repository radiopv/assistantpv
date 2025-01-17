import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import BecomeSponsor from "@/pages/BecomeSponsor";
import EmailsPage from "@/pages/admin/Emails";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Navigate } from "react-router-dom";

export const AppRoutes = () => {
  const { isAssistant } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/become-sponsor" element={<BecomeSponsor />} />
      <Route
        path="/emails"
        element={
          isAssistant ? <EmailsPage /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};