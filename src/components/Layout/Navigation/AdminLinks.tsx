import { 
  Home, 
  Users, 
  Gift, 
  Settings,
  Camera,
  UserCog,
  Mail,
  Layout,
  Star,
  HelpCircle,
  Lock,
  BarChart
} from "lucide-react";

export const adminLinks = [
  { to: "/dashboard", icon: Home, label: "Tableau de bord" },
  { to: "/children", icon: Users, label: "Enfants" },
  { to: "/children/add", icon: Users, label: "Ajouter un enfant" },
  { to: "/donations", icon: Gift, label: "Dons" },
  { to: "/statistics", icon: BarChart, label: "Statistiques" },
  { to: "/media-management", icon: Camera, label: "Gestion médias" },
  { to: "/sponsors-management", icon: UserCog, label: "Gestion parrains" },
  { to: "/messages", icon: Mail, label: "Messages" },
  { to: "/homepage-management", icon: Layout, label: "Gestion accueil" },
  { to: "/testimonials-management", icon: Star, label: "Gestion témoignages" },
  { to: "/faq-management", icon: HelpCircle, label: "Gestion FAQ" },
  { to: "/permissions", icon: Lock, label: "Permissions" },
  { to: "/settings", icon: Settings, label: "Paramètres" }
];