import { ReactNode } from "react";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import PublicDonations from "@/pages/PublicDonations";
import PublicStats from "@/pages/PublicStats";
import PublicVideos from "@/pages/PublicVideos";
import PublicFAQ from "@/pages/PublicFAQ";
import Stories from "@/pages/Stories";
import SponsorDashboard from "@/pages/SponsorDashboard";

interface RouteConfig {
  path: string;
  element: ReactNode;
  layout?: "public" | "main";
}

export const publicRoutes: RouteConfig[] = [
  { path: "/", element: <Home />, layout: "public" },
  { path: "/login", element: <Login />, layout: "public" },
  { path: "/donations/public", element: <PublicDonations />, layout: "public" },
  { path: "/statistics", element: <PublicStats />, layout: "public" },
  { path: "/videos", element: <PublicVideos />, layout: "public" },
  { path: "/faq", element: <PublicFAQ />, layout: "public" },
  { path: "/stories", element: <Stories />, layout: "public" },
];

export const protectedRoutes: RouteConfig[] = [
  { path: "/dashboard", element: <Dashboard />, layout: "main" },
  { path: "/sponsor-dashboard", element: <SponsorDashboard />, layout: "main" },
  { path: "/children", element: <Children />, layout: "main" },
  { path: "/children/:id", element: <ChildProfile />, layout: "main" },
  { path: "/children/add", element: <AddChild />, layout: "main" },
  { path: "/donations", element: <Donations />, layout: "main" },
];