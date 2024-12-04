import { useNavigate, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES, ROLE_REDIRECTS } from "@/config/routes";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirect = (role: keyof typeof ROLE_REDIRECTS) => {
    const isProtectedPage = PROTECTED_ROUTES.includes(location.pathname as any);
    
    if (location.pathname === '/login' || isProtectedPage) {
      const redirectPath = ROLE_REDIRECTS[role] || '/';
      navigate(redirectPath);
    }
  };

  const redirectToLogin = () => {
    if (PROTECTED_ROUTES.includes(location.pathname as any)) {
      navigate('/login');
    }
  };

  return { handleRedirect, redirectToLogin };
};